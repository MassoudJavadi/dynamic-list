import React, { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";
import { UserData } from "../App";
import { Box, Typography, styled } from "@mui/material";

interface VerticalLineProps {
  $containerHeight: number | null;
  hasChildren: boolean;
  isOpen: boolean;
}

const VerticalLine = styled("div")<VerticalLineProps>(({ theme, $containerHeight }) => ({
  position: "absolute",
  top: "20px",
  right: 24,
  height: $containerHeight || 0,
  borderRight: `2px dashed ${theme.palette.grey[500]}`,
}));

const TreeNodeContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  width: "440px",
  backgroundColor: theme.palette.grey[200],
  borderRadius: theme.shape.borderRadius,
  padding: `${theme.spacing(1)} ${theme.spacing(1.25)}`,
  margin: theme.spacing(0.5),
  cursor: "pointer",
}));

interface TreeNodeProps {
  node: any;
  depth: number;
}

const TreeNode: React.FC<TreeNodeProps> = ({ node, depth }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [children, setChildren] = useState<UserData[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
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

  const calculateContainerHeight = () => {
    if (containerRef.current) {
      setContainerHeight(containerRef.current.offsetHeight);
    }
  };

  useEffect(() => {
    calculateContainerHeight();
  }, [isOpen, children]);

  return (
    <Box sx={{ height: "100%" }}>
      <TreeNodeContainer onClick={toggleOpen}>
        <VerticalLine
          $containerHeight={containerHeight}
          hasChildren={!!(node.children || children?.length > 0)}
          isOpen={isOpen}
        />
        {node.children || children?.length > 0 ? (
          isOpen ? (
            <img
              src="/icons/chevron-down.png"
              width={16}
              height={9}
              style={{ transform: "rotate(180deg)" }}
              alt="Expand"
            />
          ) : (
            <img src="/icons/chevron-down.png" width={16} height={9} alt="Collapse" />
          )
        ) : (
          <img src="/icons/chevron-down.png" width={16} height={9} alt="Collapsed" />
        )}
        <Box
          sx={{
            marginLeft: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Typography>{node.userId || node?.userInfo?.chiefId}</Typography>
          <Typography variant="body2">{node.role || node?.userInfo?.role}</Typography>
        </Box>
      </TreeNodeContainer>
      {isOpen && (node.children || children?.length > 0) && (
        <Box sx={{ marginRight: "30px" }} ref={containerRef}>
          {(node.children || children).map((child: any, index: number) => (
            <React.Fragment key={index}>
              <TreeNode node={child} depth={depth + 1} />
            </React.Fragment>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default TreeNode;
