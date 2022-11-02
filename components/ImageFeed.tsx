import { FC } from "react";

import { SimpleGrid, Card, Image, Text } from "@mantine/core";

import { TImage } from "../types/TProfile";

const ImageFeed: FC<{ imageList: TImage[] | null }> = ({ imageList }) => {
  return (
    <>
      <SimpleGrid cols={4}>
        {imageList?.map((imageItem) => {
          return (
            <Card key={imageItem.id} shadow="sm" p="lg" radius="md" withBorder>
              <Card.Section>
                <Image
                  src={imageItem.image_bucket_path}
                  height={160}
                  alt="Norway"
                />
              </Card.Section>

              <Card.Section>
                <Text size="sm" color="dimmed" p="sm">
                  {imageItem.description}
                </Text>
              </Card.Section>
            </Card>
          );
        })}
      </SimpleGrid>
    </>
  );
};

export default ImageFeed;
