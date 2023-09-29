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
  query: z.string().nonempty({
    message: "Required.",
  }),
});

export default function SearchResults({
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
      query: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setOpen(false);
    setParentOpen(false);
    const apiCall = new Promise(async (resolve, reject) => {
      try {
        const serpResponse = await fetch("/api/serp", {
          method: "POST",
          body: JSON.stringify(values),
        });

        const { relatedQuestions, organicResults } = await serpResponse.json();
        console.log("organicResults: ", organicResults);

        const headlinesResponse = await fetch("api/scrape/headlines", {
          method: "POST",
          body: JSON.stringify({ organicResults: organicResults }),
        });

        const h2Headlines = await headlinesResponse.json();
        resolve(h2Headlines);

        const messages = [
          {
            role: "system",
            content: `I have a JSON nested array of a ton of H2 headlines. I need an outline created with all of these questions or topics. Please help me create an outline for it. \n\nH2 Headlines: ${h2Headlines} Please filter out unnecessary H2 tags such as "login", "logout", "user information", etc.\n\nI also have a list of related searches. Please include this when creating the outline: ${relatedQuestions}\n\nPlease provide an outline with a maximum of 12 sections. Format the outline using Roman Numerals. If the content exceeds the token limit, please truncate or shorten it. Return the output in markdown.`,
          },
          {
            role: "user",
            content: "",
          },
        ];
        complete(JSON.stringify(messages));
      } catch (error) {
        reject(new Error("Something went wrong."));
      }
    });
    toast.promise(apiCall, {
      loading: "Hacking Google... Scraping the internet... Writing outline...",
      success: (data) => "Success!",
      error: (err) => {
        if (err.message === "Something went wrong.") {
          return "You are unauthorized to perform this action.";
        } else {
          return "Something went wrong. Please try again later.";
        }
      },
    });
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="sr-only">
        Generate outline from a search term.
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Outline from Search Results</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-8"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                form.handleSubmit(onSubmit)();
              }
            }}
          >
            <FormField
              control={form.control}
              name="query"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Search Keyword</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Veteran affairs..."
                      className=""
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="sr-only">
                    Enter a search keyword to pull headlines and create an
                    outline from these headlines.
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
