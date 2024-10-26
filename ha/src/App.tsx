import { useState } from "react";
import TagsView, { TreeNode } from "./TagsView";

const initialTree: TreeNode = {
  name: "root",
  children: [
    { name: "child1", data: "child1" },
    { name: "child2", data: "c2 World" },
  ],
};

function App() {
  const [tree, setTree] = useState(initialTree);

  return (
    <div className="p-4">
      <TagsView node={tree} onUpdate={setTree} />
    </div>
  );
}

export default App;
