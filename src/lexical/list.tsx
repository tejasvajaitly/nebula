import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useState } from "react";

import {
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";

import * as React from "react";

const blockTypeToBlockName = {
  bullet: "Bulleted List",
  paragraph: "Normal",
};

export function ListAction() {
  const [editor] = useLexicalComposerContext();
  const [blockType, setBlockType] =
    useState<keyof typeof blockTypeToBlockName>("paragraph");

  const formatList = (listType: keyof typeof blockTypeToBlockName) => {
    if (listType === "bullet" && blockType !== "bullet") {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
      setBlockType("bullet");
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
      setBlockType("paragraph");
    }
  };

  return (
    <div className="toolbar">
      <button
        disabled={false}
        className={"toolbar-item spaced"}
        onClick={() => formatList("bullet")}
      >
        <span className="text">Bullet List</span>
      </button>
    </div>
  );
}
