import { NextPage } from "next";
import Head from "next/head";

import { Container } from "@mantine/core";

import { useEffect, useState } from "react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import ImageFeed from "../../components/ImageFeed";
import { TImage } from "../../types/TProfile";

const Gallery: NextPage = () => {
  const supabase = useSupabaseClient();
  const user = useUser();
  const [data, setData] = useState<TImage[] | null>(null);

  useEffect(() => {
    async function loadData() {
      const { data: user_uploads } = await supabase
        .from("user_uploads")
        .select("*")
        .eq("user_id", user?.id);

      setData(user_uploads);
    }
    loadData();
    // // Only run query once user is logged in.
    // if (user) loadData();
  });

  return (
    <Container>
      <Head key={"account-page"}>
        <title>Image Feed</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <ImageFeed imageList={data} />
      </main>

      <footer></footer>
    </Container>
  );
};

export default Gallery;
