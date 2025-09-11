'use client';

import { Box, Card, Flex, Heading, Text } from '@radix-ui/themes';

export default function FAQPage() {
  const faqs = [
    {
      question: "What is EatlyPOS?",
      answer: "EatlyPOS is a Next.js-based Restaurant Management System template designed for developers, agencies, and restaurant owners. It provides a solid foundation for building custom restaurant management solutions with modern web technologies, featuring order management, multi-branch support, and comprehensive business tools."
    },
    {
      "question": "Is this a complete restaurant management system?",
      "answer": "EatlyPOS is a frontend template with all UI components needed for a restaurant management system. You'll need to implement the backend API and database according to your specific requirements."
    },
    {
      "question": "Do I need to be a developer to use this?",
      "answer": "Yes, this is a developer tool that requires programming knowledge to implement. Restaurant owners should work with a developer to customize and deploy the template."
    },
    {
      "question": "What technologies does EatlyPOS use?",
      "answer": "EatlyPOS is built with Next.js, React, TypeScript, Tailwind CSS, and Radix UI. It uses modern frontend practices and is designed to be integrated with any backend."
    },
    {
      "question": "Can I customize the template to match my brand?",
      "answer": "Absolutely! The template is fully customizable. You can change colors, fonts, logos, and any other visual elements to match your brand identity."
    },
    {
      "question": "What kind of support is included?",
      "answer": "Standard license includes 6 months of basic email support for bug fixes. Extended license includes lifetime priority support for technical issues."
    },
    {
      question: "What features are included?",
      answer: "Key features include multi-branch architecture with role-based access control, modern UI components with dark mode support, comprehensive order management, and business analytics. The system is built with TypeScript and includes modern development tools like ESLint and Prettier preconfigured."
    },
  ];

  return (
    <Box>
      <Heading size="6" mb="4">Frequently Asked Questions</Heading>
      
      <Flex direction="column" gap="4">
        {faqs.map((faq, index) => (
          <Card key={index} className="bg-white">
            <Box>
              <Heading size="3" mb="2">{faq.question}</Heading>
              <Text as="p" color="gray">{faq.answer}</Text>
            </Box>
          </Card>
        ))}
      </Flex>
    </Box>
  );
}
