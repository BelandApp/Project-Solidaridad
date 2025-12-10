import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Child } from '../../children/entities/child.entity';
import { Event } from '../../events/entities/event.entity';

@Entity('event_participations')
export class EventParticipation {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    childId: string;

    @Column()
    eventId: string;

    @ManyToOne(() => Child, (child) => child.participations, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'childId' })
    child: Child;

    @ManyToOne(() => Event, (event) => event.participations, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'eventId' })
    event: Event;

    @CreateDateColumn()
    timestamp: Date;
}
