// FAQ Data Types and Sample Data

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
  created_at?: string;
  updated_at?: string;
}

// Sample FAQ data for development/testing
export const sampleFaqs: FaqItem[] = [
  {
    id: 1,
    question: "How do I place an order?",
    answer: "<p>To place an order, simply browse our menu, select the items you want, and proceed to checkout. You can customize your order and choose your preferred pickup or delivery time.</p>",
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-15T10:30:00Z"
  },
  {
    id: 2,
    question: "What are your delivery hours?",
    answer: "<p>We deliver from <strong>11:00 AM to 10:00 PM</strong> Monday through Sunday. Delivery times may vary based on location and order volume.</p>",
    created_at: "2024-01-15T11:00:00Z",
    updated_at: "2024-01-15T11:00:00Z"
  },
  {
    id: 3,
    question: "Do you offer vegetarian and vegan options?",
    answer: "<p>Yes! We have a wide variety of vegetarian and vegan options clearly marked on our menu. Look for the <em>V</em> (vegetarian) and <em>VG</em> (vegan) symbols next to menu items.</p>",
    created_at: "2024-01-15T11:15:00Z",
    updated_at: "2024-01-15T11:15:00Z"
  },
  {
    id: 4,
    question: "What payment methods do you accept?",
    answer: "<p>We accept the following payment methods:</p><ul><li>Credit/Debit Cards (Visa, MasterCard, American Express)</li><li>PayPal</li><li>Apple Pay</li><li>Google Pay</li><li>Cash on Delivery (where available)</li></ul>",
    created_at: "2024-01-15T12:00:00Z",
    updated_at: "2024-01-15T12:00:00Z"
  },
  {
    id: 5,
    question: "Can I cancel or modify my order?",
    answer: "<p>You can cancel or modify your order within <strong>5 minutes</strong> of placing it. After this time, please contact our customer service team and we'll do our best to accommodate your request.</p>",
    created_at: "2024-01-15T12:30:00Z",
    updated_at: "2024-01-15T12:30:00Z"
  }
];

// FAQ Categories (for future enhancement)
export const faqCategories = [
  { id: 'ordering', name: 'Ordering', color: 'blue' },
  { id: 'delivery', name: 'Delivery & Pickup', color: 'green' },
  { id: 'payment', name: 'Payment', color: 'orange' },
  { id: 'menu', name: 'Menu & Dietary', color: 'purple' },
  { id: 'account', name: 'Account & Profile', color: 'red' },
  { id: 'general', name: 'General', color: 'gray' }
];

// Helper functions
export const getFaqById = (id: number): FaqItem | undefined => {
  return sampleFaqs.find(faq => faq.id === id);
};

export const searchFaqs = (query: string): FaqItem[] => {
  const lowercaseQuery = query.toLowerCase();
  return sampleFaqs.filter(faq => 
    faq.question.toLowerCase().includes(lowercaseQuery) ||
    faq.answer.toLowerCase().includes(lowercaseQuery)
  );
};

export const getFaqsByCategory = (categoryId: string): FaqItem[] => {
  // This would be implemented when categories are added to the FAQ model
  return sampleFaqs;
};
