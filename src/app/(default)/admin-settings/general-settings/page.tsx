"use client";

import { useState, useEffect } from "react";
import { Box, Button, Card, Flex, Text, TextField, TextArea, Grid, Tabs } from "@radix-ui/themes";
import { PageHeading } from "@/components/common/PageHeading";
import { API_BASE_URL } from "@/utilities/constants";
import NProgress from "nprogress";
import { toast } from "sonner";
import { Save, Loader2, Clock3, Settings, Globe, Mail, Phone } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";

interface Setting {
  id: number;
  key: string;
  value: string;
  type?: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export default function GeneralSettingsPage() {
  usePageTitle('General Settings');
  
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [activeTab, setActiveTab] = useState('general');
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);

  // Form state for different setting categories
  const [generalSettings, setGeneralSettings] = useState({
    site_name: '',
    site_description: '',
    site_url: '',
    admin_email: '',
    contact_email: '',
    contact_phone: '',
    address: '',
    timezone: '',
    date_format: '',
    time_format: '',
  });

  const [emailSettings, setEmailSettings] = useState({
    smtp_host: '',
    smtp_port: '',
    smtp_username: '',
    smtp_password: '',
    smtp_encryption: '',
    mail_from_address: '',
    mail_from_name: '',
  });

  const [systemSettings, setSystemSettings] = useState({
    maintenance_mode: 'false',
    registration_enabled: 'true',
    max_upload_size: '',
    session_timeout: '',
    cache_enabled: 'true',
    debug_mode: 'false',
  });

  const fetchSettings = async () => {
    setFetching(true);
    NProgress.start();
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      const res = await fetch(`${API_BASE_URL}/api/admin/settings`, {
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
      const settingsData = json?.data || [];
      setSettings(settingsData);
      
      // Map settings to form state
      mapSettingsToForm(settingsData);
    } catch (e: any) {
      toast.error(e.message || 'Failed to load settings');
    } finally {
      setFetching(false);
      NProgress.done();
    }
  };

  const mapSettingsToForm = (settingsData: Setting[]) => {
    const settingsMap = settingsData.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, string>);

    // Map to general settings
    setGeneralSettings({
      site_name: settingsMap.site_name || '',
      site_description: settingsMap.site_description || '',
      site_url: settingsMap.site_url || '',
      admin_email: settingsMap.admin_email || '',
      contact_email: settingsMap.contact_email || '',
      contact_phone: settingsMap.contact_phone || '',
      address: settingsMap.address || '',
      timezone: settingsMap.timezone || '',
      date_format: settingsMap.date_format || '',
      time_format: settingsMap.time_format || '',
    });

    // Map to email settings
    setEmailSettings({
      smtp_host: settingsMap.smtp_host || '',
      smtp_port: settingsMap.smtp_port || '',
      smtp_username: settingsMap.smtp_username || '',
      smtp_password: settingsMap.smtp_password || '',
      smtp_encryption: settingsMap.smtp_encryption || '',
      mail_from_address: settingsMap.mail_from_address || '',
      mail_from_name: settingsMap.mail_from_name || '',
    });

    // Map to system settings
    setSystemSettings({
      maintenance_mode: settingsMap.maintenance_mode || 'false',
      registration_enabled: settingsMap.registration_enabled || 'true',
      max_upload_size: settingsMap.max_upload_size || '',
      session_timeout: settingsMap.session_timeout || '',
      cache_enabled: settingsMap.cache_enabled || 'true',
      debug_mode: settingsMap.debug_mode || 'false',
    });
  };

