"use client";
import { useState } from "react";
import { CreditCard, Wallet, Receipt, Printer, Clock, Users, CheckCircle, X, Dice6, Square, SquareX, Smartphone, Wifi, WifiOff, User } from "lucide-react";
import { Card, Box, Flex, Text, Button, Heading, Badge, Grid, Dialog } from "@radix-ui/themes";
import OrderTimer from "@/components/common/OrderTimer";
import AuthPINDialog from "@/components/common/AuthPINDialog";
import Image from "next/image";

interface TableOrder {
  id: string;
  tableNumber: string;
  pax: number;
  maxPax: number;
  timeElapsed: Date;
  status: "unpaid" | "paid" | "available" | "reserved";
  orderItems: OrderItem[];
  totalAmount: number;
  customerName?: string;
}

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  specifications?: string[];
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
}

export default function CheckoutPage() {
  const [selectedTable, setSelectedTable] = useState<TableOrder | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [isOnline] = useState(true);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState("Jane");
  
  const paymentMethods: PaymentMethod[] = [
    { id: "card", name: "Credit Card", icon: <CreditCard size={24} /> },
    { id: "cash", name: "Cash", icon: <Wallet size={24} /> },
    { id: "ewallet", name: "E-Wallet", icon: <Smartphone size={24} /> },
  ];

  const tables: TableOrder[] = [
    {
      id: "T1",
      tableNumber: "01",
      pax: 4,
      maxPax: 4,
      timeElapsed: new Date(Date.now() - 35 * 60 * 1000),
      status: "unpaid",
      orderItems: [
        {
          name: "Grill Pork Chop",
          quantity: 1,
          price: 12.99,
          specifications: ["size: large"]
        },
        {
          name: "Orange Juice",
          quantity: 2,
          price: 5.00,
          specifications: ["size: large", "less ice"]
        }
      ],
      totalAmount: 22.99
    },
    {
      id: "T2",
      tableNumber: "02",
      pax: 6,
      maxPax: 8,
      timeElapsed: new Date(Date.now() - 12 * 60 * 1000),
      status: "unpaid",
      orderItems: [
        {
          name: "Hawaiian Pizza",
          quantity: 1,
          price: 15.00,
          specifications: ["size: large", "more onion"]
        },
        {
          name: "Macarons",
          quantity: 1,
          price: 4.99,
          specifications: ["size: 1 set", "flavour: random"]
        }
      ],
      totalAmount: 19.99
    },
    {
      id: "T11",
      tableNumber: "11",
      pax: 0,
      maxPax: 4,
      timeElapsed: new Date(),
      status: "reserved",
      orderItems: [],
      totalAmount: 0,
      customerName: "Sean"
    },
    {
      id: "T3",
      tableNumber: "03",
      pax: 2,
      maxPax: 4,
      timeElapsed: new Date(Date.now() - 45 * 60 * 1000),
      status: "paid",
      orderItems: [
        { name: "Pasta Carbonara", quantity: 1, price: 14.99, specifications: ["extra cheese"] },
        { name: "Iced Tea", quantity: 2, price: 3.99, specifications: ["less ice"] }
      ],
      totalAmount: 22.97
    },
    {
      id: "T4",
      tableNumber: "04",
      pax: 0,
      maxPax: 2,
      timeElapsed: new Date(),
      status: "available",
      orderItems: [],
      totalAmount: 0
    },
    {
      id: "T5",
      tableNumber: "05",
      pax: 3,
      maxPax: 4,
      timeElapsed: new Date(Date.now() - 20 * 60 * 1000),
      status: "unpaid",
      orderItems: [
        { name: "Steak", quantity: 2, price: 29.99, specifications: ["medium rare"] },
        { name: "Wine", quantity: 1, price: 25.00, specifications: ["red wine"] }
      ],
      totalAmount: 84.98
    },
    {
      id: "T6",
      tableNumber: "06",
      pax: 0,
      maxPax: 6,
      timeElapsed: new Date(),
      status: "reserved",
      orderItems: [],
      totalAmount: 0,
      customerName: "John"
    },
    {
      id: "T7",
      tableNumber: "07",
      pax: 4,
      maxPax: 4,
      timeElapsed: new Date(Date.now() - 15 * 60 * 1000),
      status: "unpaid",
      orderItems: [
        { name: "Sushi Set", quantity: 2, price: 45.99 }
      ],
      totalAmount: 91.98
    },
    {
      id: "T8",
      tableNumber: "08",
      pax: 0,
      maxPax: 2,
      timeElapsed: new Date(),
      status: "available",
      orderItems: [],
      totalAmount: 0
    },
    {
      id: "T9",
      tableNumber: "09",
      pax: 2,
      maxPax: 4,
      timeElapsed: new Date(Date.now() - 50 * 60 * 1000),
      status: "paid",
      orderItems: [
        { name: "Salad", quantity: 1, price: 8.99 },
        { name: "Soup", quantity: 1, price: 6.99 }
      ],
      totalAmount: 15.98
    },
    {
      id: "T10",
      tableNumber: "10",
      pax: 0,
      maxPax: 8,
      timeElapsed: new Date(),
      status: "reserved",
      orderItems: [],
      totalAmount: 0,
      customerName: "Mary"
    },
    {
      id: "T12",
      tableNumber: "12",
      pax: 6,
      maxPax: 6,
      timeElapsed: new Date(Date.now() - 25 * 60 * 1000),
      status: "unpaid",
      orderItems: [
        { name: "BBQ Set", quantity: 2, price: 59.99 },
        { name: "Beer", quantity: 6, price: 5.99 }
      ],
      totalAmount: 155.92
    },
    {
      id: "T13",
      tableNumber: "13",
      pax: 0,
      maxPax: 4,
      timeElapsed: new Date(),
      status: "available",
      orderItems: [],
      totalAmount: 0
    },
    {
      id: "T14",
      tableNumber: "14",
      pax: 0,
      maxPax: 4,
      timeElapsed: new Date(),
      status: "available",
      orderItems: [],
      totalAmount: 0
    },
    {
      id: "T15",
      tableNumber: "15",
      pax: 2,
      maxPax: 4,
      timeElapsed: new Date(Date.now() - 10 * 60 * 1000),
      status: "unpaid",
      orderItems: [
        { name: "Pizza", quantity: 1, price: 18.99 }
      ],
      totalAmount: 18.99
    }
  ];

  const printBill = () => {
    // Implement print functionality
    console.log("Printing bill...");
  };

  const completePayment = () => {
    // Here you would typically process the payment
    // For now, we'll just close the checkout dialog and show success
    setSelectedTable(null);
    setShowSuccessDialog(true);
    
    // Reset selected method for next payment
    setSelectedMethod("");

    // Auto close the dialog after 3 seconds
    setTimeout(() => {
      setShowSuccessDialog(false);
    }, 1500);
  };

  const handleAuthSuccess = (username: string) => {
    setCurrentUser(username);
  };

  const handleLogout = () => {
    setCurrentUser("");
  };

  return (
    <Box>
      {/* Top Bar */}
      <Box className="fixed top-0 left-0 right-0 bg-white border-b border-slate-200 z-10">
        <Flex align="center" justify="between" px="4" py="2" direction={{ initial: 'column', lg: 'row' }} gap="3">
          <Flex align="center" gap="2">
            <Image src='/images/logo-sm.png' alt="Logo" width={109} height={16} />
          </Flex>

          <Flex align="center" gap="6">
            {/* Clock */}
            <Flex align="center" gap="4">
              <Flex align="center" gap="1">
                <Clock size={18} />
                <Text size="3" weight="medium">
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

              {/* Switch User */}
              <Flex align="center" gap="2">
                {currentUser && (
                  <Flex align="center" gap="1">
                    <User size={18} />
                    <Text size="2" weight="medium">{currentUser}</Text>
                  </Flex>
                )}
                {currentUser && (
                  <Button 
                    size="2" 
                    variant="outline"
                  onClick={() => setShowAuthDialog(true)}
                >
                  Switch User
                </Button>
                )}
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Box>

      
      {currentUser ? (
        <Box className="mt-28 xl:mt-20">
          <Flex justify="between" align="center" mb="4" direction={{ initial: 'column', sm: 'row' }} gap="4">
            <Flex justify="between" align="center" gap="2">
            {/* Status Legend */}
            <Flex gap="2">
              <Badge variant="soft" color="green">Available</Badge>
              <Badge variant="soft" color="gray">Reserved</Badge>
              <Badge variant="soft" color="red">Occupied</Badge>
              <Text size="2" color="gray">•</Text>
              <Badge variant="soft" color="green">Paid</Badge>
              <Badge variant="soft" color="red">Unpaid</Badge>
            </Flex>
          </Flex>

          {/* Table Statistics */}
          <Flex gap="6">
              <Flex align="center" gap="2">
                <Square size={18} />
                <Text weight="medium" className="hidden lg:block">Total Tables:</Text>
                <Badge size="2" variant="soft">{tables.length}</Badge>
              </Flex>
              <Flex align="center" gap="2">
                <CheckCircle size={18} color="green" />
                <Text weight="medium" color="green" className="hidden lg:block">Available:</Text>
                <Badge size="2" color="green" variant="soft">
                  {tables.filter(table => table.status === 'available').length}
                </Badge>
              </Flex>
              <Flex align="center" gap="2">
                <Dice6 size={18} color="orange" />
                <Text weight="medium" color="orange" className="hidden lg:block">Occupied:</Text>
                <Badge size="2" color="orange" variant="soft">
                  {tables.filter(table => table.status === 'unpaid').length}
                </Badge>
              </Flex>
              <Flex align="center" gap="2">
                <SquareX size={18} color="gray" />
                <Text weight="medium" color="gray" className="hidden lg:block">Reserved:</Text>
                <Badge size="2" color="gray" variant="soft">
                  {tables.filter(table => table.status === 'reserved').length}
                </Badge>
              </Flex>
              <Flex align="center" gap="2">
                <Receipt size={18} color="red" />
                <Text weight="medium" color="red" className="hidden lg:block">Unpaid:</Text>
                <Badge size="2" color="red" variant="soft">
                  {tables.filter(table => table.status === 'unpaid').length}
                </Badge>
              </Flex>
          </Flex>
        </Flex>

        <Grid columns={{ initial: '1', sm: '2', md: '3', lg: '4' }} gap="6">
          {tables.map((table) => (
            <Card
              key={table.id}
              variant="surface"
              className={`relative ${table.status === 'reserved' ? 'opacity-50' : 'opacity-100'}
                        ${table.status === 'unpaid' ? 'cursor-pointer' : 'pointer-events-none'}
                        `}
              style={{ boxShadow: table.status === 'reserved' ? 'none' : '' }}
              role="button"
              onClick={() => setSelectedTable(table)}
            >
              {/* Table Header */}
              <Flex justify="between" align="start" mb="2">
                <Flex direction="column">
                  <Text weight="bold" size="5">Table {table.tableNumber}</Text>
                  {table.customerName && (
                    <Text size="1" color="gray">Reserved for {table.customerName}</Text>
                  )}
                </Flex>
                <Badge 
                  size="1"
                  color={
                    table.status === 'available' ? 'green' : 
                    table.status === 'reserved' ? 'gray' : 'red'
                  }
                >
                  {table.status === 'available' ? 'Available' :
                    table.status === 'reserved' ? 'Reserved' : 'Occupied'}
                </Badge>
              </Flex>

              {/* Table Info */}
              <Flex direction="column" gap="2">
                <Flex align="center" gap="1">
                  <Users size={14} />
                  <Text size="2">{table.pax}/{table.maxPax} Pax</Text>
                </Flex>

                {table.status !== 'available' && (
                  <Flex align="center" gap="1">
                    {table.status === 'unpaid' && (
                      <OrderTimer 
                        timeReceived={table.timeElapsed}
                        color="gray"
                        isCompleted={true}
                      />
                    )}
                  </Flex>
                )}

                {table.totalAmount > 0 && (
                  <Flex justify="between" align="center">
                    <Text size="2" weight="medium">${table.totalAmount.toFixed(2)}</Text>
                    <Badge 
                      size="1" 
                      color={table.status === 'paid' ? 'green' : 'red'}
                    >
                      {table.status === 'paid' ? 'Paid' : 'Unpaid'}
                    </Badge>
                  </Flex>
                )}
              </Flex>

              {/* Actions */}
              {table.status === 'unpaid' && (
                <Flex gap="2" mt="3">
                  <Button 
                    size="4" 
                    variant="soft"
                    onClick={() => setSelectedTable(table)}
                    className="!flex-1"
                  >
                    Checkout
                  </Button>
                  <Button 
                    size="4" 
                    variant="outline"
                    onClick={printBill}
                  >
                    <Printer size={20} />
                  </Button>
                </Flex>
              )}
            </Card>
          ))}
        </Grid>

        {/* Checkout Dialog */}
        <Dialog.Root open={!!selectedTable} onOpenChange={(open) => !open && setSelectedTable(null)}>
          <Dialog.Content size="3" className="max-w-4xl">
            <Flex justify="between" align="center" mb="4">
              <Dialog.Title mb="0">Checkout - Table {selectedTable?.tableNumber}</Dialog.Title>
              <Dialog.Close>
                <Button variant="ghost" color="gray">
                  <X size={18} />
                </Button>
              </Dialog.Close>
            </Flex>

            <Flex gap="6">
              {/* Order Details */}
              <Box className="flex-[1.5]">
                <Box className="p-4 border-1 border-slate-200 rounded-md">
                  <Heading size="3" mb="3">Order Details</Heading>
                  {selectedTable?.orderItems.map((item, index) => (
                    <Box key={index} py="2">
                      <Flex justify="between" mb="1">
                        <Text weight="medium">{item.name}</Text>
                        <Text>${(item.price * item.quantity).toFixed(2)}</Text>
                      </Flex>
                      <Flex justify="between" mb="1">
                        <Text size="1" color="gray">Quantity: {item.quantity}</Text>
                        <Text size="1" color="gray">${item.price.toFixed(2)} each</Text>
                      </Flex>
                      {item.specifications?.map((spec, i) => (
                        <Text key={i} size="1" color="gray">- {spec}</Text>
                      ))}
                    </Box>
                  ))}

                  {/* Payment Summary */}
                  <Box mt="4">
                    <Flex justify="between" mb="2">
                      <Text size="2">Subtotal</Text>
                      <Text size="2">${selectedTable?.totalAmount.toFixed(2)}</Text>
                    </Flex>
                    <Flex justify="between" mb="2">
                      <Text size="2">Tax (6%)</Text>
                      <Text size="2">${selectedTable ? (selectedTable.totalAmount * 0.06).toFixed(2) : '0.00'}</Text>
                    </Flex>
                    <Flex justify="between" pt="2" className="border-t border-gray-300">
                      <Text size="4" weight="bold">Total</Text>
                      <Text size="4" weight="bold">
                        ${selectedTable ? (selectedTable.totalAmount * 1.06).toFixed(2) : '0.00'}
                      </Text>
                    </Flex>
                  </Box>
                </Box>
              </Box>

              {/* Payment Methods */}
              <Box className="flex-1">
                <Box className="p-4 border-1 border-slate-200 rounded-md">
                  <Heading size="3" mb="3">Payment Method</Heading>
                  <Grid columns="1" gap="2">
                    {paymentMethods.map((method) => (
                      <Button
                        key={method.id}
                        size="3"
                        variant={selectedMethod === method.id ? 'solid' : 'outline'}
                        onClick={() => setSelectedMethod(method.id)}
                      >
                        <Flex gap="2">
                          {method.icon}
                          <Text>{method.name}</Text>
                        </Flex>
                      </Button>
                    ))}
                  </Grid>
                </Box>
              </Box>
            </Flex>
            {/* Action Buttons */}
            <Flex gap="2" mt="4" justify="end">
              <Button
                size="4"
                variant="outline" 
                onClick={printBill}
                className="flex-1"
              >
                <Printer size={18} />
                Print Bill
              </Button>
              <Button
                size="4"
                disabled={!selectedMethod}
                className="flex-1"
                onClick={completePayment}
              >
                <CheckCircle size={18} />
                Complete Payment
              </Button>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
        </Box>
      ) : (
        <Flex justify="center" align="center" className="h-[calc(100vh-8rem)]">
          <Box className="mt-28 xl:mt-20" maxWidth="300px">
            <Card size="3">
              <Flex direction="column" align="center" gap="4">
                <Heading size="5">Please login to continue</Heading>
                <Button size="4" onClick={() => setShowAuthDialog(true)}>Login</Button>
              </Flex>
            </Card>
          </Box>
        </Flex>
      )}

      {/* Success Dialog */}
      <Dialog.Root open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <Dialog.Content size="3" className="max-w-4xl">
          <Flex direction="column" align="center" gap="4" p="4">
            <CheckCircle size={60} color="green" className="text-green-500" />
            <Dialog.Title className="text-center">Payment Successful</Dialog.Title>
            <Text align="center">
              The payment has been processed successfully.
            </Text>
          </Flex>
        </Dialog.Content>
      </Dialog.Root>

      <AuthPINDialog
        open={showAuthDialog}
        onOpenChange={setShowAuthDialog}
        onSuccess={handleAuthSuccess}
        onLogout={handleLogout}
        currentUser={currentUser}
      />
    </Box>
  );
} 