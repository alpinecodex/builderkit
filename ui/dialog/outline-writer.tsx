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
import { useForm } from "react-hook-form"; import * as z from "zod";

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
  text: z.string().min(2, "Not a valid name").nonempty({
    message: "Cannot be blank.",
  }),
});

export default function OutlineWriter({
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
    // @ts-ignore
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setOpen(false);
    setParentOpen(false);
    console.log(open);
    try {
      const messages = [
        {
          role: "system",
          content: "You are an AI assistant that writes long articles.",
        },
        {
          role: "user",
          content: `I am going to give you an outline that I want to write an article for. Please help follow the outline and write me a long article that is around 2000 words. \n\nOutline: ${values.text}\n\nPlease make sure that paragraphs are well synthesized with 7-10 well-constructed sentences each. Do not write any less than 5 sentences per paragraph. Please return the text in markdown.`,
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
          <DialogTitle>Article</DialogTitle>
          <DialogDescription>Update and re-save your prompt.</DialogDescription>
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
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Write Article based on this Outline</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Paste outline here..."
                      className="min-h-[250px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Paste an outline.</FormDescription>
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
