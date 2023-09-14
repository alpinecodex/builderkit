const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="fixed bottom-12 right-0 z-10 hidden w-3/4 rounded-lg p-12 py-6 text-sm shadow-sm lg:flex">
      <div className="flex flex-wrap gap-2 rounded-lg border bg-neutral-100 bg-opacity-80 p-4 shadow-sm backdrop-blur-md">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={
            editor.isActive("bold")
              ? "is-active dark:text-neutral-700 rounded-md border bg-neutral-300 px-2 py-1"
              : "rounded-md border px-2 py-1"
          }
        >
          bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={
            editor.isActive("italic")
              ? "is-active dark:text-neutral-700 rounded-md border bg-neutral-300 px-2 py-1"
              : "rounded-md border px-2 py-1"
          }
        >
          italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={
            editor.isActive("strike")
              ? "is-active dark:text-neutral-700 rounded-md border bg-neutral-300 px-2 py-1"
              : "rounded-md border px-2 py-1"
          }
        >
          strike
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editor.can().chain().focus().toggleCode().run()}
          className={
            editor.isActive("code")
              ? "is-active dark:text-neutral-700 rounded-md border bg-neutral-300 px-2 py-1"
              : "rounded-md border px-2 py-1"
          }
        >
          code
        </button>
        <button
          className={
            editor.isActive("clear")
              ? "is-active dark:text-neutral-700 rounded-md border bg-neutral-300 px-2 py-1"
              : "rounded-md border px-2 py-1"
          }
          onClick={() => editor.chain().focus().unsetAllMarks().run()}
        >
          clear marks
        </button>
        <button
          className={
            editor.isActive("clearNodes")
              ? "is-active dark:text-neutral-700 rounded-md border bg-neutral-300 px-2 py-1"
              : "rounded-md border px-2 py-1"
          }
          onClick={() => editor.chain().focus().clearNodes().run()}
        >
          clear nodes
        </button>
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={
            editor.isActive("paragraph")
              ? "is-active dark:text-neutral-700 rounded-md border bg-neutral-300 px-2 py-1"
              : "rounded-md border px-2 py-1"
          }
        >
          paragraph
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={
            editor.isActive("heading", { level: 1 })
              ? "is-active dark:text-neutral-700 rounded-md border bg-neutral-300 px-2 py-1"
              : "rounded-md border px-2 py-1"
          }
        >
          h1
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={
            editor.isActive("heading", { level: 2 })
              ? "is-active dark:text-neutral-700 rounded-md border bg-neutral-300 px-2 py-1"
              : "rounded-md border px-2 py-1"
          }
        >
          h2
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={
            editor.isActive("heading", { level: 3 })
              ? "is-active dark:text-neutral-700 rounded-md border bg-neutral-300 px-2 py-1"
              : "rounded-md border px-2 py-1"
          }
        >
          h3
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 4 }).run()
          }
          className={
            editor.isActive("heading", { level: 4 })
              ? "is-active dark:text-neutral-700 rounded-md border bg-neutral-300 px-2 py-1"
              : "rounded-md border px-2 py-1"
          }
        >
          h4
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 5 }).run()
          }
          className={
            editor.isActive("heading", { level: 5 })
              ? "is-active dark:text-neutral-700 rounded-md border bg-neutral-300 px-2 py-1"
              : "rounded-md border px-2 py-1"
          }
        >
          h5
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 6 }).run()
          }
          className={
            editor.isActive("heading", { level: 6 })
              ? "is-active dark:text-neutral-700 rounded-md border bg-neutral-300 px-2 py-1"
              : "rounded-md border px-2 py-1"
          }
        >
          h6
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={
            editor.isActive("bulletList")
              ? "is-active dark:text-neutral-700 rounded-md border bg-neutral-300 px-2 py-1"
              : "rounded-md border px-2 py-1"
          }
        >
          bullet list
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={
            editor.isActive("orderedList")
              ? "is-active dark:text-neutral-700 rounded-md border bg-neutral-300 px-2 py-1"
              : "rounded-md border px-2 py-1"
          }
        >
          ordered list
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={
            editor.isActive("codeBlock")
              ? "is-active dark:text-neutral-700 rounded-md border bg-neutral-300 px-2 py-1"
              : "rounded-md border px-2 py-1"
          }
        >
          code block
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={
            editor.isActive("blockquote")
              ? "is-active dark:text-neutral-700 rounded-md border bg-neutral-300 px-2 py-1"
              : "rounded-md border px-2 py-1"
          }
        >
          blockquote
        </button>
        <button
          className={
            editor.isActive("horizontalRule")
              ? "is-active dark:text-neutral-700 rounded-md border bg-neutral-300 px-2 py-1"
              : "rounded-md border px-2 py-1"
          }
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          horizontal rule
        </button>
        <button
          className={
            editor.isActive("hardBreak")
              ? "is-active dark:text-neutral-700 rounded-md border bg-neutral-300 px-2 py-1"
              : "rounded-md border px-2 py-1"
          }
          onClick={() => editor.chain().focus().setHardBreak().run()}
        >
          hard break
        </button>
        <button
          className={
            editor.isActive("undo")
              ? "is-active dark:text-neutral-700 rounded-md border bg-neutral-300 px-2 py-1"
              : "rounded-md border px-2 py-1"
          }
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
        >
          undo
        </button>
        <button
          className={
            editor.isActive("redo")
              ? "is-active dark:text-neutral-700 rounded-md border bg-neutral-400 px-2 py-1"
              : "rounded-md border px-2 py-1"
          }
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
        >
          redo
        </button>
      </div>
    </div>
  );
};

export default MenuBar;
