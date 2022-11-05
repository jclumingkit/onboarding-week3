import { FC, useState } from "react";
import {
  Stack,
  Group,
  Button,
  TextInput,
  Text,
  Code,
  Card,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

import axios from "axios";
import { Database } from "../types/supabase";

const KeywordSearchPeerReview: FC<{ userId: string }> = ({ userId }) => {
  const supabase = useSupabaseClient<Database>();
  const [latestAnalysis, setLatestAnalysis] = useState<
    Database["public"]["Tables"]["peer_reviews"]["Row"][] | null
  >(null);

  const form = useForm({
    initialValues: {
      query: "",
    },

    validate: {
      query: (value) => (value !== "" ? null : "Query must not be empty."),
    },
  });
  const handleSearch = async (values: { query: string }) => {
    const {
      data: { result },
    } = await axios.post("/api/keyword-jsonb-ilike", {
      query: values.query,
    });

    console.log(result);
    console.log(userId);
    console.log(supabase);
    if (result.length > 0) {
      setLatestAnalysis(result);
      console.log(result.length);
      // const newAnalysis = {
      //   keyword: values.query,
      //   keyword_count: keyword_count,
      //   number_of_sets: result.length,
      //   run_by: userId,
      // };

      // const { error: analysis_error } = await supabase
      //   .from("keyword_analysis_results")
      //   .insert(newAnalysis);
      // console.log(analysis_error);

      // const { data: latest_keyword_analysis } = await supabase
      //   .rpc("get_keyword_analysis")
      //   .eq("keyword", values.query)
      //   .order("created_at", { ascending: false })
      //   .limit(1)
      //   .single();

      // setLatestAnalysis(latest_keyword_analysis);
    } else {
      alert("no results");
    }
  };

  return (
    <Stack>
      <Text weight={500}>Peer Review</Text>
      <form onSubmit={form.onSubmit(handleSearch)}>
        <Group mt="md">
          <TextInput
            withAsterisk
            placeholder="Search here..."
            {...form.getInputProps("query")}
          />

          <Button type="submit">Submit</Button>
        </Group>
      </form>
      {!latestAnalysis && (
        <Card shadow="sm" p="lg" radius="md" withBorder>
          <Text>No results</Text>
        </Card>
      )}
      {latestAnalysis && (
        <Code block={true}>
          {latestAnalysis.map(
            (analysis) => `${JSON.stringify(analysis, null, 2)}, \n`
          )}
        </Code>
      )}
    </Stack>
  );
};

export default KeywordSearchPeerReview;
