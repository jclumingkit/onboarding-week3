export type Analysis = {
  id: string;
  keyword: string;
  keyword_count: number;
  number_of_sets: number;
  run_by: string;
  created_at: Date;
};

export type Result = {
  id: string;
  user_id: string;
  description: string;
  compression: string;
  image_bucket_path: string;
  created_at: Date;
};
