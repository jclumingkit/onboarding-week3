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

import { AppShell } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";

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
      <NotificationsProvider>
        <AppShell padding="md" navbar={<Menu />}>
          {router.pathname.includes("/p/") ? (
            <AuthProvider>
              <Component {...pageProps} />
            </AuthProvider>
          ) : (
            <Component {...pageProps} />
          )}
        </AppShell>
      </NotificationsProvider>
    </SessionContextProvider>
  );
}

function AuthProvider({ children }: { children: JSX.Element }) {
  const user = useUser();
  const router = useRouter();

  if (!router.isReady) return null;

  if (!user) {
    router.push("/signin");
    return null;
  }

  return children;
}
