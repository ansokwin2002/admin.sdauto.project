"use client";
import { useState, useRef, useEffect } from "react";
import { Plus, Minus, Trash2, X, ChefHatIcon, ForkKnife, Sandwich, Cake, Coffee, Receipt, Send } from "lucide-react";
import { Card, Box, Flex, Text, Button, IconButton, Heading, Grid, Dialog, Inset, ScrollArea, Badge, RadioCards, CheckboxCards, TextArea } from "@radix-ui/themes";
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

interface FlyingImage {
  src: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  key: number;
}

export default function OrderPage() {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    {
      id: 1001,
      name: "Classic Burger",
      basePrice: 11.99,
      quantity: 2,
      size: "Medium",
      addons: [
        { id: 101, name: "Extra Cheese", price: 1.50 },
        { id: 102, name: "Bacon", price: 2.00 }
      ],
      notes: "No onions please",
      totalPrice: 31.98
    },
    {
      id: 1002,
      name: "Iced Coffee",
      basePrice: 4.99,
      quantity: 1,
      size: "Medium",
      addons: [
        { id: 501, name: "Vanilla Syrup", price: 0.50 }
      ],
      totalPrice: 5.49
    }
  ]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All Dishes");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<number[]>([]);
  const [itemNotes, setItemNotes] = useState<string>("");
  const [flyingImages, setFlyingImages] = useState<FlyingImage[]>([]);
  
  const menuRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);
  const animationIdRef = useRef<number>(0);

  const categories = [
    {
      title: "All Dishes",
      icon: <ChefHatIcon />
    }, 
    {
      title: "Main",
      icon: <ForkKnife />
    }, 
    {
      title: "Sides",
      icon: <Sandwich />
    }, 
    {
      title: "Desserts",
      icon: <Cake />
    }, 
    {
      title: "Drinks",
      icon: <Coffee />
    }
  ];
  
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

  const filteredMenuItems = selectedCategory === "All Dishes" 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

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

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const calculateItemPrice = () => {
    if (!selectedItem) return 0;
    
    let basePrice = selectedItem.price;
    if (selectedItem.sizes && selectedSize) {
      const size = selectedItem.sizes.find(s => s.name === selectedSize);
      if (size) basePrice = size.price;
    }
    
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

  const startFlyingAnimation = (imageSrc: string, startRect: DOMRect, endRect: DOMRect) => {
    const newKey = Date.now();
    const newFlyingImage: FlyingImage = {
      src: imageSrc,
      startX: startRect.left + startRect.width / 2,
      startY: startRect.top + startRect.height / 2,
      endX: endRect.left + endRect.width / 2,
      endY: endRect.top + endRect.height / 2,
      key: newKey
    };

    setFlyingImages(prev => [...prev, newFlyingImage]);

    // Remove the flying image after animation completes
    setTimeout(() => {
      setFlyingImages(prev => prev.filter(img => img.key !== newKey));
    }, 1000);
  };

  const addToOrder = () => {
    if (!selectedItem) return;
    
    // Get positions for animation
    if (menuRef.current && cartRef.current && selectedItem) {
      const menuItem = document.querySelector(`[data-item-id="${selectedItem.id}"]`);
      if (menuItem) {
        const menuRect = menuItem.getBoundingClientRect();
        const cartRect = cartRef.current.getBoundingClientRect();
        
        startFlyingAnimation(selectedItem.image, menuRect, cartRect);
      }
    }
    
    const basePrice = selectedItem.sizes && selectedSize
      ? selectedItem.sizes.find(s => s.name === selectedSize)?.price || selectedItem.price
      : selectedItem.price;
    
    const selectedAddonItems = selectedItem.addons
      ? selectedItem.addons.filter(addon => selectedAddons.includes(addon.id))
      : [];
    
    const totalPrice = calculateItemPrice();
    
    const newItem: OrderItem = {
      id: Date.now(),
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

  const subtotal = orderItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const taxRate = 0.08;
  const taxAmount = subtotal * taxRate;
  const total = subtotal + taxAmount;

  return (
    <Flex gap="4" height="100%">
      {/* Logo and Categories */}
      <Box className="lg:col-span-2" width="120px">
        <Flex direction="column" gap="4">
          <Box mb="4" className="mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="25" fill="none">
              <path fill="#FEC08C" d="M24.234 3.421c.861 0 1.558-.569 1.558-1.278 0-.704-.697-1.278-1.558-1.278-.861 0-1.558.574-1.558 1.278 0 .71.697 1.278 1.558 1.278Z"/>
              <mask id="a" width="48" height="5" x="0" y="20" maskUnits="userSpaceOnUse" style={{ maskType: 'luminance'}}>
                <path fill="#fff" d="M0 20.702h48v4.163H0v-4.163Z"/>
              </mask>
              <g mask="url(#a)">
                <path fill="#FEC08C" d="M46.565 21.303H1.903c-1.052 0-1.903.86-1.903 1.923 0 1.064.85 1.923 1.903 1.923h44.662c1.052 0 1.903-.86 1.903-1.923 0-1.063-.85-1.923-1.904-1.923Z"/>
              </g>
              <path fill="#FC8019" d="M9.746 14.718c.457-2.278 1.871-4.77 4.088-5.732.41-.182.771.435.357.613-2.069.902-3.345 3.185-3.765 5.307-.09.451-.77.263-.68-.188Zm33.33 5.656c.011-.177.017-.354.017-.532 0-8.557-8.444-15.491-18.86-15.491-10.415 0-18.858 6.934-18.858 15.491 0 .178.006.355.01.532h37.692Z"/>
            </svg>
          </Box>
          
          <Flex direction="column" gap="2">
            {categories.map(category => (
              <Button 
                key={category.title}
                variant={selectedCategory === category.title ? "solid" : "soft"}
                onClick={() => setSelectedCategory(category.title)}
                size="3"
                className="h-auto px-8 !py-12"
              >
                <Flex direction="column" align="center" gap="2">
                  <span className="opacity-50">{category.icon}</span>
                  <span className="font-bold">{category.title}</span>
                </Flex>
              </Button>
            ))}
          </Flex>
        </Flex>
      </Box>

      {/* Menu Items */}
      <Box className="lg:col-span-6" flexGrow="1" ref={menuRef}>
        <ScrollArea className="!h-[calc(100vh-50px)] pr-8" size="2" type="always" scrollbars="vertical">
          <Grid columns={{ initial: '1', sm: '2', lg: '4' }} gap="6">
            {filteredMenuItems.map((item) => (
              <Card 
                size="2" 
                key={item.id} 
                className="cursor-pointer" 
                onClick={() => openItemModal(item)}
                data-item-id={item.id}
              >
                <Inset clip="padding-box" side="top" pb="current">
                  <Image 
                    src={item.image} 
                    alt={item.name} 
                    width={447}
                    height={190}
                    style={{
                      display: "block",
                      objectFit: "cover",
                      width: "100%",
                      height: 190,
                      backgroundColor: "var(--gray-5)",
                    }}
                  />
                </Inset>
                <Flex direction="column" gap="2">
                  <Text weight="medium">{item.name}</Text>
                  <Text size="1" color="gray">
                    {item.description}
                  </Text>
                  <Text size="3" weight="bold">${item.price.toFixed(2)}</Text>
                </Flex>
              </Card>
            ))}
          </Grid>
        </ScrollArea>
      </Box>

      {/* Order Summary */}
      <Box className="lg:col-span-4" minWidth="400px" ref={cartRef}>
        <Card size="2" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 50px)' }}>
          {/* Order Header */}
          <Box>
            <Flex justify="between" align="center" mb="4">
              <Text size="3" weight="bold"></Text>
              <Badge size="3" color="gray" variant="outline">Order #123456</Badge>
            </Flex>
          </Box>
          
          {/* Order Items - Scrollable Area */}
          <Box style={{ flex: '1 1 auto', overflow: 'hidden' }}>
            <ScrollArea style={{ height: '100%' }} type="always" scrollbars="vertical" size="1" className="pr-6">
              {orderItems.length === 0 ? (
                <Text color="gray" align="center" mt="4">Please select an item from the menu</Text>
              ) : (
                orderItems.map((item) => (
                  <Flex 
                    key={item.id} 
                    direction="column"
                    py="3" 
                  >
                    <Flex justify="between" align="start">
                      <Flex gap="3" align="start">
                        <Box style={{ position: 'relative', width: '50px', height: '50px', flexShrink: 0 }}>
                          <Image 
                            src={menuItems.find(menuItem => menuItem.name === item.name)?.image || ''}
                            alt={item.name}
                            fill
                            sizes="50px"
                            style={{ objectFit: 'cover', borderRadius: '4px' }}
                          />
                        </Box>
                        <Box>
                          <Heading size="3">{item.name}</Heading>
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
                          size="2"
                          onClick={() => updateOrderItemQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus size={18} />
                        </IconButton>
                        <Text size="3">{item.quantity}</Text>
                        <IconButton 
                          variant="soft" 
                          size="2"
                          onClick={() => updateOrderItemQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus size={18} />
                        </IconButton>
                      </Flex>
                      <Text weight="medium">${item.totalPrice.toFixed(2)}</Text>
                    </Flex>
                  </Flex>
                ))
              )}
            </ScrollArea>
          </Box>
          
          {/* Order Summary - Fixed at Bottom */}
          <Box style={{ 
            flex: '0 0 auto', 
            borderTop: '1px solid var(--gray-5)', 
            paddingTop: '16px',
            marginTop: '8px',
            backgroundColor: 'var(--color-panel-solid)'
          }}>
            <Flex justify="between" mb="2">
              <Text>Subtotal</Text>
              <Text>${subtotal.toFixed(2)}</Text>
            </Flex>
            <Flex justify="between" mb="2">
              <Text>Tax (8%)</Text>
              <Text>${taxAmount.toFixed(2)}</Text>
            </Flex>
            <Flex justify="between" mb="4" style={{ borderTop: '1px solid var(--gray-5)', paddingTop: '8px' }}>
              <Text weight="bold">Total</Text>
              <Text weight="bold">${total.toFixed(2)}</Text>
            </Flex>
            <Flex gap="2">
              <Button size="4" variant="soft" className="!py-10">
                <Flex direction="column" align="center" gap="2">
                  <Receipt size={20} />
                  <Text size="3" weight="bold">Bill</Text>
                </Flex>
              </Button>
              <Button size="4" disabled={orderItems.length === 0} className="!flex-1 !py-10">
                <Flex direction="column" align="center" gap="2">
                  <Send size={20} />
                  <Text size="3" weight="bold">Place Order</Text>
                </Flex>
              </Button>
            </Flex>
          </Box>
        </Card>
      </Box>

      {/* Flying Images */}
      {flyingImages.map((img) => (
        <div
          key={img.key}
          className="fixed z-50 pointer-events-none"
          style={{
            width: '200px',
            height: '200px',
            left: img.startX,
            top: img.startY,
            transform: `translate(${img.endX - img.startX}px, ${img.endY - img.startY}px)`,
            transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)',
            opacity: 0,
            animation: 'fadeInOut 1s forwards'
          }}
        >
          <Image
            src={img.src}
            alt="Flying item"
            width={50}
            height={50}
            style={{
              borderRadius: '4px',
              objectFit: 'cover',
              width: '100%',
              height: '100%'
            }}
          />
        </div>
      ))}

      {/* Add this to your global CSS or style tag */}
      <style jsx global>{`
        @keyframes fadeInOut {
          0% { opacity: 1; transform: translate(0, 0) scale(1); }
          50% { opacity: 0.8; transform: translate(calc(${flyingImages[0]?.endX - flyingImages[0]?.startX}px / 2), calc(${flyingImages[0]?.endY - flyingImages[0]?.startY}px / 2)) scale(0.8); }
          100% { opacity: 0; transform: translate(${flyingImages[0]?.endX - flyingImages[0]?.startX}px, ${flyingImages[0]?.endY - flyingImages[0]?.startY}px) scale(0.5); }
        }
      `}</style>

      {/* Item Detail Modal */}
      {selectedItem && (
        <Dialog.Root open={!!selectedItem} onOpenChange={closeItemModal}>
          <Dialog.Content style={{ maxWidth: '800px' }}>
            <Flex justify="between" mb="2">
              <Dialog.Title>{selectedItem?.name}</Dialog.Title>
              <Dialog.Close>
                <IconButton variant="ghost" color="gray">
                  <X size={18} />
                </IconButton>
              </Dialog.Close>
            </Flex>
            
            <Flex gap="4">
              {/* Item Image */}
              <Box style={{ position: 'relative', height: '250px' }} flexGrow="1" maxWidth="250px">
                <Image 
                  src={selectedItem.image} 
                  alt={selectedItem.name} 
                  fill 
                  style={{ objectFit: 'cover', borderRadius: '8px' }}
                />
              </Box>
              
              {/* Item Details */}
              <Flex direction="column" gap="4" flexGrow="1">
                <Box>
                  <Dialog.Description size="2" color="gray">{selectedItem.description}</Dialog.Description>
                </Box>
                
                {/* Quantity Selector */}
                <Box>
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
                    <CheckboxCards.Root
                      className="!flex-wrap" 
                      defaultValue={selectedAddons.map(id => id.toString())}
                      onValueChange={(value) => setSelectedAddons(value.map(Number))}
                    >
                      {selectedItem.addons.map(addon => (
                        <CheckboxCards.Item key={addon.id} value={addon.id.toString()}>
                          <Text>{addon.name} (+${addon.price.toFixed(2)})</Text>
                        </CheckboxCards.Item>
                      ))}
                    </CheckboxCards.Root>
                  </Flex>
                )}
                
                {/* Notes Field */}
                <Flex direction="column" gap="2">
                  <Text>Special Instructions</Text>
                  <TextArea
                    placeholder="Add special instructions here..."
                    value={itemNotes}
                    onChange={(e) => setItemNotes(e.target.value)}
                    rows={2}
                  />
                </Flex>
                
                <Box mt="auto">
                  <Flex justify="between" align="center" mb="3">
                    <Text weight="bold">Total:</Text>
                    <Text weight="bold">${calculateItemPrice().toFixed(2)}</Text>
                  </Flex>
                  
                  <Flex gap="2">
                    <Button size="3" variant="outline" onClick={closeItemModal} className="!flex-1 !py-8">
                      Cancel
                    </Button>
                    <Button size="3" onClick={addToOrder} className="!flex-1 !py-8">
                      Add to Order
                    </Button>
                  </Flex>
                </Box>
              </Flex>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
      )}
    </Flex>
  );
}