"use client";

import React, { useState } from "react";

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/ui/ui/command";
import OutlineGenerator from "../dialog/outline-generator";

export function CommandMenu({ editor }) {
  const [open, setOpen] = React.useState(false);
  const [outlineGeneratorOpen, setOutlineGeneratorOpen] =
    React.useState<boolean>(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <Command>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem
              onSelect={() =>
                runCommand(() => editor.commands.insertContent("Test"))
              }
            >
              Click Me
            </CommandItem>
            <CommandItem onSelect={() => setOutlineGeneratorOpen(true)}>
              <OutlineGenerator
                open={outlineGeneratorOpen}
                setOpen={setOutlineGeneratorOpen}
              />
            </CommandItem>
            <CommandItem>Custom Prompt</CommandItem>
            <CommandItem>Write Article</CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </Command>
  );
}
