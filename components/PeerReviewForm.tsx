import { FC } from "react";
import { useForm } from "@mantine/form";
import { Button, Group, TextInput, Text, NumberInput } from "@mantine/core";

import axios from "axios";
// import { showNotification } from "@mantine/notifications";

type FormData = {
  name: string;
  required_rating: {
    presentation_score: {
      score: number;
      comment: string;
    };
    technical_score: {
      score: number;
      comment: string;
    };
    assists_peers_score: {
      score: number;
      comment: string;
    };
    documentation_score: {
      score: number;
      comment: string;
    };
  };
  optional_rating: {
    stood_out: string;
  };
};

const PeerReviewForm: FC<{ userId: string }> = ({ userId }) => {
  const form = useForm({
    initialValues: {
      name: "",
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
    console.log(result);
  };

  return (
    <form onSubmit={form.onSubmit(handlePeerReview)}>
      <TextInput
        withAsterisk
        label="Name"
        placeholder="John Doe"
        {...form.getInputProps("name")}
      />
      <Group>
        <Text>Presentation</Text>
        <NumberInput
          withAsterisk
          label="Score"
          defaultValue={0}
          min={0}
          max={5}
          {...form.getInputProps("required_rating.presentation_score.score")}
        />
        <TextInput
          withAsterisk
          label="Comment"
          {...form.getInputProps("required_rating.presentation_score.comment")}
        />
      </Group>
      <Group>
        <Text>Techinical</Text>
        <NumberInput
          withAsterisk
          label="Score"
          defaultValue={0}
          min={0}
          max={5}
          {...form.getInputProps("required_rating.technical_score.score")}
        />
        <TextInput
          withAsterisk
          label="Comment"
          {...form.getInputProps("required_rating.technical_score.comment")}
        />
      </Group>
      <Group>
        <Text>Assists Peers</Text>
        <NumberInput
          withAsterisk
          label="Score"
          defaultValue={0}
          min={0}
          max={5}
          {...form.getInputProps("required_rating.assists_peers_score.score")}
        />
        <TextInput
          withAsterisk
          label="Comment"
          {...form.getInputProps("required_rating.assists_peers_score.comment")}
        />
      </Group>
      <Group>
        <Text>Documentation</Text>
        <NumberInput
          withAsterisk
          label="Score"
          defaultValue={0}
          min={0}
          max={5}
          {...form.getInputProps("required_rating.documentation_score.score")}
        />
        <TextInput
          withAsterisk
          label="Comment"
          {...form.getInputProps("required_rating.documentation_score.comment")}
        />
      </Group>
      <Group>
        <Text>Stood Out At: </Text>
        <TextInput
          label="Comment"
          {...form.getInputProps("optional_rating.stood_out")}
        />
      </Group>
      <Button mt="sm" type="submit">
        Submit
      </Button>
    </form>
  );
};

export default PeerReviewForm;
