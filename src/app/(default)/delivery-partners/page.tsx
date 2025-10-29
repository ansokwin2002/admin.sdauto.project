"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Box, Button, Card, Flex, Grid, IconButton, Table, Text, TextField, Dialog, TextArea } from "@radix-ui/themes";
import { PageHeading } from "@/components/common/PageHeading";
import { API_BASE_URL } from "@/utilities/constants";
import NProgress from "nprogress";
import { toast } from "sonner";
import Image from "next/image";
import { Upload, Trash2, Edit, Save, RefreshCcw, Image as ImageIcon, Plus, X, ExternalLink } from "lucide-react";
import { DeliveryPartner } from "@/types/delivery-partner";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function DeliveryPartnersPage() {
  usePageTitle("Delivery Partners");
  
  const [items, setItems] = useState<DeliveryPartner[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [createMode, setCreateMode] = useState<'file' | 'url'>('file');
  const [imageUrl, setImageUrl] = useState('');
  const [creatingFromUrl, setCreatingFromUrl] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);

  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [urlLink, setUrlLink] = useState('');
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewSrc, setPreviewSrc] = useState<string>("");
  const [editOpen, setEditOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editFilePreview, setEditFilePreview] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editUrlLink, setEditUrlLink] = useState('');
  const editFileInputRef = useRef<HTMLInputElement>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [itemPendingDelete, setItemPendingDelete] = useState<DeliveryPartner | null>(null);

  const getAbsoluteImageUrl = (relativePath: string) => {
    if (!relativePath) return '';
    if (relativePath.startsWith("http")) return relativePath;
    const cleaned = relativePath.startsWith("/") ? relativePath : `/${relativePath}`;
    const base = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
    return `${base}${cleaned}`;
  };

  const fetchItems = async () => {
    try {
      NProgress.start();
      setLoading(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const res = await fetch(`${API_BASE_URL}/api/admin/delivery-partners`, {
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
        throw new Error(text || 'Failed to load delivery partners');
      }
      const data: DeliveryPartner[] = json?.data || [];
      // Sort by creation date ascending (oldest first) so first added appears first
      const sorted = [...data].sort((a, b) => {
        if (!a.created_at || !b.created_at) return 0;
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      });
      setItems(sorted);
    } catch (e:any) {
      toast.error(e.message || 'Failed to load delivery partners');
    } finally {
      setLoading(false);
      NProgress.done();
    }
  };

  useEffect(()=>{ fetchItems(); },[]);

  const handleFileSelect = (selectedFile: File | null) => {
    setFile(selectedFile);

    // Clean up previous preview
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
    }

    // Create new preview
    if (selectedFile) {
      const previewUrl = URL.createObjectURL(selectedFile);
      setFilePreview(previewUrl);
    } else {
      setFilePreview(null);
    }
  };

  const handleEditFileSelect = (selectedFile: File | null) => {
    setEditFile(selectedFile);

    // Clean up previous preview
    if (editFilePreview) {
      URL.revokeObjectURL(editFilePreview);
    }

    // Create new preview
    if (selectedFile) {
      const previewUrl = URL.createObjectURL(selectedFile);
      setEditFilePreview(previewUrl);
    } else {
      setEditFilePreview(null);
    }
  };

  // Cleanup preview URLs on unmount
  useEffect(() => {
    return () => {
      if (filePreview) URL.revokeObjectURL(filePreview);
      if (editFilePreview) URL.revokeObjectURL(editFilePreview);
    };
  }, [filePreview, editFilePreview]);

  const handleUpload = async () => {
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }
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
    const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
    if (file.size > MAX_BYTES) {
      toast.error('Image is too large. Maximum size is 5 MB');
      return;
    }

    try {
      setUploading(true);
      NProgress.start();
      const formData = new FormData();
      formData.append('title', title.trim());
      if (description.trim()) {
        formData.append('description', description.trim());
      }
      if (urlLink.trim()) {
        formData.append('url_link', urlLink.trim());
      }
      formData.append('image', file);

      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const res = await fetch(`${API_BASE_URL}/api/admin/delivery-partners`, {
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
            toast.error(text || 'Failed to create delivery partner');
          }
        }
        return;
      }
      toast.success((json && json.message) || 'Delivery partner created successfully');
      setFile(null);
      setTitle('');
      setDescription('');
      setUrlLink('');

      // Clear preview
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
        setFilePreview(null);
      }

      if (fileInputRef.current) fileInputRef.current.value = '';
      await fetchItems();
    } catch (e:any) {
      toast.error(e.message || 'Upload failed');
    } finally {
      setUploading(false);
      NProgress.done();
    }
  };

  const handleCreateFromUrl = async () => {
    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    if (!imageUrl.trim()) {
      toast.error('Please enter an image URL');
      return;
    }

    // Basic URL validation
    try {
      new URL(imageUrl.trim());
    } catch {
      toast.error('Please enter a valid URL');
      return;
    }

    try {
      setCreatingFromUrl(true);
      NProgress.start();

      const payload = {
        title: title.trim(),
        description: description.trim() || undefined,
        image_url: imageUrl.trim(),
        url_link: urlLink.trim() || undefined,
      };

      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const res = await fetch(`${API_BASE_URL}/api/admin/delivery-partners/url`, {
        method: 'POST',
        body: JSON.stringify(payload),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
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
            toast.error(text || 'Failed to create delivery partner');
          }
        }
        return;
      }
      toast.success((json && json.message) || 'Delivery partner created successfully');
      setImageUrl('');
      setTitle('');
      setDescription('');
      setUrlLink('');
      await fetchItems();
    } catch (e:any) {
      console.error('Create from URL error:', e);
      toast.error(e.message || 'Creation failed');
    } finally {
      setCreatingFromUrl(false);
      NProgress.done();
    }
  };

  const handleDelete = async (item: DeliveryPartner) => {
    try {
      setDeletingId(item.id);
      NProgress.start();
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const res = await fetch(`${API_BASE_URL}/api/admin/delivery-partners/${item.id}`, {
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
        if (json?.message) {
          toast.error(json.message);
        } else {
          const text = await res.text();
          toast.error(text || 'Failed to delete delivery partner');
        }
        return;
      }
      toast.success((json && json.message) || 'Delivery partner deleted successfully');
      await fetchItems();
    } catch (e:any) {
      toast.error(e.message || 'Delete failed');
    } finally {
      setDeletingId(null);
      NProgress.done();
    }
  };

  const openEditModal = (item: DeliveryPartner) => {
    setEditingItemId(item.id);
    setEditTitle(item.title);
    setEditDescription(item.description || '');
    setEditUrlLink(item.url_link || '');
    setEditFile(null);

    // Clear edit preview
    if (editFilePreview) {
      URL.revokeObjectURL(editFilePreview);
      setEditFilePreview(null);
    }

    if (editFileInputRef.current) editFileInputRef.current.value = '';
    setEditOpen(true);
  };

  const handleEditSave = async () => {
    if (!editTitle.trim()) {
      toast.error('Please enter a title');
      return;
    }

    try {
      setSavingEdit(true);
      NProgress.start();
      
      const formData = new FormData();
      formData.append('title', editTitle.trim());
      if (editDescription.trim()) {
        formData.append('description', editDescription.trim());
      }
      if (editUrlLink.trim()) {
        formData.append('url_link', editUrlLink.trim());
      }
      if (editFile) {
        formData.append('image', editFile);
      }

      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const res = await fetch(`${API_BASE_URL}/api/admin/delivery-partners/${editingItemId}`, {
        method: 'PUT',
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
            toast.error(text || 'Failed to update delivery partner');
          }
        }
        return;
      }
      toast.success((json && json.message) || 'Delivery partner updated successfully');
      setEditOpen(false);
      await fetchItems();
    } catch (e:any) {
      toast.error(e.message || 'Update failed');
    } finally {
      setSavingEdit(false);
      NProgress.done();
    }
  };

  const confirmDelete = (item: DeliveryPartner) => {
    setItemPendingDelete(item);
    setConfirmOpen(true);
  };

  const executeDelete = async () => {
    if (itemPendingDelete) {
      await handleDelete(itemPendingDelete);
      setConfirmOpen(false);
      setItemPendingDelete(null);
    }
  };

  return (
    <Box>
      <PageHeading
        title="Delivery Partners"
        description="Manage delivery partner logos and information"
      />

      <Grid columns={{ initial: "1", lg: "3" }} gap="6">
        {/* Create New Section */}
        <Box className="lg:col-span-1">
          <Card size="3" className="h-fit">
            <Flex direction="column" gap="4">
              <Flex align="center" gap="2" mb="2">
                <Plus size={20} />
                <Text size="4" weight="bold">Add New Partner</Text>
              </Flex>

              {/* Mode Toggle */}
              <Flex gap="2" mb="3">
                <Button
                  variant={createMode === 'file' ? 'solid' : 'soft'}
                  onClick={() => setCreateMode('file')}
                  size="2"
                  className="flex-1"
                >
                  <Upload size={14} />
                  Upload
                </Button>
                <Button
                  variant={createMode === 'url' ? 'solid' : 'soft'}
                  onClick={() => setCreateMode('url')}
                  size="2"
                  className="flex-1"
                >
                  <ImageIcon size={14} />
                  URL
                </Button>
              </Flex>

              {/* Form Fields */}
              <Flex direction="column" gap="3">
                <Box>
                  <Text size="2" mb="1" weight="medium" as="label">Partner Name</Text>
                  <TextField.Root
                    placeholder="e.g., UberEats, DoorDash"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </Box>

                <Box>
                  <Text size="2" mb="1" weight="medium" as="label">Description</Text>
                  <TextArea
                    placeholder="Optional description..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                  />
                </Box>

                <Box>
                  <Text size="2" mb="1" weight="medium" as="label">Website URL</Text>
                  <TextField.Root
                    placeholder="https://www.ubereats.com"
                    value={urlLink}
                    onChange={(e) => setUrlLink(e.target.value)}
                  />
                  <Text size="1" color="gray" mt="1">Optional link to partner's website</Text>
                </Box>

                {createMode === 'file' ? (
                  <Box>
                    <Text size="2" mb="2" weight="medium" as="label">Logo Image</Text>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-800 dark:file:text-gray-300 dark:hover:file:bg-gray-700"
                    />
                    <Text size="1" color="gray" mt="1">Max 5MB • JPG, PNG, WebP, GIF</Text>

                    {/* Image Preview */}
                    {filePreview && (
                      <Box mt="3" className="relative">
                        <Text size="2" mb="2" weight="medium">Preview:</Text>
                        <div className="relative w-full max-w-[200px] mx-auto">
                          <Image
                            src={filePreview}
                            alt="Preview"
                            width={200}
                            height={120}
                            className="w-full h-auto max-h-[120px] object-contain bg-gray-50 rounded-lg border p-2"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              handleFileSelect(null);
                              if (fileInputRef.current) fileInputRef.current.value = '';
                            }}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                            title="Remove image"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </Box>
                    )}
                  </Box>
                ) : (
                  <Box>
                    <Text size="2" mb="2" weight="medium" as="label">Image URL</Text>
                    <TextField.Root
                      placeholder="https://example.com/logo.png"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                    />
                    <Text size="1" color="gray" mt="1">
                      Try using direct image URLs (ending in .jpg, .png, etc.) or image hosting services like Imgur, Unsplash, or Picsum
                    </Text>
                  </Box>
                )}

                <Button
                  onClick={createMode === 'file' ? handleUpload : handleCreateFromUrl}
                  disabled={
                    (createMode === 'file' ? (uploading || !file || !title.trim()) : (creatingFromUrl || !imageUrl.trim() || !title.trim()))
                  }
                  size="3"
                  className="mt-2"
                >
                  {(createMode === 'file' ? uploading : creatingFromUrl) ? (
                    <RefreshCcw className="animate-spin" size={16} />
                  ) : (
                    <Plus size={16} />
                  )}
                  {(createMode === 'file' ? uploading : creatingFromUrl) ? 'Creating...' : 'Add Partner'}
                </Button>
              </Flex>
            </Flex>
          </Card>
        </Box>

        {/* Partners List */}
        <Box className="lg:col-span-2">
          <Card size="3">
            <Flex justify="between" align="center" mb="4">
              <Flex align="center" gap="2">
                <Text size="4" weight="bold">Partners</Text>
                <Text size="2" color="gray">({items.length})</Text>
              </Flex>
            </Flex>

            {loading ? (
              <Flex justify="center" py="8">
                <Flex direction="column" align="center" gap="2">
                  <RefreshCcw className="animate-spin" size={24} />
                  <Text size="2" color="gray">Loading partners...</Text>
                </Flex>
              </Flex>
            ) : items.length === 0 ? (
              <Flex justify="center" py="8">
                <Flex direction="column" align="center" gap="3">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <ImageIcon size={24} className="text-gray-400" />
                  </div>
                  <Text color="gray" size="3">No delivery partners yet</Text>
                  <Text color="gray" size="2">Add your first partner using the form on the left</Text>
                </Flex>
              </Flex>
            ) : (
              <Grid columns={{ initial: "1", sm: "2" }} gap="4">
                {items.map((item) => (
                  <Card key={item.id} size="2" className="hover:shadow-md transition-shadow">
                    <Flex direction="column" gap="3">
                      {/* Image Section */}
                      <Box className="relative">
                        {item.image ? (
                          <button
                            type="button"
                            onClick={() => { setPreviewSrc(getAbsoluteImageUrl(item.image!)); setPreviewOpen(true); }}
                            className="w-full rounded-lg overflow-hidden bg-gray-50 hover:bg-gray-100 transition-colors"
                            title="Click to preview"
                          >
                            <Image
                              src={getAbsoluteImageUrl(item.image)}
                              alt={`${item.title} logo`}
                              width={200}
                              height={100}
                              className="w-full h-24 object-contain p-2"
                            />
                          </button>
                        ) : (
                          <div className="w-full h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                            <ImageIcon size={32} className="text-gray-400" />
                          </div>
                        )}
                      </Box>

                      {/* Content Section */}
                      <Flex direction="column" gap="2">
                        <Text weight="bold" size="3" className="line-clamp-1">{item.title}</Text>
                        {item.description && (
                          <Text size="2" color="gray" className="line-clamp-2">{item.description}</Text>
                        )}
                        {item.url_link && (
                          <Flex align="center" gap="1" className="mt-1">
                            <ExternalLink size={14} className="text-blue-600 flex-shrink-0" />
                            <a
                              href={item.url_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-sm underline truncate"
                              title={item.url_link}
                            >
                              Visit Website
                            </a>
                          </Flex>
                        )}
                      </Flex>

                      {/* Actions Section */}
                      <Flex gap="2" justify="end" pt="2" className="border-t border-gray-100">
                        <IconButton
                          variant="soft"
                          size="2"
                          onClick={() => openEditModal(item)}
                          title="Edit partner"
                        >
                          <Edit size={16} />
                        </IconButton>
                        <IconButton
                          variant="soft"
                          color="red"
                          size="2"
                          onClick={() => confirmDelete(item)}
                          disabled={deletingId === item.id}
                          title="Delete partner"
                        >
                          {deletingId === item.id ? (
                            <RefreshCcw className="animate-spin" size={16} />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </IconButton>
                      </Flex>
                    </Flex>
                  </Card>
                ))}
              </Grid>
            )}
          </Card>
        </Box>
      </Grid>

      {/* Preview Dialog */}
      <Dialog.Root open={previewOpen} onOpenChange={setPreviewOpen}>
        <Dialog.Content maxWidth="600px">
          <Dialog.Title>Image Preview</Dialog.Title>
          <Box mt="4">
            {previewSrc && (
              <Image 
                src={previewSrc} 
                alt="Preview" 
                width={600} 
                height={400} 
                className="w-full h-auto rounded"
                style={{ maxHeight: '400px', objectFit: 'contain' }}
              />
            )}
          </Box>
          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="outline">Close</Button>
            </Dialog.Close>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

      {/* Edit Dialog */}
      <Dialog.Root open={editOpen} onOpenChange={setEditOpen}>
        <Dialog.Content maxWidth="500px">
          <Dialog.Title>Edit Delivery Partner</Dialog.Title>
          <Flex direction="column" gap="4" mt="4">
            <Box>
              <Text size="2" mb="2" weight="medium" as="label">Partner Name</Text>
              <TextField.Root
                placeholder="Partner name"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
            </Box>

            <Box>
              <Text size="2" mb="2" weight="medium" as="label">Description</Text>
              <TextArea
                placeholder="Description (optional)"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={3}
              />
            </Box>

            <Box>
              <Text size="2" mb="2" weight="medium" as="label">Website URL</Text>
              <TextField.Root
                placeholder="https://www.ubereats.com"
                value={editUrlLink}
                onChange={(e) => setEditUrlLink(e.target.value)}
              />
            </Box>

            <Box>
              <Text size="2" mb="2" weight="medium" as="label">Replace Logo (optional)</Text>
              <input
                ref={editFileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleEditFileSelect(e.target.files?.[0] || null)}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-800 dark:file:text-gray-300 dark:hover:file:bg-gray-700"
              />
              <Text size="1" color="gray" mt="1">Leave empty to keep current image</Text>

              {/* New Image Preview */}
              {editFilePreview && (
                <Box mt="3" className="relative">
                  <Text size="2" mb="2" weight="medium">New Image Preview:</Text>
                  <div className="relative w-full max-w-[200px] mx-auto">
                    <Image
                      src={editFilePreview}
                      alt="New image preview"
                      width={200}
                      height={120}
                      className="w-full h-auto max-h-[120px] object-contain bg-gray-50 rounded-lg border p-2"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        handleEditFileSelect(null);
                        if (editFileInputRef.current) editFileInputRef.current.value = '';
                      }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                      title="Remove new image"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </Box>
              )}
            </Box>
          </Flex>
          <Flex gap="3" mt="6" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">Cancel</Button>
            </Dialog.Close>
            <Button onClick={handleEditSave} disabled={savingEdit || !editTitle.trim()}>
              {savingEdit ? <RefreshCcw className="animate-spin" size={16} /> : <Save size={16} />}
              {savingEdit ? 'Saving...' : 'Save Changes'}
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

      {/* Delete Confirmation Dialog */}
      <Dialog.Root open={confirmOpen} onOpenChange={setConfirmOpen}>
        <Dialog.Content maxWidth="450px">
          <Dialog.Title color="red">Delete Delivery Partner</Dialog.Title>
          <Flex direction="column" gap="3" mt="4">
            <Flex align="center" gap="3" p="3" className="bg-red-50 rounded-lg border border-red-200">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Trash2 size={20} className="text-red-600" />
              </div>
              <Box>
                <Text weight="medium" size="3">Are you sure?</Text>
                <Text size="2" color="gray" mt="1">
                  This will permanently delete "{itemPendingDelete?.title}" and cannot be undone.
                </Text>
              </Box>
            </Flex>
          </Flex>
          <Flex gap="3" mt="6" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">Cancel</Button>
            </Dialog.Close>
            <Button color="red" onClick={executeDelete}>
              <Trash2 size={16} />
              Delete Partner
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </Box>
  );
}
