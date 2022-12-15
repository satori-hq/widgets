// @ts-nocheck
import React from "react";

export function Table({ title, nodeType, k, v, data }) {
  const style = {
    maxWidth: "200px",
  };

  return (
    <>
      <h6 className="mb-2">
        {title} ({data.length})
      </h6>
      <div className="mr-2">
        <table
          className="table table-sm"
          style={{ maxWidth: "300px", fontSize: "12px" }}
        >
          <thead>
            <tr>
              <th style={style}>{k.label}</th>
              <th style={{ textAlign: "end" }}>{v.label}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((i) => (
              <tr className="align-middle" key={i[nodeType][k.id]}>
                <td style={style}>
                  <span
                    style={{
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      width: "100%",
                      textOverflow: "ellipsis",
                      display: "block",
                    }}
                  >
                    {i[nodeType][k.id]}
                  </span>
                </td>
                <td style={{ textAlign: "end" }}>{i[nodeType][v.id]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
