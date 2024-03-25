import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { UserData } from "../App";
import { makeStyles } from "@mui/styles";
import { Typography } from "@mui/material";

interface VerticalLineProps {
  hasChildren: boolean;
  containerHeight: number | null;
  isOpen: boolean;
}

const VerticalLine: React.FC<VerticalLineProps> = ({ hasChildren, containerHeight, isOpen }) => {
  const useStyles = makeStyles({
    verticalLine: {
      position: "absolute",
      top: "20px",
      right: 24,
      height: containerHeight || 0,
      // borderRight: "2px dashed gray",
    },
  });

  const classes = useStyles();

  if (!isOpen) {
    return null;
  }

  return (
    <div style={{ position: "relative", height: "100%" }}>
      {hasChildren && <div className={classes.verticalLine} />}
    </div>
  );
};

const TreeNode: React.FC<{ node: any; depth: number }> = ({ node, depth }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [children, setChildren] = useState<UserData[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState<number | null>(null);

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

  useEffect(() => {
    if (containerRef.current) {
      setContainerHeight(containerRef.current.offsetHeight);
    }
  }, [isOpen, children]);

  const useStyles = makeStyles({
    container: {
      height: "100%",
    },
    treeNode: {
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
    },
    treeNodeContent: {
      display: "flex",
      alignItems: "center",
      width: "440px",
      background: "#CFDBE3",
      borderRadius: "4px",
      padding: "10px",
      margin: "4px",
    },
  });

  const classes = useStyles();

  return (
    <div className={classes.container}>
      <div className={classes.treeNode} onClick={toggleOpen}>
        <VerticalLine
          hasChildren={!!(node.children || children?.length > 0)}
          containerHeight={containerHeight}
          isOpen={isOpen}
        />
        <div className={classes.treeNodeContent}>
          <img
            src="/icons/chevron-down.png"
            alt="chevron"
            width={16}
            height={9}
            style={{ transform: `rotate(${isOpen ? "180deg" : "0deg"})` }}
          />
          <div
            style={{
              marginRight: "5px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100vw",
            }}
          >
            <Typography>{node.userId || node?.userInfo?.chiefId}</Typography>
            <Typography style={{ fontSize: "10px" }}>{node.role || node?.userInfo?.role}</Typography>
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
