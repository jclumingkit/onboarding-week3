export type FormData = {
  name: string;
  required_rating: {
    presentation_score: {
      score: number;
      comment: string;
    };
    technical_score: {
      score: number;
      comment: string;
    };
    assists_peers_score: {
      score: number;
      comment: string;
    };
    documentation_score: {
      score: number;
      comment: string;
    };
  };
  optional_rating: {
    stood_out: string;
  };
};
