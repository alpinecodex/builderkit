"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { Button } from "@/ui/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/ui/select";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/ui/form";

export default function SettingsSelect({
  defaultValue,
}: {
  defaultValue: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const models: { [key: string]: string } = {
    "GPT-4": "gpt_4",
    "GPT-4 6/23": "gpt_4_0613",
    "GPT-4 32K Tokens": "gpt_4_32k",
    "GPT-4 32K Tokens 6/23": "gpt_4_32k_0613",
    "GPT-4 3/14": "gpt_4_0314",
    "GPT-4 32K Tokens 3/14": "gpt_4_32k_0314",
    "GPT-3.5 Turbo": "gpt_3_5_turbo",
    "GPT-3.5 Turbo 16K Tokens": "gpt_3_5_turbo_16k",
    "GPT-3.5 Turbo Instruct": "gpt_3_5_turbo_instruct",
    "GPT-3.5 Turbo 6/13": "gpt_3_5_turbo_0613",
    "GPT-3.5 Turbo 16K Tokens 6/13": "gpt_3_5_turbo_16k_0613",
    "GPT-3.5 Turbo 3/1": "gpt_3_5_turbo_0301",
  };
  const formSchema = z.object({
    gptModel: z.string().nonempty("Required."),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gptModel: defaultValue ? defaultValue : "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    const apiCall = new Promise(async (resolve, reject) => {
      const response = await fetch("/api/settings", {
        method: "PUT",
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (response.status === 200) {
        resolve(data);
      } else {
        reject(new Error("Something went wrong."));
      }
      setLoading(false);
      router.refresh();
    });
    toast.promise(apiCall, {
      loading: "Saving GPT Model...",
      success: (data) => "Successfully saved GPT Model.",
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-4 py-2"
      >
        <FormField
          control={form.control}
          name="gptModel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>GPT Model</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl className="pr-2">
                  <div className="flex w-full items-center space-x-2">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Font Family..." />
                    </SelectTrigger>
                    <Button variant="outline" type="submit" disabled={loading}>
                      Save
                    </Button>
                  </div>
                </FormControl>
                <SelectContent>
                  {Object.keys(models).map((option, index) => (
                    <SelectItem value={models[option]} key={index}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription className="sr-only">
                Select the GPT model you want to use globally.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
