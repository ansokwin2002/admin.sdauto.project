"use client";

import { useState } from "react";
import { Box, Button, Card, Flex, Text, TextField } from "@radix-ui/themes";
import { PageHeading } from "@/components/common/PageHeading";
import dynamic from 'next/dynamic';
import { API_BASE_URL } from "@/utilities/constants";
import NProgress from "nprogress";
import { toast } from "sonner";
import { Save, Loader2, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SummernoteEditor = dynamic(() => import('@/components/common/SummernoteEditor'), { ssr: false });

export default function AddFaqPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const handleSave = async () => {
    if (!question.trim()) {
      toast.error('Question is required');
      return;
    }
    
    if (!answer.trim()) {
      toast.error('Answer is required');
      return;
    }

    try {
      setSaving(true);
      NProgress.start();
      
      const payload = {
        question: question.trim(),
        answer: answer.trim(),
      };

      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const res = await fetch(`${API_BASE_URL}/api/admin/faqs`, {
        method: 'POST',
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
        if (res.status === 422 && json?.errors) {
          const messages = Object.values(json.errors).flat().join('\n');
          toast.error(messages);
        } else {
          toast.error(json?.message || 'Failed to create FAQ');
        }
        return;
      }

      toast.success(json?.message || 'FAQ created successfully');
      router.push('/faqs');
    } catch (e: any) {
      toast.error(e.message || 'Network error');
    } finally {
      setSaving(false);
      NProgress.done();
    }
  };

  return (
    <Box className="w-full">
      <Flex align="center" gap="3" mb="6">
        <Link href="/faqs">
          <Button variant="soft" color="gray">
            <ArrowLeft size={16} />
            Back to FAQs
          </Button>
        </Link>
        <PageHeading title="Add FAQ" description="Create a new frequently asked question" />
      </Flex>

      <Card className="!overflow-visible">
        <Box p="4">
          <Text as="div" size="3" weight="bold" mb="4">FAQ Details</Text>
          <Flex direction="column" gap="4">
            <Flex direction="column" gap="1">
              <Text as="label" size="2" weight="medium">Question *</Text>
              <TextField.Root 
                value={question} 
                onChange={(e) => setQuestion(e.target.value)} 
                placeholder="Enter the question"
              />
            </Flex>
            <Flex direction="column" gap="1">
              <Text as="label" size="2" weight="medium">Answer *</Text>
              <SummernoteEditor 
                value={answer} 
                onChange={setAnswer} 
                height={300}
                placeholder="Enter the answer..."
              />
            </Flex>
          </Flex>
        </Box>
      </Card>

      <Flex justify="end" mt="6" gap="3">
        <Link href="/faqs">
          <Button variant="soft" color="gray">
            Cancel
          </Button>
        </Link>
        <Button color="green" onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
          {saving ? 'Creating...' : 'Create FAQ'}
        </Button>
      </Flex>
    </Box>
  );
}