  const handleSaveSettings = async (settingsToSave: Record<string, string>) => {
    setLoading(true);
    NProgress.start();
    
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
      
      // Save each setting individually or in batch
      const promises = Object.entries(settingsToSave).map(async ([key, value]) => {
        const existingSetting = settings.find(s => s.key === key);
        const url = existingSetting 
          ? `${API_BASE_URL}/api/admin/settings/${existingSetting.id}`
          : `${API_BASE_URL}/api/admin/settings`;
        const method = existingSetting ? 'PUT' : 'POST';

        return fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
          },
          credentials: 'include',
          body: JSON.stringify({ key, value }),
        });
      });

      const responses = await Promise.all(promises);
      const failedResponses = responses.filter(res => !res.ok);
      
      if (failedResponses.length > 0) {
        throw new Error('Some settings failed to save');
      }

      toast.success('Settings saved successfully');
      setLastSavedAt(new Date());
      await fetchSettings(); // Refresh settings
    } catch (err: any) {
      toast.error(err?.message || 'Failed to save settings');
    } finally {
      setLoading(false);
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
    if (min < 60) return `${min} min${min > 1 ? 's' : ''} ago`;
    if (hr < 24) return `${hr} hour${hr > 1 ? 's' : ''} ago`;
    return `${day} day${day > 1 ? 's' : ''} ago`;
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  if (fetching) {
    return (
      <Box className="w-full">
        <PageHeading title="General Settings" description="Configure system-wide settings" />
        <Card size="3" className="p-8 text-center">
          <Loader2 className="animate-spin mx-auto mb-4" size={32} />
          <Text>Loading settings...</Text>
        </Card>
      </Box>
    );
  }

  return (
    <Box className="w-full">
      <PageHeading title="General Settings" description="Configure system-wide settings" />
      
      <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
        <Tabs.List>
          <Tabs.Trigger value="general">
            <Globe size={16} />
            General
          </Tabs.Trigger>
          <Tabs.Trigger value="email">
            <Mail size={16} />
            Email
          </Tabs.Trigger>
          <Tabs.Trigger value="system">
            <Settings size={16} />
            System
          </Tabs.Trigger>
        </Tabs.List>

        <Box mt="4">
          <Tabs.Content value="general">
            <Card size="3">
              <form onSubmit={(e) => { e.preventDefault(); handleSaveSettings(generalSettings); }}>
                <Grid columns={{ initial: '1', sm: '2' }} gap="4">
                  <Flex direction="column" gap="1">
                    <Text as="label" size="2" weight="medium">Site Name</Text>
                    <TextField.Root 
                      value={generalSettings.site_name} 
                      onChange={(e) => setGeneralSettings(prev => ({ ...prev, site_name: e.target.value }))} 
                    />
                  </Flex>
                  
                  <Flex direction="column" gap="1">
                    <Text as="label" size="2" weight="medium">Site URL</Text>
                    <TextField.Root 
                      value={generalSettings.site_url} 
                      onChange={(e) => setGeneralSettings(prev => ({ ...prev, site_url: e.target.value }))} 
                    />
                  </Flex>

                  <Flex direction="column" gap="1" className="sm:col-span-2">
                    <Text as="label" size="2" weight="medium">Site Description</Text>
                    <TextArea 
                      value={generalSettings.site_description} 
                      onChange={(e) => setGeneralSettings(prev => ({ ...prev, site_description: e.target.value }))} 
                      rows={3}
                    />
                  </Flex>

                  <Flex direction="column" gap="1">
                    <Text as="label" size="2" weight="medium">Admin Email</Text>
                    <TextField.Root 
                      type="email"
                      value={generalSettings.admin_email} 
                      onChange={(e) => setGeneralSettings(prev => ({ ...prev, admin_email: e.target.value }))} 
                    />
                  </Flex>

                  <Flex direction="column" gap="1">
                    <Text as="label" size="2" weight="medium">Contact Email</Text>
                    <TextField.Root 
                      type="email"
                      value={generalSettings.contact_email} 
                      onChange={(e) => setGeneralSettings(prev => ({ ...prev, contact_email: e.target.value }))} 
                    />
                  </Flex>

                  <Flex direction="column" gap="1">
                    <Text as="label" size="2" weight="medium">Contact Phone</Text>
                    <TextField.Root 
                      value={generalSettings.contact_phone} 
                      onChange={(e) => setGeneralSettings(prev => ({ ...prev, contact_phone: e.target.value }))} 
                    />
                  </Flex>

                  <Flex direction="column" gap="1">
                    <Text as="label" size="2" weight="medium">Timezone</Text>
                    <TextField.Root 
                      value={generalSettings.timezone} 
                      onChange={(e) => setGeneralSettings(prev => ({ ...prev, timezone: e.target.value }))} 
                      placeholder="UTC"
                    />
                  </Flex>

                  <Flex direction="column" gap="1" className="sm:col-span-2">
                    <Text as="label" size="2" weight="medium">Address</Text>
                    <TextArea 
                      value={generalSettings.address} 
                      onChange={(e) => setGeneralSettings(prev => ({ ...prev, address: e.target.value }))} 
                      rows={3}
                    />
                  </Flex>
                </Grid>

                <Flex justify="between" mt="6" align="center">
                  <Flex gap="2" align="center">
                    {lastSavedAt && (
                      <Text size="2" color="gray" title={lastSavedAt.toLocaleString()} className="flex items-center gap-1">
                        <Clock3 size={14} /> Last saved {formatRelativeTime(lastSavedAt)}
                      </Text>
                    )}
                  </Flex>
                  <Button color="green" type="submit" disabled={loading}>
                    {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                    {loading ? ' Saving...' : ' Save General Settings'}
                  </Button>
                </Flex>
              </form>
            </Card>
          </Tabs.Content>

          <Tabs.Content value="email">
            <Card size="3">
              <form onSubmit={(e) => { e.preventDefault(); handleSaveSettings(emailSettings); }}>
                <Grid columns={{ initial: '1', sm: '2' }} gap="4">
                  <Flex direction="column" gap="1">
                    <Text as="label" size="2" weight="medium">SMTP Host</Text>
                    <TextField.Root
                      value={emailSettings.smtp_host}
                      onChange={(e) => setEmailSettings(prev => ({ ...prev, smtp_host: e.target.value }))}
                      placeholder="smtp.gmail.com"
                    />
                  </Flex>

                  <Flex direction="column" gap="1">
                    <Text as="label" size="2" weight="medium">SMTP Port</Text>
                    <TextField.Root
                      value={emailSettings.smtp_port}
                      onChange={(e) => setEmailSettings(prev => ({ ...prev, smtp_port: e.target.value }))}
                      placeholder="587"
                    />
                  </Flex>

                  <Flex direction="column" gap="1">
                    <Text as="label" size="2" weight="medium">SMTP Username</Text>
                    <TextField.Root
                      value={emailSettings.smtp_username}
                      onChange={(e) => setEmailSettings(prev => ({ ...prev, smtp_username: e.target.value }))}
                    />
                  </Flex>

                  <Flex direction="column" gap="1">
                    <Text as="label" size="2" weight="medium">SMTP Password</Text>
                    <TextField.Root
                      type="password"
                      value={emailSettings.smtp_password}
                      onChange={(e) => setEmailSettings(prev => ({ ...prev, smtp_password: e.target.value }))}
                    />
                  </Flex>

                  <Flex direction="column" gap="1">
                    <Text as="label" size="2" weight="medium">SMTP Encryption</Text>
                    <TextField.Root
                      value={emailSettings.smtp_encryption}
                      onChange={(e) => setEmailSettings(prev => ({ ...prev, smtp_encryption: e.target.value }))}
                      placeholder="tls"
                    />
                  </Flex>

                  <Flex direction="column" gap="1">
                    <Text as="label" size="2" weight="medium">Mail From Address</Text>
                    <TextField.Root
                      type="email"
                      value={emailSettings.mail_from_address}
                      onChange={(e) => setEmailSettings(prev => ({ ...prev, mail_from_address: e.target.value }))}
                    />
                  </Flex>

                  <Flex direction="column" gap="1" className="sm:col-span-2">
                    <Text as="label" size="2" weight="medium">Mail From Name</Text>
                    <TextField.Root
                      value={emailSettings.mail_from_name}
                      onChange={(e) => setEmailSettings(prev => ({ ...prev, mail_from_name: e.target.value }))}
                    />
                  </Flex>
                </Grid>

                <Flex justify="between" mt="6" align="center">
                  <Flex gap="2" align="center">
                    {lastSavedAt && (
                      <Text size="2" color="gray" title={lastSavedAt.toLocaleString()} className="flex items-center gap-1">
                        <Clock3 size={14} /> Last saved {formatRelativeTime(lastSavedAt)}
                      </Text>
                    )}
                  </Flex>
                  <Button color="green" type="submit" disabled={loading}>
                    {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                    {loading ? ' Saving...' : ' Save Email Settings'}
                  </Button>
                </Flex>
              </form>
            </Card>
          </Tabs.Content>

          <Tabs.Content value="system">
            <Card size="3">
              <form onSubmit={(e) => { e.preventDefault(); handleSaveSettings(systemSettings); }}>
                <Grid columns={{ initial: '1', sm: '2' }} gap="4">
                  <Flex direction="column" gap="1">
                    <Text as="label" size="2" weight="medium">Maintenance Mode</Text>
                    <select
                      value={systemSettings.maintenance_mode}
                      onChange={(e) => setSystemSettings(prev => ({ ...prev, maintenance_mode: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="false">Disabled</option>
                      <option value="true">Enabled</option>
                    </select>
                  </Flex>

                  <Flex direction="column" gap="1">
                    <Text as="label" size="2" weight="medium">Registration Enabled</Text>
                    <select
                      value={systemSettings.registration_enabled}
                      onChange={(e) => setSystemSettings(prev => ({ ...prev, registration_enabled: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="true">Enabled</option>
                      <option value="false">Disabled</option>
                    </select>
                  </Flex>

                  <Flex direction="column" gap="1">
                    <Text as="label" size="2" weight="medium">Max Upload Size (MB)</Text>
                    <TextField.Root
                      type="number"
                      value={systemSettings.max_upload_size}
                      onChange={(e) => setSystemSettings(prev => ({ ...prev, max_upload_size: e.target.value }))}
                      placeholder="10"
                    />
                  </Flex>

                  <Flex direction="column" gap="1">
                    <Text as="label" size="2" weight="medium">Session Timeout (minutes)</Text>
                    <TextField.Root
                      type="number"
                      value={systemSettings.session_timeout}
                      onChange={(e) => setSystemSettings(prev => ({ ...prev, session_timeout: e.target.value }))}
                      placeholder="120"
                    />
                  </Flex>

                  <Flex direction="column" gap="1">
                    <Text as="label" size="2" weight="medium">Cache Enabled</Text>
                    <select
                      value={systemSettings.cache_enabled}
                      onChange={(e) => setSystemSettings(prev => ({ ...prev, cache_enabled: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="true">Enabled</option>
                      <option value="false">Disabled</option>
                    </select>
                  </Flex>

                  <Flex direction="column" gap="1">
                    <Text as="label" size="2" weight="medium">Debug Mode</Text>
                    <select
                      value={systemSettings.debug_mode}
                      onChange={(e) => setSystemSettings(prev => ({ ...prev, debug_mode: e.target.value }))}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="false">Disabled</option>
                      <option value="true">Enabled</option>
                    </select>
                  </Flex>
                </Grid>

                <Flex justify="between" mt="6" align="center">
                  <Flex gap="2" align="center">
                    {lastSavedAt && (
                      <Text size="2" color="gray" title={lastSavedAt.toLocaleString()} className="flex items-center gap-1">
                        <Clock3 size={14} /> Last saved {formatRelativeTime(lastSavedAt)}
                      </Text>
                    )}
                  </Flex>
                  <Button color="green" type="submit" disabled={loading}>
                    {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                    {loading ? ' Saving...' : ' Save System Settings'}
                  </Button>
                </Flex>
              </form>
            </Card>
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </Box>
  );
}
