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
} from "@/ui/ui/command";

// Dialog Components
import OutlineGenerator from "../dialog/outline-generator";
import OutlineWriter from "../dialog/outline-writer";
import CustomPrompt from "../dialog/custom-prompt";
import UrlToOutline from "../dialog/url-to-outline";

export function CommandMenu({ editor }) {
  const [open, setOpen] = React.useState(false);
  const [outlineGeneratorOpen, setOutlineGeneratorOpen] =
    React.useState<boolean>(false);
  const [outlineWriterOpen, setOutlineWriterOpen] =
    React.useState<boolean>(false);
  const [customPromptOpen, setCustomPromptOpen] =
    React.useState<boolean>(false);
  const [urlToOutlineOpen, setUrlToOutlineOpen] =
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
          <CommandGroup heading="Select below">
            <CommandItem onSelect={() => { setOutlineGeneratorOpen(true); setOpen(false); }}>
              Generate Outline
            </CommandItem>
            <CommandItem onSelect={() => { setOutlineWriterOpen(true); setOpen(false); }}>
              Write Article from Outline
            </CommandItem>
            <CommandItem onSelect={() => { setCustomPromptOpen(true); setOpen(false); }}>
              Custom Prompt
            </CommandItem>
            <CommandItem onSelect={() => { setUrlToOutlineOpen(true); setOpen(false); }}>
              Generate Outline from URL
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      {/* Dialog Components */}
      <OutlineGenerator
        open={outlineGeneratorOpen}
        setOpen={setOutlineGeneratorOpen}
        editor={editor}
        setParentOpen={setOpen}
      />
      <OutlineWriter
        open={outlineWriterOpen}
        setOpen={setOutlineWriterOpen}
        editor={editor}
        setParentOpen={setOpen}
      />
      <CustomPrompt
        open={customPromptOpen}
        setOpen={setCustomPromptOpen}
        editor={editor}
        setParentOpen={setOpen}
      />
      <UrlToOutline
        open={urlToOutlineOpen}
        setOpen={setUrlToOutlineOpen}
        editor={editor}
        setParentOpen={setOpen}
      />
    </Command>
  );
}
