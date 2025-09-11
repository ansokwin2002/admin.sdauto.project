"use client";

import React, { useState } from "react";
import { Plus, Minus, Trash2, X, ChefHatIcon, ForkKnife, Sandwich, Cake, Coffee, Send, ArrowLeft, CreditCard, Wallet, ArrowRight } from "lucide-react";
import { Card, Box, Flex, Text, Button, IconButton, Heading, Grid, Dialog, Inset, ScrollArea, RadioCards, TextArea, TextField } from "@radix-ui/themes";
import Image from "next/image";

// Enhanced interfaces
interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  sizes?: {
    name: string;
    price: number;
  }[];
  addons?: {
    id: number;
    name: string;
    price: number;
  }[];
}

interface OrderItem {
  id: number;
  name: string;
  basePrice: number;
  quantity: number;
  size?: string;
  addons?: {
    id: number;
    name: string;
    price: number;
  }[];
  notes?: string;
  totalPrice: number;
}

type OrderStep = "menu" | "summary" | "payment" | "success";

// Header component with back button and logo
const Header = ({ 
  currentStep, 
  goBack 
}: { 
  currentStep: OrderStep, 
  goBack: () => void 
}) => (
  <Box style={{ 
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: 'white',
    borderBottom: '1px solid var(--gray-5)',
    padding: '8px',
    margin: '0 auto',
    width: '100%'
  }}>
    <Flex justify="between" align="center">
      {currentStep !== "menu" ? (
        <IconButton variant="ghost" onClick={goBack}>
          <ArrowLeft size={20} />
        </IconButton>
      ) : (
        <Box width="32px" /> // Empty spacer to maintain layout
      )}
      <Flex align="center" gap="2">
       <Image src='/images/logo-sm.png' alt="Logo" width={109} height={16} />
      </Flex>
      <Box width="32px" /> {/* Empty spacer to maintain layout */}
    </Flex>
  </Box>
);

// Step indicator component
const StepIndicator = ({ currentStep }: { currentStep: OrderStep }) => (
  <Flex justify="between" align="center" width="100%" mb="4">
    <Flex gap="2" align="center">
      <Box
        style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          backgroundColor: currentStep === "menu" ? 'var(--accent-9)' : 'var(--gray-5)',
          color: currentStep === "menu" ? 'white' : 'var(--gray-11)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
        }}
      >
        1
      </Box>
      <Text size="2" weight={currentStep === "menu" ? "bold" : "regular"}>Menu</Text>
    </Flex>
    
    <Box style={{ height: '2px', backgroundColor: 'var(--gray-5)', flex: 1, margin: '0 8px' }} />
    
    <Flex gap="2" align="center">
      <Box
        style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          backgroundColor: currentStep === "summary" ? 'var(--accent-9)' : 'var(--gray-5)',
          color: currentStep === "summary" ? 'white' : 'var(--gray-11)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
        }}
      >
        2
      </Box>
      <Text size="2" weight={currentStep === "summary" ? "bold" : "regular"}>Summary</Text>
    </Flex>
    
    <Box style={{ height: '2px', backgroundColor: 'var(--gray-5)', flex: 1, margin: '0 8px' }} />
    
    <Flex gap="2" align="center">
      <Box
        style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          backgroundColor: currentStep === "payment" ? 'var(--accent-9)' : 'var(--gray-5)',
          color: currentStep === "payment" ? 'white' : 'var(--gray-11)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
        }}
      >
        3
      </Box>
      <Text size="2" weight={currentStep === "payment" ? "bold" : "regular"}>Payment</Text>
    </Flex>
  </Flex>
);

