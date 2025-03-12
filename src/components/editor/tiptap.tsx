"use client";

import TextStyle from "@tiptap/extension-text-style";
import { EditorProvider, JSONContent, useCurrentEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Strikethrough,
  Code as CodeIcon,
  X,
  Trash2,
  Pilcrow,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  List,
  ListOrdered,
  FileCode,
  Quote,
  MinusSquare,
  CornerDownRight,
  Undo,
  Redo,
} from "lucide-react";

const MenuBar = () => {
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  return (
    <div className="control-group">
      <div className="button-group flex flex-wrap gap-1">
        <Button
          size="icon"
          variant={editor.isActive("bold") ? "default" : "outline"}
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant={editor.isActive("italic") ? "default" : "outline"}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant={editor.isActive("strike") ? "default" : "outline"}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant={editor.isActive("code") ? "default" : "outline"}
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editor.can().chain().focus().toggleCode().run()}
        >
          <CodeIcon className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="outline"
          onClick={() => editor.chain().focus().unsetAllMarks().run()}
        >
          <X className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="outline"
          onClick={() => editor.chain().focus().clearNodes().run()}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant={editor.isActive("paragraph") ? "default" : "outline"}
          onClick={() => editor.chain().focus().setParagraph().run()}
        >
          <Pilcrow className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant={
            editor.isActive("heading", { level: 1 }) ? "default" : "outline"
          }
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant={
            editor.isActive("heading", { level: 2 }) ? "default" : "outline"
          }
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant={
            editor.isActive("heading", { level: 3 }) ? "default" : "outline"
          }
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          <Heading3 className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant={
            editor.isActive("heading", { level: 4 }) ? "default" : "outline"
          }
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 4 }).run()
          }
        >
          <Heading4 className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant={
            editor.isActive("heading", { level: 5 }) ? "default" : "outline"
          }
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 5 }).run()
          }
        >
          <Heading5 className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant={
            editor.isActive("heading", { level: 6 }) ? "default" : "outline"
          }
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 6 }).run()
          }
        >
          <Heading6 className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant={editor.isActive("bulletList") ? "default" : "outline"}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant={editor.isActive("orderedList") ? "default" : "outline"}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant={editor.isActive("codeBlock") ? "default" : "outline"}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          <FileCode className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant={editor.isActive("blockquote") ? "default" : "outline"}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="outline"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <MinusSquare className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="outline"
          onClick={() => editor.chain().focus().setHardBreak().run()}
        >
          <CornerDownRight className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="outline"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="outline"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

const extensions = [
  TextStyle.configure({ HTMLAttributes: { class: "text-style" } }),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false,
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false,
    },
  }),
];

const content = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Fusce et lectus ac arcu fermentum fermentum. Suspendisse potenti. Integer vitae libero et tortor posuere fermentum non a erat.

Sed non purus eros. Duis convallis vehicula justo, vel tincidunt magna consectetur ac. Proin vulputate mi sit amet urna pulvinar, sed eleifend nunc varius. Vestibulum auctor luctus turpis id viverra. Etiam id lectus nec eros iaculis feugiat non non urna. Curabitur sit amet orci vitae tortor lacinia convallis non sit amet velit. In tincidunt ex a mauris tristique, at sagittis purus scelerisque. Nulla facilisi.

Phasellus varius sapien ut ligula bibendum, at convallis lacus rhoncus. Suspendisse a velit id libero tincidunt sodales. Morbi efficitur orci et nisl ultricies, et luctus nisi feugiat. Vivamus nec felis est. Ut vel metus nec dui vestibulum sagittis. Donec vehicula magna ut urna posuere, id tristique ligula blandit. Aliquam vitae hendrerit nulla. In rhoncus, ligula id molestie fermentum, nisl erat fermentum dui, eu malesuada quam ex ut odio. Curabitur id felis vitae nisi tincidunt pharetra a nec nisl.

Maecenas sit amet pharetra massa. Nulla facilisi. Nam scelerisque, lorem vel ultrices gravida, est justo congue libero, eget elementum urna neque eu risus. Morbi gravida, nunc at fermentum posuere, enim justo convallis ligula, nec laoreet velit augue ac ligula. Ut id libero eu ex aliquet suscipit. Integer lacinia, risus in varius tristique, lacus lorem vestibulum justo, eget tempus sapien nulla ac augue. Fusce nec volutpat ex.

