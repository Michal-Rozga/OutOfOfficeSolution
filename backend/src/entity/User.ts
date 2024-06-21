import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Employee } from './Employee';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    username!: string;

    @Column()
    password!: string;

    @ManyToOne(() => Employee, { eager: true })
    @JoinColumn({ name: 'employeeId' })
    employee!: Employee;
}