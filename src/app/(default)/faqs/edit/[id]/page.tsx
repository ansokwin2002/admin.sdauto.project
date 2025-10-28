"use client";

import { useState, useEffect, use } from "react";
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

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

export default function EditFaqPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const faqId = unwrappedParams.id;

  const fetchFaq = async () => {
    setLoading(true);
    NProgress.start();
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const res = await fetch(`${API_BASE_URL}/api/faqs/${faqId}`, {
        headers: { 
          'Accept': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        credentials: 'include',
      });
      
      if (!res.ok) {
        if (res.status === 404) {
          toast.error('FAQ not found');
          router.push('/faqs');
          return;
        }
        throw new Error(`HTTP ${res.status}`);
      }
      
      const json = await res.json();
      const faq: FaqItem = json?.data;
      if (faq) {
        setQuestion(faq.question || '');
        setAnswer(faq.answer || '');
      }
    } catch (e: any) {
      toast.error(e.message || 'Failed to load FAQ');
      router.push('/faqs');
    } finally {
      setLoading(false);
      NProgress.done();
    }
  };

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
      const res = await fetch(`${API_BASE_URL}/api/faqs/${faqId}`, {
        method: 'PUT',
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
          toast.error(json?.message || 'Failed to update FAQ');
        }
        return;
      }

      toast.success(json?.message || 'FAQ updated successfully');
      router.push('/faqs');
    } catch (e: any) {
      toast.error(e.message || 'Network error');
    } finally {
      setSaving(false);
      NProgress.done();
    }
  };

  useEffect(() => {
    if (faqId) {
      fetchFaq();
    }
  }, [faqId]);

  if (loading) {
    return (
      <Box className="w-full">
        <Flex justify="center" py="8">
          <Text>Loading FAQ...</Text>
        </Flex>
      </Box>
    );
  }

  return (
    <Box className="w-full">
      <Flex align="center" gap="3" mb="6">
        <Link href="/faqs">
          <Button variant="soft" color="gray">
            <ArrowLeft size={16} />
            Back to FAQs
          </Button>
        </Link>
        <PageHeading title="Edit FAQ" description="Update the frequently asked question" />
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
          {saving ? 'Updating...' : 'Update FAQ'}
        </Button>
      </Flex>
    </Box>
  );
}
