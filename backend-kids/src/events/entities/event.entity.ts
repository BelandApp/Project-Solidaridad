import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { EventParticipation } from '../../participations/entities/participation.entity';

@Entity('events')
export class Event {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column({ nullable: true })
    imageUrl: string;

    @OneToMany(() => EventParticipation, (participation) => participation.event)
    participations: EventParticipation[];
}
