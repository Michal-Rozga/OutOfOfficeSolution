
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Employee } from './Employee';
@Entity()
export class Project {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    projectType!: string;

    @Column()
    startDate!: Date;

    @Column({ nullable: true })
    endDate!: Date;

    @ManyToOne(() => Employee, { eager: true })
    @JoinColumn({ name: 'projectManagerId' })
    projectManager!: Employee;

    @Column({ nullable: true })
    comment!: string;

    @Column()
    status!: string;
}
