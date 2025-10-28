"use client";

import React, { useEffect } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { lowlight } from 'lowlight';

export type RichTextEditorProps = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
};

const ToolbarButton = ({ active, onClick, children, title }: { active?: boolean; onClick: () => void; children: React.ReactNode; title?: string }) => (
  <button
    type="button"
    className={`px-2 py-1 rounded text-sm ${active ? 'bg-gray-200 dark:bg-neutral-800' : 'hover:bg-gray-100 dark:hover:bg-neutral-800'}`}
    onClick={onClick}
    title={title}
  >
    {children}
  </button>
);

export default function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: true, autolink: true, linkOnPaste: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Image,
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content: value || '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[120px] p-3 rounded border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-900',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value && value !== current) {
      editor.commands.setContent(value, false);
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className={className}>
      <div className="flex flex-wrap gap-1 border border-gray-300 dark:border-neutral-700 rounded-t p-1 bg-gray-50 dark:bg-neutral-900">
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Undo">↶</ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Redo">↷</ToolbarButton>
        <span className="mx-1 w-px bg-gray-300 dark:bg-neutral-700" />
        <ToolbarButton active={editor.isActive('heading', { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} title="H1">H1</ToolbarButton>
        <ToolbarButton active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="H2">H2</ToolbarButton>
        <ToolbarButton active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} title="H3">H3</ToolbarButton>
        <ToolbarButton active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} title="Bold"><b>B</b></ToolbarButton>
        <ToolbarButton active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic"><i>I</i></ToolbarButton>
        <ToolbarButton active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()} title="Underline"><u>U</u></ToolbarButton>
        <ToolbarButton active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()} title="Strike">S</ToolbarButton>
        <ToolbarButton active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Quote">❝ ❞</ToolbarButton>
        <ToolbarButton active={editor.isActive('codeBlock')} onClick={() => editor.chain().focus().toggleCodeBlock().run()} title="Code">{`</>`}</ToolbarButton>
        <ToolbarButton active={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()} title="Align left">⟸</ToolbarButton>
        <ToolbarButton active={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()} title="Align center">⇔</ToolbarButton>
        <ToolbarButton active={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()} title="Align right">⟹</ToolbarButton>
        <ToolbarButton active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Bulleted list">• • •</ToolbarButton>
        <ToolbarButton active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Numbered list">1.2.3.</ToolbarButton>
        <ToolbarButton onClick={() => {
          const url = window.prompt('Image URL');
          if (url) editor.chain().focus().setImage({ src: url }).run();
        }} title="Insert image">🖼️</ToolbarButton>
        <ToolbarButton onClick={() => {
          const previousUrl = editor.getAttributes('link').href as string | undefined;
          const url = window.prompt('Set link URL', previousUrl || 'https://');
          if (url === null) return; // cancel
          if (url === '') {
            editor.chain().focus().unsetLink().run();
            return;
          }
          editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
        }} title="Link">🔗</ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} title="Clear formatting">⌫</ToolbarButton>
      </div>
      <div className="border border-t-0 border-gray-300 dark:border-neutral-700 rounded-b bg-white dark:bg-neutral-900">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
