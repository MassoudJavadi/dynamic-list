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

const TreeNode: React.FC<{ node: UserData; depth: number }> = ({ node, depth }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [children, setChildren] = useState<UserData[]>([]);

  useEffect(() => {
    if (isOpen && !node.children) {
      fetchChildren(node.userId);
    }
  }, [isOpen, node.userId, node.children]);

  const fetchChildren = async (userId: string) => {
    try {
      const response = await axios.get<ApiResponse>(`http://172.31.30.55:5006/api/v1/netWork/user?UserId=${userId}`);
      setChildren(response.data.data.children);
    } catch (error) {
      console.error("Error fetching children:", error);
    }
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const horizontalLineLength = `${depth * 20}px`;

  return (
    <div style={{ marginRight: `${depth * 20}px` }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div
          style={{
            width: "20px",
            height: "20px",
            backgroundColor: "gray",
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={toggleOpen}
        >
          {node.children || children?.length > 0 ? (isOpen ? "-" : "+") : ""}
        </div>
        <div
          style={{
            width: horizontalLineLength,
            height: "1px",
            backgroundColor: "gray",
            marginLeft: "5px",
          }}
        />

        <div style={{ marginRight: "5px" }}>
          {node.role} ({node.userId})
        </div>
      </div>
      {isOpen && (node.children || children?.length > 0) && (
        <div style={{ marginRight: "20px" }}>
          {(node.children || children).map((child, index) => (
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
