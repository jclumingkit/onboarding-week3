import { NextPage } from "next";
import Head from "next/head";

import { Container, Tabs, Center } from "@mantine/core";
import { IconPhoto, IconMessageCircle, IconSettings } from "@tabler/icons";

import { User } from "@supabase/supabase-js";
import { withPageAuth } from "@supabase/auth-helpers-nextjs";

import ImageUpload from "../../components/ImageUpload";
import UserList from "../../components/UserList";
import KeywordSearchImageUpload from "../../components/KeywordSearchImageUpload";
import ApiCallTable from "../../components/ApiCallTable";

import { Profile } from "../../types/TProfile";

import FacebookMessengerPlugin from "../../components/FacebookMessengerPlugin";

const Profile: NextPage<{
  user: User;
  profileList: Profile[];
}> = ({ user, profileList }) => {
  return (
    <Container>
      <Head key={"account-page"}>
        <title>Your Account</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Tabs defaultValue="gallery">
          <Tabs.List>
            <Tabs.Tab value="gallery" icon={<IconPhoto size={14} />}>
              Upload Photo
            </Tabs.Tab>
            <Tabs.Tab value="apiCallsTable" icon={<IconSettings size={14} />}>
              Api Calls
            </Tabs.Tab>
            <Tabs.Tab value="peerReview" icon={<IconMessageCircle size={14} />}>
              Peer Review
            </Tabs.Tab>
            <Tabs.Tab value="keywordAnalysis" icon={<IconSettings size={14} />}>
              Keyword Analysis
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="gallery" pt="xs">
            <ImageUpload user={user} />
          </Tabs.Panel>
          <Tabs.Panel value="apiCallsTable" pt="xs">
            <ApiCallTable />
          </Tabs.Panel>

          <Tabs.Panel value="peerReview" pt="xs">
            <UserList profileList={profileList} userId={user.id} />
          </Tabs.Panel>

          <Tabs.Panel value="keywordAnalysis" pt="xs">
            <KeywordSearchImageUpload userId={user.id} />
          </Tabs.Panel>
        </Tabs>
      </main>

      <footer>
        <Center>
          <FacebookMessengerPlugin />
        </Center>
      </footer>
    </Container>
  );
};

export default Profile;

export const getServerSideProps = withPageAuth({
  redirectTo: "/signin",
  async getServerSideProps(ctx, supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: user_profiles } = await supabase
      .from("user_profiles")
      .select("*")
      .neq("id", user?.id);

    return {
      props: {
        user: user,
        profileList: user_profiles,
      },
    };
  },
});
