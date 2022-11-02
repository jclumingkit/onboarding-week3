export type Profile = {
  id: string;
  username: string;
  email: string;
  created_at: string;
};

export type TImage = {
  id: string;
  user_id: string;
  image_bucket_path: string;
  description: string;
  compression: string;
  created_at: Date;
};

export type TApiCall = {
  id: string;
  api_path: string;
  called_at: Date;
  called_by: string;
};
