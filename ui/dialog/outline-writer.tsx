"use client";

import { useCompletion } from "ai/react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/ui/ui/dialog";
import { Pencil } from "lucide-react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/ui/select";
import { Input } from "@/ui/ui/input";
import { Textarea } from "@/ui/ui/textarea";

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
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  editor;
}) {
  const { complete, completion, isLoading } = useCompletion({
    api: "/api/ai",
    onFinish: () => {
      toast.success("Successfully generated.");
    },
  });
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    // @ts-ignore
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
    },
  });

  const handleAISubmit = (content: string) => {
    complete(content);
    editor.commands.insertContent(completion);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setOpen(false);
    try {
      const messages = [
        {
          role: "system",
          content: "You are an AI assistant that writes long articles.",
        },
        {
          role: "user",
          content: `I am going to give you an outline that I want to write an article for. Please help follow the outline and write me a long article that is around 2000 words. \n\nOutline: ${values.text}\n\nPlease make sure that paragraphs are well synthesized with 7-10 well-constructed sentences each. Do not write any less than 5 sentences per paragraph. Please return the text in markdown format.`,
        },
      ];
      handleAISubmit(JSON.stringify(messages));
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
