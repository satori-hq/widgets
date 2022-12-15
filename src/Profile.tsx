// @ts-nocheck
import { json } from "d3";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Table } from "./Table";

export const Profile = ({ data, profiles, selectedNode }) => {
  const [deg1, setDeg1] = useState();
  const [profile, setProfile] = useState();
  const [myFollows, setMyFollows] = useState();
  const [myFollowers, setMyFollowers] = useState();

  useEffect(() => {
    if (selectedNode) {
      let profile = profiles[selectedNode];
      setProfile(profile);
      console.log("profiles", profile);
      console.log("data", data.links);
      const myFollows = data.links
        .filter((e) => e.source.id === selectedNode)
        .reduce((acc, i) => {
          let res = acc.findIndex((el) => el.target.id === i.target.id);
          if (res === -1) {
            acc.push(i);
          }
          return acc;
        }, [])
        .sort((a, b) => b.target.count - a.target.count);
      const myFollowers = data.links
        .filter((e) => e.target.id === selectedNode)
        .reduce((acc, i) => {
          let res = acc.findIndex((el) => el.source.id === i.source.id);
          if (res === -1) {
            acc.push(i);
          }
          return acc;
        }, [])
        .sort((a, b) => b.source.count - a.source.count);
      console.log("myFollows", myFollows);
      console.log("myFollowers", myFollowers);
      setMyFollowers(myFollowers);
      setMyFollows(myFollows);
    }
  }, [selectedNode]);

  useEffect(() => {
    console.log(`https://ipfs.io/ipfs/${profile?.image?.ipfs_cid}`);
  }, [profile]);
  return (
    <div className="alert alert-primary" role="alert">
      {profile ? (
        <div id="profile">
          <img
            style={{ maxWidth: "200px" }}
            src={`https://ipfs.io/ipfs/${profile?.image?.ipfs_cid}`}
          ></img>
          <h3>{profile.name}</h3>
          <h4>
            <a
              href={`https://near.social/#/mob.near/widget/ProfilePage?accountId=${selectedNode}`}
              target="_blank"
            >
              {selectedNode}
            </a>
          </h4>

          {profile.website ? (
            <p>
              <a href={profile.website}>{profile.website}</a>
            </p>
          ) : null}

          {profile.tags ? (
            <>
              {Object.keys(profile.tags).map((key) => (
                <span
                  style={{ marginRight: "8px" }}
                  className="badge rounded-pill text-bg-primary"
                  key={key}
                >
                  {key}
                </span>
              ))}
            </>
          ) : null}

          {/* <pre style={{ maxWidth: "400px" }}>
            {JSON.stringify(profile, null, 2)}
          </pre> */}

          {profile.linktree ? (
            <>
              <h5>Linktree</h5>
              <>
                {Object.entries(profile.linktree).map(([key, value]) => (
                  <p key={key}>
                    <span
                      style={{
                        fontWeight: "bold",
                        minWidth: "100px",
                        marginRight: "10px",
                      }}
                    >
                      {key}
                    </span>
                    <span>{value}</span>
                  </p>
                ))}
              </>
            </>
          ) : null}

          {/* {profile.description ? (
            <>
              <h5>Profile Description</h5>
              <p>{profile.description}</p>
            </>
          ) : null} */}
        </div>
      ) : null}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridGap: "20px",
        }}
      >
        <div>
          {myFollowers ? (
            <Table
              title={"Followers"}
              data={myFollowers}
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
        <div>
          {myFollows ? (
            <Table
              title={"Following"}
              data={myFollows}
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
    </div>
  );
};
