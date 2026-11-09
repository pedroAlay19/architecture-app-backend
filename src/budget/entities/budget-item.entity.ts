import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BudgetCategory } from "./budget-category.entity";
import { decimalTransformer } from "../../common/transformers/decimal.transformer";

@Entity('budget_items')
export class BudgetItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {nullable: true})
    code: string | null;

    @Column('text')
    description: string;

    @Column('text')
    unit: string;

    @Column({type: 'decimal', precision: 14, scale: 2, transformer: decimalTransformer})
    quantity: number;

    @Column({type: 'decimal', precision: 14, scale: 2, transformer: decimalTransformer})
    unitPrice: number;

    @Column('int')
    order: number;

    @Column('boolean', {default: false})
    isAdditional: boolean;

    @ManyToOne(() => BudgetCategory, (category) => category.items, {
        onDelete: 'CASCADE'// Si se elimina la categoria se eliminan sus items
    })
    category: BudgetCategory;
}