Vestibulum ac purus nec quam volutpat tincidunt. Aliquam erat volutpat. Donec ac sapien a nisi congue interdum. Etiam vel semper nunc. Donec bibendum eros at elit blandit, eget vehicula lacus elementum. Nunc sit amet sem id augue accumsan gravida. Curabitur nec lorem vel velit scelerisque tincidunt at non urna. Aenean scelerisque sodales justo, nec fermentum justo dignissim ac.

Fusce feugiat justo non nunc laoreet, ac volutpat turpis elementum. Aenean aliquet sapien sit amet purus convallis, ut vulputate nisi suscipit. Duis a risus ut nulla viverra pellentesque in in nulla. Curabitur ullamcorper, lacus non pharetra malesuada, justo risus hendrerit urna, nec interdum sapien ex ac elit. Ut faucibus tortor ac dolor faucibus, in dictum odio tincidunt. Nullam non mi ut dolor tincidunt dapibus. Cras congue odio a purus hendrerit fermentum. Duis nec ante vel tortor consequat tempus. Quisque at metus ac quam dignissim tincidunt. Nam vitae nisi id lectus faucibus imperdiet in eget nunc.

Praesent scelerisque lectus nec nisl sollicitudin, sed vulputate nisi vulputate. Suspendisse potenti. Nullam accumsan orci non dui aliquet, a posuere libero viverra. Morbi in tincidunt neque. Etiam a nunc ut quam iaculis egestas. Pellentesque sed sapien sed erat laoreet ullamcorper ut nec augue. Donec ac nisi ac ligula gravida cursus. Mauris sagittis semper urna, ac vestibulum velit venenatis eu. Nam sed sapien vel lacus maximus dapibus. Duis et urna ut lacus fermentum auctor. Cras suscipit turpis eget mauris pharetra, id vehicula sapien hendrerit. Nulla facilisi. Duis cursus, nisl non lacinia feugiat, urna justo tempus libero, vel pharetra lacus felis et metus.

Nam auctor lacus quis nibh varius, a vestibulum justo dictum. Vivamus laoreet eros ut ligula pharetra, non venenatis libero posuere. Morbi condimentum, sem at egestas lacinia, augue velit ultricies eros, ac viverra nunc felis eget velit. Vestibulum ut pharetra enim, ac ultrices nunc. Mauris aliquet odio sed augue tincidunt, id congue justo bibendum. Donec non massa erat. Suspendisse gravida, arcu id convallis malesuada, elit nisl lacinia nulla, sit amet vehicula quam lectus at velit.

Integer cursus felis nec velit bibendum, in lacinia odio auctor. Duis vestibulum, elit vel iaculis hendrerit, erat ligula tristique augue, eget ultrices eros libero ac nisi. Fusce hendrerit mi sed varius lobortis. Integer sed efficitur ex, a pharetra odio. Curabitur quis nisi vel mi feugiat egestas. Morbi quis facilisis lectus, nec pharetra lorem. Etiam id augue sed erat vestibulum lobortis non non purus. Nulla facilisi. In varius ligula nec mauris tincidunt, ut cursus lacus suscipit.

Sed ac nisi nisi. Cras elementum orci non nulla fringilla, id ultricies felis cursus. Vestibulum ac turpis sed libero faucibus varius. Duis convallis metus id arcu feugiat, eget imperdiet lacus hendrerit. Donec posuere tincidunt magna, id volutpat justo pulvinar nec. Nullam posuere fermentum elit, sed tincidunt tortor congue et. Integer nec nisi felis. Phasellus gravida tincidunt dolor non hendrerit. In eget est vel libero tempor volutpat. Nullam fringilla dapibus urna, at consequat risus pulvinar et.


`;

export default function Tiptap({
  onChange,
}: {
  onChange: (content: JSONContent) => void;
}) {
  return (
    <EditorProvider
      slotBefore={<MenuBar />}
      extensions={extensions}
      content={content}
      editorProps={{
        attributes: {
          class:
            "prose prose-zinc prose-sm sm:prose-base lg:prose-lg xl:prose-xl m-5 focus:outline-none",
        },
      }}
      onUpdate={({ editor }) => {
        onChange(editor.getJSON());
      }}
    ></EditorProvider>
  );
}
