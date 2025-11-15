/* eslint-disable */
"use client";

import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { useTheme } from 'next-themes';

// Import CSS for summernote lite (no bootstrap required). If you prefer Bootstrap look, swap to summernote-bs5.css and include Bootstrap CSS.
import 'summernote/dist/summernote-lite.css';
// Import custom dark mode styles
import '@/styles/summernote-dark.css';

// We will dynamically require jquery and summernote only on client
let $: any = null;
let loaded = false;

function ensureSummernoteLoaded() {
  if (loaded) return;
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const jq = require('jquery');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('summernote/dist/summernote-lite.js');
    // assign to global in case summernote expects window.jQuery
    (window as any).jQuery = jq;
    (window as any).$ = jq;
    $ = jq;
    loaded = true;
  }
}

export type SummernoteEditorProps = {
  value: string;
  onChange: (html: string) => void;
  height?: number;
  placeholder?: string;
  className?: string;
};

export default function SummernoteEditor({ value, onChange, height = 320, placeholder = '', className }: SummernoteEditorProps) {
  const elRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
  const initialisedRef = useRef(false);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Handle mounting state for theme detection
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    ensureSummernoteLoaded();
    if (!$ || !elRef.current || initialisedRef.current || !mounted) return;

    const $el = $((elRef.current as unknown) as HTMLElement);
    const isDarkMode = resolvedTheme === 'dark';

    $el.summernote({
      height,
      placeholder,
      tabsize: 2,
      toolbar: [
        ['style', ['style']],
        ['font', ['bold', 'italic', 'underline', 'strikethrough', 'clear']],
        ['font2', ['superscript', 'subscript']],
        ['fontsize', ['fontsize']],
        ['color', ['color']],
        ['para', ['ul', 'ol', 'paragraph']],
        ['table', ['table']],
        ['insert', ['link', 'picture', 'video', 'hr']],
        ['view', ['codeview', 'fullscreen', 'help']],
      ],
      callbacks: {
        onChange: function(contents: string) {
          onChange(contents);
        },
        onInit: function() {
          // set initial content
          $el.summernote('code', value || '');

          // Apply theme-specific styling after initialization
          const noteEditor = $el.next('.note-editor');
          if (isDarkMode) {
            noteEditor.addClass('dark-theme');
          } else {
            noteEditor.removeClass('dark-theme');
          }
        },
        onFocus: function() {
          // Add focused class for orange border
          const noteEditor = $el.next('.note-editor');
          noteEditor.addClass('note-editor-focused');
        },
        onBlur: function() {
          // Remove focused class
          const noteEditor = $el.next('.note-editor');
          noteEditor.removeClass('note-editor-focused');
        }
      },
    });

    initialisedRef.current = true;

    return () => {
      try {
        $el.summernote('destroy');
      } catch {}
      initialisedRef.current = false;
    };
  }, [mounted, resolvedTheme]);

  // Keep external value in sync if it changes
  useEffect(() => {
    if (!$ || !elRef.current || !initialisedRef.current) return;
    const $el = $((elRef.current as unknown) as HTMLElement);
    const current = $el.summernote('code');
    if ((value || '') !== (current || '')) {
      $el.summernote('code', value || '');
    }
  }, [value]);

  // Handle theme changes dynamically
  useEffect(() => {
    if (!$ || !elRef.current || !initialisedRef.current || !mounted) return;

    const $el = $((elRef.current as unknown) as HTMLElement);
    const noteEditor = $el.next('.note-editor');
    const isDarkMode = resolvedTheme === 'dark';

    if (isDarkMode) {
      noteEditor.addClass('dark-theme');
    } else {
      noteEditor.removeClass('dark-theme');
    }
  }, [resolvedTheme, mounted]);

  return <div ref={elRef} className={className} />;
}
