import { Box, Button, Card, Flex, Grid, Heading, IconButton, Text, Badge, TextField, Select, TextArea, RadioGroup, Checkbox, Separator, Inset } from '@radix-ui/themes';
import { ArrowLeft, Save, Upload, X, Image as ImageIcon, Trash, Trash2 } from 'lucide-react';
import { MenuItem, menuCategories, dietaryLabels } from '@/data/MenuData';
import { organization } from '@/data/CommonData';
import DateRangeInput  from '@/components/common/DateRangeInput';
import { useState, useRef } from 'react';
import { Range } from 'react-date-range';
import SearchableSelect from '@/components/common/SearchableSelect';
import { PageHeading } from '@/components/common/PageHeading';
import Image from 'next/image';

interface MenuFormProps {
  selectedItem: MenuItem | null;
  onBack: () => void;
  onSubmit: (formData: Partial<MenuItem>) => void;
}

export default function MenuForm({ selectedItem, onBack, onSubmit }: MenuFormProps) {
  const [formData, setFormData] = useState<Partial<MenuItem>>({
    name: selectedItem?.name || '',
    category: selectedItem?.category || '',
    price: selectedItem?.price || 0,
    description: selectedItem?.description || '',
    isSeasonal: selectedItem?.isSeasonal || false,
    seasonalStartDate: selectedItem?.seasonalStartDate,
    seasonalEndDate: selectedItem?.seasonalEndDate,
    dietaryLabels: selectedItem?.dietaryLabels || [],
    isActive: selectedItem?.isActive ?? true,
    availableBranchesIds: selectedItem?.availableBranchesIds || [],
    imageUrl: selectedItem?.imageUrl || ''
  });

  const [isSeasonalItem, setIsSeasonalItem] = useState(formData.isSeasonal);
  const [seasonalRange, setSeasonalRange] = useState<Range>({
    startDate: formData.seasonalStartDate ? new Date(formData.seasonalStartDate) : undefined,
    endDate: formData.seasonalEndDate ? new Date(formData.seasonalEndDate) : undefined,
    key: 'selection'
  });
  const totalBranches = organization.filter(o => o.id !== 'hq').length;
  const [availability, setAvailability] = useState(formData.availableBranchesIds?.length === totalBranches ? 'all' : formData.availableBranchesIds?.length > 0 ? 'selected' : 'all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleSeasonalChange = (checked: boolean) => {
    setIsSeasonalItem(checked);
    setFormData(prev => ({
      ...prev,
      isSeasonal: checked
    }));
  };

  const handleSeasonalRangeChange = (range: Range) => {
    setSeasonalRange(range);
    setFormData(prev => ({
      ...prev,
      seasonalStartDate: range.startDate?.toISOString(),
      seasonalEndDate: range.endDate?.toISOString()
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          imageUrl: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          imageUrl: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <Flex align="center" justify="between">
          <PageHeading
            title={selectedItem ? selectedItem.name : 'Add New Menu Item'} 
            description={selectedItem ? 'Update/view menu item details' : 'Create a new menu item'} 
            showBackButton={true} 
            onBackClick={onBack}
            noMarginBottom={true}
          />
        </Flex>

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
                    <Text as="label" size="2" weight="medium">Base Price</Text>
                    <TextField.Root
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                    >
                      <TextField.Slot>$</TextField.Slot>
                    </TextField.Root>
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
                <Text as="label" size="2" weight="medium">Image</Text>
                <Box 
                  className="border border-gray-300 dark:border-neutral-700 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-neutral-800 transition-colors"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  {formData.imageUrl ? (
                    <Box className="relative">
                      <Image 
                        src={formData.imageUrl} 
                        alt={formData.name} 
                        width={564}
                        height={317}
                        className="max-w-48 mx-auto rounded-lg"
                      />
                      <Box mt="2">
                        <Text as="p" className="text-slate-500 dark:text-neutral-600" size="2">Click or drag and drop new image to replace</Text>
                        <Button variant="soft" color="red" mt="2" onClick={(e) => {
                          e.stopPropagation();
                          setFormData(prev => ({ ...prev, imageUrl: '' }));
                        }}>
                          Remove Image
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    <Flex direction="column" align="center" gap="2">
                      <Box className="p-2 bg-gray-100 dark:bg-neutral-800 rounded-full">
                        <ImageIcon size={22} className="text-gray-400 dark:text-neutral-600" />
                      </Box>
                      <Text className="text-slate-500 dark:text-neutral-600">Click to upload image</Text>
                      <Text className="text-slate-500 dark:text-neutral-600" size="2">or drag and drop</Text>
                    </Flex>
                  )}
                </Box>
              </Flex>

              <Box>
                <Text as="label" size="2" weight="medium">
                  <Flex gap="2">
                    <Checkbox
                      checked={isSeasonalItem}
                      onCheckedChange={handleSeasonalChange}
                    />
                    Seasonal Item
                  </Flex>
                </Text>
                {isSeasonalItem && (
                  <Box mt="2">
                    <DateRangeInput
                      value={seasonalRange}
                      onChange={handleSeasonalRangeChange}
                      placeholder="Select season period..."
                      position="top"
                      months={2}
                    />
                  </Box>
                )}
              </Box>
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
                    {menuCategories.map(category => (
                      <Select.Item key={category.id} value={category.id}>
                        {category.name}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </Flex>
              <Flex direction="column" gap="1">
                <Text as="label" size="2" weight="medium">Dietary Labels</Text>
                <SearchableSelect
                  placeholder="Select Dietary Labels"
                  options={dietaryLabels.map(label => ({
                    value: label.id,
                    label: label.name
                  }))}
                  isMulti={true}
                  value={formData.dietaryLabels}
                  onChange={(value) => setFormData(prev => ({ 
                    ...prev, 
                    dietaryLabels: value ? (Array.isArray(value) ? value : [value]) : [] 
                  }))}
                />
              </Flex>

              <Inset mt="4" mb="5">
                <Separator size="4" mt="4" mb="4" />
              </Inset>
              
              <Box>
                <Flex direction="column" gap="3">
                  <Flex direction="column" gap="1">
                    <Text as="label" size="2" weight="medium">Status</Text>
                    <Flex gap="4">
                      <label className="flex items-center gap-2">
                        <RadioGroup.Root
                          value={formData.isActive ? 'active' : 'inactive'}
                          onValueChange={(value) => setFormData(prev => ({ ...prev, isActive: value === 'active' }))}
                        >
                          <RadioGroup.Item value="active">Active</RadioGroup.Item>
                          <RadioGroup.Item value="inactive">Inactive</RadioGroup.Item>
                        </RadioGroup.Root>
                      </label>
                    </Flex>
                  </Flex>
                  <Flex direction="column" gap="1">
                    <Text as="label" size="2" weight="medium">Availability</Text>
                    <Flex gap="4">
                      <label className="flex items-center gap-2">
                        <RadioGroup.Root
                          value={availability}
                          onValueChange={(value) => setAvailability(value)}
                        >
                          <RadioGroup.Item value="all">All Branches</RadioGroup.Item>
                          <RadioGroup.Item value="selected">Selected Branches</RadioGroup.Item>
                          <RadioGroup.Item value="none">None</RadioGroup.Item>
                        </RadioGroup.Root>
                      </label>
                    </Flex>
                  </Flex>
                  {availability === 'selected' && (
                    <Box>
                      <Flex direction="column" gap="1">
                        <SearchableSelect
                          placeholder="Select Branches"
                          options={organization.filter(o => o.id !== 'hq').map(branch => ({
                            value: branch.id,
                            label: branch.name
                          }))}
                          isMulti={true}
                          usePortal={true}
                          value={formData.availableBranchesIds}
                          onChange={(value) => setFormData(prev => ({ 
                            ...prev, 
                            availableBranchesIds: value ? (Array.isArray(value) ? value : [value]) : [] 
                          }))}
                        />
                      </Flex>
                    </Box>
                  )}
                </Flex>
              </Box>
            </Card>
          </Box>
        </Grid>

        <Flex justify="between" mt="6">
          <Flex gap="4">
            <Button color="green" type="submit">
              <Save size={16} /> 
              {selectedItem ? 'Save Changes' : 'Save Menu'}
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
    </Box>
  );
} 