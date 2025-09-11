import { Text } from '@radix-ui/themes';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

interface SortableHeaderProps {
  label: string;
  sortKey: string;
  currentSort: { key: string; direction: 'asc' | 'desc' } | null;
  onSort: (key: string) => void;
  align?: 'left' | 'center' | 'right';
}

export const SortableHeader = ({ label, sortKey, currentSort, onSort, align = 'left' }: SortableHeaderProps) => {
  const getSortIcon = () => {
    if (!currentSort || currentSort.key !== sortKey) {
      return <ArrowUpDown size={14} />;
    }
    return currentSort.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
  };

  return (
    <Text 
      as="span" 
      role="button" 
      onClick={() => onSort(sortKey)} 
      className={`flex items-center gap-1 cursor-pointer ${align === 'right' ? 'justify-end' : align === 'center' ? 'justify-center' : ''}`}
    >
      {label} {getSortIcon()}
    </Text>
  );
}; 