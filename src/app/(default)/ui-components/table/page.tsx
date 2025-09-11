import { Table, Card, Heading, Flex } from '@radix-ui/themes'

export const metadata = {
  title: "Table | EatlyPOS",
}

export default function TableDemo() {
  return (
    <div>
      <Heading mb="5">Table</Heading>
      
      <div className="space-y-5">
        {/* Basic Table */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Basic Table</Heading>
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Full name</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell>Group</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              <Table.Row>
                <Table.Cell>John Doe</Table.Cell>
                <Table.Cell>john@example.com</Table.Cell>
                <Table.Cell>Admin</Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>Jane Smith</Table.Cell>
                <Table.Cell>jane@example.com</Table.Cell>
                <Table.Cell>User</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Root>
        </Card>

        {/* Table Variants */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Table Variants</Heading>
          <Flex direction="column" gap="4">
            <Table.Root variant="surface">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>Surface Variant</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>John Doe</Table.Cell>
                  <Table.Cell>john@example.com</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table.Root>

            <Table.Root variant="ghost">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>Ghost Variant</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>John Doe</Table.Cell>
                  <Table.Cell>john@example.com</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table.Root>
          </Flex>
        </Card>

        {/* Table Sizes */}
        <Card size="3">
          <Heading as="h2" size="3" mb="4">Table Sizes</Heading>
          <Flex direction="column" gap="4">
            <Table.Root size="1">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>Size 1</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>John Doe</Table.Cell>
                  <Table.Cell>john@example.com</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table.Root>

            <Table.Root size="2">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>Size 2</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>John Doe</Table.Cell>
                  <Table.Cell>john@example.com</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table.Root>

            <Table.Root size="3">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>Size 3</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>John Doe</Table.Cell>
                  <Table.Cell>john@example.com</Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table.Root>
          </Flex>
        </Card>
      </div>
    </div>
  )
} 