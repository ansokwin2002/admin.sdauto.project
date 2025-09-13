import { Box, Button, Card, Flex, Grid, Text, TextField, Select, TextArea, RadioGroup, Dialog, IconButton } from '@radix-ui/themes';
import { Save, X, Image as ImageIcon, Trash2, Upload, Link as LinkIcon } from 'lucide-react';
import { Product } from '@/types/product';
import { useState, useRef } from 'react';
import Image from 'next/image';

interface ProductFormProps {
  selectedItem: Partial<Product> | null;
  onBack: () => void;
  onSubmit: (formData: Partial<Product> & { image_urls?: string[], images?: File[], videos?: string[] }) => void;
}

export default function ProductForm({ selectedItem, onBack, onSubmit }: ProductFormProps) {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: selectedItem?.name || '',
    brand: selectedItem?.brand || '',
    category: selectedItem?.category || '',
    part_number: selectedItem?.part_number || '',
    condition: selectedItem?.condition || 'New',
    quantity: selectedItem?.quantity || 0,
    price: selectedItem?.price || '0',
    original_price: selectedItem?.original_price || '0',
    description: selectedItem?.description || '',
    is_active: selectedItem?.is_active ?? true,
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(selectedItem?.images || []);
  const [imageUrls, setImageUrls] = useState<string>('');
  const [isUrlModalOpen, setUrlModalOpen] = useState(false);
  const [videoUrls, setVideoUrls] = useState<string>('');
  const [isVideoUrlModalOpen, setVideoUrlModalOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const urlList = imageUrls.split('\n').filter(url => url.trim() !== '');
    const videoUrlList = videoUrls.split('\n').filter(url => url.trim() !== '');
    onSubmit({ ...formData, image_urls: urlList, images: imageFiles, videos: videoUrlList });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setImageFiles(prev => [...prev, ...newFiles]);
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddUrls = () => {
    const urlList = imageUrls.split('\n').filter(url => url.trim() !== '');
    setImagePreviews(prev => [...prev, ...urlList]);
    setImageUrls('');
    setUrlModalOpen(false);
  };

  return (
    <Box>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <Grid columns={{ initial: '1', md: '4' }} gap="4">
          <Box className="md:col-span-3">
            <Card size="3" className="space-y-3 !overflow-visible" style={{ contain: 'none !important' }}>
              <Box>
                <Grid columns={{ initial: '1', sm: '2' }} gap="4">
                  <Flex direction="column" gap="1">
                    <Text as="label" size="2" weight="medium">Name</Text>
                    <TextField.Root
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </Flex>
                   <Flex direction="column" gap="1">
                    <Text as="label" size="2" weight="medium">Brand</Text>
                    <TextField.Root
                      type="text"
                      value={formData.brand}
                      onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                    />
                  </Flex>
                </Grid>
                 <Grid columns={{ initial: '1', sm: '2' }} gap="4" mt="3">
                  <Flex direction="column" gap="1">
                    <Text as="label" size="2" weight="medium">Part Number</Text>
                    <TextField.Root
                      type="text"
                      value={formData.part_number}
                      onChange={(e) => setFormData(prev => ({ ...prev, part_number: e.target.value }))}
                    />
                  </Flex>
                  <Flex direction="column" gap="1">
                    <Text as="label" size="2" weight="medium">Condition</Text>
                    <Select.Root
                      value={formData.condition}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, condition: value }))}
                    >
                      <Select.Trigger placeholder="Select Condition" />
                      <Select.Content>
                        <Select.Item value="New">New</Select.Item>
                        <Select.Item value="Used">Used</Select.Item>
                        <Select.Item value="Refurbished">Refurbished</Select.Item>
                      </Select.Content>
                    </Select.Root>
                  </Flex>
                </Grid>
                <Grid columns={{ initial: '1', sm: '2' }} gap="4" mt="3">
                  <Flex direction="column" gap="1">
                    <Text as="label" size="2" weight="medium">Original Price</Text>
                    <TextField.Root
                      type="number"
                      step="0.01"
                      value={formData.original_price || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, original_price: parseFloat(e.target.value) || 0 }))}
                    >
                      <TextField.Slot>$</TextField.Slot>
                    </TextField.Root>
                  </Flex>
                  <Flex direction="column" gap="1">
                    <Text as="label" size="2" weight="medium">Price</Text>
                    <TextField.Root
                      type="number"
                      step="0.01"
                      value={formData.price || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    >
                      <TextField.Slot>$</TextField.Slot>
                    </TextField.Root>
                  </Flex>
                  <Flex direction="column" gap="1">
                    <Text as="label" size="2" weight="medium">Quantity</Text>
                    <TextField.Root
                      type="number"
                      value={formData.quantity}
                      onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                    />
                  </Flex>
                </Grid>
                <Flex direction="column" gap="1" mt="3">
                  <Text as="label" size="2" weight="medium">Description</Text>
                  <TextArea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </Flex>
              </Box>

              <Flex direction="column" gap="1">
                <Text as="label" size="2" weight="medium">Videos</Text>
                <Card>
                  <Flex gap="2" mt="2">
                    <Button type="button" variant="soft" onClick={() => setVideoUrlModalOpen(true)}>
                      <LinkIcon size={16} /> Add from URLs
                    </Button>
                  </Flex>
                </Card>
              </Flex>

              <Flex direction="column" gap="1">
                <Text as="label" size="2" weight="medium">Images</Text>
                <Card>
                  <Grid columns="4" gap="2">
                    {imagePreviews.map((image, index) => (
                      <Box key={index} className="relative">
                        <Image 
                          src={image} 
                          alt={`Product image ${index + 1}`} 
                          width={100}
                          height={100}
                          className="rounded object-cover w-full h-full"
                        />
                        <IconButton 
                          size="1" 
                          color="red" 
                          variant="solid" 
                          onClick={() => handleRemoveImage(index)}
                          style={{ position: 'absolute', top: 4, right: 4, cursor: 'pointer' }}
                        >
                          <Trash2 size={12} />
                        </IconButton>
                      </Box>
                    ))}
                  </Grid>
                  <Flex gap="2" mt="2">
                    <Button type="button" variant="soft" onClick={() => fileInputRef.current?.click()}>
                      <Upload size={16} /> Upload Images
                    </Button>
                    <Button type="button" variant="soft" onClick={() => setUrlModalOpen(true)}>
                      <LinkIcon size={16} /> Add from URLs
                    </Button>
                  </Flex>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </Card>
              </Flex>
            </Card>
          </Box>

          <Box>
            <Card size="3" className="space-y-3">
              <Flex direction="column" gap="1">
                <Text as="label" size="2" weight="medium">Category</Text>
                <Select.Root
                  value={formData.category}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <Select.Trigger placeholder="Select Category" />
                  <Select.Content>
                    {/* Replace with actual categories from your API or data source */}
                    <Select.Item value="electronics">Electronics</Select.Item>
                    <Select.Item value="clothing">Clothing</Select.Item>
                    <Select.Item value="books">Books</Select.Item>
                  </Select.Content>
                </Select.Root>
              </Flex>
              
              <Box>
                <Flex direction="column" gap="3">
                  <Flex direction="column" gap="1">
                    <Text as="label" size="2" weight="medium">Status</Text>
                    <Flex gap="4">
                      <label className="flex items-center gap-2">
                        <RadioGroup.Root
                          value={formData.is_active ? 'active' : 'inactive'}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, is_active: value === 'active' }))}
                        >
                          <RadioGroup.Item value="active">Active</RadioGroup.Item>
                          <RadioGroup.Item value="inactive">Inactive</RadioGroup.Item>
                        </RadioGroup.Root>
                      </label>
                    </Flex>
                  </Flex>
                </Flex>
              </Box>
            </Card>
          </Box>
        </Grid>

        <Flex justify="between" mt="6">
          <Flex gap="4">
            <Button color="green" type="submit">
              <Save size={16} /> 
              {selectedItem ? 'Save Changes' : 'Save Product'}
            </Button>
            <Button variant="soft" color="gray" onClick={onBack} type="button">
              <X size={16} />
              Cancel
            </Button>
          </Flex>
          {selectedItem && (
            <Button variant="soft" color="red" type="button">
              <Trash2 size={16} />
              Delete Item
            </Button>
          )}
        </Flex>
      </form>
      <Dialog.Root open={isUrlModalOpen} onOpenChange={setUrlModalOpen}>
        <Dialog.Content style={{ maxWidth: 500 }}>
          <Dialog.Title>Add Image URLs</Dialog.Title>
          <Dialog.Description size="2" mb="4">
            Enter one image URL per line.
          </Dialog.Description>
          <TextArea
            value={imageUrls}
            onChange={(e) => setImageUrls(e.target.value)}
            placeholder="https://example.com/image1.jpg\nhttps://example.com/image2.jpg"
            rows={5}
          />
          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">Cancel</Button>
            </Dialog.Close>
            <Button onClick={handleAddUrls}>Add URLs</Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

      <Dialog.Root open={isVideoUrlModalOpen} onOpenChange={setVideoUrlModalOpen}>
        <Dialog.Content style={{ maxWidth: 500 }}>
          <Dialog.Title>Add Video URLs</Dialog.Title>
          <Dialog.Description size="2" mb="4">
            Enter one video URL per line.
          </Dialog.Description>
          <TextArea
            value={videoUrls}
            onChange={(e) => setVideoUrls(e.target.value)}
            placeholder="https://example.com/video1.mp4\nhttps://example.com/video2.mp4"
            rows={5}
          />
          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">Cancel</Button>
            </Dialog.Close>
            <Button onClick={() => setVideoUrlModalOpen(false)}>Add URLs</Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </Box>
  );
}
