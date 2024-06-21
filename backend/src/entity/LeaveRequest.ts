import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Employee } from './Employee';

@Entity()
export class LeaveRequest {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Employee, { eager: true })
    @JoinColumn({ name: 'employeeId' })
    employee!: Employee;

    @Column()
    absenceReason!: string;

    @Column()
    startDate!: Date;

    @Column()
    endDate!: Date;

    @Column({ nullable: true })
    comment!: string;

    @Column()
    status!: string;
}