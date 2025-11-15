"use client";
import { Box, Button, Flex, Grid, Text, Card, TextField, TextArea } from "@radix-ui/themes";
import { Save, Loader2, Clock3 } from "lucide-react";
import NProgress from 'nprogress';
import { toast } from 'sonner';
import { API_BASE_URL } from '@/utilities/constants';
import { useEffect, useState } from "react";
import { PageHeading } from "@/components/common/PageHeading";

export default function HomeSettingsPage() {
  const mockData = {
    address: "123 Example St, City, Country",
    email: "info@example.com",
    phone: "+1 555-1234",
    logo: "https://example.com/logo.png",
    site_title: "My Awesome Site",
    site_description: "Best site for awesome things.",
    welcome_logo: "https://example.com/welcome.png",
    welcome_title: "Welcome to Our Store",
    welcome_description: "Find the best deals and latest products here!",
    why_choose_logo: "https://example.com/why-choose.png",
    why_choose_title: "Why Choose Us",
    why_choose_item_1_title: "Quality Products",
    why_choose_item_1_description: "We offer only the best quality.",
    why_choose_item_2_title: "Fast Shipping",
    why_choose_item_2_description: "Get your orders quickly.",
    why_choose_item_3_title: "Great Support",
    why_choose_item_3_description: "We are here to help 24/7.",
    why_choose_item_4_title: "Secure Payments",
    why_choose_item_4_description: "Your data and payments are safe with us.",
  };

  const [form, setForm] = useState(mockData);
  const [loading, setLoading] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [isInitialFetch, setIsInitialFetch] = useState(true);

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const mapToApi = (f: typeof form) => ({
    address: f.address,
    email: f.email,
    phone: f.phone,
    logo: f.logo,
    title: f.site_title,
    description: f.site_description,
    welcome_logo: f.welcome_logo,
    title_welcome: f.welcome_title,
    description_welcome: f.welcome_description,
    why_choose_logo: f.why_choose_logo,
    why_choose_title: f.why_choose_title,
    why_choose_title1: f.why_choose_item_1_title,
    why_choose_description1: f.why_choose_item_1_description,
    why_choose_title2: f.why_choose_item_2_title,
    why_choose_description2: f.why_choose_item_2_description,
    why_choose_title3: f.why_choose_item_3_title,
    why_choose_description3: f.why_choose_item_3_description,
    why_choose_title4: f.why_choose_item_4_title,
    why_choose_description4: f.why_choose_item_4_description,
  });

  const mapFromApi = (d: any) => ({
    address: d.address || '',
    email: d.email || '',
    phone: d.phone || '',
    logo: d.logo || '',
    site_title: d.title || '',
    site_description: d.description || '',
    welcome_logo: d.welcome_logo || '',
    welcome_title: d.title_welcome || '',
    welcome_description: d.description_welcome || '',
    why_choose_logo: d.why_choose_logo || '',
    why_choose_title: d.why_choose_title || '',
    why_choose_item_1_title: d.why_choose_title1 || '',
    why_choose_item_1_description: d.why_choose_description1 || '',
    why_choose_item_2_title: d.why_choose_title2 || '',
    why_choose_item_2_description: d.why_choose_description2 || '',
    why_choose_item_3_title: d.why_choose_title3 || '',
    why_choose_item_3_description: d.why_choose_description3 || '',
    why_choose_item_4_title: d.why_choose_title4 || '',
    why_choose_item_4_description: d.why_choose_description4 || '',
  });

  const fetchExisting = async () => {
    try {
      NProgress.start();
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const res = await fetch(`${API_BASE_URL}/api/admin/settings`, {
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          'Accept': 'application/json',
        },
        credentials: 'include',
      });
      const json = await res.json();
      if (res.ok && json?.data) {
        const items = Array.isArray(json.data) ? json.data : [];
        if (items.length > 0) {
          const item = items[0];
          setCurrentId(String(item.id));
          setForm(mapFromApi(item));
          if (isInitialFetch) {
            setIsInitialFetch(false);
          }
        }
      }
    } catch (e) {
      console.error(e);
      // non-blocking
    } finally {
      NProgress.done();
    }
  };

  const formatRelativeTime = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const sec = Math.floor(diff / 1000);
    const min = Math.floor(sec / 60);
    const hr = Math.floor(min / 60);
    const day = Math.floor(hr / 24);
    if (sec < 60) return 'just now';
    if (min < 60) return `${min} min${min>1?'s':''} ago`;
    if (hr < 24) return `${hr} hour${hr>1?'s':''} ago`;
    return `${day} day${day>1?'s':''} ago`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    NProgress.start();
    try {
      const payload = mapToApi(form);
      const url = currentId ? `${API_BASE_URL}/api/admin/settings/${currentId}` : `${API_BASE_URL}/api/admin/settings`;
      const method = currentId ? 'PUT' : 'POST';
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
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
          setErrors(json.errors as Record<string, string[]>);
          const messages = Object.values(json.errors).flat().join('\n');
          toast.error(messages);
        } else {
          toast.error(json?.message || 'Failed to save settings');
        }
        return;
      }
      setErrors({});
      toast.success(json?.message || 'Settings saved successfully');
      const saved = json?.data;
      if (saved?.id) {
        setCurrentId(String(saved.id));
      }
      setLastSavedAt(new Date());
      // Re-fetch latest from DB
      await fetchExisting();
    } catch (err:any) {
      toast.error(err?.message || 'Network error');
    } finally {
      setLoading(false);
      NProgress.done();
    }
  };

  useEffect(() => {
    fetchExisting();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box className="w-full">
      <PageHeading title="Home Settings" description="Configure your public website content" />
      <form className="space-y-6" onSubmit={handleSubmit}>
        <Grid columns={{ initial: '1', md: '4' }} gap="0" className="w-full">
          <Box className="md:col-span-4 w-full">
            <Card size="3" className="space-y-4 !overflow-visible w-full" style={{ contain: 'none !important' }}>
              {/* General */}
              <Box>
                <Text as="div" size="3" weight="bold" mb="3">General</Text>
                <Grid columns={{ initial: '1', sm: '2' }} gap="4">
                  <Flex direction="column" gap="1" className="sm:col-span-2">
                    <Text as="label" size="2" weight="medium">Address</Text>
                    <TextArea value={form.address} onChange={(e) => handleChange('address', e.target.value)} rows={3} />
                    {errors.address && errors.address.map((m,i)=>(<Text key={i} size="1" color="red">{m}</Text>))}
                  </Flex>
                  <Flex direction="column" gap="1">
                    <Text as="label" size="2" weight="medium">Email</Text>
                    <TextField.Root type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} />
                    {errors.email && errors.email.map((m,i)=>(<Text key={i} size="1" color="red">{m}</Text>))}
                  </Flex>
                  <Flex direction="column" gap="1">
                    <Text as="label" size="2" weight="medium">Phone</Text>
                    <TextField.Root value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} />
                    {errors.phone && errors.phone.map((m,i)=>(<Text key={i} size="1" color="red">{m}</Text>))}
                  </Flex>
                  <Flex direction="column" gap="1">
                    <Text as="label" size="2" weight="medium">Logo URL</Text>
                    <TextField.Root value={form.logo} onChange={(e) => handleChange('logo', e.target.value)} />
                    {errors.logo && errors.logo.map((m,i)=>(<Text key={i} size="1" color="red">{m}</Text>))}
                  </Flex>
                  <Flex direction="column" gap="1">
                    <Text as="label" size="2" weight="medium">Site Title</Text>
                    <TextField.Root value={form.site_title} onChange={(e) => handleChange('site_title', e.target.value)} />
                    {errors.title && errors.title.map((m,i)=>(<Text key={i} size="1" color="red">{m}</Text>))}
                  </Flex>
                  <Flex direction="column" gap="1" className="sm:col-span-2">
                    <Text as="label" size="2" weight="medium">Site Description</Text>
                    <TextArea value={form.site_description} onChange={(e) => handleChange('site_description', e.target.value)} rows={3} />
                    {errors.description && errors.description.map((m,i)=>(<Text key={i} size="1" color="red">{m}</Text>))}
                  </Flex>
                </Grid>
              </Box>

              {/* Welcome Section */}
              <Box>
                <Text as="div" size="3" weight="bold" mb="3">Welcome Section</Text>
                <Grid columns={{ initial: '1', sm: '2' }} gap="4">
                  <Flex direction="column" gap="1">
                    <Text as="label" size="2" weight="medium">Welcome Logo URL</Text>
                    <TextField.Root value={form.welcome_logo} onChange={(e) => handleChange('welcome_logo', e.target.value)} />
                    {errors.welcome_logo && errors.welcome_logo.map((m,i)=>(<Text key={i} size="1" color="red">{m}</Text>))}
                  </Flex>
                  <Flex direction="column" gap="1">
                    <Text as="label" size="2" weight="medium">Welcome Title</Text>
                    <TextField.Root value={form.welcome_title} onChange={(e) => handleChange('welcome_title', e.target.value)} />
                    {errors.title_welcome && errors.title_welcome.map((m,i)=>(<Text key={i} size="1" color="red">{m}</Text>))}
                  </Flex>
                  <Flex direction="column" gap="1" className="sm:col-span-2">
                    <Text as="label" size="2" weight="medium">Welcome Description</Text>
                    <TextArea value={form.welcome_description} onChange={(e) => handleChange('welcome_description', e.target.value)} rows={3} />
                    {errors.description_welcome && errors.description_welcome.map((m,i)=>(<Text key={i} size="1" color="red">{m}</Text>))}
                  </Flex>
                </Grid>
              </Box>

              {/* Why Choose Us */}
              <Box>
                <Text as="div" size="3" weight="bold" mb="3">Why Choose Us</Text>
                <Grid columns={{ initial: '1', sm: '2' }} gap="4">
                  <Flex direction="column" gap="1">
                    <Text as="label" size="2" weight="medium">Why Choose Logo URL</Text>
                    <TextField.Root value={form.why_choose_logo} onChange={(e) => handleChange('why_choose_logo', e.target.value)} />
                    {errors.why_choose_logo && errors.why_choose_logo.map((m,i)=>(<Text key={i} size="1" color="red">{m}</Text>))}
                  </Flex>
                  <Flex direction="column" gap="1">
                    <Text as="label" size="2" weight="medium">Why Choose Title</Text>
                    <TextField.Root value={form.why_choose_title} onChange={(e) => handleChange('why_choose_title', e.target.value)} />
                    {errors.why_choose_title && errors.why_choose_title.map((m,i)=>(<Text key={i} size="1" color="red">{m}</Text>))}
                  </Flex>
                </Grid>
              </Box>

              {/* Why Choose Items */}
              <Box>
                <Text as="div" size="3" weight="bold" mb="3">Why Choose Items</Text>
                <Grid columns={{ initial: '1', sm: '2' }} gap="4">
                  <Flex direction="column" gap="1">
                    <Text as="label" size="2" weight="medium">Item 1 Title</Text>
                    <TextField.Root value={form.why_choose_item_1_title} onChange={(e) => handleChange('why_choose_item_1_title', e.target.value)} />
                    {errors.why_choose_title1 && errors.why_choose_title1.map((m,i)=>(<Text key={i} size="1" color="red">{m}</Text>))}
                  </Flex>
                  <Flex direction="column" gap="1" className="sm:col-span-2">
                    <Text as="label" size="2" weight="medium">Item 1 Description</Text>
                    <TextArea value={form.why_choose_item_1_description} onChange={(e) => handleChange('why_choose_item_1_description', e.target.value)} rows={3} />
                    {errors.why_choose_description1 && errors.why_choose_description1.map((m,i)=>(<Text key={i} size="1" color="red">{m}</Text>))}
                  </Flex>

                  <Flex direction="column" gap="1">
                    <Text as="label" size="2" weight="medium">Item 2 Title</Text>
                    <TextField.Root value={form.why_choose_item_2_title} onChange={(e) => handleChange('why_choose_item_2_title', e.target.value)} />
                    {errors.why_choose_title2 && errors.why_choose_title2.map((m,i)=>(<Text key={i} size="1" color="red">{m}</Text>))}
                  </Flex>
                  <Flex direction="column" gap="1" className="sm:col-span-2">
                    <Text as="label" size="2" weight="medium">Item 2 Description</Text>
                    <TextArea value={form.why_choose_item_2_description} onChange={(e) => handleChange('why_choose_item_2_description', e.target.value)} rows={3} />
                    {errors.why_choose_description2 && errors.why_choose_description2.map((m,i)=>(<Text key={i} size="1" color="red">{m}</Text>))}
                  </Flex>

                  <Flex direction="column" gap="1">
                    <Text as="label" size="2" weight="medium">Item 3 Title</Text>
                    <TextField.Root value={form.why_choose_item_3_title} onChange={(e) => handleChange('why_choose_item_3_title', e.target.value)} />
                    {errors.why_choose_title3 && errors.why_choose_title3.map((m,i)=>(<Text key={i} size="1" color="red">{m}</Text>))}
                  </Flex>
                  <Flex direction="column" gap="1" className="sm:col-span-2">
                    <Text as="label" size="2" weight="medium">Item 3 Description</Text>
                    <TextArea value={form.why_choose_item_3_description} onChange={(e) => handleChange('why_choose_item_3_description', e.target.value)} rows={3} />
                    {errors.why_choose_description3 && errors.why_choose_description3.map((m,i)=>(<Text key={i} size="1" color="red">{m}</Text>))}
                  </Flex>

                  <Flex direction="column" gap="1">
                    <Text as="label" size="2" weight="medium">Item 4 Title</Text>
                    <TextField.Root value={form.why_choose_item_4_title} onChange={(e) => handleChange('why_choose_item_4_title', e.target.value)} />
                    {errors.why_choose_title4 && errors.why_choose_title4.map((m,i)=>(<Text key={i} size="1" color="red">{m}</Text>))}
                  </Flex>
                  <Flex direction="column" gap="1" className="sm:col-span-2">
                    <Text as="label" size="2" weight="medium">Item 4 Description</Text>
                    <TextArea value={form.why_choose_item_4_description} onChange={(e) => handleChange('why_choose_item_4_description', e.target.value)} rows={3} />
                    {errors.why_choose_description4 && errors.why_choose_description4.map((m,i)=>(<Text key={i} size="1" color="red">{m}</Text>))}
                  </Flex>
                </Grid>
              </Box>
            </Card>
          </Box>


        </Grid>

        <Flex justify="between" mt="6" align="center">
          <Flex gap="2" align="center">
            {lastSavedAt && (
              <Text size="2" color="gray" title={lastSavedAt.toLocaleString()} className="flex items-center gap-1">
                <Clock3 size={14} /> Last saved {formatRelativeTime(lastSavedAt)}
              </Text>
            )}
          </Flex>
          <Flex gap="4">
            <Button color="green" type="submit" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
              {loading ? ' Saving...' : ' Save'}
            </Button>
          </Flex>
        </Flex>
      </form>
    </Box>
  );
}


