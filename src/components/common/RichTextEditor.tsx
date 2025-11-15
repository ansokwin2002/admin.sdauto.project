"use client";

import React from 'react';
import { TextArea } from '@radix-ui/themes';

export type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
};

// Fallback implementation without external editor dependencies to unblock build
export default function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
  return (
    <div className={className}>
      <TextArea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || 'Enter text...'}
        rows={6}
      />
    </div>
  );
}
