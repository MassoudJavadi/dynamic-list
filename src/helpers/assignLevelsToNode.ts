export const assignLevelsToNodes = (node: any, level = 0): void => {
  node.level = level;
  if (node.children) {
    node.children.forEach((child: any) => assignLevelsToNodes(child, level + 1));
  }
};
