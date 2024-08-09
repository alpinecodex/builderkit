import { Button } from "../ui/button";

import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
} from "lucide-react";

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const handleHeadingChange = (level) => {
    editor
      .chain()
      .focus()
      .toggleHeading({ level: parseInt(level) })
      .run();
  };

  return (
    <div className="fixed left-0 right-0 top-0 z-40 ml-[256px] hidden w-[calc(100%-256px)] rounded-lg text-sm sm:flex">
      <div className="flex w-full flex-wrap gap-2 border-b bg-background/80 p-2 backdrop-blur-md">
        <Button
          variant="outline"
          size="icon"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "is-active bg-accent" : ""}
        >
          <Bold size={16} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "is-active bg-accent" : ""}
        >
          <Italic size={16} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={editor.isActive("strike") ? "is-active bg-accent" : ""}
        >
          <Strikethrough size={16} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editor.can().chain().focus().toggleCode().run()}
          className={editor.isActive("code") ? "is-active bg-accent" : ""}
        >
          <Code size={16} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "is-active bg-accent" : ""}
        >
          <List size={16} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={
            editor.isActive("orderedList") ? "is-active bg-accent" : ""
          }
        >
          <ListOrdered size={16} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive("blockquote") ? "is-active bg-accent" : ""}
        >
          <Quote size={16} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className=""
        >
          <Undo size={16} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className=""
        >
          <Redo size={16} />
        </Button>
      </div>
    </div>
  );
};

export default MenuBar;
