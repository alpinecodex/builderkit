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
  system: z.string().min(2, "Not a valid prompt").nonempty({
    message: "Cannot be blank.",
  }),
  user: z.string().min(2, "Not a valid prompt").nonempty({
    message: "Cannot be blank.",
  }),
});

export default function CustomPrompt({
  open,
  setOpen,
  editor,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  editor;
}) {
  const { data: session } = useSession();

  const form = useForm<z.infer<typeof formSchema>>({
    // @ts-ignore
    resolver: zodResolver(formSchema),
    defaultValues: {
      system: "",
      user: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setOpen(false);
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
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                form.handleSubmit(onSubmit)();
              }
            }}
          >
            <FormField
              control={form.control}
              name="system"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>System Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="System prompt message..."
                      className=""
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="sr-only">
                    Use a system message for the AI.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="user"
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
                    Use a user message for the AI.
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
