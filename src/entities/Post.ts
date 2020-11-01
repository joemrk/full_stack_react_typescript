import { Updoot } from './Updoot';
import { Field, Int, ObjectType } from "type-graphql";
import { ManyToOne, BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { User } from "./User";

@ObjectType()
@Entity()
export class Post extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  title!: string;

  @Field()
  @Column()
  text!: string;

  @Field()
  @Column({ type: "int", default: 0 })
  points!: number;

  @Field(() => Int, { nullable: true })
  voteStatus: number | null

  @Field()
  @Column()
  creatorId: number

  @Field()
  @ManyToOne(() => User, user => user.posts)
  creator: User

  @OneToMany(() => Updoot, updoot => updoot.post)
  updoots: Updoot[]

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;

}