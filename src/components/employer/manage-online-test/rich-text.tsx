"use client";

import { useEffect, useRef } from "react";

const richTextTools = [
  { label: "Undo", command: "undo" },
  { label: "Redo", command: "redo" },
  { label: "B", command: "bold" },
  { label: "I", command: "italic" },
  { label: "U", command: "underline" },
  { label: "• List", command: "insertUnorderedList" },
  { label: "1. List", command: "insertOrderedList" },
  { label: "Left", command: "justifyLeft" },
  { label: "Center", command: "justifyCenter" },
  { label: "Right", command: "justifyRight" },
  { label: "Justify", command: "justifyFull" },
];

export const getPlainTextFromHtml = (html: string) => {
  if (!html) {
    return "";
  }

  const wrapper = document.createElement("div");
  wrapper.innerHTML = html;
  return (wrapper.textContent || "").replace(/\u00a0/g, " ").trim();
};

const isEffectivelyEmptyHtml = (html: string) => {
  return getPlainTextFromHtml(html).length === 0;
};

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  minHeightClassName?: string;
  ariaLabel: string;
};

export function RichTextEditor({
  value,
  onChange,
  placeholder,
  minHeightClassName = "min-h-28",
  ariaLabel,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!editorRef.current) {
      return;
    }

    if (editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const runCommand = (command: string, commandValue?: string) => {
    if (!editorRef.current) {
      return;
    }

    editorRef.current.focus();
    document.execCommand(command, false, commandValue);
    onChange(editorRef.current.innerHTML);
  };

  return (
    <div className="rounded-lg border border-(--akij-border) bg-white">
      <div className="flex flex-wrap items-center gap-1 border-b border-(--akij-border) px-2 py-1.5">
        {richTextTools.map((tool) => (
          <button
            key={tool.label}
            type="button"
            onClick={() => runCommand(tool.command)}
            className="rounded-md px-2 py-1 text-xs font-semibold text-(--akij-heading) transition hover:bg-[#f3f4f6]"
          >
            {tool.label}
          </button>
        ))}
      </div>

      <div className="relative">
        {isEffectivelyEmptyHtml(value) && (
          <p className="pointer-events-none absolute left-3 top-2 text-sm text-(--akij-subtext)">
            {placeholder}
          </p>
        )}
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          role="textbox"
          aria-multiline="true"
          aria-label={ariaLabel}
          className={`${minHeightClassName} w-full px-3 py-2 text-sm text-(--akij-text) outline-none [&_ol]:ml-5 [&_ol]:list-decimal [&_ul]:ml-5 [&_ul]:list-disc`}
          onInput={(event) => onChange(event.currentTarget.innerHTML)}
        />
      </div>
    </div>
  );
}
