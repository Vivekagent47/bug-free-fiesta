import { useContext, useEffect, useState } from "react";
import { TagsContext, TreeNode } from "./TagsContext";
import TagsView from "./TagsView";
import { Button } from "./components/ui/button";

function App() {
  const [show, setShow] = useState<TreeNode | undefined>();
  const { tags, setTags, getInitialTags, addTag } = useContext(TagsContext);

  useEffect(() => {
    getInitialTags();
  }, []);

  return (
    <div className="p-4">
      <TagsView node={tags} onUpdate={setTags} />

      <Button
        onClick={() => {
          addTag(tags);
          setShow(tags);
        }}
      >
        Export
      </Button>

      {show && (
        <pre className="mt-4 whitespace-pre-wrap break-words text-sm bg-gray-100 p-4 rounded-lg overflow-auto max-h-[600px]">
          {JSON.stringify(show, null, 2)}
        </pre>
      )}
    </div>
  );
}

export default App;
