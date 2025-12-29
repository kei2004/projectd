export class CreateVideoDto {
  title: string;
  description: string;
  videoUrl: string;
  genre: string; // ジャンルも受け取る
}