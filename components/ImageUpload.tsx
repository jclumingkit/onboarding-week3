import { FC, useState } from "react";
import { useForm } from "@mantine/form";
import {
  Button,
  FileInput,
  NativeSelect,
  LoadingOverlay,
  Textarea,
} from "@mantine/core";

import { User, useSupabaseClient } from "@supabase/auth-helpers-react";
import Compressor from "compressorjs";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { showNotification } from "@mantine/notifications";

type FormData = {
  image: File | null;
  description: string;
  compression: string;
};

const ImageUpload: FC<{ user: User }> = ({ user }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
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
                const { data: error } = await axios.post(
                  "/api/user-upload",
                  newImageUpload
                );
                setUploadError(error);
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
            const { data: error } = await axios.post(
              "/api/user-upload",
              newImageUpload
            );
            setUploadError(error);
          }
          break;

        case "raw":
          try {
            const { data } = await supabase.storage
              .from("images")
              .upload(imagePath, values.image);

            if (data?.path !== undefined) {
              newImageUpload.image_bucket_path = data.path;
              const { data: error } = await axios.post(
                "/api/user-upload",
                newImageUpload
              );
              setUploadError(error);
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

    !uploadError
      ? showNotification({
          title: "Upload successful",
          message: "Your post has been saved.",
          color: "green",
        })
      : showNotification({
          title: "Upload error",
          message: "Please try again later.",
          color: "red",
        });
  };

  return (
    <>
      <LoadingOverlay visible={isLoading} overlayBlur={1} />
      <form onSubmit={form.onSubmit(handleImageUpload)}>
        <FileInput
          placeholder="avatar.jpg"
          label="Your Image"
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
    </>
  );
};

export default ImageUpload;
