"use client";

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
  name: z.string().min(2, "Not a valid name").nonempty({
    message: "Cannot be blank.",
  }),
  message: z.string().min(5, "Not valid text").nonempty({
    message: "Not valid text.",
  }),
  type: z.string().nonempty({ message: "Required." }),
});

const promptTypes: { [key: string]: string } = {
  FirstStep: "1st Step",
  SecondStep: "2nd Step",
  ThirdStep: "3rd Step",
  FourthStep: "4th Step",
  FifthStep: "5th Step",
};

export default function OutlineGenerator({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => null;
}) {
  const [loading, setLoading] = useState<boolean>(false);

  //   useEffect(() => {
  //     setOpen(open);
  //   }, [open]);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    // @ts-ignore
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    const formData = {
      ...values,
    };

    try {
      const response = await fetch("/api/prompt", {
        method: "PUT",
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.status === 200) {
        router.refresh();
        toast.success("Prompt updated successfully.");
        setLoading(false);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("An error occurred.");
    }
  };
  return (
    <Dialog open={open} onOpenChange={() => setOpen(false)}>
      <DialogTrigger onClick={() => setOpen(false)}>
        Generate Outline
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Prompt</DialogTitle>
          <DialogDescription>Update and re-save your prompt.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-8"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name of Prompt</FormLabel>
                  <FormControl>
                    <Input
                      className="max-w-[800px]"
                      placeholder="Name for your prompt..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Enter a name for your prompt.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading}>
              Submit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
