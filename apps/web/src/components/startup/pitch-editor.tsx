"use client";

import StarterKit from "@tiptap/starter-kit";
import {
  CheckSquare,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Text,
  TextQuote,
} from "lucide-react";
import {
  Command,
  createSuggestionItems,
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
  EditorContent,
  EditorRoot,
  handleCommandNavigation,
  type JSONContent,
  renderItems,
  type SuggestionItem,
} from "novel";

const suggestionItems: SuggestionItem[] = createSuggestionItems([
  {
    title: "Text",
    description: "Plain paragraph text.",
    searchTerms: ["p", "paragraph"],
    icon: <Text size={18} />,
    command: ({ editor, range }) =>
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleNode("paragraph", "paragraph")
        .run(),
  },
  {
    title: "Heading 1",
    description: "Big section heading.",
    searchTerms: ["title", "big", "large"],
    icon: <Heading1 size={18} />,
    command: ({ editor, range }) =>
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode("heading", { level: 1 })
        .run(),
  },
  {
    title: "Heading 2",
    description: "Medium section heading.",
    searchTerms: ["subtitle", "medium"],
    icon: <Heading2 size={18} />,
    command: ({ editor, range }) =>
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode("heading", { level: 2 })
        .run(),
  },
  {
    title: "Heading 3",
    description: "Small section heading.",
    searchTerms: ["subtitle", "small"],
    icon: <Heading3 size={18} />,
    command: ({ editor, range }) =>
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode("heading", { level: 3 })
        .run(),
  },
  {
    title: "Bullet List",
    description: "Create a simple bullet list.",
    searchTerms: ["unordered", "point"],
    icon: <List size={18} />,
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleBulletList().run(),
  },
  {
    title: "Numbered List",
    description: "Create a list with numbering.",
    searchTerms: ["ordered"],
    icon: <ListOrdered size={18} />,
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleOrderedList().run(),
  },
  {
    title: "To-do List",
    description: "Track tasks with a to-do list.",
    searchTerms: ["todo", "task", "check", "checkbox"],
    icon: <CheckSquare size={18} />,
    command: ({ editor, range }) =>
      editor.chain().focus().deleteRange(range).toggleTaskList().run(),
  },
  {
    title: "Quote",
    description: "Capture a quote.",
    searchTerms: ["blockquote"],
    icon: <TextQuote size={18} />,
    command: (props) =>
      props.editor
        .chain()
        .focus()
        .deleteRange(props.range)
        .toggleNode("paragraph", "paragraph")
        .toggleBlockquote()
        .run(),
  },
  {
    title: "Code",
    description: "Capture a code snippet.",
    searchTerms: ["codeblock"],
    icon: <Code size={18} />,
    command: (props) =>
      props.editor
        .chain()
        .focus()
        .deleteRange(props.range)
        .toggleCodeBlock()
        .run(),
  },
]);

const slashCommand = Command.configure({
  suggestion: {
    items: () => suggestionItems,
    render: renderItems,
  },
});

const DEFAULT_CONTENT: JSONContent = {
  type: "doc",
  content: [
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "The Problem" }],
    },
    {
      type: "paragraph",
      content: [
        { type: "text", text: "Describe the pain point you're solving..." },
      ],
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Our Solution" }],
    },
    {
      type: "paragraph",
      content: [{ type: "text", text: "Explain your approach..." }],
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "Traction" }],
    },
    {
      type: "paragraph",
      content: [
        { type: "text", text: "Any early metrics, users, or revenue..." },
      ],
    },
  ],
};

interface PitchEditorProps {
  onChange: (html: string) => void;
}

/**
 * Notion-style rich text editor for startup pitches.
 * Built on Novel (Tiptap). Outputs HTML via onChange.
 */
export function PitchEditor({ onChange }: PitchEditorProps) {
  return (
    <EditorRoot>
      <EditorContent
        immediatelyRender={false}
        extensions={[StarterKit, slashCommand]}
        initialContent={DEFAULT_CONTENT}
        onUpdate={({ editor }) => {
          onChange(editor.getHTML());
        }}
        editorProps={{
          handleDOMEvents: {
            keydown: (_view, event) => handleCommandNavigation(event),
          },
          attributes: {
            class:
              "prose dark:prose-invert prose-headings:font-semibold prose-p:text-neutral-600 dark:prose-p:text-white/60 focus:outline-none max-w-full min-h-64 px-8 py-6",
          },
        }}
      >
        <EditorCommand className="z-50 w-72 overflow-hidden rounded-xl border border-neutral-200/60 bg-white shadow-xl dark:border-white/10 dark:bg-neutral-900">
          <EditorCommandEmpty className="px-4 py-3 text-sm text-neutral-400 dark:text-white/40">
            No results
          </EditorCommandEmpty>
          <EditorCommandList>
            {suggestionItems.map((item) => (
              <EditorCommandItem
                key={item.title}
                value={item.title}
                onCommand={(val) => item.command?.(val)}
                className="flex items-center gap-3 px-3 py-2.5 text-sm transition aria-selected:bg-neutral-100 dark:aria-selected:bg-white/10"
              >
                <div className="flex size-9 items-center justify-center rounded-lg border border-neutral-200/60 bg-neutral-50 dark:border-white/10 dark:bg-white/5">
                  {item.icon}
                </div>
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-xs text-neutral-400 dark:text-white/40">
                    {item.description}
                  </p>
                </div>
              </EditorCommandItem>
            ))}
          </EditorCommandList>
        </EditorCommand>
      </EditorContent>
    </EditorRoot>
  );
}
