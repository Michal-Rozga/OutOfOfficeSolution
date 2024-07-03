import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Employee } from './Employee';
import { LeaveRequest } from './LeaveRequest';

@Entity()
export class ApprovalRequest {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Employee, { eager: true })
    @JoinColumn({ name: 'approverId' })
    approver!: Employee;

    @OneToOne(() => LeaveRequest, { eager: true })
    @JoinColumn({ name: 'leaveRequestId' })
    leaveRequest!: LeaveRequest;

    @Column()
    status!: string;

    @Column({ nullable: true })
    comment!: string;
}