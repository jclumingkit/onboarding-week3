import { FC, useState } from "react";
import { Stack, Group, Button, TextInput, Text, Card } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { Analysis, Result } from "../types/TKeywordSearch";
import axios from "axios";

const KeywordSearchImageUpload: FC<{ userId: string }> = ({ userId }) => {
  const supabase = useSupabaseClient();
  const [latestAnalysis, setLatestAnalysis] = useState<Analysis | null>(null);

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
    } = await axios.post("/api/keyword-search-image-upload", {
      query: values.query,
    });

    if (result.length > 0) {
      const number_of_sets = result.length;
      const keyword_arr = result.map((item: Result) => {
        const results = item.description
          .split(" ")
          .filter((word: string) => word.toLocaleLowerCase() === values.query);
        return results.length;
      });
      const keyword_count = keyword_arr?.reduce(
        (a: number, b: number) => a + b
      );

      const newAnalysis = {
        keyword: values.query,
        keyword_count: keyword_count,
        number_of_sets: number_of_sets,
        run_by: userId,
      };

      const { error: analysis_error } = await supabase
        .from("keyword_analysis_results")
        .insert(newAnalysis);
      console.log(analysis_error);

      const { data: latest_keyword_analysis } = await supabase
        .rpc("get_keyword_analysis")
        .eq("keyword", values.query)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      setLatestAnalysis(latest_keyword_analysis);
    }
  };

  return (
    <Stack>
      <Text weight={500}>Image Uploads</Text>
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
        <Group position="center" m="md">
          <Card shadow="sm" p="lg" radius="md" withBorder>
            <Text align="center" style={{ fontSize: "20px" }}>
              Keyword
            </Text>
            <Text
              align="center"
              weight={700}
              style={{ fontSize: "32px" }}
              color="green"
            >
              &quot;{latestAnalysis.keyword}&quot;
            </Text>
          </Card>
          <Card shadow="sm" p="lg" radius="md" withBorder>
            <Text align="center" style={{ fontSize: "20px" }}>
              Number of Sets
            </Text>
            <Text
              align="center"
              weight={700}
              style={{ fontSize: "32px" }}
              color="yellow"
            >
              {latestAnalysis.number_of_sets}
            </Text>
          </Card>
          <Card shadow="sm" p="lg" radius="md" withBorder>
            <Text align="center" style={{ fontSize: "20px" }}>
              Total Keyword Count:
            </Text>
            <Text
              align="center"
              weight={700}
              style={{ fontSize: "32px" }}
              color="blue"
            >
              {latestAnalysis.keyword_count}
            </Text>
          </Card>
        </Group>
      )}
    </Stack>
  );
};

export default KeywordSearchImageUpload;
