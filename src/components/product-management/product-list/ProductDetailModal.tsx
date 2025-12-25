'use client';

import { Dialog, Flex, Button, Text, Card, Grid, Box, Badge } from '@radix-ui/themes';
import Image from 'next/image';
import { Product } from '@/types/product';
import { X, Tag, DollarSign, Package, CheckCircle, XCircle, Info, Scale } from 'lucide-react';
import { API_BASE_URL } from '@/utilities/constants';

const getAbsoluteImageUrl = (inputUrl: string): string => {
  const PLACEHOLDER_IMAGE_URL = 'https://via.placeholder.com/800x600?text=No+Image';

  if (!inputUrl || typeof inputUrl !== 'string' || inputUrl.trim() === '') {
    return PLACEHOLDER_IMAGE_URL;
  }

  // If the URL is already an absolute URL, return it as is.
  if (inputUrl.startsWith('http://') || inputUrl.startsWith('https://') || inputUrl.startsWith('blob:') || inputUrl.startsWith('data:')) {
    return inputUrl;
  }

  // Otherwise, assume it's a relative path and try to resolve it using API_BASE_URL
  try {
    const baseUrl = new URL(API_BASE_URL);
    // If inputUrl starts with '/', new URL(inputUrl, baseUrl) will resolve it as root-relative to baseUrl.
    // Otherwise, it resolves relative to baseUrl's path.
    return new URL(inputUrl, baseUrl).toString();
  } catch (e) {
    console.error("Error constructing image URL for path:", inputUrl, "with base:", API_BASE_URL, e);
    // Fallback for malformed API_BASE_URL or inputUrl.
    // Simple concatenation, ensuring no double slashes
    const base = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
    const path = inputUrl.startsWith('/') ? inputUrl : `/${inputUrl}`;
    return `${base}${path}`;
  }
};
import { useState, useEffect } from 'react';
import NProgress from 'nprogress';
import { toast } from 'sonner';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination as SwiperPagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/plugins/captions.css";

