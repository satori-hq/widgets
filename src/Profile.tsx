// @ts-nocheck

export const Profile = ({ profile, selectedNode }) => {
  return (
    <div id="profile" className="mt-2 mt-4">
      <div>
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

        {/* 
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
          */}

        {/* {profile.description ? (
            <>
              <h5>Profile Description</h5>
              <p>{profile.description}</p>
            </>
          ) : null} */}
      </div>
      {/* <pre style={{ maxWidth: "400px" }}>
        {JSON.stringify(profile, null, 2)}
      </pre> */}
    </div>
  );
};
