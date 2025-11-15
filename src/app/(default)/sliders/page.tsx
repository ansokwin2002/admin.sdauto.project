"use client";

import { useEffect, useRef, useState } from "react";
import { Box, Button, Card, Flex, IconButton, Table, Text, TextField, Dialog } from "@radix-ui/themes";
import { PageHeading } from "@/components/common/PageHeading";
import { API_BASE_URL } from "@/utilities/constants";
import NProgress from "nprogress";
import { toast } from "sonner";
import Image from "next/image";
import { Upload, Trash2, Edit, Save, RefreshCcw, Image as ImageIcon } from "lucide-react";

interface SliderItem {
  id: number;
  image: string;
  ordering?: number | null;
}

export default function SlidersPage() {
  const [items, setItems] = useState<SliderItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [createMode, setCreateMode] = useState<'file' | 'url'>('file');
  const [imageUrl, setImageUrl] = useState('');
  const [creatingFromUrl, setCreatingFromUrl] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [savingOrderingId, setSavingOrderingId] = useState<number | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);

  const [orderingEdits, setOrderingEdits] = useState<Record<number, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewSrc, setPreviewSrc] = useState<string>("");
  const [editOpen, setEditOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [editFile, setEditFile] = useState<File | null>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [itemPendingDelete, setItemPendingDelete] = useState<SliderItem | null>(null);

  const getAbsoluteImageUrl = (relativePath: string) => {
    if (!relativePath) return '';
    if (relativePath.startsWith("http")) return relativePath;
    const cleaned = relativePath.startsWith("/") ? relativePath : `/${relativePath}`;
    const base = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
    // Server returns /storage/..., serve as-is from same domain
    return `${base}${cleaned}`;
  };

  const fetchItems = async () => {
    try {
      NProgress.start();
      setLoading(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const res = await fetch(`${API_BASE_URL}/api/admin/sliders`, {
        credentials: 'include',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          'Accept': 'application/json',
        },
      });
      let json: any = null;
      try { json = await res.json(); } catch {}
      if (!res.ok) {
        if (res.status === 401) {
          toast.error('Unauthorized. Please login again.');
        }
        if (json?.message) throw new Error(json.message);
        const text = await res.text();
        throw new Error(text || 'Failed to load sliders');
      }
      const data: SliderItem[] = json?.data || [];
      // sort by ordering asc then id asc
      const sorted = [...data].sort((a,b)=> (a.ordering??9999)-(b.ordering??9999) || a.id - b.id);
      setItems(sorted);
    } catch (e:any) {
      toast.error(e.message || 'Failed to load sliders');
    } finally {
      setLoading(false);
      NProgress.done();
    }
  };

  useEffect(()=>{ fetchItems(); },[]);

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select an image to upload');
      return;
    }
    // Client-side validations
    const allowedTypes = ['image/jpeg','image/jpg','image/png','image/webp','image/gif'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a valid image (jpg, jpeg, png, webp, gif)');
      return;
    }
    const MAX_BYTES = 1073741824; // 1 GB
    if (file.size > MAX_BYTES) {
      toast.error('Image is too large. Maximum size is 1 GB');
      return;
    }

    try {
      setUploading(true);
      NProgress.start();
      const formData = new FormData();
      formData.append('image', file);

      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const res = await fetch(`${API_BASE_URL}/api/admin/sliders`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          'Accept': 'application/json',
        },
      });
      let json: any = null;
      try { json = await res.json(); } catch {}
      if (!res.ok) {
        if (res.status === 422 && json?.errors) {
          const messages = Object.values(json.errors).flat().join('\n');
          toast.error(messages);
        } else {
          if (json?.message) {
            toast.error(json.message);
          } else {
            const text = await res.text();
            toast.error(text || 'Failed to create slider');
          }
        }
        return;
      }
      toast.success((json && json.message) || 'Slider created successfully');
      setFile(null);

      if (fileInputRef.current) fileInputRef.current.value = '';
      await fetchItems();
    } catch (e:any) {
      toast.error(e.message || 'Upload failed');
    } finally {
      setUploading(false);
      NProgress.done();
    }
  };

  const handleDelete = async (item: SliderItem) => {
    try {
      setDeletingId(item.id);
      NProgress.start();
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const res = await fetch(`${API_BASE_URL}/api/admin/sliders/${item.id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          'Accept': 'application/json',
        },
      });
      let json: any = null;
      try { json = await res.json(); } catch {}
      if (!res.ok) {
        if (json?.message) throw new Error(json.message);
        const text = await res.text();
        throw new Error(text || 'Failed to delete');
      }
      toast.success((json && json.message) || 'Slider deleted successfully');
      await fetchItems();
    } catch (e:any) {
      toast.error(e.message || 'Delete failed');
    } finally {
      setDeletingId(null);
      NProgress.done();
    }
  };

  const handleOrderingChange = (id:number, value:string) => {
    if (!/^\d*$/.test(value)) return; // only numbers
    setOrderingEdits(prev => ({ ...prev, [id]: value }));
  };

  const handleSaveOrdering = async (item: SliderItem) => {
    const value = orderingEdits[item.id];
    if (value === undefined) return;
    try {
      setSavingOrderingId(item.id);
      NProgress.start();
      const formData = new FormData();
      formData.append('ordering', value || '');
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const res = await fetch(`${API_BASE_URL}/api/admin/sliders/${item.id}`, {
        method: 'POST', // some servers accept POST+_method=PUT; otherwise use PUT with JSON
        headers: {
          'X-HTTP-Method-Override': 'PUT',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          'Accept': 'application/json',
        },
        body: formData,
        credentials: 'include',
      });
      let json: any = null;
      try { json = await res.json(); } catch {}
      if (!res.ok) {
        if (res.status === 422 && json?.errors) {
          const messages = Object.values(json.errors).flat().join('\n');
          toast.error(messages);
        } else {
          if (json?.message) {
            toast.error(json.message);
          } else {
            const text = await res.text();
            toast.error(text || 'Failed to update');
          }
        }
        return;
      }
      toast.success((json && json.message) || 'Ordering updated successfully');
      setOrderingEdits(prev => { const p = { ...prev }; delete p[item.id]; return p; });
      await fetchItems();
    } catch (e:any) {
      toast.error(e.message || 'Update failed');
    } finally {
      setSavingOrderingId(null);
      NProgress.done();
    }
  };

  return (
    <Box className="w-full">
      <PageHeading title="Sliders" description="Manage homepage sliders" />

      <Card className="!overflow-visible">
        <Box p="3">
          <Flex justify="between" align="center" wrap="wrap" gap="3">
            <Text as="div" size="3" weight="bold">Add New Slider</Text>
          </Flex>

          <Flex mt="3" direction="column" gap="3">
            <Flex gap="2">
              <Button variant={createMode==='file' ? 'solid' : 'soft'} onClick={()=> setCreateMode('file')}>Upload file</Button>
              <Button variant={createMode==='url' ? 'solid' : 'soft'} onClick={()=> setCreateMode('url')}>Use image URL</Button>
            </Flex>

            {createMode === 'file' ? (
              <Flex justify="between" align="center" wrap="wrap" gap="3">
                <input ref={fileInputRef} type="file" accept="image/*" onChange={(e)=> setFile(e.target.files?.[0] || null)} />
                <Flex align="center" gap="2">
                  <Button onClick={handleUpload} disabled={uploading}>
                    <Upload size={16} /> {uploading ? 'Uploading...' : 'Upload'}
                  </Button>
                </Flex>
              </Flex>
            ) : (
              <Flex align="center" gap="3" wrap="wrap">
                <TextField.Root
                  className="min-w-[320px] flex-1"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e)=> setImageUrl(e.target.value)}
                />
                <Button disabled={creatingFromUrl} onClick={async ()=>{
                  const url = imageUrl.trim();
                  if (!url) { toast.error('Please enter an image URL'); return; }
                  try {
                    setCreatingFromUrl(true);
                    NProgress.start();
                    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
                    const res = await fetch(`${API_BASE_URL}/api/admin/sliders/url`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                      },
                      credentials: 'include',
                      body: JSON.stringify({ url })
                    });
                    let json:any = null; try { json = await res.json(); } catch {}
                    if (!res.ok) {
                      if (res.status === 422 && json?.errors) {
                        const messages = Object.values(json.errors).flat().join('\n');
                        toast.error(messages);
                      } else if (json?.message) {
                        toast.error(json.message);
                      } else {
                        const text = await res.text();
                        toast.error(text || 'Failed to create from URL');
                      }
                      return;
                    }
                    toast.success((json && json.message) || 'Slider created successfully');
                    setImageUrl('');
                    await fetchItems();
                  } catch (e:any) {
                    toast.error(e.message || 'Request failed');
                  } finally {
                    setCreatingFromUrl(false);
                    NProgress.done();
                  }
                }}>
                  {creatingFromUrl ? 'Creating...' : 'Create from URL'}
                </Button>
              </Flex>
            )}
          </Flex>
        </Box>
      </Card>

      <Box mt="4">
        {loading ? (
          <Box className="py-8 text-center"><Text size="3" color="gray">Loading sliders...</Text></Box>
        ) : (
          <Table.Root variant="surface">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell style={{ width: 80 }}>ID</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Image</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell style={{ width: 160 }}>Ordering</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell align="right" style={{ width: 140 }}>Actions</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {items.map(item => (
                <Table.Row key={item.id}>
                  <Table.Cell>{item.id}</Table.Cell>
                  <Table.Cell>
                    <Flex align="center" gap="3">
                      {item.image && (
                        <button
                          type="button"
                          onClick={() => { setPreviewSrc(getAbsoluteImageUrl(item.image)); setPreviewOpen(true); }}
                          className="rounded overflow-hidden"
                          title="Click to preview"
                        >
                          <Image src={getAbsoluteImageUrl(item.image)} alt={`slider-${item.id}`} width={120} height={60} className="rounded object-cover" />
                        </button>
                      )}
                    </Flex>
                  </Table.Cell>
                  <Table.Cell>
                    <TextField.Root
                      placeholder="e.g. 1"
                      value={orderingEdits[item.id] ?? (item.ordering?.toString() || '')}
                      onChange={(e)=> handleOrderingChange(item.id, e.target.value)}
                    />
                  </Table.Cell>
                  <Table.Cell align="right">
                    <Flex justify="end" gap="2">
                      <IconButton variant="soft" color="green" onClick={()=> handleSaveOrdering(item)} title="Save ordering" disabled={savingOrderingId===item.id}>
                        {savingOrderingId===item.id ? <RefreshCcw className="animate-spin" size={14} /> : <Save size={14} />}
                      </IconButton>
                      <IconButton variant="soft" color="blue" onClick={() => { setEditingItemId(item.id); setEditOpen(true); }} title="Edit image">
                        <Edit size={14} />
                      </IconButton>
                      <IconButton variant="soft" color="red" onClick={()=> { setItemPendingDelete(item); setConfirmOpen(true); }} title="Delete" disabled={deletingId===item.id}>
                        {deletingId===item.id ? <RefreshCcw className="animate-spin" size={14} /> : <Trash2 size={14} />}
                      </IconButton>
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        )}
      </Box>
      <Dialog.Root open={previewOpen} onOpenChange={setPreviewOpen}>
        <Dialog.Content style={{ maxWidth: 900 }}>
          <Dialog.Title>Image Preview</Dialog.Title>
          <Dialog.Description size="2" mb="3">Click outside to close</Dialog.Description>
          {previewSrc ? (
            <Box className="w-full">
              {/* Responsive preview */}
              <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewSrc} alt="Preview" className="absolute inset-0 w-full h-full object-contain rounded" />
              </div>
            </Box>
          ) : (
            <Flex align="center" justify="center" className="h-64 bg-gray-50 dark:bg-neutral-900 rounded">
              <ImageIcon size={24} />
            </Flex>
          )}
        </Dialog.Content>
      </Dialog.Root>

      <Dialog.Root open={editOpen} onOpenChange={(open)=>{ setEditOpen(open); if (!open) { setEditingItemId(null); setEditFile(null); if (editFileInputRef.current) editFileInputRef.current.value=''; } }}>
        <Dialog.Content style={{ maxWidth: 500 }}>
          <Dialog.Title>Edit Slider Image</Dialog.Title>
          <Dialog.Description size="2" mb="3">Select a new image (jpg, jpeg, png, webp, gif)</Dialog.Description>
          <input ref={editFileInputRef} type="file" accept="image/*" onChange={(e)=> setEditFile(e.target.files?.[0] || null)} />
          <Flex justify="end" gap="2" mt="3">
            <Dialog.Close>
              <Button variant="soft" color="gray">Cancel</Button>
            </Dialog.Close>
            <Button disabled={savingEdit} onClick={async ()=>{
              if (!editingItemId) return;
              if (!editFile) { toast.error('Please select an image'); return; }
              const allowedTypes = ['image/jpeg','image/jpg','image/png','image/webp','image/gif'];
              if (!allowedTypes.includes(editFile.type)) { toast.error('Please upload a valid image (jpg, jpeg, png, webp, gif)'); return; }
              const MAX_BYTES = 1073741824; // 1 GB
              if (editFile.size > MAX_BYTES) { toast.error('Image is too large. Maximum size is 1 GB'); return; }
              try {
                setSavingEdit(true);
                NProgress.start();
                const fd = new FormData();
                fd.append('image', editFile);
                const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
                const res = await fetch(`${API_BASE_URL}/api/admin/sliders/${editingItemId}`, {
                  method: 'POST',
                  headers: {
                    'X-HTTP-Method-Override': 'PUT',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                    'Accept': 'application/json',
                  },
                  body: fd,
                  credentials: 'include',
                });
                let json:any = null; try { json = await res.json(); } catch {}
                if (!res.ok) {
                  if (res.status === 422 && json?.errors) {
                    const messages = Object.values(json.errors).flat().join('\n');
                    toast.error(messages);
                  } else if (json?.message) {
                    toast.error(json.message);
                  } else {
                    const text = await res.text();
                    toast.error(text || 'Failed to update image');
                  }
                  return;
                }
                toast.success((json && json.message) || 'Slider updated successfully');
                setEditOpen(false);
                setEditingItemId(null);
                setEditFile(null);
                if (editFileInputRef.current) editFileInputRef.current.value='';
                await fetchItems();
              } catch (e:any) {
                toast.error(e.message || 'Update failed');
              } finally {
                setSavingEdit(false);
                NProgress.done();
              }
            }}>Save</Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
      <Dialog.Root open={confirmOpen} onOpenChange={(v)=>{ if (!deletingId) setConfirmOpen(v); }}>
        <Dialog.Content style={{ maxWidth: 420 }}>
          <Dialog.Title>Delete Slider</Dialog.Title>
          <Dialog.Description size="2" mb="3">
            {itemPendingDelete ? `Are you sure you want to delete slider #${itemPendingDelete.id}? This action cannot be undone.` : 'Are you sure you want to delete this slider?'}
          </Dialog.Description>
          <Flex justify="end" gap="2">
            <Dialog.Close>
              <Button variant="soft" color="gray" disabled={!!deletingId}>Cancel</Button>
            </Dialog.Close>
            <Button color="red" disabled={!!deletingId} onClick={async ()=>{
              if (!itemPendingDelete) return;
              await handleDelete(itemPendingDelete);
              setConfirmOpen(false);
              setItemPendingDelete(null);
            }}>
              {deletingId ? <RefreshCcw className="animate-spin" size={16} /> : <Trash2 size={16} />}
              {deletingId ? 'Deleting...' : 'Delete'}
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </Box>
  );
}