// Helper to get YouTube embed URL
const getYouTubeEmbedUrl = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}`;
  }
  return null;
};

interface ProductDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productId: string | null;
}

export default function ProductDetailModal({ open, onOpenChange, productId }: ProductDetailModalProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    if (!open) {
      // Reset state when the modal is closed to ensure a clean slate on next open
      setProduct(null);
      setLightboxOpen(false);
      setLightboxIndex(0);
    }
  }, [open]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      // Only fetch if the modal is open and there is a product ID
      if (open && productId) {
        NProgress.start();
        setLoading(true);
        setError(null);
        try {
          let response;

          // Try public endpoint first
          try {
            response = await fetch(`${API_BASE_URL}/api/public/products/${productId}` , {
              headers: {
                'Accept': 'application/json',
              },
              credentials: 'include',
            });

            if (!response.ok && response.status === 404) {
              throw new Error('Public endpoint not found');
            }
          } catch (publicError) {
            console.log('Public endpoint failed, trying admin endpoint...');

            // Fallback to admin endpoint with authentication
            const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
            response = await fetch(`${API_BASE_URL}/api/admin/products/${productId}`, {
              headers: {
                'Accept': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
              },
              credentials: 'include',
            });
          }

          if (!response.ok) {
            if (response.status === 401) {
              throw new Error('Unauthorized. Please login again.');
            }
            throw new Error('Failed to fetch product details');
          }
          const data = await response.json();
          setProduct(data.data);
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An unknown error occurred');
          toast.error(err instanceof Error ? err.message : 'An unknown error occurred');
          setProduct(null);
        } finally {
          setLoading(false);
          NProgress.done();
        }
      }
    };

    fetchProductDetails();
  }, [productId, open]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content style={{ maxWidth: 1200, padding: '0' }}>
        <Flex justify="between" align="center" p="4" pb="2" style={{ borderBottom: '1px solid var(--gray-a3)' }}>
          <Dialog.Title className="text-2xl font-bold">
            {loading ? 'Loading Product' : error ? 'Error' : product ? product.name : 'Product Details'}
          </Dialog.Title>
          <Button variant="ghost" color="gray" onClick={() => onOpenChange(false)}>
            <X size={20} />
          </Button>
        </Flex>

        {product && (
          <Flex direction="column">

            {/* Main Content Area */}
            <Box p="4">
              {loading ? (
                <Text>Loading product details...</Text>
              ) : error ? (
                <Text color="red">Error: {error}</Text>
              ) : (
                <Grid columns={{ initial: '1', md: '3' }} gap="5">
                  {/* Left Column: Images (2/3 width on medium screens) */}
                  <Box className="md:col-span-2">
                    <Card className="p-3 mb-4"> {/* Card for image gallery */}
                      {product.images && product.images.length > 0 ? (
                        <Swiper
                          spaceBetween={10}
                          slidesPerView={1}
                          navigation={true}
                          pagination={{ clickable: true }}
                          autoplay={{
                            delay: 2500,
                            disableOnInteraction: false,
                          }}
                          modules={[SwiperPagination, Navigation, Autoplay]}
                          className="mySwiper"
                        >
                          {product.images.map((img, index) => (
                            <SwiperSlide key={index}>
                              <Image
                                onClick={() => {
                                  setLightboxIndex(index);
                                  setLightboxOpen(true);
                                }}
                                style={{ cursor: 'pointer' }}
                                src={getAbsoluteImageUrl(img)}
                                alt={`${product.name} image ${index + 1}`}
                                width={800} // Larger width for hero image
                                height={600} // Larger height for hero image
                                className="rounded object-contain w-full h-auto max-h-[600px]"
                              />
                            </SwiperSlide>
                          ))}
                        </Swiper>
                      ) : (
                        <Box className="w-full h-[400px] bg-slate-200 dark:bg-neutral-700 rounded flex items-center justify-center">
                          <Text color="gray" size="4">No Image Available</Text>
                        </Box>
                      )}
                    </Card>

                    {/* Description Section */}
                    {product.description && (
                      <Card className="p-4 mb-4"> {/* Added mb-4 for spacing */}
                        <Flex align="center" gap="2" mb="3">
                          <Info size={20} className="text-blue-500" />
                          <Text size="4" weight="bold">Description</Text>
                        </Flex>
                        <Text size="2" dangerouslySetInnerHTML={{ __html: product.description }} />
                      </Card>
                    )}

                    {/* Videos Section */}
                    {product.videos && product.videos.length > 0 && (
                      <Card className="p-4">
                        <Flex align="center" gap="2" mb="3">
                          <Text size="4" weight="bold">Videos</Text>
                        </Flex>
                        <Grid columns={{ initial: '1', sm: '2' }} gap="3">
                          {product.videos.map((videoUrl, index) => {
                            const embedUrl = getYouTubeEmbedUrl(videoUrl);
                            return embedUrl ? (
                              <Box key={index} className="relative aspect-video">
                                <iframe
                                  src={embedUrl}
                                  frameBorder="0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                  className="absolute top-0 left-0 w-full h-full rounded"
                                ></iframe>
                              </Box>
                            ) : null;
                          })}
                        </Grid>
                      </Card>
                    )}
                  </Box>

                  {/* Right Column: Product Information (1/3 width on medium screens) */}
                  <Box className="space-y-4">
                    {/* Basic Info */}
                    <Card className="p-4 space-y-3">
                      <Flex align="center" gap="2" mb="3">
                        <Tag size={20} className="text-purple-500" />
                        <Text size="4" weight="bold">Product Details</Text>
                      </Flex>
                      <Flex direction="column" gap="2">
                        <Text size="2" color="gray">Brand: <Text weight="medium">{product.brand}</Text></Text>
                        <Text size="2" color="gray">Category: <Text weight="medium">{product.category}</Text></Text>
                        {product.part_number && <Text size="2" color="gray">Part No.: <Text weight="medium">{product.part_number}</Text></Text>}
                        {product.condition && <Text size="2" color="gray">Condition: <Text weight="medium">{product.condition}</Text></Text>}
                      </Flex>
                    </Card>

                    {/* Pricing & Stock */}
                    <Card className="p-4 space-y-3">
                      <Flex align="center" gap="2" mb="3">
                        <DollarSign size={20} className="text-green-500" />
                        <Text size="4" weight="bold">Pricing & Stock</Text>
                      </Flex>
                      <Grid columns="2" gap="2">
                        <Flex direction="column">
                          <Text size="2" color="gray">Price:</Text>
                          <Text size="4" weight="bold">{product.formatted_price}</Text>
                        </Flex>
                        {product.original_price && product.original_price > product.price && (
                          <Flex direction="column">
                            <Text size="2" color="gray">Original Price:</Text>
                            <Text size="2" className="line-through">{product.original_price}</Text>
                          </Flex>
                        )}
                        <Flex direction="column">
                          <Text size="2" color="gray">Quantity:</Text>
                          <Text size="3" weight="medium">{product.quantity}</Text>
                        </Flex>
                        <Flex direction="column">
                          <Text size="2" color="gray">Stock Status:</Text>
                          <Badge
                            color={product.stock_status === 'in_stock' ? 'green' : product.stock_status === 'low_stock' ? 'amber' : 'red'}
                            variant="soft"
                          >
                            <Flex align="center" gap="1">
                              <Scale size={14} />
                              {product.stock_status.replace('_', ' ')}
                            </Flex>
                          </Badge>
                        </Flex>
                      </Grid>
                    </Card>

                    {/* Status */}
                    <Card className="p-4 space-y-3">
                      <Flex align="center" gap="2" mb="3">
                        {product.is_active ? <CheckCircle size={20} className="text-green-500" /> : <XCircle size={20} className="text-red-500" />}
                        <Text size="4" weight="bold">Availability</Text>
                      </Flex>
                      <Badge color={product.is_active ? 'green' : 'gray'} variant="soft">
                        {product.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </Card>
                  </Box>
                </Grid>
              )}
            </Box>
          </Flex>
        )}

        {!product && !loading && !error && (
          <Box p="4">
            <Text>No product selected.</Text>
          </Box>
        )}

        {/* Footer with Close Button */}
        <Flex gap="3" mt="4" p="4" justify="end" style={{ borderTop: '1px solid var(--gray-a3)' }}>
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Close
            </Button>
          </Dialog.Close>
        </Flex>

        {product && (
          <Lightbox
            open={isLightboxOpen}
            close={() => setLightboxOpen(false)}
            slides={product.images.map(src => ({ src: getAbsoluteImageUrl(src) }))}
            index={lightboxIndex}
            on={{ view: ({ index: currentIndex }) => setLightboxIndex(currentIndex) }}
            plugins={[Zoom]}
            carousel={{ finite: product.images.length <= 1 }}
            controller={{ closeOnBackdropClick: false }}
            render={{
              buttonPrev: product.images.length <= 1 ? () => null : undefined,
              buttonNext: product.images.length <= 1 ? () => null : undefined,
            }}
          />
        )}
      </Dialog.Content>
    </Dialog.Root>
  );
}