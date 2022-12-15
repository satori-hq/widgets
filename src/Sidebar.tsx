// @ts-nocheck
import { useEffect, useState } from "react";
import { Profile } from "./Profile";
import { Tables } from "./Tables";

export const Sidebar = ({
  data,
  profiles,
  selectedNode,
  handleSelectedNode,
  handleHighlightedtNode,
}) => {
  const [deg1, setDeg1] = useState();
  const [profile, setProfile] = useState();
  const [followedBy, setFollowedBy] = useState();
  const [following, setFollowing] = useState();

  useEffect(() => {
    if (selectedNode) {
      let profile = profiles[selectedNode];
      setProfile(profile);
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
      // console.log("myFollows", myFollows);
      // console.log("myFollowers", myFollowers);
      setFollowedBy(myFollowers);
      setFollowing(myFollows);
    }
  }, [selectedNode]);

  useEffect(() => {
    // console.log(`https://ipfs.io/ipfs/${profile?.image?.ipfs_cid}`);
  }, [profile]);

  return (
    <div id="sidebar" className="" role="alert">
      <Profile selectedNode={selectedNode} profile={profile} />
      <Tables followedBy={followedBy} following={following} />
    </div>
  );
};
