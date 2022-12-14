import { useRouter } from "next/router";
import { useForm } from "@mantine/form";
import { TextInput, PasswordInput, Button, Group, Box } from "@mantine/core";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

type FormData = {
  email: string;
  password: string;
};

export default function SignupPage() {
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
    const { data, error } = await supabase.auth.signUp(values);
    if (data.user !== null) {
      const { error } = await supabase.from("user_profiles").insert({
        id: data.user.id,
        username: data.user.email,
        email: data.user.email,
      });
      console.log(error);
      router.push("/signin");
    } else {
      console.log(error);
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
