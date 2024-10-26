import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronRight, Plus, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export interface TreeNode {
  name: string;
  data?: string;
  children?: TreeNode[];
}

export interface TagViewProps {
  node: TreeNode;
  onUpdate: (updatedNode: TreeNode) => void;
  onDelete?: () => void;
  isRoot?: boolean;
}

export default function TagView({
  node,
  onUpdate,
  onDelete,
  isRoot = false,
}: TagViewProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(node.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleAddChild = () => {
    const newChild: TreeNode = {
      name: `New Child ${(node.children?.length || 0) + 1}`,
      data: "",
    };
    const updatedNode = {
      ...node,
      children: [...(node.children || []), newChild],
    };
    delete updatedNode.data;
    onUpdate(updatedNode);
    setIsExpanded(true);
  };

  const handleUpdateData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedNode = { ...node, data: e.target.value };
    onUpdate(updatedNode);
  };

  const handleEditName = () => {
    setIsEditing(true);
    setEditName(node.name);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditName(e.target.value);
  };

  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const updatedNode = { ...node, name: editName };
      onUpdate(updatedNode);
      setIsEditing(false);
    } else if (e.key === "Escape") {
      setIsEditing(false);
      setEditName(node.name);
    }
  };

  const handleDeleteChild = (index: number) => {
    const updatedChildren = [...(node.children || [])];
    updatedChildren.splice(index, 1);
    onUpdate({ ...node, children: updatedChildren });
  };

  return (
    <div className="border rounded-md mb-2">
      <div className="flex items-center p-2 bg-blue-100">
        <Button
          variant="ghost"
          size="icon"
          className="w-6 h-6 p-0 mr-2"
          onClick={handleToggle}
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
        {isEditing ? (
          <Input
            ref={inputRef}
            value={editName}
            onChange={handleNameChange}
            onKeyDown={handleNameKeyDown}
            className="h-6 py-0 px-1 mr-2"
          />
        ) : (
          <span className="mr-2 cursor-pointer" onClick={handleEditName}>
            {node.name}
          </span>
        )}
        <div className="ml-auto flex items-center space-x-2">
          <Button
            variant="secondary"
            size="sm"
            className="text-xs"
            onClick={handleAddChild}
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Child
          </Button>
          {!isRoot && (
            <Button
              variant="destructive"
              size="sm"
              className="text-xs"
              onClick={onDelete}
              aria-label={`Delete ${node.name}`}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
      {isExpanded && (
        <div className="pl-6 pr-2 py-2">
          {(!node.children || node.children.length === 0) && (
            <div className="mb-2">
              <label
                htmlFor={`data-${node.name}`}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Data
              </label>
              <Input
                id={`data-${node.name}`}
                value={node.data || ""}
                onChange={handleUpdateData}
                className="w-full"
                placeholder="Enter data for this node"
              />
            </div>
          )}
          {node.children?.map((child, index) => (
            <TagView
              key={index}
              node={child}
              onUpdate={(updatedChild) => {
                const updatedChildren = [...(node.children || [])];
                updatedChildren[index] = updatedChild;
                onUpdate({ ...node, children: updatedChildren });
              }}
              onDelete={() => handleDeleteChild(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}