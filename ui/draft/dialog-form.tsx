"use client";

import { useState } from "react";

import { Editor } from "@tiptap/react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/ui/ui/dialog";

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
import { Button } from "../ui/button";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";

export default function DialogForm({ editor }: { editor: Editor }) {
  const [loading, setLoading] = useState<boolean>(false);
  const formSchema = z.object({
    title: z.string().nonempty({
      message: "Required",
    }),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    const content = editor?.getJSON() || "";
    const formData = {
      ...values,
      content,
    };

    try {
      const response = await fetch("/api/drafts", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.status === 200) {
        toast.success("Successfully saved draft.");
      } else if (response.status === 401) {
        toast.error("You are unauthorized to perform this action.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error);
    }
  };
  return (
    <Dialog>
      <DialogTrigger className="fixed right-14 top-4 flex items-center gap-1 rounded-lg bg-stone-100 py-1 pl-1 pr-2 text-sm font-medium text-stone-600 hover:bg-stone-200">
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
        Save Draft
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Draft</DialogTitle>
          <DialogDescription className="sr-only">
            Add a title and click &quot;save&quot; to save your draft.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-8"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Draft Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Title..." {...field} />
                  </FormControl>
                  <FormDescription className="italic">
                    What do you want to title this draft?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Save</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
