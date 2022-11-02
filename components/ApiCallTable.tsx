import { FC } from "react";

import { Table } from "@mantine/core";

import { TApiCall } from "../types/TProfile";

const ApiCallTable: FC<{ apiCallList: TApiCall[] }> = ({ apiCallList }) => {
  const rows = apiCallList.map((apiCall) => {
    const date = new Date(apiCall.called_at);
    return (
      <tr key={apiCall.id}>
        <td>{apiCall.api_path}</td>
        <td>{date.toDateString()}</td>
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
