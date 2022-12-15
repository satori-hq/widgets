// @ts-nocheck
import { useEffect, useState } from "react";
import { AppDefault } from "./AppDefault";
import { Profile } from "./Profile";
import { ProfileDefault } from "./ProfileDefault";
import { Tables } from "./Tables";

export const Sidebar = ({ selectedNode, profiles, followedBy, following }) => {
  const [profile, setProfile] = useState();

  useEffect(() => {
    setProfile(profiles[selectedNode]);
  }, [selectedNode]);

  useEffect(() => {
    // console.log(`https://ipfs.io/ipfs/${profile?.image?.ipfs_cid}`);
  }, [profile]);

  if (!selectedNode) return <AppDefault />;

  return (
    <div id="sidebar" className="" role="alert">
      {profile ? (
        <Profile selectedNode={selectedNode} profile={profile} />
      ) : (
        <ProfileDefault selectedNode={selectedNode} />
      )}
      <Tables followedBy={followedBy} following={following} />
    </div>
  );
};
