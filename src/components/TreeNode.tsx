import React, { useState, useEffect } from "react";
import axios from "axios";

export interface UserData {
  userId: string;
  role: string;
  children?: UserData[];
}

export interface ApiResponse {
  error: null;
  data: {
    children: UserData[];
    parent: UserData;
    userInfo: {
      role: string;
      chiefId: string;
      parentId: number;
      netWorkMemberId: number;
    };
  };
  isSuccess: boolean;
  statusCode: number;
}

interface VerticalLineProps {
  depth: number;
  hasChildren: boolean;
}
const VerticalLine: React.FC<VerticalLineProps> = ({ depth, hasChildren }) => {
  const marginLeft = `${depth * 20}px`;

  return (
    <div
      style={{
        position: "relative",
        height: "100%",
        marginLeft,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "9px",
          height: hasChildren ? "calc(100% - 20px)" : "100%",
          width: "1px",
          backgroundColor: "gray",
        }}
      />
    </div>
  );
};

const TreeNode: React.FC<{ node: any; depth: number }> = ({ node, depth }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [children, setChildren] = useState<UserData[]>([]);

  console.log("NODE", node);
  useEffect(() => {
    if (isOpen && !node.children) {
      fetchChildren(node.userId);
    }
  }, [isOpen, node.userId, node.children]);

  const fetchChildren = async (userId: string) => {
    try {
      const response = await axios.get(`http://172.31.30.55:5006/api/v1/netWork/user?UserId=${userId}`);
      setChildren(response.data.data.children);
    } catch (error) {
      console.error("Error fetching children:", error);
    }
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div style={{ height: "100%" }}>
      <div style={{ display: "flex", alignItems: "center" }} onClick={toggleOpen}>
        <VerticalLine depth={depth} hasChildren={!!(isOpen && (node.children || children?.length > 0))} />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "440px",
            background: "#CFDBE3",
            borderRadius: "4px",
            paddingRight: "10px",
            paddingLeft: "10px",
            margin: "4px",
          }}
        >
          {node.children || children?.length > 0 ? (
            isOpen ? (
              <img src="/icons/chevron-down.png" width={16} height={9} style={{ rotate: "180deg" }} />
            ) : (
              <img src="/icons/chevron-down.png" width={16} height={9} />
            )
          ) : (
            <img src="/icons/chevron-down.png" width={16} height={9} />
          )}
          <div
            style={{
              marginRight: "5px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100vw",
            }}
          >
            <p>{node.userId || node?.userInfo?.chiefId}</p>
            <p style={{ fontSize: "10px" }}> {node.role || node?.userInfo?.role}</p>
          </div>
        </div>
      </div>
      {isOpen && (node.children || children?.length > 0) && (
        <div style={{ marginLeft: "30px" }}>
          {(node.children || children).map((child: any, index: number) => (
            <React.Fragment key={index}>
              <TreeNode node={child} depth={depth + 1} />
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeNode;