// Menu step component
const MenuStep = ({ 
  selectedCategory,
  setSelectedCategory,
  categories,
  filteredMenuItems,
  openItemModal,
  orderItems,
  subtotal,
  goToSummary,
}: { 
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: { title: string; icon: React.ReactNode }[];
  filteredMenuItems: MenuItem[];
  openItemModal: (item: MenuItem) => void;
  orderItems: OrderItem[];
  subtotal: number;
  goToSummary: () => void;
}) => (
  <Box style={{ 
    display: 'flex', 
    flexDirection: 'column',
  }}>
    {/* Category selector - fixed below header */}
    <Box style={{ 
      position: 'fixed',
      top: '32px', // Below header
      left: 0,
      right: 0,
      zIndex: 9,
      backgroundColor: 'white',
      borderBottom: '1px solid var(--gray-5)',
      margin: '0 auto',
      width: '100%'
    }}>
      <ScrollArea scrollbars="horizontal" size="1">
        <Flex gap="2" justify="center" py="1" px="2">
          {categories.map(category => (
            <Button 
              key={category.title}
              variant={selectedCategory === category.title ? "solid" : "soft"}
              onClick={() => setSelectedCategory(category.title)}
              size="1"
              className="flex-shrink-0"
            >
              <Flex align="center" gap="1">
                <span>{category.icon}</span>
                <span>{category.title}</span>
              </Flex>
            </Button>
          ))}
        </Flex>
      </ScrollArea>
    </Box>
    
    {/* Menu items - scrollable content */}
    <Box className="pt-[80px] pb-8">
      <Grid columns="2" gap="4">
        {filteredMenuItems.map((item) => (
          <Card 
            key={item.id} 
            className="cursor-pointer" 
            size="1"
            onClick={() => openItemModal(item)}
          >
            <Inset clip="padding-box" side="top" pb="current">
              <Image 
                src={item.image} 
                alt={item.name} 
                width={242}
                height={100}
                style={{
                  display: "block",
                  objectFit: "cover",
                  width: "242px",
                  height: "100px",
                  backgroundColor: "var(--gray-5)",
                }}
              />
            </Inset>
            <Flex direction="column" gap="1" p="2">
              <Text weight="medium">{item.name}</Text>
              <Text size="1" color="gray" style={{ 
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                lineHeight: '1.2em',
                maxHeight: '2.4em'
              }}>
                {item.description}
              </Text>
              <Text size="2" weight="bold">${item.price.toFixed(2)}</Text>
            </Flex>
          </Card>
        ))}
      </Grid>
    </Box>
    
    {/* Floating action button */}
    {orderItems.length > 0 && (
      <Box position="fixed" bottom="4" left="0" right="0" style={{ 
        padding: '0 16px',
        maxWidth: '500px',
        margin: '0 auto',
        zIndex: 20
      }}>
        <Button 
          size="4"
          onClick={goToSummary}
          style={{ width: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          color="green"
        >
          <Flex justify="between" width="100%">
            <Text>View Order ({orderItems.length} items)</Text>
            <Flex align="center" gap="1">
              <Text weight="bold">${subtotal.toFixed(2)}</Text>
              <ArrowRight size={18} />
            </Flex>
          </Flex>
        </Button>
      </Box>
    )}
  </Box>
);

// Order summary step component
const SummaryStep = ({
  orderItems,
  menuItems,
  removeOrderItem,
  updateOrderItemQuantity,
  customerName,
  handleCustomerNameChange,
  tableNumber,
  handleTableNumberChange,
  subtotal,
  taxAmount,
  total,
  goToPayment,
}: {
  orderItems: OrderItem[];
  menuItems: MenuItem[];
  removeOrderItem: (itemId: number) => void;
  updateOrderItemQuantity: (itemId: number, newQuantity: number) => void;
  customerName: string;
  handleCustomerNameChange: (value: string) => void;
  tableNumber: string;
  handleTableNumberChange: (value: string) => void;
  subtotal: number;
  taxAmount: number;
  total: number;
  goToPayment: () => void;
}) => (
  <Box style={{ height: 'calc(100vh - 150px)', display: 'flex', flexDirection: 'column' }}>
    <Flex direction="column" gap="4" height="100%">
      {/* Order items */}
      <Box style={{ flex: 1, overflow: 'hidden' }}>
        <Text size="4" weight="bold" mb="2">Your Order</Text>
        <ScrollArea style={{ height: 'calc(100% - 40px)' }} type="always" scrollbars="vertical">
          {orderItems.map((item) => (
            <Card key={item.id} my="2">
              <Flex direction="column" p="3">
                <Flex justify="between" align="start">
                  <Flex gap="3" align="start">
                    <Box style={{ position: 'relative', width: '40px', height: '40px', flexShrink: 0 }}>
                      <Image 
                        src={menuItems.find(menuItem => menuItem.name === item.name)?.image || ''}
                        alt={item.name}
                        width={40}
                        height={40}
                        style={{ objectFit: 'cover', borderRadius: '4px', width: '40px', height: '40px' }}
                      />
                    </Box>
                    <Box>
                      <Heading size="2">{item.name}</Heading>
                      {item.size && <Box key={item.size}><Text size="1" color="gray">Size: {item.size}</Text></Box>}
                      {item.addons && item.addons.map(addon => (
                        <Box key={addon.id}><Text size="1" color="gray">+ {addon.name} (${addon.price.toFixed(2)})</Text></Box>
                      ))}
                      {item.notes && <Box><Text size="1" color="gray" style={{fontStyle: "italic"}}>Note: {item.notes}</Text></Box>}
                    </Box>
                  </Flex>
                  <IconButton 
                    variant="ghost" 
                    size="1" 
                    color="red"
                    onClick={() => removeOrderItem(item.id)}
                  >
                    <Trash2 size={16} />
                  </IconButton>
                </Flex>
                <Flex justify="end" align="center" gap="4" mt="2">
                  <Flex align="center" gap="2">
                    <IconButton 
                      variant="soft" 
                      size="1"
                      onClick={() => updateOrderItemQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus size={14} />
                    </IconButton>
                    <Text size="2">{item.quantity}</Text>
                    <IconButton 
                      variant="soft" 
                      size="1"
                      onClick={() => updateOrderItemQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus size={14} />
                    </IconButton>
                  </Flex>
                  <Text weight="medium">${item.totalPrice.toFixed(2)}</Text>
                </Flex>
              </Flex>
            </Card>
          ))}
        </ScrollArea>
      </Box>

      {/* Customer info */}
      <Card>
        <Flex direction="column" gap="3" p="3">
          <Text weight="bold">Customer Information</Text>
          <Flex direction="column" gap="2">
            <Text size="2">Name (optional)</Text>
            <TextField.Root
              placeholder="Enter customer name"
              value={customerName}
              onChange={(e) => handleCustomerNameChange(e.target.value)}
              size="2"
              variant="surface"
              autoComplete="off"
              spellCheck="false"
            />
          </Flex>
          <Flex direction="column" gap="2">
            <Text size="2">Table Number</Text>
            <TextField.Root
              placeholder="Enter table number"
              value={tableNumber}
              onChange={(e) => handleTableNumberChange(e.target.value)}
              size="2"
              variant="surface"
              autoComplete="off"
              spellCheck="false"
            />
          </Flex>
        </Flex>
      </Card>

      {/* Order summary */}
      <Card>
        <Box p="3">
          <Flex justify="between" mb="2">
            <Text>Subtotal</Text>
            <Text>${subtotal.toFixed(2)}</Text>
          </Flex>
          <Flex justify="between" mb="2">
            <Text>Tax (8%)</Text>
            <Text>${taxAmount.toFixed(2)}</Text>
          </Flex>
          <Flex justify="between" mb="2" style={{ borderTop: '1px solid var(--gray-5)', paddingTop: '8px' }}>
            <Text weight="bold">Total</Text>
            <Text weight="bold">${total.toFixed(2)}</Text>
          </Flex>
        </Box>
      </Card>

      {/* Continue button */}
      <Button 
        size="3" 
        onClick={goToPayment} 
        color="green"
        style={{ marginTop: 'auto' }}
      >
        Continue to Payment
      </Button>
    </Flex>
  </Box>
);

// Item detail modal component
const ItemDetailModal = ({
  selectedItem,
  closeItemModal,
  quantity,
  decrementQuantity,
  incrementQuantity,
  selectedSize,
  setSelectedSize,
  selectedAddons,
  toggleAddon,
  itemNotes,
  handleItemNotesChange,
  calculateItemPrice,
  addToOrder,
}: {
  selectedItem: MenuItem;
  closeItemModal: () => void;
  quantity: number;
  decrementQuantity: () => void;
  incrementQuantity: () => void;
  selectedSize: string | null;
  setSelectedSize: (size: string) => void;
  selectedAddons: number[];
  toggleAddon: (addonId: number) => void;
  itemNotes: string;
  handleItemNotesChange: (value: string) => void;
  calculateItemPrice: () => number;
  addToOrder: () => void;
}) => {
  if (!selectedItem) return null;
  
  return (
    <Dialog.Root open={!!selectedItem} onOpenChange={closeItemModal}>
      <Dialog.Content>
        <Flex justify="between" mb="2">
          <Dialog.Title>{selectedItem.name}</Dialog.Title>
          <Dialog.Close>
            <IconButton variant="ghost" color="gray">
              <X size={18} />
            </IconButton>
          </Dialog.Close>
        </Flex>

        <ScrollArea type="always" scrollbars="vertical" className="pb-4 pr-4" style={{ overscrollBehavior: 'none' }}>
          <Flex direction="column" gap="3" style={{ paddingBottom: '60px', maxHeight: '400px' }}>
            {/* Item Image */}
            <Flex gap="2">
              <Image 
                src={selectedItem.image} 
                alt={selectedItem.name} 
                width={100}
                height={100}
                style={{ objectFit: 'cover', borderRadius: '8px', width: '100px', height: '100px' }}
              />
              <Dialog.Description size="2" color="gray">{selectedItem.description}</Dialog.Description>
            </Flex>
            
            {/* Quantity Selector */}
            <Box>
              <Text mb="2">Quantity</Text>
              <Flex align="center" gap="2">
                <IconButton variant="outline" onClick={decrementQuantity}>
                  <Minus size={16} />
                </IconButton>
                <Text style={{ width: '40px', textAlign: 'center' }}>{quantity}</Text>
                <IconButton variant="outline" onClick={incrementQuantity}>
                  <Plus size={16} />
                </IconButton>
              </Flex>
            </Box>
            
            {/* Size Selection */}
            {selectedItem.sizes && (
              <Flex direction="column" gap="2">
                <Text>Size</Text>
                <RadioCards.Root
                  onValueChange={setSelectedSize}
                  defaultValue={selectedSize || undefined}
                >
                  {selectedItem.sizes.map(size => (
                    <RadioCards.Item
                      key={size.name} 
                      value={size.name}
                    >
                      <Text weight="medium">{size.name} - ${size.price.toFixed(2)}</Text>
                    </RadioCards.Item>
                  ))}
                </RadioCards.Root>
              </Flex>
            )}
            
            {/* Add-ons */}
            {selectedItem.addons && selectedItem.addons.length > 0 && (
              <Flex direction="column" gap="2">
                <Text>Add-ons</Text>
                <Flex wrap="wrap" gap="2">
                  {selectedItem.addons.map(addon => (
                    <Card 
                      key={addon.id}
                      className="cursor-pointer p-2"
                      style={{
                        borderColor: selectedAddons.includes(addon.id) ? 'var(--accent-9)' : 'var(--gray-6)',
                        borderWidth: selectedAddons.includes(addon.id) ? '2px' : '1px',
                        borderStyle: 'solid',
                      }}
                      onClick={() => toggleAddon(addon.id)}
                    >
                      <Flex align="center" gap="2">
                        <Box style={{
                          width: '16px',
                          height: '16px',
                          borderRadius: '4px',
                          border: '1px solid var(--gray-8)',
                          backgroundColor: selectedAddons.includes(addon.id) ? 'var(--accent-9)' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                          {selectedAddons.includes(addon.id) && <Text style={{ color: 'white' }} size="1">✓</Text>}
                        </Box>
                        <Text>{addon.name} (+${addon.price.toFixed(2)})</Text>
                      </Flex>
                    </Card>
                  ))}
                </Flex>
              </Flex>
            )}
            
            {/* Notes Field */}
            <Flex direction="column" gap="2">
              <Text>Special Instructions</Text>
              <TextArea
                placeholder="Add special instructions here..."
                value={itemNotes}
                onChange={(e) => handleItemNotesChange(e.target.value)}
                size="2"
                variant="surface"
                resize="none"
                rows={2}
                autoComplete="off"
                spellCheck="false"
              />
            </Flex>
          </Flex>
        </ScrollArea>
        {/* Total and Add to Order Button */}
        <Box style={{ 
            borderTop: '1px solid var(--gray-5)', 
            paddingTop: '16px',
            marginTop: 'auto',
            width: '100%',
            position: 'sticky',
            bottom: 0,
            backgroundColor: 'white',
            zIndex: 10
          }}>
            <Flex justify="between" align="center" mb="3">
              <Text weight="bold">Total:</Text>
              <Text weight="bold">${calculateItemPrice().toFixed(2)}</Text>
            </Flex>
            
            <Flex gap="2">
              <Button size="3" variant="outline" onClick={closeItemModal} className="flex-1">
                Cancel
              </Button>
              <Button size="3" onClick={addToOrder} className="flex-1" color="green">
                <Plus size={16} />
                Add to Order
              </Button>
            </Flex>
          </Box>
      </Dialog.Content>
    </Dialog.Root>
  );
};

// Payment step component
const PaymentStep = ({
  orderItems,
  subtotal,
  taxAmount,
  total,
  paymentMethod,
  setPaymentMethod,
  completeOrder,
}: {
  orderItems: OrderItem[];
  subtotal: number;
  taxAmount: number;
  total: number;
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  completeOrder: () => void;
}) => (
  <Box style={{ height: 'calc(100vh - 150px)', display: 'flex', flexDirection: 'column' }}>
    <Flex direction="column" gap="4" height="100%">
      {/* Order summary */}
      <Card>
        <Box p="3">
          <Text weight="bold" mb="2">Order Summary</Text>
          <Flex justify="between" mb="2">
            <Text>{orderItems.length} items</Text>
            <Text>${subtotal.toFixed(2)}</Text>
          </Flex>
          <Flex justify="between" mb="2">
            <Text>Tax (8%)</Text>
            <Text>${taxAmount.toFixed(2)}</Text>
          </Flex>
          <Flex justify="between" mb="2" style={{ borderTop: '1px solid var(--gray-5)', paddingTop: '8px' }}>
            <Text weight="bold">Total</Text>
            <Text weight="bold">${total.toFixed(2)}</Text>
          </Flex>
        </Box>
      </Card>

      {/* Payment methods */}
      <Card>
        <Box p="3">
          <Text weight="bold">Payment Method</Text>
          <RadioCards.Root
            value={paymentMethod}
            onValueChange={setPaymentMethod}
            mt="2"
          >
            <RadioCards.Item value="cashier">
              <Flex align="center" gap="2">
                <Wallet size={18} />
                <Text>Pay at Cashier</Text>
              </Flex>
            </RadioCards.Item>
            <RadioCards.Item value="card">
              <Flex align="center" gap="2">
                <CreditCard size={18} />
                <Text>Credit/Debit Card</Text>
              </Flex>
            </RadioCards.Item>
          </RadioCards.Root>
        </Box>
      </Card>

      {/* Payment details - only show if card payment selected */}
      {paymentMethod === "card" && (
        <Card>
          <Box p="3">
            <Text weight="bold" mb="3">Card Details</Text>
            <Box py="4">
              <Text size="2" color="gray" align="center">
                Card payment will be processed at the table by our staff with a mobile payment terminal.
              </Text>
            </Box>
          </Box>
        </Card>
      )}

      {/* Submit order button */}
      <Button 
        size="3" 
        onClick={completeOrder} 
        color="green"
      >
        <Send size={18} />
        Place Order
      </Button>
    </Flex>
  </Box>
);

// Success step component
const SuccessStep = ({
  orderNumber,
  tableNumber,
  orderItems,
  total,
  paymentMethod,
  resetOrder,
}: {
  orderNumber: string;
  tableNumber: string;
  orderItems: OrderItem[];
  total: number;
  paymentMethod: string;
  resetOrder: () => void;
}) => (
  <Box style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
    <Card size="3" style={{ maxWidth: '400px', width: '100%' }}>
      <Flex direction="column" gap="5" align="center">
        <Box style={{ 
          width: '80px', 
          height: '80px', 
          borderRadius: '50%', 
          backgroundColor: 'var(--green-5)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center'
        }}>
          <Text style={{ fontSize: '40px' }}>✓</Text>
        </Box>
        
        <Box>
          <Heading size="5" align="center" mb="2">Order Placed Successfully!</Heading>
          <Text size="2" color="gray" align="center" mb="4">
            Your order has been received and is being prepared.
          </Text>
        </Box>
        
        <Card style={{ width: '100%', border: '1px solid var(--gray-5)' }}>
          <Flex direction="column" gap="3" p="3">
            <Flex justify="between">
              <Text weight="bold">Order Number:</Text>
              <Text>{orderNumber}</Text>
            </Flex>
            
            {tableNumber && (
              <Flex justify="between">
                <Text weight="bold">Table:</Text>
                <Text>{tableNumber}</Text>
              </Flex>
            )}
            
            <Flex justify="between">
              <Text weight="bold">Items:</Text>
              <Text>{orderItems.length}</Text>
            </Flex>
            
            <Flex justify="between">
              <Text weight="bold">Total:</Text>
              <Text>${total.toFixed(2)}</Text>
            </Flex>
            
            <Flex justify="between">
              <Text weight="bold">Payment:</Text>
              <Text>{paymentMethod === "cashier" ? "Pay at Cashier" : "Card Payment"}</Text>
            </Flex>
          </Flex>
        </Card>
        
        <Button 
          size="3" 
          onClick={resetOrder} 
          style={{ width: '100%' }}
        >
          Return to Menu
        </Button>
      </Flex>
    </Card>
  </Box>
);

export default function OrderMobilePage() {
  // Step management
  const [currentStep, setCurrentStep] = useState<OrderStep>("menu");
  
  // Order state
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All Dishes");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<number[]>([]);
  const [itemNotes, setItemNotes] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("cashier");
  const [customerName, setCustomerName] = useState<string>("");
  const [tableNumber, setTableNumber] = useState<string>("");
  const [orderNumber, setOrderNumber] = useState<string>("");
  
  // Categories for menu filtering
  const categories = [
    {
      title: "All Dishes",
      icon: <ChefHatIcon size={14} />
    }, 
    {
      title: "Main",
      icon: <ForkKnife size={14} />
    }, 
    {
      title: "Sides",
      icon: <Sandwich size={14} />
    }, 
    {
      title: "Desserts",
      icon: <Cake size={14} />
    }, 
    {
      title: "Drinks",
      icon: <Coffee size={14} />
    }
  ];
  
  // Sample menu items
  const menuItems: MenuItem[] = [
    { 
      id: 1, 
      name: "Classic Burger", 
      price: 9.99, 
      category: "Main",
      description: "Juicy beef patty with lettuce, tomato, and special sauce",
      image: "/images/order/burger.jpg",
      sizes: [
        { name: "Small", price: 9.99 },
        { name: "Medium", price: 11.99 },
        { name: "Large", price: 13.99 }
      ],
      addons: [
        { id: 101, name: "Extra Cheese", price: 1.50 },
        { id: 102, name: "Bacon", price: 2.00 }
      ]
    },
    { 
      id: 2, 
      name: "Margherita Pizza", 
      price: 12.99, 
      category: "Main",
      description: "Traditional pizza with tomato sauce, mozzarella, and basil",
      image: "/images/order/pizza.jpg",
      sizes: [
        { name: "Small", price: 12.99 },
        { name: "Medium", price: 15.99 },
        { name: "Large", price: 18.99 }
      ],
      addons: [
        { id: 201, name: "Extra Cheese", price: 2.00 },
        { id: 202, name: "Mushrooms", price: 1.50 }
      ]
    },
    { 
      id: 3, 
      name: "French Fries", 
      price: 4.99, 
      category: "Sides",
      description: "Crispy golden fries with sea salt",
      image: "/images/order/fries.jpg",
      sizes: [
        { name: "Small", price: 4.99 },
        { name: "Medium", price: 5.99 },
        { name: "Large", price: 6.99 }
      ],
      addons: [
        { id: 301, name: "Cheese Sauce", price: 1.00 },
        { id: 302, name: "Truffle Oil", price: 2.50 }
      ]
    },
    { 
      id: 4, 
      name: "Chocolate Cake", 
      price: 6.99, 
      category: "Desserts",
      description: "Rich chocolate cake with fudge frosting",
      image: "/images/order/cake.jpg"
    },
    { 
      id: 5, 
      name: "Iced Coffee", 
      price: 3.99, 
      category: "Drinks",
      description: "Cold brewed coffee served over ice",
      image: "/images/order/coffee.jpg",
      sizes: [
        { name: "Small", price: 3.99 },
        { name: "Medium", price: 4.99 },
        { name: "Large", price: 5.99 }
      ],
      addons: [
        { id: 501, name: "Vanilla Syrup", price: 0.50 },
        { id: 502, name: "Whipped Cream", price: 0.75 }
      ]
    },
    {
      id: 6,
      name: "Coke",
      price: 2.99,
      category: "Drinks",
      description: "Classic Coca-Cola",
      image: "/images/order/coke.jpg",
    },
    {
      id: 7,
      name: "Sprite",
      price: 2.99,
      category: "Drinks",
      description: "Classic Sprite",
      image: "/images/order/sprite.jpg",
    },
    {
      id: 8,
      name: "Sparkling Water",
      price: 1.99,
      category: "Drinks",
      description: "Classic Sparkling Water",
      image: "/images/order/water.jpg",
    },
    {
      id: 9,
      name: "Ice Tea",
      price: 2.99,
      category: "Drinks",
      description: "Classic Ice Tea",
      image: "/images/order/tea.jpg",
    },
  ];
  
  // Filter menu items based on selected category
  const filteredMenuItems = selectedCategory === "All Dishes" 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  // Item detail modal functions
  const openItemModal = (item: MenuItem) => {
    setSelectedItem(item);
    setQuantity(1);
    setSelectedSize(item.sizes ? item.sizes[0].name : null);
    setSelectedAddons([]);
    setItemNotes("");
  };

  const closeItemModal = () => {
    setSelectedItem(null);
  };

  // Quantity management
  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  // Addon management
  const toggleAddon = (addonId: number) => {
    setSelectedAddons(prev => 
      prev.includes(addonId)
        ? prev.filter(id => id !== addonId)
        : [...prev, addonId]
    );
  };

  // Price calculation
  const calculateItemPrice = () => {
    if (!selectedItem) return 0;
    
    // Base price based on selected size
    let basePrice = selectedItem.price;
    if (selectedItem.sizes && selectedSize) {
      const size = selectedItem.sizes.find(s => s.name === selectedSize);
      if (size) basePrice = size.price;
    }
    
    // Add addon prices
    let addonTotal = 0;
    if (selectedItem.addons) {
      selectedItem.addons.forEach(addon => {
        if (selectedAddons.includes(addon.id)) {
          addonTotal += addon.price;
        }
      });
    }
    
    return (basePrice + addonTotal) * quantity;
  };

  // Add item to order
  const addToOrder = () => {
    if (!selectedItem) return;
    
    const basePrice = selectedItem.sizes && selectedSize
      ? selectedItem.sizes.find(s => s.name === selectedSize)?.price || selectedItem.price
      : selectedItem.price;
    
    const selectedAddonItems = selectedItem.addons
      ? selectedItem.addons.filter(addon => selectedAddons.includes(addon.id))
      : [];
    
    const totalPrice = calculateItemPrice();
    
    const newItem: OrderItem = {
      id: Date.now(), // Use timestamp as unique ID for order items
      name: selectedItem.name,
      basePrice,
      quantity,
      size: selectedSize || undefined,
      addons: selectedAddonItems.length > 0 ? selectedAddonItems : undefined,
      notes: itemNotes.trim() || undefined,
      totalPrice
    };
    
    setOrderItems(prev => [...prev, newItem]);
    closeItemModal();
  };

  // Order item management
  const removeOrderItem = (itemId: number) => {
    setOrderItems(prev => prev.filter(item => item.id !== itemId));
  };

  const updateOrderItemQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setOrderItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const unitPrice = item.totalPrice / item.quantity;
        return {
          ...item,
          quantity: newQuantity,
          totalPrice: unitPrice * newQuantity
        };
      }
      return item;
    }));
  };

  // Price calculations
  const subtotal = orderItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const taxRate = 0.08; // 8% tax rate
  const taxAmount = subtotal * taxRate;
  const total = subtotal + taxAmount;
  
  // Navigation between steps
  const goToSummary = () => {
    setCurrentStep("summary");
  };
  
  const goToPayment = () => {
    setCurrentStep("payment");
  };
  
  const goBack = () => {
    if (currentStep === "summary") {
      setCurrentStep("menu");
    } else if (currentStep === "payment") {
      setCurrentStep("summary");
    }
  };
  
  const completeOrder = () => {
    // Generate a random order number (in a real app this would come from the backend)
    const newOrderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderNumber(newOrderNumber);
    
    // Move to success screen instead of showing an alert
    setCurrentStep("success");
  };
  
  const resetOrder = () => {
    // Reset all order-related state
    setOrderItems([]);
    setCustomerName("");
    setTableNumber("");
    setPaymentMethod("cashier");
    setCurrentStep("menu");
  };
  
  return (
    <Box style={{ position: 'relative' }}>
      <Box className="mx-auto" style={{ height: '100%', maxWidth: '500px', position: 'relative' }}>  
        {currentStep !== "success" && <Header currentStep={currentStep} goBack={goBack} />}
        {currentStep !== "success" && currentStep !== "menu" && (
          <Box style={{ paddingTop: '40px' }}>
            <StepIndicator currentStep={currentStep} />
          </Box>
        )}
        
        {currentStep === "menu" && (
          <MenuStep 
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categories={categories}
            filteredMenuItems={filteredMenuItems}
            openItemModal={openItemModal}
            orderItems={orderItems}
            subtotal={subtotal}
            goToSummary={goToSummary}
          />
        )}
        
        {currentStep === "summary" && (
          <SummaryStep 
            orderItems={orderItems}
            menuItems={menuItems}
            removeOrderItem={removeOrderItem}
            updateOrderItemQuantity={updateOrderItemQuantity}
            customerName={customerName}
            handleCustomerNameChange={setCustomerName}
            tableNumber={tableNumber}
            handleTableNumberChange={setTableNumber}
            subtotal={subtotal}
            taxAmount={taxAmount}
            total={total}
            goToPayment={goToPayment}
          />
        )}
        
        {currentStep === "payment" && (
          <PaymentStep 
            orderItems={orderItems}
            subtotal={subtotal}
            taxAmount={taxAmount}
            total={total}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            completeOrder={completeOrder}
          />
        )}
        
        {currentStep === "success" && (
          <SuccessStep 
            orderNumber={orderNumber}
            tableNumber={tableNumber}
            orderItems={orderItems}
            total={total}
            paymentMethod={paymentMethod}
            resetOrder={resetOrder}
          />
        )}
        
        {selectedItem && (
          <ItemDetailModal 
            selectedItem={selectedItem}
            closeItemModal={closeItemModal}
            quantity={quantity}
            decrementQuantity={decrementQuantity}
            incrementQuantity={incrementQuantity}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            selectedAddons={selectedAddons}
            toggleAddon={toggleAddon}
            itemNotes={itemNotes}
            handleItemNotesChange={setItemNotes}
            calculateItemPrice={calculateItemPrice}
            addToOrder={addToOrder}
          />
        )}
      </Box>
    </Box>
  );
}
