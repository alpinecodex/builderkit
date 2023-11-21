"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { useEditor, EditorContent } from "@tiptap/react";
import { TiptapEditorProps } from "./props";
import { TiptapExtensions } from "./extensions";
import { useCompletion } from "ai/react";
import { toast } from "sonner";
import va from "@vercel/analytics";
import { EditorBubbleMenu } from "./components/bubble-menu";
import { getPrevText } from "@/lib/editor";
import { ImageResizer } from "./components/image-resizer";
import { CommandMenu } from "../ui/cmd-k";
import MenuBar from "./menu-bar";
import Stats from "./stats";
import { useRouter } from "next/navigation";
import { Plus, Send, Copy } from "lucide-react";

export default function Editor({ content, id }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

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
        // complete(e.editor.storage.markdown.getMarkdown());
        va.track("Autocomplete Shortcut Used");
      } else {
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

  // cmd + s to save
  // useEffect(() => {
  //   const onKeyDown = (e: KeyboardEvent) => {
  //     if ((e.metaKey || e.ctrlKey) && e.key === "s") {
  //       e.preventDefault();
  //       saveOnClick();
  //     }
  //   };
  //   document.addEventListener("keydown", onKeyDown);
  //   return () => {
  //     document.removeEventListener("keydown", onKeyDown);
  //   };
  // }, []);

  const saveOnClick = async () => {
    const content = editor?.getJSON() || "";
    console.log(content);
    const apiCall = new Promise(async (resolve, reject) => {
      try {
        setLoading(true);
        const response = await fetch("/api/drafts", {
          method: "PUT",
          body: JSON.stringify({ content, id }),
        });
        const data = await response.json();
        if (response.status === 200) {
          resolve(data);
          router.refresh();
        } else {
          reject(new Error("Something went wrong."));
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error("An error occurred.");
      }
    });
    toast.promise(apiCall, {
      loading: "Saving the draft...",
      success: (data) => "Successfully saved the draft.",
      error: (err) => {
        if (err.message === "Something went wrong.") {
          return "You are unauthorized to perform this action.";
        } else {
          return "Something went wrong. Please try again later.";
        }
      },
    });
  };

  // Hydrate the editor with the content from localStorage.
  useEffect(() => {
    if (editor && content && !hydrated) {
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
          return "You are unauthorized to perform this action.";
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
      // @ts-ignore
      setContent({
        type: "doc",
        content: [],
      }); // This will clear the local storage
    }
  };

  return (
    <div className="absolute right-0 top-0 w-screen items-end">
      {/* Cmd + K */}
      <CommandMenu editor={editor} />
      {/* Text Formatting Menu */}
      <MenuBar editor={editor} />
      {/* Stats Menu */}
      <Stats editor={editor} />

      <div
        onClick={() => {
          editor?.chain().focus().run();
        }}
        className="absolute right-0 top-0 z-0 min-h-screen w-3/4 border-neutral-200 sm:mb-[calc(20vh)]"
      >
        {editor && <EditorBubbleMenu editor={editor} />}
        {editor?.isActive("image") && <ImageResizer editor={editor} />}
        <div className="mx-auto max-w-screen-md px-12 pb-56 pt-36">
          <EditorContent editor={editor} />
        </div>
        {/* Copy Button, Google Doc, Post to Wordpress */}
        <div className="fixed left-[27%] top-4 flex gap-2">
          <button
            className="flex items-center gap-1 rounded-lg bg-stone-100 px-2 py-1 text-sm font-medium text-stone-600 hover:bg-stone-200"
            onClick={copyContent}
          >
            <Copy className="w-4" />
            Copy
          </button>

          <button
            className="flex items-center gap-1 rounded-lg bg-stone-100 px-2 py-1 text-sm font-medium text-stone-600 hover:bg-stone-200"
            onClick={postToWordpress}
          >
            <Send className="w-4" />
            Post to WordPress
          </button>
        </div>

        <button
          className="fixed right-14 top-4 flex items-center gap-1 rounded-lg bg-stone-100 py-1 pl-1 pr-2 text-sm font-medium text-stone-600 hover:bg-stone-200"
          disabled={loading}
          onClick={saveOnClick}
        >
          <Plus className="w-4" />
          Save Draft
        </button>
      </div>
    </div>
  );
}
