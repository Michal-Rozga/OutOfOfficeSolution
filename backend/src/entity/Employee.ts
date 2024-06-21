import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApprovalRequest } from './ApprovalRequest';
import { LeaveRequest } from './LeaveRequest';
import { Project } from './Project';
import { Role } from './Role';
import { User } from './User';

@Entity()
export class Employee {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    fullName!: string;

    @Column()
    subdivision!: string;

    @Column()
    position!: string;

    @Column()
    status!: string;

    @Column()
    peoplePartner!: string;

    @Column()
    outOfOfficeBalance!: number;

    @Column({ nullable: true })
    photo!: string;

    @OneToMany(() => User, user => user.employee)
    users!: User[];

    @OneToMany(() => LeaveRequest, leaveRequest => leaveRequest.employee)
    leaveRequests!: LeaveRequest[]; 

    @OneToMany(() => ApprovalRequest, approvalRequest => approvalRequest.approver)
    approvalRequests!: ApprovalRequest[]; 

    @OneToMany(() => Project, project => project.projectManager)
    projectsManaged!: Project[];

    @ManyToOne(() => Role, { eager: true })
    role!: Role;
}
