export interface FavoriteMusicModel {
  id: string;
  user_id: string;
  video_id: string;
  video_title: string;
  video_thumbnail: string;
  create_at?: Date;
}
