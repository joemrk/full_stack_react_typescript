import { Post } from './Post';
import { Field, Int, ObjectType } from "type-graphql";
import { ManyToOne, BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, PrimaryColumn } from "typeorm";
import { User } from "./User";

@ObjectType()
@Entity()
export class Updoot extends BaseEntity {
  @Field()
  @Column({type: 'int'})
  value: number
  
  @Field()
  @Column()
  @PrimaryColumn()
  userId: number

  @Field(()=>User)
  @ManyToOne(()=> User, user => user.updoots)
  user:User

  @Field()
  @Column()
  @PrimaryColumn()
  postId: number

  @Field(()=>Post)
  @ManyToOne(()=> Post, post => post.updoots, {
    onDelete: "CASCADE"
  })
  post:Post

}