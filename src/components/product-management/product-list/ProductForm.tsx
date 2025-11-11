import { Box, Button, Card, Flex, Grid, Text, TextField, Select, TextArea, RadioGroup, Dialog, IconButton } from '@radix-ui/themes';
import { Save, X, Image as ImageIcon, Trash2, Upload, Link as LinkIcon } from 'lucide-react';
import { Product } from '@/types/product';
import { Brand } from '@/types/brand';
import { useState, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { API_BASE_URL } from '@/utilities/constants';
import NProgress from 'nprogress';
import { toast } from 'sonner';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

const cleanImageUrl = (url: string): string => {
  if (typeof url !== 'string' || !url) {
    return url;
  }

  // If the URL is already an absolute URL, return it as is.
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // If it's a relative path that needs the API_BASE_URL
  const storageMarker = '/storage/products/';
  if (url.includes(storageMarker)) {
    const parts = url.split(storageMarker);
    const lastPart = parts[parts.length - 1];
    return `${API_BASE_URL}${storageMarker}${lastPart}`;
  }
  
  return url;
};

const getAbsoluteImageUrl = (relativePath: string) => {
  const PLACEHOLDER_IMAGE_URL = 'https://via.placeholder.com/100x100?text=No+Image';

  if (!relativePath || typeof relativePath !== 'string' || relativePath.trim() === '') {
    return PLACEHOLDER_IMAGE_URL;
  }

  // Priority 1: Check for valid absolute URLs that next/image can handle directly.
  if (relativePath.startsWith('blob:') || relativePath.startsWith('data:') || relativePath.startsWith('http')) {
    return relativePath;
  }

  // Priority 2: Fix for malformed URLs that might contain an absolute URL within the string
  // (e.g., "storage/https://picsum.photos...")
  const urlRegex = /(https?:\/\/[^\s]+)/;
  const matches = relativePath.match(urlRegex);
  if (matches) {
    return matches[0];
  }

  // Priority 3: Handle relative paths from our own API.
  let cleanedPath = relativePath;

  // Specific fix for the observed malformed URL pattern:
  // http://192.168.1.9:8000/storage/http://192.168.1.9:8000/storage/products/...
  const malformedPrefix = `${API_BASE_URL}/storage/${API_BASE_URL}/storage/`;
  if (cleanedPath.startsWith(malformedPrefix)) {
    cleanedPath = cleanedPath.substring(malformedPrefix.length - (`${API_BASE_URL}/storage/`).length);
  }

  try {
    const baseUrl = new URL(API_BASE_URL);
    const fullUrl = new URL(cleanedPath, baseUrl);
    return fullUrl.toString();
  } catch (e) {
    console.error("Error constructing image URL for path:", relativePath, e);
    return PLACEHOLDER_IMAGE_URL;
  }
};

interface ProductFormProps {
  selectedItem: Partial<Product> | null;
  onBack: () => void;
  onSubmit: (formData: Partial<Product> & { image_urls?: string[], images?: File[], videos?: string[], deleted_images?: string[] }) => void;
  onLightboxChange?: (isOpen: boolean) => void;
  isSubmitting?: boolean;
  onDelete?: () => Promise<void> | void;
}

const MAX_IMAGES = 20;

export default function ProductForm({ selectedItem, onBack, onSubmit, onLightboxChange, isSubmitting=false, onDelete }: ProductFormProps) {
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

  // Brands state
  const [brands, setBrands] = useState<Brand[]>([]);
  const [brandsLoading, setBrandsLoading] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  // Fetch brands from API
  const fetchBrands = async () => {
    try {
      setBrandsLoading(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const res = await fetch(`${API_BASE_URL}/api/admin/brands`, {
        credentials: 'include',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          'Accept': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch brands');
      }

      const json = await res.json();
      const data: Brand[] = json?.data || [];
      setBrands(data);
    } catch (e: any) {
      console.error('Failed to load brands:', e);
      toast.error('Failed to load brands');
    } finally {
      setBrandsLoading(false);
    }
  };

  const cleanedImages = useMemo(() => {
    return (selectedItem?.images || []).map(cleanImageUrl);
  }, [selectedItem?.images]);

  const [imagePreviews, setImagePreviews] = useState<string[]>(cleanedImages);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<string>('');
  const [isUrlModalOpen, setUrlModalOpen] = useState(false);
  const [videoUrls, setVideoUrls] = useState<string>('');
  const [originalVideoUrls, setOriginalVideoUrls] = useState<string[]>([]);
  const [isVideoUrlModalOpen, setVideoUrlModalOpen] = useState(false);
  const [priceError, setPriceError] = useState<string | null>(null);
  const [brandError, setBrandError] = useState<string | null>(null);
  const [isLightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    onLightboxChange?.(isLightboxOpen);
  }, [isLightboxOpen, onLightboxChange]);

  useEffect(() => {
    const originalPrice = parseFloat(formData.original_price as string);
    const currentPrice = parseFloat(formData.price as string);

    if (originalPrice > 0 && currentPrice > originalPrice) {
      setPriceError('The current price cannot be higher than the original price.');
    } else {
      setPriceError(null);
    }
  }, [formData.price, formData.original_price]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setImagePreviews(cleanedImages);
  }, [cleanedImages]);

  // Fetch brands on component mount
  useEffect(() => {
    fetchBrands();
  }, []);

  // Helper to get YouTube embed URL
  const getYouTubeEmbedUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }
    return null;
  };

  // Populate video URLs from selectedItem
  useEffect(() => {
    if (selectedItem?.videos) {
      let videosArray: string[] = [];
      if (Array.isArray(selectedItem.videos)) {
        videosArray = selectedItem.videos;
      } else if (typeof selectedItem.videos === 'string') {
        try {
          const parsedVideos = JSON.parse(selectedItem.videos);
          if (Array.isArray(parsedVideos)) {
            videosArray = parsedVideos;
          }
        } catch (e) {
          console.error("Failed to parse selectedItem.videos as JSON array:", e);
        }
      }

      // Convert video IDs to full YouTube URLs
      const fullUrls = videosArray
        .map(videoId => {
          if (!videoId) return null;
          const trimmedVideoId = videoId.trim();
          if (!trimmedVideoId) return null;

          if (!trimmedVideoId.startsWith('http')) {
            return `https://www.youtube.com/watch?v=${trimmedVideoId}`;
          }
          return trimmedVideoId;
        })
        .filter(Boolean) as string[];

      setOriginalVideoUrls(fullUrls);
    } else {
      setOriginalVideoUrls([]);
    }
  }, [selectedItem]);

  const videoPreviews = useMemo(() => {
    return originalVideoUrls.map(url => getYouTubeEmbedUrl(url)).filter(Boolean) as string[];
  }, [originalVideoUrls]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    setBrandError(null);

    // Validate brand is required
    if (!formData.brand?.trim() || formData.brand === 'no-brand') {
      setBrandError('Please select a brand');
      toast.error('Please select a brand');
      return;
    }

    if (priceError) {
      toast.error(priceError);
      return;
    }

    const currentImageUrls = imagePreviews.filter(url => !url.startsWith('blob:'));

    onSubmit({
      ...formData,
      image_urls: currentImageUrls,
      images: imageFiles,
      videos: originalVideoUrls,
      deleted_images: imagesToDelete,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const currentImageCount = imagePreviews.length;
      if (currentImageCount >= MAX_IMAGES) {
        toast.error(`You can upload a maximum of ${MAX_IMAGES} images.`);
        return;
      }

      const newFiles = Array.from(files);
      const totalAfterAdd = currentImageCount + newFiles.length;

      if (totalAfterAdd > MAX_IMAGES) {
        toast.error(`You can only add ${MAX_IMAGES - currentImageCount} more image(s).`);
        const filesToAdd = newFiles.slice(0, MAX_IMAGES - currentImageCount);
        setImageFiles(prev => [...prev, ...filesToAdd]);
        const newPreviews = filesToAdd.map(file => URL.createObjectURL(file));
        setImagePreviews(prev => [...prev, ...newPreviews]);
      } else {
        setImageFiles(prev => [...prev, ...newFiles]);
        const newPreviews = newFiles.map(file => URL.createObjectURL(file));
        setImagePreviews(prev => [...prev, ...newPreviews]);
      }
    }
  };

  const handleRemoveImage = (e: React.MouseEvent<HTMLButtonElement>, index: number) => {
    e.stopPropagation();
    e.preventDefault();
    const imageUrlToRemove = imagePreviews[index];

    if (imageUrlToRemove.startsWith('blob:')) {
      const blobUrls = imagePreviews.filter(url => url.startsWith('blob:'));
      const blobIndex = blobUrls.indexOf(imageUrlToRemove);

      if (blobIndex > -1) {
        setImageFiles(prev => prev.filter((_, i) => i !== blobIndex));
      }
      setImagePreviews(prev => prev.filter((_, i) => i !== index));
    } else {
      setImagesToDelete(prev => [...prev, imageUrlToRemove]);
      setImagePreviews(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleRemoveVideo = (e: React.MouseEvent<HTMLButtonElement>, index: number) => {
    e.stopPropagation();
    e.preventDefault();
    setOriginalVideoUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddUrls = () => {
    const urlList = imageUrls.split('\n').filter(url => url.trim() !== '');
    const currentImageCount = imagePreviews.length;

    if (currentImageCount >= MAX_IMAGES) {
      toast.error(`You can have a maximum of ${MAX_IMAGES} images.`);
      return;
    }

    const totalAfterAdd = currentImageCount + urlList.length;

    if (totalAfterAdd > MAX_IMAGES) {
      toast.error(`You can only add ${MAX_IMAGES - currentImageCount} more image(s).`);
      const urlsToAdd = urlList.slice(0, MAX_IMAGES - currentImageCount);
      setImagePreviews(prev => [...prev, ...urlsToAdd]);
    } else {
      setImagePreviews(prev => [...prev, ...urlList]);
    }

    setImageUrls('');
    setUrlModalOpen(false);
  };

  const handleAddVideoUrls = () => {
    const urls = videoUrls.split('\n').filter(url => url.trim() !== '');
    setOriginalVideoUrls(prev => [...prev, ...urls]);
    setVideoUrls('');
    setVideoUrlModalOpen(false);
  };

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
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
                    <Text as="label" size="2" weight="medium">Brand *</Text>
                    <Select.Root
                      value={formData.brand || 'no-brand'}
                      onValueChange={(value) => {
                        setFormData(prev => ({ ...prev, brand: value === 'no-brand' ? '' : value }));
                        setBrandError(null); // Clear error when user selects a brand
                      }}
                      disabled={brandsLoading}
                    >
                      <Select.Trigger
                        placeholder={brandsLoading ? "Loading brands..." : "Select Brand"}
                        style={brandError ? { borderColor: 'red' } : {}}
                      />
                      <Select.Content>
                        <Select.Item value="no-brand">Select Brand</Select.Item>
                        {brands.map((brand) => (
                          <Select.Item key={brand.id} value={brand.brand_name}>
                            {brand.brand_name}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Root>
                    {brandError && (
                      <Text size="1" color="red">{brandError}</Text>
                    )}
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
                  {priceError && <Text size="1" color="red" className="col-span-2">{priceError}</Text>}
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
                  <Grid columns="2" gap="2">
                    {videoPreviews.map((videoUrl, index) => (
                      <Box key={index} className="relative aspect-video">
                        <iframe
                          src={videoUrl}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="absolute top-0 left-0 w-full h-full rounded"
                        ></iframe>
                        <IconButton 
                          type="button"
                          size="1" 
                          color="red" 
                          variant="solid" 
                          onClick={(e) => handleRemoveVideo(e, index)}
                          style={{ position: 'absolute', top: 4, right: 4, cursor: 'pointer' }}
                        >
                          <Trash2 size={12} />
                        </IconButton>
                      </Box>
                    ))}
                  </Grid>
                  <Flex gap="2" mt="2">
                    <Button type="button" variant="soft" onClick={() => setVideoUrlModalOpen(true)}>
                      <LinkIcon size={16} /> Add from URLs
                    </Button>
                  </Flex>
                </Card>
              </Flex>

              <Flex direction="column" gap="1">
                <Text as="label" size="2" weight="medium">Images ({imagePreviews.length}/{MAX_IMAGES})</Text>
                <Card>
                  <Grid columns="4" gap="2">
                    {imagePreviews.map((image, index) => (
                      <Box 
                        key={index} 
                        className="relative"
                        onClick={() => {
                          setLightboxIndex(index);
                          setLightboxOpen(true);
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        <Image 
                          src={getAbsoluteImageUrl(image)} 
                          alt={`Product image ${index + 1}`} 
                          width={100}
                          height={100}
                          className="rounded object-cover w-full h-full"
                        />
                        <IconButton 
                          type="button"
                          size="1" 
                          color="red" 
                          variant="solid" 
                          onClick={(e) => handleRemoveImage(e, index)}
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
                  value={formData.category || ''}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <Select.Trigger placeholder="Select Category" />
                  <Select.Content>
                    <Select.Item value={null}>Select Category</Select.Item>
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
            <Button color="green" type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Save className="animate-spin" size={16} /> : <Save size={16} />}
              {isSubmitting ? ' Saving...' : (selectedItem ? 'Save Changes' : 'Save Product')}
            </Button>
            <Button variant="soft" color="gray" onClick={onBack} type="button">
              <X size={16} />
              Cancel
            </Button>
          </Flex>
          {selectedItem && (
            <Button variant="soft" color="red" type="button" disabled={deleting} onClick={()=> setConfirmOpen(true)}>
              {deleting ? <Save className="animate-spin" size={16} /> : <Trash2 size={16} />}
              {deleting ? ' Deleting...' : 'Delete Item'}
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
            placeholder="https://www.youtube.com/watch?v=...\nhttps://youtu.be/..."
            rows={5}
          />
          <Flex gap="3" mt="4" justify="end">
            <Dialog.Close>
              <Button variant="soft" color="gray">Cancel</Button>
            </Dialog.Close>
            <Button onClick={handleAddVideoUrls}>Add URLs</Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

      <Lightbox
        open={isLightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={imagePreviews.map(src => ({ src: getAbsoluteImageUrl(src) }))}
        index={lightboxIndex}
        on={{ view: ({ index: currentIndex }) => setLightboxIndex(currentIndex) }}
        plugins={[Zoom]}
        closeOnBackdropClick={false}
      />

      <Dialog.Root open={confirmOpen} onOpenChange={(v)=>{ if (!deleting) setConfirmOpen(v); }}>
        <Dialog.Content style={{ maxWidth: 420 }}>
          <Dialog.Title>Delete Product</Dialog.Title>
          <Dialog.Description size="2" mb="3">
            Are you sure you want to delete this product? This action cannot be undone.
          </Dialog.Description>
          <Flex justify="end" gap="2">
            <Dialog.Close>
              <Button variant="soft" color="gray" disabled={deleting}>Cancel</Button>
            </Dialog.Close>
            <Button color="red" disabled={deleting} onClick={async ()=>{
              if (!onDelete) { setConfirmOpen(false); return; }
              try {
                setDeleting(true);
                await onDelete();
              } finally {
                setDeleting(false);
                setConfirmOpen(false);
              }
            }}>
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>
    </Box>
  );
}