import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
  UpdateDateColumn,
} from 'typeorm';

@Entity('tags')
@Tree('closure-table')
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  data?: string;

  @TreeChildren()
  children?: Tag[];

  @TreeParent()
  parent?: Tag;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @BeforeInsert()
  @BeforeUpdate()
  validateDataAndChildren() {
    if (this.data && this.children?.length) {
      throw new Error('A tag cannot have both data and children');
    }

    if (!this.data && !this.children?.length) {
      throw new Error('A tag must have either data or children');
    }
  }
}
