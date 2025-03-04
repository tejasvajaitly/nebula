"use client";

import TextStyle from "@tiptap/extension-text-style";
import { EditorProvider, useCurrentEditor } from "@tiptap/react";
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

`;

export default () => {
  return (
    <EditorProvider
      slotBefore={<MenuBar />}
      extensions={extensions}
      content={content}
      editorProps={{
        attributes: {
          class:
            "prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl m-5 focus:outline-none",
        },
      }}
    ></EditorProvider>
  );
};
