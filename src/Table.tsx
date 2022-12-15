// @ts-nocheck
import React from "react";

export function Table({ title, nodeType, k, v, data }) {
  const style = {
    overflow: "hidden",
    whiteSpace: "nowrap",
    maxWidth: "300px",
  };

  return (
    <>
      <h6 className="mb-4">
        {title} ({data.length})
      </h6>
      <div className="table-responsive">
        <table className="table table-sm" style={{ fontSize: "12px" }}>
          <thead>
            <th style={style}>{k.label}</th>
            <th>{v.label}</th>
          </thead>
          <tbody>
            {data.map((i) => (
              <tr className="align-middle" key={i[nodeType][k.id]}>
                <td style={style}>{i[nodeType][k.id]}</td>
                <td>{i[nodeType][v.id]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
