import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Child } from './entities/child.entity';
import { CreateChildDto } from './dto/create-child.dto';
import { UpdateChildDto } from './dto/update-child.dto';
import * as QRCode from 'qrcode';

@Injectable()
export class ChildrenService {
    constructor(
        @InjectRepository(Child)
        private readonly childrenRepository: Repository<Child>,
    ) { }

    async create(createChildDto: CreateChildDto): Promise<Child> {
        const child = this.childrenRepository.create(createChildDto);

        // Save first to get the ID? Or generate QR based on DTO info?
        // Request says "QR generada automáticamente al crear".
        // Usually, QR contains the ID to identify the child.
        // If I need the ID in the QR, I must save first, then update with QR, or use a UUID generated beforehand.
        // Since we use @PrimaryGeneratedColumn('uuid'), TypeORM generates it on save.
        // To have the ID in the QR, I'll save first, generate QR with ID, then save again.

        // Save initial to generate ID
        const savedChild = await this.childrenRepository.save(child);

        // Generate QR with the ID (and maybe name for readability if scanned casually)
        // Format: JSON string or just ID? Request says: "POST /participations/register-by-qr se envía { eventId: string, childId: string }".
        // If scanning sends childId, then the QR probably encodes the childId.
        const qrData = JSON.stringify({ id: savedChild.id, name: savedChild.fullName });
        const qrCode = await QRCode.toDataURL(qrData);

        savedChild.qrCode = qrCode;
        return this.childrenRepository.save(savedChild);
    }

    async findAll(): Promise<Child[]> {
        return this.childrenRepository.find();
    }

    async findOne(id: string): Promise<Child> {
        const child = await this.childrenRepository.findOneBy({ id });
        if (!child) {
            throw new NotFoundException(`Child with ID ${id} not found`);
        }
        return child;
    }

    async update(id: string, updateChildDto: UpdateChildDto): Promise<Child> {
        const child = await this.findOne(id); // Ensure exists
        Object.assign(child, updateChildDto);
        return this.childrenRepository.save(child);
    }

    async remove(id: string): Promise<void> {
        const result = await this.childrenRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Child with ID ${id} not found`);
        }
    }
}
