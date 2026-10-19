import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../auth/entities/user.entity";

export enum ProjectStatus {
    IN_PROGRESS='in_progress',
    COMPLETED='completed'
}

@Entity('projects')
export class Project {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    name: string;

    @Column('text')
    location: string;

    @Column('text')
    client: string;

    @Column({type: 'date'})
    startDate: string;

    @Column({type: 'int'})
    durationDays: number;

    @Column({type: 'date'})
    estimatedEndDate: string;


    @Column({ type: 'decimal', precision: 14, scale: 2 })
    totalBudget: number;


    @Column({ type: 'enum', enum: ProjectStatus, default: ProjectStatus.IN_PROGRESS })
    status: ProjectStatus;

    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(
        () => User,
        (user) => user.projects,
    )
    contractor: User
}
