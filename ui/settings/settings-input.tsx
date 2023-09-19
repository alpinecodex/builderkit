"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

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

  const [hidden, setHidden] = useState<boolean>(true);
  const form = useForm<z.infer<typeof formSchema>>({
    // @ts-ignore
    resolver: zodResolver(formSchema),
    defaultValues: {
      [attribute]: defaultValue ? defaultValue : "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const response = await fetch("/api/settings", {
      method: "PUT",
      body: JSON.stringify(values),
    });
    if (response.status === 200) {
      toast.success(`Successfully saved ${title}.`);
    }
    const data = await response.json();
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
              <FormControl>
                <div className="flex w-full max-w-sm items-center space-x-2">
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
