import React from "react";

interface Person {
  name: string;
  children?: Person[];
}

interface TreeProps {
  data: Person;
}

const TreeNode: React.FC<{ person: Person; level: number }> = ({ person, level }) => {
  const renderChildren = () => {
    if (!person.children || person.children.length === 0) return null;

    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        {person.children.map((child) => (
          <div key={child.name} style={{ marginLeft: 20 }}>
            <TreeNode person={child} level={level + 1} />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div>{person.name}</div>
      {renderChildren()}
    </div>
  );
};

const Tree: React.FC<TreeProps> = ({ data }) => {
  return (
    <div style={{ position: "relative", textAlign: "center" }}>
      <div id="tree">
        <TreeNode person={data} level={0} />
      </div>
    </div>
  );
};

export default Tree;
