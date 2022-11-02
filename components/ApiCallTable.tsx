import { FC, useState, useEffect } from "react";
import { Table } from "@mantine/core";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";

import { TApiCall } from "../types/TProfile";

const ApiCallTable: FC = () => {
  const supabase = useSupabaseClient();
  const user = useUser();
  const [data, setData] = useState<TApiCall[] | null>(null);

  useEffect(() => {
    async function loadData() {
      const { data: api_call_table } = await supabase
        .from("api_call_table")
        .select("*")
        .eq("called_by", user?.id)
        .order("called_at", { ascending: false });

      setData(api_call_table);
    }
    loadData();
    // // Only run query once user is logged in.
    // if (user) loadData();
  });

  const rows = data?.map((apiCall) => {
    const date = new Date(apiCall.called_at);

    return (
      <tr key={apiCall.id}>
        <td>{apiCall.api_path}</td>
        <td>{date.toString()}</td>
        <td>{apiCall.called_by}</td>
      </tr>
    );
  });
  return (
    <>
      <Table striped highlightOnHover withBorder>
        <thead>
          <tr>
            <th>Api Path</th>
            <th>Called At</th>
            <th>Called By</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </Table>
    </>
  );
};

export default ApiCallTable;
