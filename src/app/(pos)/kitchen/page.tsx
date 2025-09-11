"use client";
import { useState } from "react";
import { Clock, CheckCircle, ReceiptText, CookingPot, WifiOff, Wifi } from "lucide-react";
import { Card, Box, Flex, Text, Button, Grid, Badge, Heading } from "@radix-ui/themes";
import OrderTimer from "@/components/common/OrderTimer";
import Image from "next/image";

interface OrderItem {
  name: string;
  quantity: number;
  specifications?: string[];
  completed?: boolean;
}

interface Order {
  id: string;
  tableNumber: string;
  type: "Dine-in" | "Take Away";
  items: OrderItem[];
  timeReceived: Date;
  status: "in-progress" | "completed";
  completedCount: number;
}

export default function KitchenPage() {
  const [isOnline] = useState(false);
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "9049",
      tableNumber: "05",
      type: "Dine-in",
      timeReceived: new Date(Date.now() - 7 * 60 * 1000),
      status: "in-progress",
      completedCount: 1,
      items: [
        {
          name: "Pork Burger",
          quantity: 1,
          specifications: ["large size", "extra cheese"],
          completed: false,
        },
        {
          name: "Macarons",
          quantity: 2,
          specifications: ["serve after dishes"],
          completed: false,
        },
        {
          name: "Coke",
          quantity: 2,
          specifications: ["large size", "less ice"],
          completed: true,
        }
      ]
    },
    {
      id: "9047",
      tableNumber: "14",
      type: "Dine-in",
      timeReceived: new Date(Date.now() - 12 * 60 * 1000),
      status: "in-progress",
      completedCount: 3,
      items: [
        {
          name: "Baked chicken wing",
          quantity: 1,
          specifications: ["6 pieces", "honey source"],
          completed: true,
        },
        {
          name: "Veggie Spaghetti",
          quantity: 1,
          specifications: ["size: large", "spicy level: light"],
          completed: true,
        },
        {
          name: "Creamy Coffee",
          quantity: 1,
          specifications: ["no sugar", "more cream"],
          completed: true,
        },
        {
          name: "Grill Chicken Chop",
          quantity: 1,
          specifications: ["ala carte"],
          completed: false,
        }
      ]
    },
    {
      id: "9048",
      tableNumber: "15",
      type: "Take Away",
      timeReceived: new Date(Date.now() - 15 * 60 * 1000),
      status: "in-progress",
      completedCount: 0,
      items: [
        {
          name: "Pork Burger",
          quantity: 1,
          specifications: ["large size", "extra cheese"],
          completed: false,
        },
        {
          name: "Macarons",
          quantity: 1,
          specifications: ["serve after dishes"],
          completed: false,
        }
      ]
    },
    {
      id: "9046",
      tableNumber: "16",
      type: "Take Away",
      timeReceived: new Date(Date.now() - 10 * 60 * 1000),
      status: "completed",
      completedCount: 2,
      items: [
        {
          name: "Pork Burger",
          quantity: 1,
          specifications: ["large size", "extra cheese"], 
          completed: true,
        },
        {
          name: "Macarons",
          quantity: 2,
          specifications: ["serve after dishes"],
          completed: true,
        }
      ]
    }
    
  ]);
  
  const completeItem = (orderId: string, itemName: string) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const updatedItems = order.items.map(item => {
          if (item.name === itemName) {
            return { ...item, completed: true };
          }
          return item;
        });
        const completedCount = updatedItems.filter(item => item.completed).length;
        const status = completedCount === order.items.length ? "completed" : "in-progress";
        
        return {
          ...order,
          items: updatedItems,
          completedCount,
          status
        };
      }
      return order;
    }));
  };

  return (
    <Box>
      {/* Top Bar */}
      <Box className="fixed top-0 left-0 right-0 bg-white border-b border-slate-200 z-10">
        <Flex align="center" justify="between" px="4" py="2" direction={{ initial: 'column', lg: 'row' }} gap="3">
          <Flex align="center" gap="2">
            <Image src='/images/logo-sm.png' alt="Logo" width={109} height={16} />
          </Flex>

          <Flex align="center" gap="4">
            {/* Clock */}
            <Flex align="center" gap="2">
              <Clock size={18} />
              <Text size="3">
                {new Date().toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: true 
                })}
              </Text>
            </Flex>

            {/* Online offline indicator */}
            <Flex align="center" gap="1">
              {isOnline ? (
                <Wifi size={18} color="green" />
              ) : (
                <WifiOff size={18} color="red" />
              )}
              <Text size="3" weight="medium" color={isOnline ? "green" : "red"}>{isOnline ? "Online" : "Offline"}</Text>
            </Flex>
          </Flex>
        </Flex>
      </Box>

      {/* Main Content */}
      <Box className="mt-28 xl:mt-20">
        {/* Order Statistics */}
        <Flex gap="6" justify={{ initial: 'center', lg: 'end' }}>
          <Flex align="center" gap="2">
            <ReceiptText size={18} />
            <Text weight="medium" className="hidden lg:block">Total:</Text>
            <Badge size="2" variant="soft">{orders.length}</Badge>
          </Flex>
          <Flex align="center" gap="2">
            <CheckCircle size={18} color="green" />
            <Text weight="medium" color="green" className="hidden lg:block">Completed:</Text>
            <Badge size="2" color="green" variant="soft">
              {orders.filter(order => order.status === 'completed').length}
            </Badge>
          </Flex>
          <Flex align="center" gap="2">
            <CookingPot size={18} color="orange" />
            <Text weight="medium" color="orange" className="hidden lg:block">In Progress:</Text>
            <Badge size="2" color="orange" variant="soft">
              {orders.filter(order => order.status === 'in-progress').length}
            </Badge>
          </Flex>
        </Flex>

        <Box mt="3">
          <Grid columns={{ initial: '1', sm: '2', lg: '3', xl: '4' }} gap="6">
            {orders.map((order) => (
              <Card
                key={order.id}
                size="3"
              >
                {/* Order Header */}
                <Flex justify="between" align="center" mb="4">
                  <Flex direction="column" gap="1">
                    <Heading size="6" weight="bold">Table {order.tableNumber}</Heading>
                    <Flex gap="2" align="center">
                      <Badge size="3" color="brown">Order #{order.id}</Badge>
                      <Badge size="3" variant="soft" color="gray">{order.type}</Badge>
                    </Flex>
                  </Flex>
                  <Flex direction="column" align="end" gap="1">
                    <OrderTimer 
                      timeReceived={order.timeReceived}
                      isCompleted={order.status === 'completed'}
                      color="gray"
                    />
                    <Text size="3" color="gray">
                      Completed: ({order.completedCount}/{order.items.length})
                    </Text>
                  </Flex>
                </Flex>

                {/* Order Items Grid */}
                <Grid gap="3">
                  {order.items.map((item, index) => (
                    <Box
                      key={index}
                      className="p-3 border-1 border-slate-200 rounded-md"
                      style={{ backgroundColor: item.completed ? "white" : "var(--slate-2)" }}
                    >
                      <Flex gap="3">
                        <Box flexGrow="1">
                          <Flex justify="between" align="center" mb="2" gap="2" direction={{ initial: 'column', lg: 'row' }}>
                            <Heading weight="bold" size="4">x{item.quantity} {item.name}</Heading>
                            <Box>
                              {!item.completed ? (
                              <Flex gap="2" justify="between" direction={{ initial: 'column', lg: 'row' }}>
                                <Button
                                  variant="soft" 
                                  onClick={() => completeItem(order.id, item.name)}
                                >
                                  <CheckCircle size={16} />
                                  Mark Complete
                                </Button>
                              </Flex>
                              ) : (
                                <Flex gap="1" align="center" className="text-green-600">
                                  <CheckCircle size={16} /> Completed
                                </Flex>
                              )}
                            </Box>
                          </Flex>
                          {item.specifications && (
                            <Box>
                              {item.specifications.map((spec, i) => (
                                <Text as="p" key={i} size="4" color="gray">- {spec}</Text>
                              ))}
                            </Box>
                          )}
                        </Box>
                      </Flex>
                    </Box>
                  ))}
                </Grid>

                {order.status === 'completed' && (
                  <Badge size="3" color="green" className="flex align-center gap-1" mt="4">
                    <CheckCircle size={16} /> All dishes served • <OrderTimer timeReceived={order.timeReceived} isCompleted={true} /> total time
                  </Badge>
                )}
              </Card>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
} 