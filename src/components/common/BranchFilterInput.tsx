import { Flex, Select, Text, Button } from '@radix-ui/themes';
import { organization } from '@/data/CommonData';
import { Store, X } from 'lucide-react';

interface BranchFilterInputProps {
  selectedBranch: string | null;
  setSelectedBranch: (id: string | null) => void;
  clearFilter: () => void;
}

export default function BranchFilterInput({ selectedBranch, setSelectedBranch, clearFilter }: BranchFilterInputProps) {
  return (
    <Flex align="center" gap="2">
      <Text size="2">Filter by branch:</Text>
      <Select.Root 
        value={selectedBranch || ""} 
        onValueChange={setSelectedBranch}
      >
        <Select.Trigger placeholder="Select Branch" variant="soft" />
        <Select.Content>
          {organization.filter(entity => entity.id !== "hq").map((entity) => (
            <Select.Item key={entity.id} value={entity.id}>
              <Flex align="center" gap="2"> 
                <Store size={14} />
                {entity.name}
              </Flex>
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
      {selectedBranch && (
        <Button variant="outline" onClick={clearFilter} ml="1">
          <X size={14} />
          Clear
        </Button>
      )}
    </Flex>
  );
}