import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { UserData } from "../App";

interface VerticalLineProps {
  depth: number;
  hasChildren: boolean;
  isLastChild: boolean;
  containerHeight: string | number;
  isOpen: boolean; // Added isOpen prop
}

const VerticalLine: React.FC<VerticalLineProps> = ({
  hasChildren,
  isLastChild,
  containerHeight,
  isOpen, // Added isOpen prop
}) => {
  const height = isLastChild ? "20px" : containerHeight;

  // Show verticalLine only when isOpen is true for that level
  if (!isOpen) {
    return null;
  }

  return (
    <div
      style={{
        position: "relative",
        height: "100%",
      }}
    >
      {hasChildren && (
        <div
          style={{
            position: "absolute",
            top: "20px",
            right: 24,
            height,
            borderRight: "2px dashed gray",
          }}
        />
      )}
    </div>
  );
};

const TreeNode: React.FC<{ node: any; depth: number }> = ({ node, depth }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [children, setChildren] = useState<UserData[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState<string | number>("");

  useEffect(() => {
    if (isOpen && !node.children) {
      fetchChildren(node.userId);
    }
  }, [isOpen, node.userId, node.children]);

  useEffect(() => {
    if (containerRef.current) {
      setContainerHeight(containerRef.current.offsetHeight);
    }
  }, [isOpen, children]);

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

  const isLastChild = !node.children && !children?.length;

  return (
    <div style={{ height: "100%" }}>
      <div style={{ display: "flex", alignItems: "center" }} onClick={toggleOpen}>
        <VerticalLine
          depth={depth}
          hasChildren={!!(node.children || children?.length > 0)}
          isLastChild={isLastChild}
          containerHeight={containerHeight}
          isOpen={isOpen} // Pass isOpen to VerticalLine
        />
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
            cursor: "pointer",
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
            <p style={{ fontSize: "10px" }}>{node.role || node?.userInfo?.role}</p>
          </div>
        </div>
      </div>
      {isOpen && (node.children || children?.length > 0) && (
        <div style={{ marginRight: "30px" }} ref={containerRef}>
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
