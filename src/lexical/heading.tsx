import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection } from "lexical";
import { $setBlocksType } from "@lexical/selection";
import { HeadingTagType, $createHeadingNode } from "@lexical/rich-text";

export const CustomHeadingActions = () => {
  const [editor] = useLexicalComposerContext();

  const handleOnClick = (tag: HeadingTagType) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(tag));
      }
    });
  };

  return (
    <div style={{ marginTop: "10px" }}>
      <span style={{ fontWeight: "bold" }}>Align actions</span>
      <div>
        <button
          className="bg-zinc-600 text-white px-2 py-1 rounded-md"
          key={"h1"}
          onClick={() => handleOnClick("h1")}
        >
          H1
        </button>
      </div>
    </div>
  );
};
