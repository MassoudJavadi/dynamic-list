// CustomLink.tsx
import React from "react";

interface CustomLinkProps {
  linkData: any;
}

const CustomLink: React.FC<CustomLinkProps> = ({ linkData }) => (
  <path stroke="#808080" strokeDasharray="5,5" strokeWidth="2" fill="none" d={linkData.path} strokeLinecap="round" />
);

export default CustomLink;
