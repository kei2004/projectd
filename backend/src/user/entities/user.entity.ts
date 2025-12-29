import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Video } from '../../video/entities/video.entity'; 

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ default: 'student'})
  role: string;

  @OneToMany(() => Video, (video) => video.user)
  videos: Video[];
}