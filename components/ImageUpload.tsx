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
import { showNotification, updateNotification } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons";

import { User, useSupabaseClient } from "@supabase/auth-helpers-react";
import Compressor from "compressorjs";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";

type FormData = {
  image: File | null;
  description: string;
  compression: string;
};

const ImageUpload: FC<{ user: User }> = ({ user }) => {
  const [opened, setOpened] = useState(false);
  const [userUpload, setUserUpload] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
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
      setIsLoading(true);
      showNotification({
        id: "user-upload",
        loading: true,
        title: "Uploading...",
        message: `This won't take too long.`,
        autoClose: false,
        disallowClose: true,
      });
      switch (values.compression) {
        case "clientSideCompression":
          new Compressor(values.image, {
            quality: 0.5,
            mimeType: "image/jpeg",
            success: async (compressed) => {
              const { data: image } = await supabase.storage
                .from("images")
                .upload(imagePath, compressed);
              if (image?.path !== undefined) {
                newImageUpload.image_bucket_path = image.path;
                const { data: userUpload } = await axios.post(
                  "/api/user-upload",
                  newImageUpload
                );
                setUserUpload(userUpload);
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
            const { data: userUpload } = await axios.post(
              "/api/user-upload",
              newImageUpload
            );
            setUserUpload(userUpload);
          }
          break;

        case "raw":
          try {
            const { data } = await supabase.storage
              .from("images")
              .upload(imagePath, values.image);

            if (data?.path !== undefined) {
              newImageUpload.image_bucket_path = data.path;
              const { data: userUpload } = await axios.post(
                "/api/user-upload",
                newImageUpload
              );
              setUserUpload(userUpload);
            }
          } catch (error) {
            console.log(error);
          }
          break;

        default:
          break;
      }
    }

    setIsLoading(false);
    userUpload
      ? updateNotification({
          id: "user-upload",
          title: "Upload successful.",
          message: `Thank you for waiting.`,
          color: "teal",
          icon: <IconCheck size={16} />,
          autoClose: 2000,
        })
      : updateNotification({
          id: "user-upload",
          title: "Sorry, there was a problem.",
          message: "Please try again later",
          color: "red",
          icon: <IconX size={16} />,
          autoClose: 2000,
        });
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
            disabled={isLoading}
          />
          <Textarea
            label="Image Caption"
            {...form.getInputProps("description")}
            disabled={isLoading}
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
            disabled={isLoading}
          />
          <Button mt="sm" type="submit" disabled={isLoading}>
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
