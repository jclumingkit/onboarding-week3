import Head from "next/head";
import { Container, Stack, Text } from "@mantine/core";
import SigninPage from "../components/SigninPage";

export default function SignIn() {
  return (
    <Container>
      <Head>
        <title>Sign In</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Stack style={{ height: "100vh" }} align="center" justify="center">
          <Text>Sign in</Text>
          <SigninPage />
        </Stack>
      </main>

      <footer></footer>
    </Container>
  );
}
