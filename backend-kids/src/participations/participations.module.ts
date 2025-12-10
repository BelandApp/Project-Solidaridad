import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParticipationsService } from './participations.service';
import { ParticipationsController } from './participations.controller';
import { EventParticipation } from './entities/participation.entity';
import { ChildrenModule } from '../children/children.module';
import { EventsModule } from '../events/events.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([EventParticipation]),
        ChildrenModule,
        EventsModule
    ],
    controllers: [ParticipationsController],
    providers: [ParticipationsService],
})
export class ParticipationsModule { }
