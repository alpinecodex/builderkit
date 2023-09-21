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

export default function Editor({ content, id }) {
  const { data: session } = useSession();

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

  // CMD + S to save draft
  // TODO -> figure out why this is clearing the editor
  // useEffect(() => {
  //   const handleKeyDown = async (e) => {
  //     if (e.metaKey && e.code === "KeyS") {
  //       e.preventDefault();
  //       await saveOnClick();
  //     }
  //   };

  //   window.addEventListener("keydown", handleKeyDown);

  //   return () => {
  //     window.removeEventListener("keydown", handleKeyDown);
  //   };
  // }, []);

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
    const postContent = editor?.getHTML() || "";

    try {
      const response = await fetch("/api/wordpress", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: postContent })
      });

      if (!response.ok) {
        throw new Error('Failed to post to WordPress');
      }

      toast.success("Content posted to WordPress as a 'Draft'.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to post content to WordPress.");
    }
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
        className="absolute right-0 top-0 min-h-screen w-3/4 border-neutral-200 sm:mb-[calc(20vh)]"
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5A3.375 3.375 0 006.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0015 2.25h-1.5a2.251 2.251 0 00-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 00-9-9z"
              />
            </svg>
            Copy
          </button>

          <button
            className="flex items-center gap-1 rounded-lg bg-stone-100 px-2 py-1 text-sm font-medium text-stone-600 hover:bg-stone-200"
            onClick={postToWordpress}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
              />
            </svg>
            Post to WordPress
          </button>
        </div>

        <button
          className="fixed right-14 top-4 flex items-center gap-1 rounded-lg bg-stone-100 py-1 pl-1 pr-2 text-sm font-medium text-stone-600 hover:bg-stone-200"
          disabled={loading}
          onClick={saveOnClick}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v12m6-6H6"
            />
          </svg>
          Save
        </button>
      </div>
    </div>
  );
}
