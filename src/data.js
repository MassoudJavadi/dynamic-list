export const treeData = {
  id: 1,
  name: "امید امیدی",
  children: [
    {
      id: 2,
      name: "نوید جلیلی",
      children: [
        { id: 5, name: "منصوره هادیان" },
        { id: 6, name: "غلامرضا کریمی" },
        {
          id: 7,
          name: "فیروزه شاه آبادی",
          children: [
            { id: 8, name: "بهرام رازی" },
            { id: 9, name: "لیلی پاک طینت" },
          ],
        },
      ],
    },
    { id: 3, name: "رسول کرمی" },
    {
      id: 4,
      name: "مرتضی میرمیران",
      children: [
        {
          id: 50,
          name: "سیروس برق آسا",
          children: [
            { id: 51, name: "سید احمد حسینی" },
            { id: 52, name: "سید وحید حسینی" },
          ],
        },
      ],
    },
  ],
};


export const newTreeData = 
 {
children: [
      {
        userId: "dsadasdsdasdasdasddsadasd",
        role: "SalesManager"
      },
      {
        userId: "dsadasdsdasdasdasdasdasda",
        role: "SalesManager"
      }
    ],
    parent: {
      userId: "dsadasdasdasdasd",
      role: "Chief"
    },
    userInfo: {
      role: "DirectorofEducation",
      chiefId: "dsadasdasdasdasd",
      parentId: 1,
      netWorkMemberId: 3
    }
  }

