import { Badge } from "@radix-ui/themes";

export const getTransferStatusBadge  = ({ status }) => {
  switch (status) {
    case 'New': return <Badge color="blue">New</Badge>;
    case 'Rejected': return <Badge color="red">Rejected</Badge>;
    case 'Approved': return <Badge color="green">Approved</Badge>;
    case 'Delivering': return <Badge color="orange">Delivering</Badge>;
    case 'Completed': return <Badge color="purple">Completed</Badge>;
    default: return <Badge color="gray">{status}</Badge>;
  }
};