"use client";

import { useEffect, useRef, useState } from "react";
import { Box, Button, Card, Flex, Grid, Text, TextField, TextArea } from "@radix-ui/themes";

import { PageHeading } from "@/components/common/PageHeading";
import dynamic from 'next/dynamic';
import { API_BASE_URL } from "@/utilities/constants";
import NProgress from "nprogress";
import { toast } from "sonner";
import { Save } from "lucide-react";



const SummernoteEditor = dynamic(() => import('@/components/common/SummernoteEditor'), { ssr: false });

interface ShippingItem {
  id: number;
  title: string;
  description?: string | null;
  label_partner?: string | null;
  text?: string | null;
  map_image?: string | null;
}

export default function ShippingsPage() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [labelPartner, setLabelPartner] = useState('');
  const [text, setText] = useState('');
  const [mapFile, setMapFile] = useState<File | null>(null);
  const [mapUrl, setMapUrl] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getAbsoluteUrl = (relativePath?: string | null) => {
    if (!relativePath) return '';
    if (relativePath.startsWith('http')) return relativePath;
    const cleaned = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
    const base = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
    return `${base}${cleaned}`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setMapFile(file);

    if (file) {
      // Create preview URL for the selected file
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      // Clear preview if no file selected
      setPreviewUrl(null);
    }
  };

  // Clean up preview URL when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const fetchCurrent = async () => {
    try {
      NProgress.start();
      setLoading(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const res = await fetch(`${API_BASE_URL}/api/shippings`, {
        credentials: 'include',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          'Accept': 'application/json',
        },
      });
      let json: any = null; try { json = await res.json(); } catch {}
      if (!res.ok) {
        if (res.status === 401) toast.error('Unauthorized. Please login again.');
        if (json?.message) throw new Error(json.message);
        const text = await res.text();
        throw new Error(text || 'Failed to load shippings');
      }
      const data: ShippingItem[] = json?.data || [];
      const item = data[0];
      if (item) {
        setCurrentId(item.id);
        setTitle(item.title || '');
        setDescription(item.description || '');
        setLabelPartner(item.label_partner || '');
        setText(item.text || '');
        setMapUrl(item.map_image ? getAbsoluteUrl(item.map_image) : '');
      } else {
        setCurrentId(null);
        setTitle(''); setDescription(''); setLabelPartner(''); setText('');
        setMapUrl('');
      }
    } catch (e: any) {
      toast.error(e.message || 'Failed to load shippings');
    } finally {
      setLoading(false);
      NProgress.done();
    }
  };

  useEffect(()=>{ fetchCurrent(); },[]);

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }

    if (mapFile) {
      const allowed = ['image/jpeg','image/jpg','image/png','image/webp','image/gif'];
      if (!allowed.includes(mapFile.type)) {
        toast.error('Map image must be jpg, jpeg, png, webp, or gif');
        return;
      }
      const MAX = 5 * 1024 * 1024; // 5MB
      if (mapFile.size > MAX) {
        toast.error('Map image exceeds 5MB limit');
        return;
      }
    }

    try {
      setSaving(true);
      NProgress.start();
      const fd = new FormData();
      fd.append('title', title.trim());
      if (description.trim()) fd.append('description', description.trim());
      if (labelPartner.trim()) fd.append('label_partner', labelPartner.trim());
      if (text.trim()) fd.append('text', text.trim());
      if (mapFile) fd.append('map_image', mapFile);

      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const url = currentId ? `${API_BASE_URL}/api/shippings/${currentId}` : `${API_BASE_URL}/api/shippings`;
      const method = currentId ? 'POST' : 'POST';
      const headers: Record<string,string> = { 'Accept': 'application/json', ...(token ? { 'Authorization': `Bearer ${token}` } : {}) };
      if (currentId) headers['X-HTTP-Method-Override'] = 'PUT';
      const res = await fetch(url, {
        method,
        body: fd,
        credentials: 'include',
        headers,
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
          toast.error(text || 'Failed to create');
        }
        return;
      }
      toast.success((json && json.message) || (currentId ? 'Shipping updated successfully' : 'Shipping created successfully'));
      if (fileInputRef.current) fileInputRef.current.value = '';
      setMapFile(null);
      // Clear preview URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      await fetchCurrent();
    } catch (e:any) {
      toast.error(e.message || 'Create failed');
    } finally {
      setSaving(false);
      NProgress.done();
    }
  };


  return (
    <Box className="w-full">
      <PageHeading title="Shippings" description="Manage shipping information" />

      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
        <Card className="!overflow-visible">
          <Box p="4">
            <Text as="div" size="3" weight="bold" mb="4">Shipping Settings</Text>
            <Grid columns={{ initial: '1', md: '2' }} gap="4">
              <Flex direction="column" gap="1">
                <Text as="label" size="2" weight="medium">Title *</Text>
                <TextField.Root value={title} onChange={(e)=> setTitle(e.target.value)} />
              </Flex>
              <Flex direction="column" gap="1">
                <Text as="label" size="2" weight="medium">Label Partner</Text>
                <TextField.Root value={labelPartner} onChange={(e)=> setLabelPartner(e.target.value)} />
              </Flex>
              <Flex direction="column" gap="1" className="md:col-span-2">
                <Text as="label" size="2" weight="medium">Description</Text>
                <TextArea value={description} onChange={(e)=> setDescription(e.target.value)} rows={3} />
              </Flex>
              <Flex direction="column" gap="1" className="md:col-span-2">
                <Text as="label" size="2" weight="medium">Content</Text>
                <SummernoteEditor value={text} onChange={setText} height={280} />
              </Flex>
              <Flex direction="column" gap="1" className="md:col-span-2">
                <Text as="label" size="2" weight="medium">Map Image</Text>
                <div className="space-y-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl || mapUrl || '/images/map-placeholder.svg'}
                    alt={previewUrl ? "Selected image preview" : mapUrl ? "Current map" : "Map placeholder"}
                    className="w-full max-w-[500px] h-auto rounded border border-gray-200 dark:border-neutral-700"
                    style={{ maxHeight: 280, objectFit: 'contain' }}
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="text-sm text-gray-500 dark:text-neutral-400 file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 dark:file:bg-orange-900/20 dark:file:text-orange-400 dark:hover:file:bg-orange-900/30"
                  />
                </div>
              </Flex>
            </Grid>
          </Box>
        </Card>

        <Flex justify="end" mt="6">
          <Button type="submit" color="green" disabled={saving}>
            {saving ? <Save className="animate-spin" size={16} /> : <Save size={16} />}
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </Flex>
      </form>

      {loading && (
        <Box className="py-6 text-center"><Text size="3" color="gray">Loading shipping...</Text></Box>
      )}
    </Box>
  );
}
