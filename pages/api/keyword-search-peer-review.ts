import { NextApiRequest, NextApiResponse } from "next";
import supabase from "../../utils/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { query } = req.body;

    // const { data, error } = await supabase
    //   .rpc("search_peer_reviews", {
    //     keyword: query,
    //   })
    //   .select();

    // const { data, error } = await supabase
    //   .from("peer_reviews")
    //   .select()
    //   .textSearch("fts", `'${query}'`);

    const { data, error } = await supabase
      .from("peer_reviews")
      .select()
      .textSearch("fts", `'${query}'`);

    console.log(data);
    console.log(error);
    res.status(200).json({ result: data, error: error });
  } else {
    res.setHeader("Allow", ["POST"]);
    res
      .status(405)
      .json({ message: `HTTP method ${req.method} is not supported.` });
  }
}
