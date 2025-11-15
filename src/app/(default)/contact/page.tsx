"use client";

import { useEffect, useState } from "react";
import { Box, Button, Card, Flex, Grid, Text, TextField, TextArea } from "@radix-ui/themes";
import { PageHeading } from "@/components/common/PageHeading";
import { API_BASE_URL } from "@/utilities/constants";
import NProgress from "nprogress";
import { toast } from "sonner";
import { RefreshCcw, Save } from "lucide-react";

interface ContactItem {
  id: number;
  address?: string | null;
  phone?: string | null;
  whatsApp?: string | null;
  email?: string | null;
  business_hour?: string | null;
  created_at?: string;
  updated_at?: string;
}

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [item, setItem] = useState<ContactItem | null>(null);

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsApp, setWhatsApp] = useState("");
  const [email, setEmail] = useState("");
  const [businessHour, setBusinessHour] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      NProgress.start();
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const res = await fetch(`${API_BASE_URL}/api/admin/contacts`, {
        credentials: 'include',
        headers: {
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          'Accept': 'application/json',
        },
        cache: 'no-store',
      });
      let json: any = null;
      try { json = await res.json(); } catch {}
      if (!res.ok) {
        if (json?.message) throw new Error(json.message);
        const text = await res.text();
        throw new Error(text || 'Failed to load contacts');
      }
      const items: ContactItem[] = json?.data || [];
      const current = items[0] || null; // assume single contact record
      setItem(current);
      setAddress(current?.address || "");
      setPhone(current?.phone || "");
      setWhatsApp(current?.whatsApp || "");
      setEmail(current?.email || "");
      setBusinessHour(current?.business_hour || "");
    } catch (e: any) {
      toast.error(e.message || 'Failed to load contact');
    } finally {
      setLoading(false);
      NProgress.done();
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      NProgress.start();

      const payload = {
        address: address.trim(),
        phone: phone.trim(),
        whatsApp: whatsApp.trim(),
        email: email.trim(),
        business_hour: businessHour.trim(),
      };

      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const url = item?.id
        ? `${API_BASE_URL}/api/admin/contacts/${item.id}`
        : `${API_BASE_URL}/api/admin/contacts`;
      const method = item?.id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
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
            toast.error(text || 'Failed to save contact');
          }
        }
        return;
      }
      toast.success((json && json.message) || (item?.id ? 'Contact updated successfully' : 'Contact created successfully'));
      await loadData();
    } catch (e: any) {
      toast.error(e.message || 'Save failed');
    } finally {
      setSaving(false);
      NProgress.done();
    }
  };

  return (
    <Box>
      <PageHeading title="Contact" description="Manage contact information" />
      <Grid columns={{ initial: '1', lg: '2' }} gap="6">
        <Box className="lg:col-span-2">
          <Card size="3">
            <Flex direction="column" gap="4">
              <Grid columns={{ initial: '1', md: '2' }} gap="4">
                <Box>
                  <Text size="2" mb="1" weight="medium" as="label">Phone</Text>
                  <TextField.Root
                    placeholder="Phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}

                  />
                </Box>

                <Box>
                  <Text size="2" mb="1" weight="medium" as="label">WhatsApp</Text>
                  <TextField.Root
                    placeholder="WhatsApp number"
                    value={whatsApp}
                    onChange={(e) => setWhatsApp(e.target.value)}

                  />
                </Box>

                <Box>
                  <Text size="2" mb="1" weight="medium" as="label">Email</Text>
                  <TextField.Root
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}

                  />
                </Box>

                <Box>
                  <Text size="2" mb="1" weight="medium" as="label">Business Hours</Text>
                  <TextField.Root
                    placeholder="Mon-Fri 9:00 - 17:00"
                    value={businessHour}
                    onChange={(e) => setBusinessHour(e.target.value)}

                  />
                </Box>

                <Box className="md:col-span-2">
                  <Text size="2" mb="1" weight="medium" as="label">Address</Text>
                  <TextArea
                    placeholder="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={3}

                  />
                </Box>
              </Grid>

              <Flex justify="end" mt="4" gap="3">
                <Button color="green" onClick={handleSave} disabled={saving}>
                  {saving ? <RefreshCcw className="animate-spin" size={16} /> : <Save size={16} />}
                  {saving ? ' Saving...' : ' Save'}
                </Button>
              </Flex>
            </Flex>
          </Card>
        </Box>
      </Grid>
    </Box>
  );
}
