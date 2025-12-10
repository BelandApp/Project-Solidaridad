import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { EventParticipation } from '../../participations/entities/participation.entity';

@Entity('children')
export class Child {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    fullName: string;

    @Column()
    sex: 'Niño' | 'Niña';

    @Column()
    age: number;

    @Column({ type: 'text', nullable: true })
    qrCode: string; // Base64 string

    @OneToMany(() => EventParticipation, (participation) => participation.child)
    participations: EventParticipation[];
}
