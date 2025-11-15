"use client";

import { useEffect, useState } from "react";
import { Box, Button, Flex, Text, Table, IconButton, Dialog, TextField } from "@radix-ui/themes";
import { PageHeading } from "@/components/common/PageHeading";
import { API_BASE_URL } from "@/utilities/constants";
import NProgress from "nprogress";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Save, RefreshCcw, Eye } from "lucide-react";
import dynamic from 'next/dynamic';

const SummernoteEditor = dynamic(() => import('@/components/common/SummernoteEditor'), { ssr: false });

import { FaqItem } from "@/data/FaqData";

export default function FaqsPage() {
  const [loading, setLoading] = useState(false);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Add/Edit Modal States
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);
  const [viewingFaq, setViewingFaq] = useState<FaqItem | null>(null);
  const [saving, setSaving] = useState(false);

  // Form States
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const fetchFaqs = async () => {
    setLoading(true);
    NProgress.start();
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const res = await fetch(`${API_BASE_URL}/api/admin/faqs`, {
        headers: {
          'Accept': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const json = await res.json();
      setFaqs(json?.data || []);
    } catch (e: any) {
      toast.error(e.message || 'Failed to load FAQs');
    } finally {
      setLoading(false);
      NProgress.done();
    }
  };

  const resetForm = () => {
    setQuestion('');
    setAnswer('');
  };

  const handleAdd = () => {
    resetForm();
    setAddModalOpen(true);
  };

  const handleEdit = (faq: FaqItem) => {
    setEditingFaq(faq);
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setEditModalOpen(true);
  };

  const handleView = (faq: FaqItem) => {
    setViewingFaq(faq);
    setViewModalOpen(true);
  };

  const handleSave = async (isEdit: boolean = false) => {
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
      const url = isEdit ? `${API_BASE_URL}/api/admin/faqs/${editingFaq?.id}` : `${API_BASE_URL}/api/admin/faqs`;
      const method = isEdit ? 'PUT' : 'POST';

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
        if (res.status === 422 && json?.errors) {
          const messages = Object.values(json.errors).flat().join('\n');
          toast.error(messages);
        } else {
          toast.error(json?.message || `Failed to ${isEdit ? 'update' : 'create'} FAQ`);
        }
        return;
      }

      toast.success(json?.message || `FAQ ${isEdit ? 'updated' : 'created'} successfully`);
      setAddModalOpen(false);
      setEditModalOpen(false);
      setEditingFaq(null);
      resetForm();
      await fetchFaqs();
    } catch (e: any) {
      toast.error(e.message || 'Network error');
    } finally {
      setSaving(false);
      NProgress.done();
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    setDeleting(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const res = await fetch(`${API_BASE_URL}/api/admin/faqs/${deleteId}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        credentials: 'include',
      });

      const json = await res.json();
      if (!res.ok) {
        toast.error(json?.message || 'Failed to delete FAQ');
        return;
      }

      toast.success(json?.message || 'FAQ deleted successfully');
      setDeleteId(null);
      await fetchFaqs(); // Refresh the list
    } catch (e: any) {
      toast.error(e.message || 'Network error');
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);



  return (
    <Box className="w-full">
      <Flex justify="between" align="center" mb="6">
        <PageHeading title="FAQs" description="Manage frequently asked questions" />
        <Button color="green" onClick={handleAdd}>
          <Plus size={16} />
          Add FAQ
        </Button>
      </Flex>

      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell style={{ width: 80 }}>ID</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Question</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Answer Preview</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell align="right" style={{ width: 180 }}>Actions</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {loading ? (
            <Table.Row>
              <Table.Cell colSpan={4}>
                <Flex justify="center" py="6">
                  <Text size="3" color="gray">Loading FAQs...</Text>
                </Flex>
              </Table.Cell>
            </Table.Row>
          ) : faqs.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={4}>
                <Flex justify="center" py="4">
                  <Text size="2" color="gray">No data</Text>
                </Flex>
              </Table.Cell>
            </Table.Row>
          ) : (
            faqs.map((faq, index) => (
              <Table.Row key={faq.id}>
                <Table.Cell>
                  <Text weight="bold" color="gray">{index + 1}</Text>
                </Table.Cell>
                <Table.Cell>
                  <Text weight="medium" className="line-clamp-2">
                    {faq.question}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <Text
                    size="2"
                    color="gray"
                    className="line-clamp-2"
                  >
                    {faq.answer.replace(/<[^>]*>/g, '').substring(0, 80)}...
                  </Text>
                </Table.Cell>
                <Table.Cell align="right">
                  <Flex justify="end" gap="2">
                    <IconButton
                      size="1"
                      variant="soft"
                      color="gray"
                      onClick={() => handleView(faq)}
                      title="View FAQ"
                    >
                      <Eye size={14} />
                    </IconButton>
                    <IconButton
                      size="1"
                      variant="soft"
                      color="blue"
                      onClick={() => handleEdit(faq)}
                      title="Edit FAQ"
                    >
                      <Edit size={14} />
                    </IconButton>
                    <IconButton
                      size="1"
                      variant="soft"
                      color="red"
                      onClick={() => setDeleteId(faq.id)}
                      title="Delete FAQ"
                      disabled={deleting && deleteId === faq.id}
                    >
                      {deleting && deleteId === faq.id ? (
                        <RefreshCcw className="animate-spin" size={14} />
                      ) : (
                        <Trash2 size={14} />
                      )}
                    </IconButton>
                  </Flex>
                </Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table.Root>

      {/* Add FAQ Modal */}
      <Dialog.Root open={addModalOpen} onOpenChange={(open) => {
        setAddModalOpen(open);
        if (!open) resetForm();
      }}>
        <Dialog.Content style={{ maxWidth: 600 }}>
          <Dialog.Title>Add New FAQ</Dialog.Title>
          <Dialog.Description size="2" mb="4">
            Create a new frequently asked question
          </Dialog.Description>

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
                height={200}
                placeholder="Enter the answer..."
              />
            </Flex>
          </Flex>

          <Flex justify="end" gap="3" mt="4">
            <Dialog.Close>
              <Button variant="soft" color="gray" disabled={saving}>
                Cancel
              </Button>
            </Dialog.Close>
            <Button color="green" onClick={() => handleSave(false)} disabled={saving}>
              {saving ? <RefreshCcw className="animate-spin" size={16} /> : <Save size={16} />}
              {saving ? 'Creating...' : 'Create FAQ'}
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

      {/* Edit FAQ Modal */}
      <Dialog.Root open={editModalOpen} onOpenChange={(open) => {
        setEditModalOpen(open);
        if (!open) {
          setEditingFaq(null);
          resetForm();
        }
      }}>
        <Dialog.Content style={{ maxWidth: 600 }}>
          <Dialog.Title>Edit FAQ</Dialog.Title>
          <Dialog.Description size="2" mb="4">
            Update the frequently asked question
          </Dialog.Description>

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
                height={200}
                placeholder="Enter the answer..."
              />
            </Flex>
          </Flex>

          <Flex justify="end" gap="3" mt="4">
            <Dialog.Close>
              <Button variant="soft" color="gray" disabled={saving}>
                Cancel
              </Button>
            </Dialog.Close>
            <Button color="green" onClick={() => handleSave(true)} disabled={saving}>
              {saving ? <RefreshCcw className="animate-spin" size={16} /> : <Save size={16} />}
              {saving ? 'Updating...' : 'Update FAQ'}
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

      {/* View FAQ Modal */}
      <Dialog.Root open={viewModalOpen} onOpenChange={(open) => {
        setViewModalOpen(open);
        if (!open) setViewingFaq(null);
      }}>
        <Dialog.Content style={{ maxWidth: 700 }}>
          <Dialog.Title>View FAQ</Dialog.Title>
          <Dialog.Description size="2" mb="4">
            FAQ Details
          </Dialog.Description>

          {viewingFaq && (
            <Flex direction="column" gap="4">
              <Flex direction="column" gap="2">
                <Text as="label" size="2" weight="bold" color="gray">Question:</Text>
                <Text size="3" weight="medium">{viewingFaq.question}</Text>
              </Flex>
              <Flex direction="column" gap="2">
                <Text as="label" size="2" weight="bold" color="gray">Answer:</Text>
                <Box
                  className="p-3 bg-gray-50 dark:bg-neutral-900 rounded border"
                  dangerouslySetInnerHTML={{ __html: viewingFaq.answer }}
                />
              </Flex>
              {viewingFaq.created_at && (
                <Flex direction="column" gap="2">
                  <Text as="label" size="2" weight="bold" color="gray">Created:</Text>
                  <Text size="2" color="gray">
                    {new Date(viewingFaq.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Text>
                </Flex>
              )}
            </Flex>
          )}

          <Flex justify="end" gap="3" mt="4">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                Close
              </Button>
            </Dialog.Close>
            {viewingFaq && (
              <Button color="blue" onClick={() => {
                setViewModalOpen(false);
                handleEdit(viewingFaq);
              }}>
                <Edit size={16} />
                Edit FAQ
              </Button>
            )}
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

      {/* Delete Confirmation Dialog */}
      <Dialog.Root open={deleteId !== null} onOpenChange={(open) => {
        if (!deleting) setDeleteId(open ? deleteId : null);
      }}>
        <Dialog.Content style={{ maxWidth: 450 }}>
          <Dialog.Title>Delete FAQ</Dialog.Title>
          <Dialog.Description size="2" mb="4">
            Are you sure you want to delete this FAQ? This action cannot be undone.
          </Dialog.Description>

          <Flex justify="end" gap="3">
            <Dialog.Close>
              <Button variant="soft" color="gray" disabled={deleting}>
                Cancel
              </Button>
            </Dialog.Close>
            <Button color="red" onClick={handleDelete} disabled={deleting}>
              {deleting ? <RefreshCcw className="animate-spin" size={16} /> : <Trash2 size={16} />}
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </Box>
  );
}
