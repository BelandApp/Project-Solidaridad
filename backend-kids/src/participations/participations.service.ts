import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventParticipation } from './entities/participation.entity';
import { CreateParticipationDto } from './dto/create-participation.dto';
import { RegisterByQrDto } from './dto/register-by-qr.dto';
import { ChildrenService } from '../children/children.service';
import { EventsService } from '../events/events.service';

@Injectable()
export class ParticipationsService {
    constructor(
        @InjectRepository(EventParticipation)
        private readonly participationsRepository: Repository<EventParticipation>,
        private readonly childrenService: ChildrenService,
        private readonly eventsService: EventsService,
    ) { }

    async create(createDto: CreateParticipationDto) {
        const { childId, eventId } = createDto;

        // Verify Child and Event existence
        await this.childrenService.findOne(childId);
        await this.eventsService.findOne(eventId);

        // Check for duplicate participation
        const existing = await this.participationsRepository.findOne({
            where: { childId, eventId },
        });

        if (existing) {
            throw new ConflictException('El niño ya participó en este evento');
        }

        const participation = this.participationsRepository.create({
            childId,
            eventId,
        });

        return this.participationsRepository.save(participation);
    }

    async registerByQr(dto: RegisterByQrDto) {
        const { qrContent, eventId } = dto;

        let childId: string;
        try {
            childId = qrContent;
        } catch (e) {
            // Fallback: assume QR is just the ID string if JSON parse fails?
            // Or maybe it is base64? 
            // If the client scans the base64, they get the text.
            // If the text is not JSON, maybe it's just the ID.
            childId = qrContent;
        }

        if (!childId) {
            throw new BadRequestException('Invalid QR Content');
        }

        // Reuse create logic which handles checks
        return this.create({ childId, eventId });
    }

    async findByChild(childId: string, page: number = 1, limit: number = 10): Promise<{ data: EventParticipation[], total: number, page: number, limit: number }> {
        const [data, total] = await this.participationsRepository.findAndCount({
            where: { childId },
            relations: ['event'],
            skip: (page - 1) * limit,
            take: limit,
        });
        return { data, total, page, limit };
    }

    async findByEvent(eventId: string, page: number = 1, limit: number = 10): Promise<{ data: EventParticipation[], total: number, page: number, limit: number }> {
        const [data, total] = await this.participationsRepository.findAndCount({
            where: { eventId },
            relations: ['child'],
            skip: (page - 1) * limit,
            take: limit,
        });
        return { data, total, page, limit };
    }
}
