"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
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
import MenuBar from "./menu-bar";
import Stats from "./stats";
import DialogForm from "../draft/dialog-form";
import { Eraser, Send, Copy } from "lucide-react";
import { Button } from "../ui/button";

interface EditorProps {
  content?: any; // Optional, as it might not be provided for new drafts
  id?: string; // Optional, as it might not be provided for new drafts
}

export default function Editor({ content: initialContent, id }: EditorProps) {
  const { data: session } = useSession();
  const [content, setContent] = useState(
    initialContent || DEFAULT_EDITOR_CONTENT,
  );
  const [hydrated, setHydrated] = useState(false);

  // Always call useLocalStorage at the top level
  const [storedContent, setStoredContent] = useLocalStorage("content", content);

  // If an ID is provided, we should not use local storage to manage the content state
  const useLocalStorageForContent = !id;

  useEffect(() => {
    if (useLocalStorageForContent && !hydrated) {
      setContent(storedContent);
      setHydrated(true);
    }
  }, [storedContent, useLocalStorageForContent, hydrated]);

  const syncContent = useCallback(() => {
    if (useLocalStorageForContent) {
      setStoredContent(content);
    }
  }, [useLocalStorageForContent, content, setStoredContent]);

  useEffect(() => {
    return syncContent;
  }, [syncContent]);

  const debouncedUpdates = useDebouncedCallback(async ({ editor }) => {
    const json = editor.getJSON();
    setContent(json);
  }, 750);

  const editor = useEditor({
    extensions: TiptapExtensions,
    editorProps: TiptapEditorProps,
    onUpdate: (e) => {
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
    headers: {
      email: session?.user?.email,
    },
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

  // Hydrate the editor with the content from the prop or localStorage.
  useEffect(() => {
    if (editor && !hydrated) {
      editor.commands.setContent(content);
      setHydrated(true);
    }
  }, [editor, content, hydrated]);

  // Copy Content Function
  const copyContent = () => {
    const el = document.createElement("div");
    el.innerHTML = editor?.getHTML() || "";
    document.body.appendChild(el);

    const range = document.createRange();
    range.selectNode(el);

    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }

    try {
      document.execCommand("copy");
      toast.success("Content copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy text.");
    }

    if (selection) {
      selection.removeAllRanges();
    }

    document.body.removeChild(el);
  };

  // Post to Wordpress
  const postToWordpress = async () => {
    const apiCall = new Promise(async (resolve, reject) => {
      const postContent = editor?.getHTML() || "";
      try {
        const response = await fetch("/api/wordpress", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: postContent }),
        });
        const data = await response.json();
        if (!response.ok) {
          reject(new Error("Something went wrong."));
        } else {
          resolve(data);
        }
      } catch (err) {
        console.error(err);
        reject(new Error("Something went wrong."));
      }
    });
    toast.promise(apiCall, {
      loading: `Posting to WordPress...`,
      success: (data) => `Successfully posted to WordPress`,
      error: (err) => {
        if (err.message === "Something went wrong.") {
          return "You need to add your WordPress credentials in Settings.";
        } else {
          return "Something went wrong. Please try again later.";
        }
      },
    });
  };

  // Clear Editor Function
  const clearEditor = () => {
    if (editor) {
      editor.commands.setContent({
        type: "doc",
        content: [],
      });
      setContent({
        type: "doc",
        content: [],
      }); // This will clear the local storage
    }
  };

  return (
    <div className="relative h-screen">
      {BottomBar(copyContent, clearEditor, postToWordpress, editor)}
      <CommandMenu editor={editor} />
      <MenuBar editor={editor} />
      <DialogForm editor={editor} />
      <div
        className="relative mx-auto max-w-2xl py-32"
        onClick={() => {
          editor?.chain().focus().run();
        }}
      >
        {editor && <EditorBubbleMenu editor={editor} />}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

const BottomBar = (copyContent, clearEditor, postToWordpress, editor) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 ml-[256px] flex w-[calc(100%-256px)] gap-2 border-t bg-background/80 p-2 backdrop-blur-sm">
      <Button variant="outline" size="sm" onClick={copyContent}>
        <Copy className="mr-2 h-4 w-4" />
        Copy
      </Button>

      <Button variant="outline" size="sm" onClick={clearEditor}>
        <Eraser className="mr-2 h-4 w-4" />
        Clear Editor
      </Button>

      <Button variant="outline" size="sm" onClick={postToWordpress}>
        <Send className="mr-2 h-4 w-4" />
        Post to WordPress
      </Button>

      <Stats editor={editor} />
    </div>
  );
};
