"use client";

import { useCompletion } from "ai/react";
import { useSession } from "next-auth/react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/ui/ui/dialog";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/ui/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/ui/form";
import { Input } from "@/ui/ui/input";

import { useEffect, useRef } from "react";
import { toast } from "sonner";

const formSchema = z.object({
  url: z.string().min(5).url({
    message: "Not a valid URL.",
  }),
});

export default function UrlToOutline({
  open,
  setOpen,
  editor,
  setParentOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  editor;
  setParentOpen: (open: boolean) => void;
}) {
  const { data: session } = useSession();
  const { complete, isLoading, completion, stop } = useCompletion({
    id: "url-to-outline",
    api: "/api/ai",
    headers: {
      email: session?.user?.email,
    },
    onResponse: (response) => {
      if (response.status === 429) {
        toast.error("You have reached your request limit for the day.");
        return;
      }
      editor.chain().focus().run();
    },
    // onFinish: (_prompt, completion) => {
    //   // highlight the generated text -> Do we still want this?
    //   editor.commands.insertContent(completion
    //     //   {
    //     //   from: range.from,
    //     //   to: range.from + completion.length,
    //     // }
    //   );
    // },
    onError: () => {
      toast.error("Something went wrong.");
    },
  });

  useEffect(() => {
    if (editor) {
      editor.chain().setContent(completion, false).run();
    }
  }, [isLoading, editor, completion]);

  // useEffect(() => {
  //   // if user presses escape or cmd + z and it's loading,
  //   // stop the request, delete the completion, and insert back the "++"
  //   const onKeyDown = (e: KeyboardEvent) => {
  //     if (e.key === "Escape" || (e.metaKey && e.key === "z")) {
  //       stop();
  //       if (e.key === "Escape") {
  //         editor?.commands.deleteRange({
  //           from: editor.state.selection.from - completion.length,
  //           to: editor.state.selection.from,
  //         });
  //       }
  //       editor?.commands.insertContent("++");
  //     }
  //   };
  //   const mousedownHandler = (e: MouseEvent) => {
  //     e.preventDefault();
  //     e.stopPropagation();
  //     stop();
  //     if (window.confirm("AI writing paused. Continue?")) {
  //       complete(editor?.getText() || "");
  //     }
  //   };
  //   if (isLoading) {
  //     document.addEventListener("keydown", onKeyDown);
  //     window.addEventListener("mousedown", mousedownHandler);
  //   } else {
  //     document.removeEventListener("keydown", onKeyDown);
  //     window.removeEventListener("mousedown", mousedownHandler);
  //   }
  //   return () => {
  //     document.removeEventListener("keydown", onKeyDown);
  //     window.removeEventListener("mousedown", mousedownHandler);
  //   };
  // }, [stop, isLoading, editor, complete, completion.length]);

  const form = useForm<z.infer<typeof formSchema>>({
    // @ts-ignore
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setOpen(false);
    setParentOpen(false);
    console.log(open);
    try {
      const contentResponse = await fetch("/api/scrape", {
        method: "POST",
        body: JSON.stringify({ url: values.url }),
      });
      const contentData = await contentResponse.json();
      const messages = [
        {
          role: "system",
          content: `I have a piece of content that needs an outline. Please help me create an outline for it. \n\nContent: ${contentData}\n\nPlease provide an outline with a maximum of 12 sections. Format the outline using Roman Numerals. If the content exceeds the token limit, please truncate or shorten it. Return the output in markdown.`,
        },
        {
          role: "user",
          content: "",
        },
      ];
      complete(JSON.stringify(messages));
    } catch (error) {
      toast.error("An error occurred.");
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="sr-only">
        Writer Article from Outline
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Custom Prompt</DialogTitle>
          <DialogDescription>Enter a custom prompt to write.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-8"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                form.handleSubmit(onSubmit)();
              }
            }}
          >
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL of Article</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com"
                      className=""
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="sr-only">
                    Paste a link to scrape the article and create an outline
                    using AI.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
