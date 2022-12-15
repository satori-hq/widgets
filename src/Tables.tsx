// @ts-nocheck
import { useEffect, useState } from "react";
import { Table } from "./Table";

export const Tables = ({ followedBy, following }) => {
  const [deg1, setDeg1] = useState();

  return (
    <div
      id="tables"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gridGap: "20px",
      }}
    >
      <div id="table-1">
        {followedBy ? (
          <Table
            title={"Followers"}
            data={followedBy}
            nodeType={"source"}
            k={{
              id: "id",
              label: "Account",
            }}
            v={{
              id: "count",
              label: "Count",
            }}
          ></Table>
        ) : null}
      </div>
      <div id="table-2">
        {following ? (
          <Table
            title={"Following"}
            data={following}
            nodeType={"target"}
            k={{
              id: "id",
              label: "Account",
            }}
            v={{
              id: "count",
              label: "Count",
            }}
          ></Table>
        ) : null}
      </div>
    </div>
  );
};
