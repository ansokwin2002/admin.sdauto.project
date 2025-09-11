"use client";
import { PageHeading } from "@/components/common/PageHeading";
import { Card, Box, Grid, Text, Flex, Link, Inset } from "@radix-ui/themes";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import { usePageTitle } from '@/hooks/usePageTitle';

interface POSFeature {
  title: string;
  description: string;
  link: string;
  image: string;
}

export default function POSPage() {
  usePageTitle('Point of Sale');

  const features: POSFeature[] = [
    {
      title: "Order Counter",
      description: "Quick and easy order management with item attributes and friendly UI.",
      link: "/order",
      image: "/images/order-counter.png"
    },
    {
      title: "Order Mobile",
      description: "Allow customers to order from their mobile phone.",
      link: "/order-mobile",
      image: "/images/order-mobile.png"
    },
    {
      title: "Kitchen Display",
      description: "Real-time order tracking and management system for kitchen staff.",
      link: "/kitchen",
      image: "/images/kitchen-display.png"
    },
    {
      title: "Checkout",
      description: "Streamlined payment processing with multiple payment options.",
      link: "/checkout",
      image: "/images/checkout.png"
    },
  ];

  return (
    <Box>
      <PageHeading title="Point of Sale (POS) Terminal" description="Click on the cards below to view the different screens/views of the POS system." />
      <Grid columns={{ initial: '1', sm: '2', lg: '4' }} gap="4">
        {features.map((feature) => (
          <Link 
            key={feature.title}
            href={feature.link}
            target="_blank"
            style={{ textDecoration: 'none' }}
          >
            <Card size="2">
              <Inset clip="padding-box" side="top" pb="current">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    width={800}
                    height={450}
                    className="w-full h-full object-contain"
                  />
                </Inset>
                <Box>
                  <Flex align="center" gap="2" mb="1">
                    <Text size="5" weight="medium">{feature.title}</Text>
                    <ExternalLink size={16} />
                  </Flex>
                  <Text color="gray" size="2">
                    {feature.description}
                  </Text>
                </Box>
            </Card>
          </Link>
        ))}
      </Grid>
    </Box>
  );
}
