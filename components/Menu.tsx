import { Center, NavLink } from "@mantine/core";
import Link from "next/link";
import { useRouter } from "next/router";

import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { deleteCookie } from "cookies-next";

export default function Menu() {
  const session = useSession();
  const supabase = useSupabaseClient();
  const router = useRouter();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      deleteCookie("current_user");
      router.push("/signin");
    }
  };

  return (
    <Center>
      {!session ? (
        <>
          <Link href="/signin" passHref>
            <NavLink label="Sign In" active={router.pathname === "/signin"} />
          </Link>
          <Link href="/signup" passHref>
            <NavLink label="Sign Up" active={router.pathname === "/signup"} />
          </Link>
        </>
      ) : (
        <>
          <Link href="/p/profile" passHref>
            <NavLink
              label="Profile"
              active={router.pathname === "/p/profile"}
            />
          </Link>
          <NavLink label="Logout" onClick={() => handleSignOut()} />
        </>
      )}
    </Center>
  );
}
