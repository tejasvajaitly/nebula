"use client";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";

import { $convertFromMarkdownString, TRANSFORMERS } from "@lexical/markdown";

import { CodeNode } from "@lexical/code";
import { LinkNode } from "@lexical/link";
import { ListNode, ListItemNode } from "@lexical/list";
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";

import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";

import { CustomHeadingActions } from "@/lexical/heading";
import { MarkdownActions } from "@/lexical/markdown";
import { ListAction } from "@/lexical/list";

import editorTheme from "@/lexical/theme";

const theme = editorTheme;

function onError(error: Error) {
  console.error(error);
}

export default function Editor({ initialContent }: { initialContent: string }) {
  const initialConfig = {
    namespace: "MyEditor",
    theme,
    nodes: [
      HeadingNode,
      CodeNode,
      LinkNode,
      ListNode,
      ListItemNode,
      HorizontalRuleNode,
      QuoteNode,
    ],
    onError,
  };

  return (
    <LexicalComposer
      initialConfig={{
        ...initialConfig,
        editorState: () =>
          $convertFromMarkdownString(initialContent, TRANSFORMERS),
      }}
    >
      <RichTextPlugin
        contentEditable={<ContentEditable className="lexical-editor" />}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <ListPlugin />
      <HistoryPlugin />
      <MarkdownShortcutPlugin transformers={TRANSFORMERS} />

      <ListAction />
      <MarkdownActions />
      <CustomHeadingActions />
    </LexicalComposer>
  );
}
