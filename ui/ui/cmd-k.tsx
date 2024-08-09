"use client";

import React, { useState } from "react";
import AiTag from "./ai-tag";
import { Pencil } from "lucide-react";
import { Button } from "./button";

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
import ClaudeCustomPrompt from "../dialog/claude-custom-prompt";
import ClaudeOutlineWriter from "../dialog/claude-outline-writer";
import SearchResults from "../dialog/search-results";

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
  const [claudeCustomOpen, setClaudeCustomOpen] =
    React.useState<boolean>(false);
  const [claudeOutline, setClaudeOutline] = React.useState<boolean>(false);
  const [searchOutline, setSearchOutline] = React.useState<boolean>(false);

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
    <div>
      <Button
        className="fixed bottom-2 right-2 z-50"
        variant="outline"
        size="sm"
        onClick={() => setOpen((open) => !open)}
      >
        <Pencil className="mr-2 h-4 w-4" />
        Write with AI
      </Button>
      <Command>
        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>

            <CommandGroup heading="Generate content outlines.">
              <CommandItem
                onSelect={() => {
                  setOutlineGeneratorOpen(true);
                  setOpen(false);
                }}
              >
                Generate Outline <AiTag aiType="gpt">ChatGPT</AiTag>
              </CommandItem>

              <CommandItem
                onSelect={() => {
                  setUrlToOutlineOpen(true);
                  setOpen(false);
                }}
              >
                Generate Outline from URL <AiTag aiType="gpt">ChatGPT</AiTag>
              </CommandItem>

              <CommandItem
                onSelect={() => {
                  setSearchOutline(true);
                  setOpen(false);
                }}
              >
                Outline from Search Term <AiTag aiType="gpt">ChatGPT</AiTag>
              </CommandItem>
            </CommandGroup>

            <CommandGroup heading="Generate content.">
              <CommandItem
                onSelect={() => {
                  setOutlineWriterOpen(true);
                  setOpen(false);
                }}
              >
                Article from Outline <AiTag aiType="gpt">ChatGPT</AiTag>
              </CommandItem>

              <CommandItem
                onSelect={() => {
                  setClaudeOutline(true);
                  setOpen(false);
                }}
              >
                Article from Outline <AiTag aiType="claude">Claude</AiTag>
              </CommandItem>

              <CommandItem
                onSelect={() => {
                  setCustomPromptOpen(true);
                  setOpen(false);
                }}
              >
                Custom Prompt <AiTag aiType="gpt">ChatGPT</AiTag>
              </CommandItem>

              <CommandItem
                onSelect={() => {
                  setClaudeCustomOpen(true);
                  setOpen(false);
                }}
              >
                Custom Prompt <AiTag aiType="claude">Claude</AiTag>
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
        <ClaudeCustomPrompt
          open={claudeCustomOpen}
          setOpen={setClaudeCustomOpen}
          editor={editor}
          setParentOpen={setOpen}
        />
        <ClaudeOutlineWriter
          open={claudeOutline}
          setOpen={setClaudeOutline}
          editor={editor}
          setParentOpen={setOpen}
        />
        <SearchResults
          open={searchOutline}
          setOpen={setSearchOutline}
          editor={editor}
          setParentOpen={setOpen}
        />
      </Command>
    </div>
  );
}
