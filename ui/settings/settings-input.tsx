"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
import { Eye } from "lucide-react";

type SettingsInputProps = {
  attribute: string;
  title: string;
  placeholder: string;
  description: string;
  defaultValue: string;
};

export default function SettingsInput({
  attribute,
  title,
  placeholder,
  description,
  defaultValue,
}: SettingsInputProps) {
  const formSchema = z.object({
    [attribute]: z.string().nonempty("Required."),
  });

  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [hidden, setHidden] = useState<boolean>(true);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      [attribute]: defaultValue ? defaultValue : "",
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
        router.refresh();
      } else {
        reject(new Error("Something went wrong."));
      }
    });
    toast.promise(apiCall, {
      loading: `Saving ${title}...`,
      success: (data) => `Successfully edited ${title}.`,
      error: (err) => {
        if (err.message === "Something went wrong.") {
          return "You are unauthorized to perform this action.";
        } else {
          return "Something went wrong. Please try again later.";
        }
      },
    });
  };

  const handleClick = () => {
    setHidden((prevState) => !prevState);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-4 py-2"
      >
        <FormField
          control={form.control}
          name={attribute}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{title}</FormLabel>
              <FormControl className="flex w-full items-center">
                <div className="flex gap-2">
                  <Input
                    placeholder={placeholder}
                    {...field}
                    type={hidden ? "password" : "text"}
                  />
                  <Button
                    size="icon"
                    onClick={handleClick}
                    className="p-2"
                    variant="outline"
                    type="button"
                  >
                    <Eye />
                  </Button>
                  <Button variant="outline" type="submit">
                    Save
                  </Button>
                </div>
              </FormControl>
              <FormDescription className="sr-only">
                {description}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
