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
import { Textarea } from "@/ui/ui/textarea";

import { useEffect, useRef } from "react";
import { toast } from "sonner";

const formSchema = z.object({
  prompt: z.string().min(2, "Not a valid prompt").nonempty({
    message: "Cannot be blank.",
  }),
});

export default function ClaudeCustomPrompt({
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
    id: "outline-writer",
    api: "/api/ai/claude",
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
    onError: () => {
      toast.error("Something went wrong.");
    },
  });

  useEffect(() => {
    if (editor) {
      editor.chain().setContent(completion, false).run();
    }
  }, [isLoading, editor, completion]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setOpen(false);
    setParentOpen(false);
    try {
      complete(JSON.stringify(prompt));
    } catch (error) {
      toast.error("An error occurred.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="sr-only">
        Write a custom prompt for Claude 2
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Custom Prompt with Claude</DialogTitle>
          <DialogDescription>Enter a custom prompt to write.</DialogDescription>
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
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="User prompt message..."
                      className=""
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="sr-only">
                    Set a custom prompt message for Claude 2 by Anthropic.
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
