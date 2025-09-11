import { Button, Flex, Select, Text } from '@radix-ui/themes';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (value: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  startIndex,
  endIndex,
  onPageChange,
  onItemsPerPageChange
}: PaginationProps) {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 3; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 2; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <Flex justify="between" align="center">
      <Flex align="center" gap="2">
        <Select.Root
          size="1"
          value={itemsPerPage.toString()} 
          onValueChange={(value) => {
            onItemsPerPageChange(Number(value));
          }}
        >
          <Select.Trigger />
          <Select.Content>
            <Select.Item value="10">10</Select.Item>
            <Select.Item value="25">25</Select.Item>
            <Select.Item value="50">50</Select.Item>
            <Select.Item value="100">100</Select.Item>
          </Select.Content>
        </Select.Root>
        <Text size="1" className="text-gray-600 dark:text-gray-400">
          Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} items
        </Text>
      </Flex>
      
      <Flex gap="2" align="center">
        <Button 
          variant="outline" 
          color="gray"
          size="1" 
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        
        {getPageNumbers().map((page, index) => (
          page === '...' ? (
            <Text key={`ellipsis-${index}`}>...</Text>
          ) : (
            <Button
              key={`page-${page}`}
              variant={currentPage === page ? 'solid' : 'outline'}
              color="gray"
              size="1"
              onClick={() => onPageChange(Number(page))}
            >
              {page}
            </Button>
          )
        ))}
        
        <Button 
          variant="outline" 
          color="gray"
          size="1"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </Flex>
    </Flex>
  );
} 