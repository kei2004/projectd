// src/video/entities/video.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity'; // パスに注意

@Entity()
export class Video {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  description: string; 

  @Column()
  videoUrl: string; 

  @Column()
  genre: string;

  @CreateDateColumn()
  createdAt: Date; 

  
  @ManyToOne(() => User, (user) => user.videos)
  user: User;
}