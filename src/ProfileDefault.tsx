// @ts-nocheck
export const ProfileDefault = ({ selectedNode }) => {
  return (
    <div id="profile" className="mt-2 mt-4">
      <div>
        <img style={{ maxWidth: "200px" }} src={`near-logo.png`}></img>
        <h3>{selectedNode}</h3>
      </div>
    </div>
  );
};
