import React, { useState, useEffect } from "react";
import TreeNode from "./components/TreeNode";
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

const App: React.FC = () => {
  const [rootNode, setRootNode] = useState<UserData | null>(null);

  useEffect(() => {
    fetchRootNode();
  }, []);

  const fetchRootNode = async () => {
    try {
      const response = await axios.get<any>("http://172.31.30.55:5006/api/v1/netWork/3");
      // console.log("RESP", response);
      setRootNode(response.data.data);
    } catch (error) {
      console.error("Error fetching root node:", error);
    }
  };

  return (
    <div className="App" dir="rtl">
      <div style={{ height: "100vh", width: "100vw" }}>{rootNode && <TreeNode node={rootNode} depth={0} />}</div>
    </div>
  );
};

export default App;
