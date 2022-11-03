import { FC } from "react";
import { useForm } from "@mantine/form";
import { Button, TextInput, Text, Stack, Slider } from "@mantine/core";

import axios from "axios";
import { showNotification } from "@mantine/notifications";
import { FormData } from "../types/TPeerReviewForm";

const PeerReviewForm: FC<{ userId: string; username: string }> = ({
  userId,
  username,
}) => {
  const form = useForm({
    initialValues: {
      name: username,
      required_rating: {
        presentation_score: {
          score: 0,
          comment: "",
        },
        technical_score: {
          score: 0,
          comment: "",
        },
        assists_peers_score: {
          score: 0,
          comment: "",
        },
        documentation_score: {
          score: 0,
          comment: "",
        },
      },
      optional_rating: {
        stood_out: "",
      },
    },

    validate: {
      name: (value) => (value !== "" ? null : "Name is required"),
      required_rating: {
        presentation_score: {
          score: (value) => (value <= 5 ? null : "Maximum score is 5"),
          comment: (value) => (value !== "" ? null : "Comment is required"),
        },
        technical_score: {
          score: (value) => (value <= 5 ? null : "Maximum score is 5"),
          comment: (value) => (value !== "" ? null : "Comment is required"),
        },
        assists_peers_score: {
          score: (value) => (value <= 5 ? null : "Maximum score is 5"),
          comment: (value) => (value !== "" ? null : "Comment is required"),
        },
        documentation_score: {
          score: (value) => (value <= 5 ? null : "Maximum score is 5"),
          comment: (value) => (value !== "" ? null : "Comment is required"),
        },
      },
    },
  });

  const handlePeerReview = async (values: FormData) => {
    const review = { ...values, submitted_by: userId };
    const result = await axios.post("/api/peer-review", review);
    if (!result.data.error) {
      showNotification({
        title: "Feedback submitted",
        message: "Thanks for providing feedback.",
        color: "green",
      });
    }
  };

  const marks = [
    { value: 5, label: "5" },
    { value: 4, label: "4" },
    { value: 3, label: "3" },
    { value: 2, label: "2" },
    { value: 1, label: "1" },
  ];

  return (
    <>
      <form onSubmit={form.onSubmit(handlePeerReview)}>
        <TextInput
          withAsterisk
          label="Name"
          {...form.getInputProps("name")}
          readOnly
        />
        <Stack>
          <Text align="center" weight={600} mt="md">
            Presentation Score
          </Text>
          <Slider
            marks={marks}
            max={5}
            min={0}
            mb="md"
            {...form.getInputProps("required_rating.presentation_score.score")}
          />
          <TextInput
            withAsterisk
            label="Comment"
            {...form.getInputProps(
              "required_rating.presentation_score.comment"
            )}
          />
        </Stack>
        <Stack>
          <Text align="center" weight={600} mt="md">
            Technical Score
          </Text>
          <Slider
            marks={marks}
            max={5}
            min={0}
            mb="md"
            {...form.getInputProps("required_rating.technical_score.score")}
          />
          <TextInput
            withAsterisk
            label="Comment"
            {...form.getInputProps("required_rating.technical_score.comment")}
          />
        </Stack>
        <Stack>
          <Text align="center" weight={600} mt="md">
            Assists Peers Score
          </Text>
          <Slider
            marks={marks}
            max={5}
            min={0}
            mb="md"
            {...form.getInputProps("required_rating.assists_peers_score.score")}
          />
          <TextInput
            withAsterisk
            label="Comment"
            {...form.getInputProps(
              "required_rating.assists_peers_score.comment"
            )}
          />
        </Stack>
        <Stack>
          <Text align="center" weight={600} mt="md">
            Documentation Score
          </Text>
          <Slider
            marks={marks}
            max={5}
            min={0}
            mb="md"
            {...form.getInputProps("required_rating.documentation_score.score")}
          />
          <TextInput
            withAsterisk
            label="Comment"
            {...form.getInputProps(
              "required_rating.documentation_score.comment"
            )}
          />
        </Stack>
        <Stack>
          <Text align="center" weight={600} mt="md">
            Additional Feedback
            <TextInput
              label="Comment"
              {...form.getInputProps("optional_rating.stood_out")}
            />
          </Text>
        </Stack>
        <Button fullWidth mt="sm" type="submit">
          Submit
        </Button>
      </form>
    </>
  );
};

export default PeerReviewForm;
