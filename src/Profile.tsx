// @ts-nocheck
import { json } from "d3";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

export const Profile = ({ data, profiles, selectedNode }) => {
  const [deg1, setDeg1] = useState();
  const [profile, setProfile] = useState();

  useEffect(() => {
    if (selectedNode) {
      let profile = profiles[selectedNode];
      setProfile(profile);
      console.log("profiles", profile);
      console.log("data", data.links);
      const myFollows = data.links.filter((e) => e.source.id === selectedNode);
      const myFollowers = data.links.filter(
        (e) => e.target.id === selectedNode
      );

      console.log("myFollows", myFollows);
      console.log("myFollowers", myFollowers);
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
                  class="badge rounded-pill text-bg-primary"
                  value={key}
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

          {profile.description ? (
            <>
              <h5>Profile Description</h5>
              <p>{profile.description}</p>
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};
