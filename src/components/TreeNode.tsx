import React, { useState, useEffect } from "react";
import axios from "axios";

interface UserData {
  userId: string;
  role: string;
  children?: UserData[];
}

interface ApiResponse {
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
      const response = await axios.get<ApiResponse>(`/api/users/${userId}/children`);
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
    <div style={{ marginLeft: `${depth * 20}px` }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div
          style={{
            width: horizontalLineLength,
            height: "1px",
            backgroundColor: "gray",
            marginRight: "5px",
          }}
        />
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
          {node.children && node.children.length > 0 ? (isOpen ? "-" : "+") : ""}
        </div>
        <div style={{ marginLeft: "5px" }}>
          {node.role} ({node.userId})
        </div>
      </div>
      {isOpen && node.children && node.children.length > 0 && (
        <div style={{ marginLeft: "20px" }}>
          {node.children.map((child, index) => (
            <React.Fragment key={index}>
              <div
                style={{
                  height: "20px",
                  borderLeft: "1px solid gray",
                  marginLeft: "10px",
                }}
              />
              <TreeNode node={child} depth={depth + 1} />
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};
