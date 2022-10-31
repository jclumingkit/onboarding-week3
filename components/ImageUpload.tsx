import { FC, useState } from "react";
import { useForm } from "@mantine/form";
import {
  Modal,
  Button,
  Group,
  FileInput,
  NativeSelect,
  Textarea,
} from "@mantine/core";
import { User, useSupabaseClient } from "@supabase/auth-helpers-react";

import Compressor from "compressorjs";
import { v4 as uuidv4 } from "uuid";

type FormData = {
  image: File | null;
  description: string;
  compression: string;
};

const ImageUpload: FC<{ user: User }> = ({ user }) => {
  const [opened, setOpened] = useState(false);
  const supabase = useSupabaseClient();

  const form = useForm({
    initialValues: {
      image: null,
      compression: "clientSideCompression",
      description: "",
    },
  });

  const handleImageUpload = async (values: FormData) => {
    const imagePath = `${uuidv4()}-${Date.now()}-${values.compression}`;
    const newImageUpload = {
      user_id: user.id,
      image_bucket_path: "",
      description: values.description,
      compression: values.compression,
    };

    if (values.image !== null) {
      switch (values.compression) {
        case "clientSideCompression":
          new Compressor(values.image, {
            quality: 0.5,
            mimeType: "image/jpeg",
            success: async (compressed) => {
              const { data } = await supabase.storage
                .from("images")
                .upload(imagePath, compressed);
              if (data?.path !== undefined) {
                newImageUpload.image_bucket_path = data.path;
              }
              try {
                const { data } = await supabase
                  .from("user_uploads")
                  .insert(newImageUpload)
                  .select();
                console.log(data);
              } catch (error) {
                console.log(error);
              }
            },
          });

          break;
        case "serverSideCompression":
          const { data } = await supabase.functions.invoke("imageCompressor", {
            body: values.image,
          });
          if (data?.path !== undefined) {
            newImageUpload.image_bucket_path = data.path;
          }
          const res = await supabase
            .from("user_uploads")
            .insert(newImageUpload)
            .select();
          console.log(res);
          break;
        case "raw":
          try {
            const { data } = await supabase.storage
              .from("images")
              .upload(imagePath, values.image);

            if (data?.path !== undefined) {
              newImageUpload.image_bucket_path = data.path;
            }
            const res = await supabase
              .from("user_uploads")
              .insert(newImageUpload)
              .select();
            console.log(res);
          } catch (error) {
            console.log(error);
          }
          break;

        default:
          break;
      }
    }
  };

  return (
    <>
      <Modal
        centered
        opened={opened}
        onClose={() => setOpened(false)}
        title="Introduce yourself!"
      >
        <form onSubmit={form.onSubmit(handleImageUpload)}>
          <FileInput
            placeholder="avatar.jpg"
            label="Your Avatar"
            variant="filled"
            withAsterisk
            accept="image/*"
            {...form.getInputProps("image")}
          />
          <Textarea
            label="Image Caption"
            {...form.getInputProps("description")}
          />
          <NativeSelect
            data={[
              {
                value: "clientSideCompression",
                label: "Client-Side Compression",
              },
              {
                value: "serverSideCompression",
                label: "Server-Side Compression",
              },
              { value: "raw", label: "Raw (No Compression)" },
            ]}
            label="Image Compression"
            withAsterisk
            {...form.getInputProps("compression")}
          />
          <Button mt="sm" type="submit">
            Upload
          </Button>
        </form>
      </Modal>

      <Group position="center">
        <Button onClick={() => setOpened(true)}>Open Modal</Button>
      </Group>
    </>
  );
};

export default ImageUpload;
