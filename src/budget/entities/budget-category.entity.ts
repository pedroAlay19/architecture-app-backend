import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Project } from "../../projects/entities/project.entity";
import { BudgetItem } from "./budget-item.entity";

@Entity('budget_categories')
export class BudgetCategory {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    name: string;

    @Column('int')
    order: number;

    @ManyToOne(() => Project, (project) => project.categories, {
        onDelete: 'CASCADE' // Si se borra el proyecto, se borran sus categorias
    })
    project: Project;

    @OneToMany(() => BudgetItem, (item) => item.category, { cascade: ['insert'] })
    items: BudgetItem[];
}
