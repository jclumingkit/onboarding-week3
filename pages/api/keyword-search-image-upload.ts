import { NextApiRequest, NextApiResponse } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabase = createServerSupabaseClient({ req, res });

  if (req.method === "POST") {
    const { query } = req.body;
    const { data, error } = await supabase
      .from("user_uploads")
      .select("*")
      .textSearch("description", `${query}`);
    res.status(200).json({ result: data, error: error });
  } else {
    res.setHeader("Allow", ["POST"]);
    res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
