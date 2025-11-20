// Server-only exports for the [itemId] route segment.
// This file must NOT include "use client".

export async function generateStaticParams() {
  // No prebuilt item IDs; return empty to satisfy Next.js `output: 'export'` requirement.
  return [] as Array<{ itemId: string }>;
}
