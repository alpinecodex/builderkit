import { Editor } from "@tiptap/core";
import { FC } from "react";

interface EditWithAI {
  editor: Editor;
}

export const EditWithAI: FC<EditWithAI> = ({ editor }) => {
  return (
    <div className="relative h-full">
      <DialogForm editor={editor} />
    </div>
  );
};

// ------------------ Dialog Box Below ------------------- //
// ******************************************************* //
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

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const formSchema = z.object({
  prompt: z.string().min(2, "Not a valid prompt").nonempty({
    message: "Cannot be blank.",
  }),
});

function DialogForm({ editor }: { editor: Editor }) {
  const { data: session } = useSession();
  const [open, setOpen] = useState<boolean>(false);
  let selection = editor.state.selection;
  let range = { from: selection.from, to: selection.to };

  const mousedownHandler = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const { complete, isLoading, completion, stop } = useCompletion({
    id: "edit-prompt",
    api: "/api/ai",
    headers: {
      email: session?.user?.email,
    },
    onResponse: (response) => {
      window.addEventListener("mousedown", mousedownHandler);
      editor.chain().focus().run();
    },
    onFinish: () => {
      window.removeEventListener("mousedown", mousedownHandler);
    },
    onError: () => {
      toast.error("Something went wrong.");
    },
  });

  const prev = useRef("");

  useEffect(() => {
    const diff = completion.slice(prev.current.length);
    prev.current = completion;
    editor?.commands.insertContent(diff);
  }, [isLoading, editor, completion]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setOpen(false);
    try {
      const messages = [
        {
          role: "system",
          content: "You are an AI assistant for writing.",
        },
        {
          role: "user",
          content: `${values.prompt}\n\n Please return the only the text in markdown.`,
        },
      ];
      complete(JSON.stringify(messages));
    } catch (error) {
      toast.error("An error occurred.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="flex h-full items-center gap-1 p-2 text-sm font-medium text-stone-600 hover:bg-stone-100 active:bg-stone-200">
        Edit
      </DialogTrigger>
      <DialogContent className="z-[9999]">
        <DialogHeader>
          <DialogTitle>Edit Selection with a Custom Prompt</DialogTitle>
          <DialogDescription>
            Enter instructions on what you want the AI to do.
          </DialogDescription>
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
                  <FormLabel>Instructions</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter prompt..."
                      className=""
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="sr-only">
                    Enter a prompt to perform custom actions on the selected
                    area.
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
