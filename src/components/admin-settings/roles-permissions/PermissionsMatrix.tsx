'use client';

import React from 'react';
import { Box, Checkbox, Flex, Table, Text, Tooltip } from '@radix-ui/themes';
import { Permission } from '@/data/RolesPermissionsData';
import { HelpCircle } from 'lucide-react';

interface PermissionsMatrixProps {
  permissions: Permission[];
  onChange: (updatedPermissions: Permission[]) => void;
  readOnly?: boolean;
}

export default function PermissionsMatrix({ 
  permissions, 
  onChange, 
  readOnly = false 
}: PermissionsMatrixProps) {
  
  // Handle permission change
  const handlePermissionChange = (
    moduleId: string, 
    action: 'view' | 'create' | 'edit' | 'delete', 
    checked: boolean
  ) => {
    if (readOnly) return;
    
    const updatedPermissions = permissions.map(permission => {
      if (permission.id === moduleId) {
        // If unchecking "view", uncheck all other permissions too
        if (action === 'view' && !checked) {
          return {
            ...permission,
            view: false,
            create: false,
            edit: false,
            delete: false
          };
        }
        
        // If checking any other permission, ensure "view" is also checked
        if (action !== 'view' && checked) {
          return {
            ...permission,
            [action]: checked,
            view: true
          };
        }
        
        return {
          ...permission,
          [action]: checked
        };
      }
      return permission;
    });
    
    onChange(updatedPermissions);
  };

  return (
    <Box>
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Module</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>
              <Flex align="center" gap="1">
                <Text>View</Text>
                <Tooltip content="Ability to view and access this module">
                  <HelpCircle size={14} className="text-gray-400" />
                </Tooltip>
              </Flex>
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>
              <Flex align="center" gap="1">
                <Text>Create</Text>
                <Tooltip content="Ability to create new items in this module">
                  <HelpCircle size={14} className="text-gray-400" />
                </Tooltip>
              </Flex>
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>
              <Flex align="center" gap="1">
                <Text>Edit</Text>
                <Tooltip content="Ability to modify existing items in this module">
                  <HelpCircle size={14} className="text-gray-400" />
                </Tooltip>
              </Flex>
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>
              <Flex align="center" gap="1">
                <Text>Delete</Text>
                <Tooltip content="Ability to remove items from this module">
                  <HelpCircle size={14} className="text-gray-400" />
                </Tooltip>
              </Flex>
            </Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        
        <Table.Body>
          {permissions.map(permission => (
            <Table.Row key={permission.id}>
              <Table.Cell>
                <Text weight="medium">{permission.module}</Text>
              </Table.Cell>
              <Table.Cell>
                <Checkbox 
                  checked={permission.view} 
                  disabled={readOnly}
                  onCheckedChange={(checked) => {
                    handlePermissionChange(permission.id, 'view', !!checked);
                  }}
                />
              </Table.Cell>
              <Table.Cell>
                <Checkbox 
                  checked={permission.create} 
                  disabled={readOnly || !permission.view}
                  onCheckedChange={(checked) => {
                    handlePermissionChange(permission.id, 'create', !!checked);
                  }}
                />
              </Table.Cell>
              <Table.Cell>
                <Checkbox 
                  checked={permission.edit} 
                  disabled={readOnly || !permission.view}
                  onCheckedChange={(checked) => {
                    handlePermissionChange(permission.id, 'edit', !!checked);
                  }}
                />
              </Table.Cell>
              <Table.Cell>
                <Checkbox 
                  checked={permission.delete} 
                  disabled={readOnly || !permission.view}
                  onCheckedChange={(checked) => {
                    handlePermissionChange(permission.id, 'delete', !!checked);
                  }}
                />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
} 