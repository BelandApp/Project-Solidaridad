import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { EventParticipation } from '../../participations/entities/participation.entity';

@Entity('children')
export class Child {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    fullName: string;

    @Column()
    document: string; // DNI or passport

    @Column()
    age: number;

    @Column()
    birthDate: Date;

    @Column()
    tutorName: string;

    @Column({ nullable: true })
    imageUrl: string;

    @Column({ type: 'text', nullable: true })
    qrCode: string; // Base64 string

    @OneToMany(() => EventParticipation, (participation) => participation.child)
    participations: EventParticipation[];
}
