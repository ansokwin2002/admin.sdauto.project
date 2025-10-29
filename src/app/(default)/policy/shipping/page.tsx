"use client";

import { useEffect, useState } from "react";
import { Box, Button, Card, Flex, Text, TextField } from "@radix-ui/themes";
import { PageHeading } from "@/components/common/PageHeading";
import dynamic from 'next/dynamic';
import { API_BASE_URL } from "@/utilities/constants";
import NProgress from "nprogress";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";

const SummernoteEditor = dynamic(() => import('@/components/common/SummernoteEditor'), { ssr: false });

interface PolicyItem {
  id: number;
  title: string;
  privacy?: string | null;
  warranty?: string | null;
  shipping?: string | null;
  order_cancellation?: string | null;
}

export default function ShippingPolicyPage() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [title, setTitle] = useState('Shipping Policy');
  const [content, setContent] = useState('');

  const getAbsoluteUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const fetchCurrent = async () => {
    setLoading(true);
    NProgress.start();
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const res = await fetch(`${API_BASE_URL}/api/admin/policies`, {
        headers: { 
          'Accept': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        credentials: 'include',
      });
      
      if (!res.ok) {
        if (res.status === 404) {
          // No existing policy, start with empty form
          setCurrentId(null);
          setTitle('Shipping Policy');
          setContent('');
          return;
        }
        throw new Error(`HTTP ${res.status}`);
      }
      
      const json = await res.json();
      const data: PolicyItem[] = json?.data || [];
      const item = data[0];
      if (item) {
        setCurrentId(item.id);
        setTitle(item.title || 'Shipping Policy');
        setContent(item.shipping || '');
      } else {
        setCurrentId(null);
        setTitle('Shipping Policy');
        setContent('');
      }
    } catch (e: any) {
      toast.error(e.message || 'Failed to load shipping policy');
    } finally {
      setLoading(false);
      NProgress.done();
    }
  };

  useEffect(() => { 
    fetchCurrent(); 
  }, []);

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }

    try {
      setSaving(true);
      NProgress.start();
      
      const payload = {
        title: title.trim(),
        shipping: content.trim(),
      };

      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const url = currentId ? `${API_BASE_URL}/api/admin/policies/${currentId}` : `${API_BASE_URL}/api/admin/policies`;
      const method = currentId ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        toast.error(json?.message || 'Failed to save shipping policy');
        return;
      }

      toast.success(json?.message || 'Shipping policy saved successfully');
      const saved = json?.data;
      if (saved?.id) {
        setCurrentId(saved.id);
      }
      
      // Re-fetch to get latest data
      await fetchCurrent();
    } catch (e: any) {
      toast.error(e.message || 'Network error');
    } finally {
      setSaving(false);
      NProgress.done();
    }
  };

  return (
    <Box className="w-full">
      <PageHeading title="Shipping Policy" description="Manage your shipping policy content" />

      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
        <Card className="!overflow-visible">
          <Box p="4">
            <Text as="div" size="3" weight="bold" mb="4">Shipping Policy Settings</Text>
            <Flex direction="column" gap="4">
              <Flex direction="column" gap="1">
                <Text as="label" size="2" weight="medium">Title *</Text>
                <TextField.Root 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="Enter policy title"
                />
              </Flex>
              <Flex direction="column" gap="1">
                <Text as="label" size="2" weight="medium">Content</Text>
                <SummernoteEditor 
                  value={content} 
                  onChange={setContent} 
                  height={400}
                  placeholder="Enter your shipping policy content here..."
                />
              </Flex>
            </Flex>
          </Box>
        </Card>

        <Flex justify="end" mt="6">
          <Button type="submit" color="green" disabled={saving || loading}>
            {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </Flex>
      </form>
    </Box>
  );
}
