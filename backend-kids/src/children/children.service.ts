import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Child } from './entities/child.entity';
import { CreateChildDto } from './dto/create-child.dto';
import { UpdateChildDto } from './dto/update-child.dto';
import * as QRCode from 'qrcode';
import * as csv from 'csv-parser';
import { Readable } from 'stream';

@Injectable()
export class ChildrenService {
    private readonly logger = new Logger(ChildrenService.name);

    constructor(
        @InjectRepository(Child)
        private readonly childrenRepository: Repository<Child>,
    ) { }

    async create(createChildDto: CreateChildDto): Promise<Child> {
        const child = this.childrenRepository.create(createChildDto);
        const savedChild = await this.childrenRepository.save(child);

        const qrData = JSON.stringify({ id: savedChild.id, name: savedChild.fullName });
        const qrCode = await QRCode.toDataURL(qrData);

        savedChild.qrCode = qrCode;
        return this.childrenRepository.save(savedChild);
    }

    async findAll(page: number = 1, limit: number = 10): Promise<{ data: Child[], total: number, page: number, limit: number }> {
        const [data, total] = await this.childrenRepository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
        });
        return { data, total, page, limit };
    }

    async findOne(id: string): Promise<Child> {
        const child = await this.childrenRepository.findOneBy({ id });
        if (!child) {
            throw new NotFoundException(`Child with ID ${id} not found`);
        }
        return child;
    }

    async update(id: string, updateChildDto: UpdateChildDto): Promise<Child> {
        const child = await this.findOne(id);
        Object.assign(child, updateChildDto);
        return this.childrenRepository.save(child);
    }

    async remove(id: string): Promise<void> {
        const result = await this.childrenRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Child with ID ${id} not found`);
        }
    }

    async uploadCsv(buffer: Buffer): Promise<Child[]> {
        // Strip BOM if present
        const csvString = buffer.toString('utf-8').replace(/^\uFEFF/, '');
        const stream = Readable.from(csvString);
        const childrenToCreate: CreateChildDto[] = [];
        this.logger.log('Starting processing CSV');
        this.logger.log(`Buffer length: ${buffer.length}`);

        return new Promise((resolve, reject) => {
            stream
                .pipe(csv({
                    separator: ';',
                    mapHeaders: ({ header }) => header.trim()
                }))
                .on('data', (row) => {
                    this.logger.debug(`Row received: ${JSON.stringify(row)}`);
                    // Map CSV columns to DTO
                    // Expected headers: fullName, age, sex
                    if (!row.fullName || !row.age || !row.sex) {
                        this.logger.warn(`Invalid row: ${JSON.stringify(row)}`);
                        // Can optionally log or skip invalid rows
                        return;
                    }

                    childrenToCreate.push({
                        fullName: row.fullName,
                        age: parseInt(row.age, 10),
                        sex: row.sex as 'Niño' | 'Niña',
                    });
                })
                .on('end', async () => {
                    this.logger.log(`CSV parsing completed. Found ${childrenToCreate.length} valid records.`);
                    try {
                        const savedChildren: Child[] = [];
                        for (const dto of childrenToCreate) {
                            const saved = await this.create(dto); // Reuses create logic which generates QR
                            savedChildren.push(saved);
                        }
                        resolve(savedChildren);
                    } catch (error) {
                        this.logger.error('Error saving children', error);
                        reject(error);
                    }
                })
                .on('error', (error) => {
                    this.logger.error('Error parsing CSV', error);
                    reject(new BadRequestException('Error parsing CSV'));
                });
        });
    }
}
