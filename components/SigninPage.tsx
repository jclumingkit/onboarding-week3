import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/router";
import { useForm } from "@mantine/form";
import { TextInput, PasswordInput, Button, Group, Box } from "@mantine/core";
import { setCookie } from "cookies-next";

type FormData = {
  email: string;
  password: string;
};

export default function SigninPage() {
  const supabase = useSupabaseClient();
  const router = useRouter();

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length >= 6 ? null : "Password must be atleast 6 characters",
    },
  });

  const addUser = async (values: FormData) => {
    const { data, error } = await supabase.auth.signInWithPassword(values);
    console.log(error);
    if (data.user !== null) {
      setCookie("current_user", data.user.id);
      router.push("/p/profile");
    }
  };

  return (
    <Box sx={{ maxWidth: 300 }} mx="auto">
      <form onSubmit={form.onSubmit(addUser)}>
        <TextInput
          withAsterisk
          label="Email"
          placeholder="your@email.com"
          {...form.getInputProps("email")}
        />

        <PasswordInput
          withAsterisk
          label="Password"
          {...form.getInputProps("password")}
        />

        <Group position="right" mt="md">
          <Button type="submit">Submit</Button>
        </Group>
      </form>
    </Box>
  );
}
