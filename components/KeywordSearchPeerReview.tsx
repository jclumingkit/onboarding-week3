import { FC } from "react";
import { Stack, Group, Button, TextInput, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
// import { useSupabaseClient } from "@supabase/auth-helpers-react";
// import { Analysis } from "../types/TKeywordSearch";
import axios from "axios";

const KeywordSearchPeerReview: FC<{ userId: string }> = ({ userId }) => {
  //const supabase = useSupabaseClient();
  //const [latestAnalysis, setLatestAnalysis] = useState<Analysis | null>(null);

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
    } = await axios.post("/api/keyword-search-peer-review", {
      query: values.query,
    });

    console.log(result);

    if (result.length > 0) {
      console.log(result);
      console.log(userId);
      // const newAnalysis = {
      //   keyword: values.query,
      //   keyword_count: keyword_count,
      //   number_of_sets: number_of_sets,
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
      {/* {!latestAnalysis && (
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
      )} */}
    </Stack>
  );
};

export default KeywordSearchPeerReview;
