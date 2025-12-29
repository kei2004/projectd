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
  description: string; // 説明文（「ここが分かりません」など）

  @Column()
  videoUrl: string; // R2のURL（https://.../uuid-move.mp4）

  @Column()
  genre: string; // ★追加！(Break, HipHop, Locking...)

  @CreateDateColumn()
  createdAt: Date; // 投稿日

  // ▼ ここが重要！「動画は必ず一人のユーザーに属する」設定
  @ManyToOne(() => User, (user) => user.videos)
  user: User;
}