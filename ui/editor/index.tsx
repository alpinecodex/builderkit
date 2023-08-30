"use client";

import { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { TiptapEditorProps } from "./props";
import { TiptapExtensions } from "./extensions";
import useLocalStorage from "@/lib/hooks/use-local-storage";
import { useDebouncedCallback } from "use-debounce";
import { useCompletion } from "ai/react";
import { toast } from "sonner";
import va from "@vercel/analytics";
import DEFAULT_EDITOR_CONTENT from "./default-content";
import { EditorBubbleMenu } from "./components/bubble-menu";
import { getPrevText } from "@/lib/editor";
import { ImageResizer } from "./components/image-resizer";
import { CommandMenu } from "../ui/cmd-k";
import MenuBar from "./menu";

export default function Editor() {
  const [content, setContent] = useLocalStorage(
    "content",
    DEFAULT_EDITOR_CONTENT,
  );
  const [saveStatus, setSaveStatus] = useState("Saved");

  const [hydrated, setHydrated] = useState(false);

  const debouncedUpdates = useDebouncedCallback(async ({ editor }) => {
    const json = editor.getJSON();
    setSaveStatus("Saving...");
    setContent(json);
    // Simulate a delay in saving.
    setTimeout(() => {
      setSaveStatus("Saved");
    }, 500);
  }, 750);

  const editor = useEditor({
    extensions: TiptapExtensions,
    editorProps: TiptapEditorProps,
    onUpdate: (e) => {
      setSaveStatus("Unsaved");
      const selection = e.editor.state.selection;
      const lastTwo = getPrevText(e.editor, {
        chars: 2,
      });
      if (lastTwo === "++" && !isLoading) {
        e.editor.commands.deleteRange({
          from: selection.from - 2,
          to: selection.from,
        });
        complete(
          getPrevText(e.editor, {
            chars: 5000,
          }),
        );
        // complete(e.editor.storage.markdown.getMarkdown());
        va.track("Autocomplete Shortcut Used");
      } else {
        debouncedUpdates(e);
      }
    },
    autofocus: "end",
  });

  const { complete, completion, isLoading, stop } = useCompletion({
    id: "novel",
    api: "/api/generate",
    onFinish: (_prompt, completion) => {
      editor?.commands.setTextSelection({
        from: editor.state.selection.from - completion.length,
        to: editor.state.selection.from,
      });
    },
    onError: (err) => {
      toast.error(err.message);
      if (err.message === "You have reached your request limit for the day.") {
        va.track("Rate Limit Reached");
      }
    },
  });

  const prev = useRef("");

  // Insert chunks of the generated text
  useEffect(() => {
    const diff = completion.slice(prev.current.length);
    prev.current = completion;
    editor?.commands.insertContent(diff);
  }, [isLoading, editor, completion]);

  useEffect(() => {
    // if user presses escape or cmd + z and it's loading,
    // stop the request, delete the completion, and insert back the "++"
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || (e.metaKey && e.key === "z")) {
        stop();
        if (e.key === "Escape") {
          editor?.commands.deleteRange({
            from: editor.state.selection.from - completion.length,
            to: editor.state.selection.from,
          });
        }
        editor?.commands.insertContent("++");
      }
    };
    const mousedownHandler = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      stop();
      if (window.confirm("AI writing paused. Continue?")) {
        complete(editor?.getText() || "");
      }
    };
    if (isLoading) {
      document.addEventListener("keydown", onKeyDown);
      window.addEventListener("mousedown", mousedownHandler);
    } else {
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("mousedown", mousedownHandler);
    }
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("mousedown", mousedownHandler);
    };
  }, [stop, isLoading, editor, complete, completion.length]);

  // Hydrate the editor with the content from localStorage.
  useEffect(() => {
    if (editor && content && !hydrated) {
      editor.commands.setContent(content);
      setHydrated(true);
    }
  }, [editor, content, hydrated]);

  return (
    <div className="absolute right-0 top-0 w-screen items-end">
      {/* Cmd + K */}
      <CommandMenu editor={editor} />
      {/* Text Formatting Menu */}
      <MenuBar editor={editor} />
      <div
        onClick={() => {
          editor?.chain().focus().run();
        }}
        className="absolute right-0 top-0 min-h-screen w-3/4 border-neutral-200 sm:mb-[calc(20vh)]"
      >
        <div className="fixed right-14 top-4 z-50 rounded-lg bg-neutral-100 px-2 py-1 text-sm text-neutral-400">
          {saveStatus}
        </div>
        {editor && <EditorBubbleMenu editor={editor} />}
        {editor?.isActive("image") && <ImageResizer editor={editor} />}
        <div
          className="max-w-screen-md px-12 pb-56 pt-24
        "
        >
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}
