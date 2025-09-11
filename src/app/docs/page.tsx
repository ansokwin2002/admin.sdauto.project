"use client";

import { Heading, Text, Flex, Grid } from "@radix-ui/themes";
import { BookOpen, Layout, Palette, HelpCircle } from "lucide-react";
import Link from "next/link";
import { usePageTitle } from "@/hooks/usePageTitle";

const DocCard = ({ title, description, icon, href }) => (
  <Link href={href} className="no-underline">
    <Flex direction="column" gap="3">
      <Flex gap="2" align="center">
        {icon}
        <Heading size="4">{title}</Heading>
      </Flex>
      <Text color="gray" size="2">{description}</Text>
    </Flex>
  </Link>
);

export default function DocsHome() {
  usePageTitle('Documentation');
  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      <Heading size="8" mb="4">EatlyPOS Documentation</Heading>
      <Text as="p" size="3" mb="4">
        Welcome to the EatlyPOS documentation. Here you&apos;ll find comprehensive guides and documentation to help you start working with EatlyPOS as quickly as possible.
      </Text>
      
      <Grid columns={{initial: "1", sm: "2"}} gap="6" className="mt-10">
        <DocCard
          title="Getting Started"
          description="Learn how to install, set up your development environment, and understand the project structure"
          icon={<BookOpen size={24} className="text-orange-500" />}
          href="/docs/getting-started/installation"
        />
        <DocCard
          title="User Interface"
          description="Explore our UI framework and various layout options available in EatlyPOS"
          icon={<Layout size={24} className="text-orange-500" />}
          href="/docs/ui/ui-framework"
        />
        <DocCard
          title="Customization"
          description="Learn how to style, add features, and extend components in EatlyPOS"
          icon={<Palette size={24} className="text-orange-500" />}
          href="/docs/customization/styling"
        />
        <DocCard
          title="Helpful Resources"
          description="Find answers to common questions, get support, and stay updated with changes"
          icon={<HelpCircle size={24} className="text-orange-500" />}
          href="/docs/resources/faq"
        />
      </Grid>
    </div>
  );
} 