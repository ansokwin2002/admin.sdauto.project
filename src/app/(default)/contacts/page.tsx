"use client";

import { useState, useEffect } from "react";
import { Box, Button, Card, Flex, Text, TextField, TextArea, Grid, Table, Dialog, IconButton, Badge } from "@radix-ui/themes";
import { PageHeading } from "@/components/common/PageHeading";
import { API_BASE_URL } from "@/utilities/constants";
import NProgress from "nprogress";
import { toast } from "sonner";
import { Save, Loader2, Plus, Edit, Eye, Trash2, Mail, User, MessageSquare } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";

interface Contact {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message?: string;
  status?: 'new' | 'read' | 'replied' | 'closed';
  created_at?: string;
  updated_at?: string;
}

export default function ContactsPage() {
  usePageTitle('Contact Management');
  
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [viewingContact, setViewingContact] = useState<Contact | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    status: 'new' as Contact['status'],
  });

  const fetchContacts = async () => {
    setLoading(true);
    NProgress.start();
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const res = await fetch(`${API_BASE_URL}/api/admin/contacts`, {
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
      setContacts(json?.data || []);
    } catch (e: any) {
      toast.error(e.message || 'Failed to load contacts');
    } finally {
      setLoading(false);
      NProgress.done();
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Name and email are required');
      return;
    }

    setSaving(true);
    NProgress.start();
    
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const url = editingContact 
        ? `${API_BASE_URL}/api/admin/contacts/${editingContact.id}`
        : `${API_BASE_URL}/api/admin/contacts`;
      const method = editingContact ? 'PUT' : 'POST';

      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
        status: formData.status,
      };

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
          toast.error(json?.message || 'Failed to save contact');
        }
        return;
      }

      toast.success(json?.message || `Contact ${editingContact ? 'updated' : 'created'} successfully`);
      resetForm();
      setDialogOpen(false);
      await fetchContacts();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save contact');
    } finally {
      setSaving(false);
      NProgress.done();
    }
  };

  const handleDelete = async (contact: Contact) => {
    if (!confirm(`Are you sure you want to delete the contact from ${contact.name}?`)) {
      return;
    }

    setDeleting(contact.id);
    NProgress.start();
    
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const res = await fetch(`${API_BASE_URL}/api/admin/contacts/${contact.id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        credentials: 'include',
      });

      const json = await res.json();
      if (!res.ok) {
        toast.error(json?.message || 'Failed to delete contact');
        return;
      }

      toast.success(json?.message || 'Contact deleted successfully');
      await fetchContacts();
    } catch (err: any) {
      toast.error(err?.message || 'Failed to delete contact');
    } finally {
      setDeleting(null);
      NProgress.done();
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      status: 'new',
    });
    setEditingContact(null);
  };

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name || '',
      email: contact.email || '',
      phone: contact.phone || '',
      subject: contact.subject || '',
      message: contact.message || '',
      status: contact.status || 'new',
    });
    setDialogOpen(true);
  };

  const handleView = (contact: Contact) => {
    setViewingContact(contact);
    setViewDialogOpen(true);
  };

  const handleAdd = () => {
    resetForm();
    setDialogOpen(true);
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'new': return 'blue';
      case 'read': return 'yellow';
      case 'replied': return 'green';
      case 'closed': return 'gray';
      default: return 'gray';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  if (loading && contacts.length === 0) {
    return (
      <Box className="w-full">
        <PageHeading title="Contact Management" description="Manage customer inquiries and messages" />
        <Card size="3" className="p-8 text-center">
          <Loader2 className="animate-spin mx-auto mb-4" size={32} />
          <Text>Loading contacts...</Text>
        </Card>
      </Box>
    );
  }

  return (
    <Box className="w-full">
      <PageHeading title="Contact Management" description="Manage customer inquiries and messages" />
      
      <Flex justify="between" align="center" mb="4">
        <Text size="4" weight="bold">Contact Messages</Text>
        <Button onClick={handleAdd}>
          <Plus size={16} />
          Add Contact
        </Button>
      </Flex>

      {contacts.length === 0 ? (
        <Card size="3" className="p-8 text-center">
          <MessageSquare size={48} className="mx-auto mb-4 text-gray-400" />
          <Text size="4" weight="bold" mb="2">No contacts found</Text>
          <Text size="2" color="gray" mb="4">Customer inquiries will appear here</Text>
          <Button onClick={handleAdd}>
            <Plus size={16} />
            Add Contact
          </Button>
        </Card>
      ) : (
        <Card>
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Subject</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell align="right">Actions</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {contacts.map((contact) => (
                <Table.Row key={contact.id}>
                  <Table.Cell>
                    <Flex align="center" gap="2">
                      <User size={16} className="text-gray-400" />
                      <Text weight="medium">{contact.name}</Text>
                    </Flex>
                  </Table.Cell>
                  <Table.Cell>
                    <Flex align="center" gap="2">
                      <Mail size={16} className="text-gray-400" />
                      <Text size="2">{contact.email}</Text>
                    </Flex>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="2" className="max-w-[200px] truncate">
                      {contact.subject || 'No subject'}
                    </Text>
                  </Table.Cell>
                  <Table.Cell>
                    <Badge color={getStatusColor(contact.status)} variant="soft">
                      {contact.status || 'new'}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>
                    <Text size="2" color="gray">
                      {formatDate(contact.created_at)}
                    </Text>
                  </Table.Cell>
                  <Table.Cell align="right">
                    <Flex gap="2" justify="end">
                      <IconButton 
                        variant="soft" 
                        color="gray" 
                        onClick={() => handleView(contact)}
                        title="View contact details"
                      >
                        <Eye size={14} />
                      </IconButton>
                      <IconButton 
                        variant="soft" 
                        color="blue" 
                        onClick={() => handleEdit(contact)}
                        title="Edit contact"
                      >
                        <Edit size={14} />
                      </IconButton>
                      <IconButton 
                        variant="soft" 
                        color="red" 
                        onClick={() => handleDelete(contact)}
                        title="Delete contact"
                        disabled={deleting === contact.id}
                      >
                        {deleting === contact.id ? (
                          <Loader2 className="animate-spin" size={14} />
                        ) : (
                          <Trash2 size={14} />
                        )}
                      </IconButton>
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Card>
      )}

      {/* Add/Edit Dialog */}
      <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
        <Dialog.Content style={{ maxWidth: 600 }}>
          <Dialog.Title>
            {editingContact ? 'Edit Contact' : 'Add Contact'}
          </Dialog.Title>
          <Dialog.Description size="2" mb="4">
            {editingContact ? 'Update the contact details' : 'Create a new contact entry'}
          </Dialog.Description>

          <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            <Grid gap="4">
              <Grid columns="2" gap="4">
                <Flex direction="column" gap="1">
                  <Text as="label" size="2" weight="medium">Name *</Text>
                  <TextField.Root
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Full name"
                  />
                </Flex>

                <Flex direction="column" gap="1">
                  <Text as="label" size="2" weight="medium">Email *</Text>
                  <TextField.Root
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="email@example.com"
                  />
                </Flex>
              </Grid>

              <Grid columns="2" gap="4">
                <Flex direction="column" gap="1">
                  <Text as="label" size="2" weight="medium">Phone</Text>
                  <TextField.Root
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Phone number"
                  />
                </Flex>

                <Flex direction="column" gap="1">
                  <Text as="label" size="2" weight="medium">Status</Text>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as Contact['status'] }))}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="new">New</option>
                    <option value="read">Read</option>
                    <option value="replied">Replied</option>
                    <option value="closed">Closed</option>
                  </select>
                </Flex>
              </Grid>

              <Flex direction="column" gap="1">
                <Text as="label" size="2" weight="medium">Subject</Text>
                <TextField.Root
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Message subject"
                />
              </Flex>

              <Flex direction="column" gap="1">
                <Text as="label" size="2" weight="medium">Message</Text>
                <TextArea
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Contact message"
                  rows={4}
                />
              </Flex>
            </Grid>

            <Flex justify="end" gap="2" mt="6">
              <Dialog.Close>
                <Button variant="soft" color="gray" type="button">
                  Cancel
                </Button>
              </Dialog.Close>
              <Button color="green" type="submit" disabled={saving}>
                {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                {saving ? 'Saving...' : 'Save'}
              </Button>
            </Flex>
          </form>
        </Dialog.Content>
      </Dialog.Root>

      {/* View Dialog */}
      <Dialog.Root open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <Dialog.Content style={{ maxWidth: 600 }}>
          <Dialog.Title>Contact Details</Dialog.Title>
          <Dialog.Description size="2" mb="4">
            View contact information and message
          </Dialog.Description>

          {viewingContact && (
            <Grid gap="4">
              <Grid columns="2" gap="4">
                <Box>
                  <Text size="2" weight="medium" color="gray">Name</Text>
                  <Text size="3">{viewingContact.name}</Text>
                </Box>
                <Box>
                  <Text size="2" weight="medium" color="gray">Email</Text>
                  <Text size="3">{viewingContact.email}</Text>
                </Box>
              </Grid>

              <Grid columns="2" gap="4">
                <Box>
                  <Text size="2" weight="medium" color="gray">Phone</Text>
                  <Text size="3">{viewingContact.phone || 'Not provided'}</Text>
                </Box>
                <Box>
                  <Text size="2" weight="medium" color="gray">Status</Text>
                  <Badge color={getStatusColor(viewingContact.status)} variant="soft">
                    {viewingContact.status || 'new'}
                  </Badge>
                </Box>
              </Grid>

              <Box>
                <Text size="2" weight="medium" color="gray">Subject</Text>
                <Text size="3">{viewingContact.subject || 'No subject'}</Text>
              </Box>

              <Box>
                <Text size="2" weight="medium" color="gray">Message</Text>
                <Box className="p-3 bg-gray-50 dark:bg-gray-900 rounded-md">
                  <Text size="2">{viewingContact.message || 'No message'}</Text>
                </Box>
              </Box>

              <Grid columns="2" gap="4">
                <Box>
                  <Text size="2" weight="medium" color="gray">Created</Text>
                  <Text size="2">{formatDate(viewingContact.created_at)}</Text>
                </Box>
                <Box>
                  <Text size="2" weight="medium" color="gray">Updated</Text>
                  <Text size="2">{formatDate(viewingContact.updated_at)}</Text>
                </Box>
              </Grid>
            </Grid>
          )}

          <Flex justify="end" gap="2" mt="6">
            <Dialog.Close>
              <Button variant="soft" color="gray">
                Close
              </Button>
            </Dialog.Close>
            {viewingContact && (
              <Button
                color="blue"
                onClick={() => {
                  setViewDialogOpen(false);
                  handleEdit(viewingContact);
                }}
              >
                <Edit size={16} />
                Edit
              </Button>
            )}
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </Box>
  );
}
