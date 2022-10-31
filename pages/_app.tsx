import "../styles/globals.css";
import "normalize.css/normalize.css";
import type { AppProps } from "next/app";

import { useState } from "react";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import {
  SessionContextProvider,
  Session,
  useUser,
} from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { AppShell, Header } from "@mantine/core";

import Menu from "../components/Menu";

export default function App({
  Component,
  pageProps,
}: AppProps<{ initialSession: Session }>) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());
  const router = useRouter();

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <AppShell
        padding="md"
        header={
          <Header height={60} p="xs">
            <Menu />
          </Header>
        }
      >
        {router.pathname.includes("/p/") ? (
          <AuthProvider>
            <Component {...pageProps} />
          </AuthProvider>
        ) : (
          <Component {...pageProps} />
        )}
      </AppShell>
    </SessionContextProvider>
  );
}

function AuthProvider({ children }: { children: JSX.Element }) {
  const user = useUser();
  const router = useRouter();

  if (!router.isReady) return null;

  if (!user) {
    router.push("/signup");
    return null;
  }

  return children;
}
