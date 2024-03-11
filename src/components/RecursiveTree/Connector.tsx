import React from "react";

interface ConnectorProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

const Connector: React.FC<ConnectorProps> = ({ startX, startY, endX, endY }) => {
  const dx = endX - startX;
  const dy = endY - startY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const path = `M ${startX},${startY} Q ${startX + distance / 2},${startY} ${endX},${endY}`;

  return (
    <svg style={{ position: "absolute", zIndex: -1 }}>
      <path d={path} fill="none" stroke="#000" strokeDasharray="5,5" />
    </svg>
  );
};

export default Connector;
