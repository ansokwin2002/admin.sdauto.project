import { AlertDialog, Button, Flex, IconButton } from "@radix-ui/themes";
import { X } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'soft' | 'solid';
  color?: 'red' | 'orange' | 'green';
}

export default function ConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "solid",
  color = "red"
}: ConfirmDialogProps) {
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Content size="2">
        <Flex justify="between" align="center" mb="3">
          <AlertDialog.Title>{title}</AlertDialog.Title>
          <AlertDialog.Cancel>
            <IconButton size="1" variant="ghost" color="gray">
              <X size={16} />
            </IconButton>
          </AlertDialog.Cancel>
        </Flex>

        <AlertDialog.Description>
          {description}
        </AlertDialog.Description>

        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Cancel>
            <Button variant="soft" color="gray">
              {cancelText}
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button variant={variant} color={color} onClick={onConfirm}>
              {confirmText}
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
} 