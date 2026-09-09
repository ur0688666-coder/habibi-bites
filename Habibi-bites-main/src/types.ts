export interface MenuItemSize {
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  category: 'Wraps' | 'Zinger' | 'Burgers' | 'Fries & Sides' | 'Drinks' | 'Deals / Combos';
  description: string;
  basePrice: number;
  sizes: MenuItemSize[];
  image: string;
  alt: string;
  popular?: boolean;
  spicy?: boolean;
}

export interface OrderFormValues {
  customerName: string;
  phoneNumber: string;
  deliveryLocation: string;
  selectedItemId: string;
  selectedSize: string;
  deliveryChefNote: string;
}

export interface OrderHistoryItem {
  referenceId: string;
  customerName: string;
  phoneNumber: string;
  deliveryLocation: string;
  selectedItemId: string;
  itemName: string;
  selectedSize: string;
  price: number;
  deliveryChefNote?: string;
  timestamp: string;
  createdAt: number;
}

export interface CustomerReview {
  id: string;
  quote: string;
  author: string;
  badge: string;
  dishRecommended: string;
  rating: number;
}

export interface FeaturePoint {
  id: string;
  title: string;
  description: string;
  iconName: 'Flame' | 'BadgePercent' | 'Leaf' | 'HeartHandshake';
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface GroundingWebSource {
  uri?: string;
  title?: string;
}

export interface GroundingMapSource {
  uri?: string;
  title?: string;
  placeAnswerSources?: {
    reviewSnippets?: Array<{
      reviewText?: string;
    }>;
  };
}

export interface GroundingChunk {
  web?: GroundingWebSource;
  maps?: GroundingMapSource;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  modelUsed?: string;
  mode?: 'general' | 'search' | 'maps';
  groundingChunks?: GroundingChunk[];
  webSearchQueries?: string[];
}
