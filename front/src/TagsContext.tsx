import React, { createContext, useState } from "react";
import AxiosInstance from "./lib/axios";

export interface TreeNode {
  id?: number;
  name: string;
  data?: string | null;
  children?: TreeNode[];
}

const initialTree: TreeNode = {
  name: "root",
  data: "",
};

const useTagsStore = () => {
  const [tags, setTags] = useState(initialTree);
  const [loading, setLoading] = useState(false);

  const getInitialTags = async () => {
    setLoading(true);
    try {
      const res = await AxiosInstance({
        method: "GET",
        url: "/tags",
      });

      if (res.data.length) {
        setTags(res.data[0]);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const addTag = async (tag: TreeNode) => {
    try {
      await AxiosInstance({
        method: "PUT",
        url: "/tags",
        data: tag,
      });
    } catch (e) {
      console.error(e);
    }
  };

  return {
    tags,
    loading,
    setTags,
    addTag,
    getInitialTags,
  };
};

type TagsStoreType = ReturnType<typeof useTagsStore>;
export const TagsContext = createContext({} as TagsStoreType);
export const TagsProvider = ({ children }: { children: React.ReactNode }) => {
  const store = useTagsStore();
  return <TagsContext.Provider value={store}>{children}</TagsContext.Provider>;
};
