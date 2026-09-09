import { CustomerReview, FAQItem, FeaturePoint, MenuItem } from '../types';

export const RESTAURANT_INFO = {
  name: 'Habibi Bites',
  tagline: 'Big Flavour. Fresh Bites. Made for You.',
  shortDescription: 'Authentic, delicious and affordable Pakistani bites made fresh for every craving.',
  phone: '0343 4100089',
  phoneRaw: '03434100089',
  phoneTel: 'tel:03434100089',
  googleMapsUrl: 'https://share.google/qSmBhLF07TBLJqIE1',
  facebookUrl: 'https://www.facebook.com/share/195qQ7gAJp/',
  instagramUrl: 'https://www.instagram.com/habibi_bites_qds?igsh=ZDEyNDFqY2JhMmIx',
  currency: 'Rs.',
  serviceHours: '12:00 PM – 2:00 AM (Open 7 Days)',
  deliveryNotice: 'Fast hot delivery across the local community. Freshly prepared to order.',
};

export const MENU_CATEGORIES = [
  'All',
  'Wraps',
  'Zinger',
  'Burgers',
  'Fries & Sides',
  'Drinks',
  'Deals / Combos',
] as const;

export const MENU_ITEMS: MenuItem[] = [
  // Wraps
  {
    id: 'wrap-zinger',
    name: 'Signature Zinger Wrap',
    category: 'Wraps',
    description: 'Crispy golden fried zinger fillet strips rolled in a warm toasted tortilla with shredded iceberg, signature Habibi garlic mayo, and sweet spicy drizzle.',
    basePrice: 380,
    sizes: [
      { name: 'Regular', price: 380 },
      { name: 'Jumbo Double Crisp', price: 520 },
    ],
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80',
    alt: 'Freshly toasted signature zinger wrap filled with crispy chicken, lettuce, and sauces',
    popular: true,
    spicy: true,
  },
  {
    id: 'wrap-bbq-tikka',
    name: 'Spicy BBQ Tikka Wrap',
    category: 'Wraps',
    description: 'Charcoal-grilled tender chicken boti infused with smoky Pakistani BBQ spices, crisp purple onions, fresh coriander, and chilled mint raita.',
    basePrice: 420,
    sizes: [
      { name: 'Regular', price: 420 },
      { name: 'Large Loaded', price: 560 },
    ],
    image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=800&q=80',
    alt: 'Smoky grilled Pakistani BBQ chicken tikka wrap in flatbread',
    popular: true,
    spicy: true,
  },
  {
    id: 'wrap-malai-boti',
    name: 'Creamy Malai Boti Wrap',
    category: 'Wraps',
    description: 'Melt-in-your-mouth creamy marinated chicken morsels tossed in garlic herb emulsion, mild spices, and wrapped with fresh garden greens.',
    basePrice: 430,
    sizes: [
      { name: 'Regular', price: 430 },
      { name: 'Large Feast', price: 570 },
    ],
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=800&q=80',
    alt: 'Creamy malai boti chicken wrap with rich white sauce and herbs',
  },
  {
    id: 'wrap-cheese-lover',
    name: 'Loaded Cheesy Zinger Wrap',
    category: 'Wraps',
    description: 'Extra crunchy chicken strips drowned in warm melted cheddar sauce, mozzarella blend, jalapeños, and secret Habibi sauce.',
    basePrice: 460,
    sizes: [
      { name: 'Regular', price: 460 },
      { name: 'Double Cheese Monster', price: 620 },
    ],
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=800&q=80',
    alt: 'Loaded cheesy chicken wrap oozing with cheddar and peri peri sauce',
    popular: true,
  },

  // Zinger
  {
    id: 'zinger-classic',
    name: 'Classic Crispy Zinger',
    category: 'Zinger',
    description: 'Our iconic buttermilk marinated whole chicken breast, deep fried to crunchy perfection, fresh crispy lettuce, and rich garlic mayo in a toasted sesame bun.',
    basePrice: 450,
    sizes: [
      { name: 'Single Fillet', price: 450 },
      { name: 'Double Decker Fillet', price: 680 },
    ],
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    alt: 'Golden crispy chicken zinger burger with lettuce and creamy sauce in sesame bun',
    popular: true,
  },
  {
    id: 'zinger-fiery-fire',
    name: 'Fiery Fire Zinger',
    category: 'Zinger',
    description: 'Coated in fiery cayenne pepper glaze, layered with pickled jalapeños, pepper jack cheese, and spicy Habibi firehouse dressing.',
    basePrice: 490,
    sizes: [
      { name: 'Single Fillet', price: 490 },
      { name: 'Double Decker Hot', price: 720 },
    ],
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
    alt: 'Spicy fiery zinger chicken burger topped with melted cheese and chili sauce',
    spicy: true,
    popular: true,
  },
  {
    id: 'zinger-mighty-stack',
    name: 'Mighty Cheesy Zinger',
    category: 'Zinger',
    description: 'Two gigantic crispy chicken breast fillets, stacked with dual melted cheddar cheese slices, pickled gherkins, and smoked garlic sauce.',
    basePrice: 690,
    sizes: [
      { name: 'Mighty Double', price: 690 },
      { name: 'Monster Triple Stack', price: 920 },
    ],
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80',
    alt: 'Massive double fillet crispy zinger burger with layers of melted cheese',
  },

  // Burgers
  {
    id: 'burger-chapli-fusion',
    name: 'Pakistani Chapli Fusion Burger',
    category: 'Burgers',
    description: 'Spiced aromatic Pakistani-style chapli kebab patty with crushed coriander seeds, diced ripe tomatoes, mint herb spread, and toasted golden bun.',
    basePrice: 420,
    sizes: [
      { name: 'Single Patty', price: 420 },
      { name: 'Double Patty Deluxe', price: 620 },
    ],
    image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&w=800&q=80',
    alt: 'Pakistani spiced chapli patty burger with fresh coriander and sauce',
    popular: true,
    spicy: true,
  },
  {
    id: 'burger-grilled-fillet',
    name: 'Flame-Grilled Chicken Fillet Burger',
    category: 'Burgers',
    description: 'Lean tender chicken breast fillet flame grilled with lemon herb marinade, crisp red onions, tomatoes, and low-fat pepper sauce.',
    basePrice: 480,
    sizes: [
      { name: 'Single Fillet', price: 480 },
      { name: 'Double Fillet', price: 690 },
    ],
    image: 'https://images.unsplash.com/photo-1520072959219-c595dc870360?auto=format&fit=crop&w=800&q=80',
    alt: 'Healthy flame-grilled chicken fillet burger with fresh garden vegetables',
  },
  {
    id: 'burger-gourmet-beef',
    name: 'Habibi Prime Beef Burger',
    category: 'Burgers',
    description: 'Handcrafted seasoned beef patty seared on high heat, topped with caramelized onions, tangy pickle relish, and vintage melted cheddar cheese.',
    basePrice: 550,
    sizes: [
      { name: 'Single (150g)', price: 550 },
      { name: 'Double Patty (300g)', price: 790 },
    ],
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=800&q=80',
    alt: 'Juicy gourmet beef burger with melting cheese and caramelized onions',
  },

  // Fries & Sides
  {
    id: 'fries-loaded-cheesy',
    name: 'Loaded Cheesy Fiesta Fries',
    category: 'Fries & Sides',
    description: 'Crispy skin-on fries drowned in warm melted cheese sauce, topped with shredded spicy chicken bites, jalapeño rings, and Habibi spicy mayo.',
    basePrice: 380,
    sizes: [
      { name: 'Regular Basket', price: 380 },
      { name: 'Large Sharing Feast', price: 540 },
    ],
    image: 'https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=800&q=80',
    alt: 'Hot golden fries loaded with melted cheese, chicken bits, and jalapeños',
    popular: true,
  },
  {
    id: 'fries-spicy-masala',
    name: 'Special Masala Crispy Fries',
    category: 'Fries & Sides',
    description: 'Signature golden crinkle-cut fries tossed vigorously in authentic Pakistani chaat masala and served with tangy garlic mayo dip.',
    basePrice: 220,
    sizes: [
      { name: 'Regular', price: 220 },
      { name: 'Large', price: 320 },
    ],
    image: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=800&q=80',
    alt: 'Crispy golden fries tossed in Pakistani masala spices',
  },
  {
    id: 'side-hot-wings',
    name: 'Crispy Spicy Hot Wings',
    category: 'Fries & Sides',
    description: 'Marinated succulent chicken wings coated in crunchy batter, fried crisp and shaken in our tangy chili pepper sauce.',
    basePrice: 390,
    sizes: [
      { name: '6 Pieces', price: 390 },
      { name: '10 Pieces', price: 620 },
    ],
    image: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=800&q=80',
    alt: 'Golden brown crunchy hot wings with dipping sauce',
    spicy: true,
  },
  {
    id: 'side-tenders',
    name: 'Crunchy Chicken Tenders',
    category: 'Fries & Sides',
    description: '100% whole white-meat chicken tenders marinated overnight, hand-breaded, and served piping hot with choice of dip.',
    basePrice: 380,
    sizes: [
      { name: '4 Pieces', price: 380 },
      { name: '8 Pieces', price: 690 },
    ],
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=800&q=80',
    alt: 'Crispy golden fried chicken breast tenders',
  },

  // Drinks
  {
    id: 'drink-mint-lemonade',
    name: 'Habibi Mint Lemonade Cooler',
    category: 'Drinks',
    description: 'Refreshing blended fresh mint leaves, squeezed lemon juice, black salt, and sparkling soda over crushed ice. The perfect palate refresher.',
    basePrice: 180,
    sizes: [
      { name: 'Regular (350ml)', price: 180 },
      { name: 'Large (500ml)', price: 260 },
    ],
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    alt: 'Chilled green mint lemonade with fresh mint leaves and lemon slice',
    popular: true,
  },
  {
    id: 'drink-soft-drink',
    name: 'Chilled Soft Drinks',
    category: 'Drinks',
    description: 'Ice cold carbonated beverages of your choice: Coca-Cola, Sprite, Fanta, or Mountain Dew.',
    basePrice: 100,
    sizes: [
      { name: 'Can (345ml)', price: 100 },
      { name: 'Bottle (500ml)', price: 130 },
      { name: 'Jumbo Bottle (1.5 Litre)', price: 240 },
    ],
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80',
    alt: 'Chilled refreshing soft drink in glass with condensation and ice cubes',
  },
  {
    id: 'drink-karak-chai',
    name: 'Special Doodh Patti Karak Chai',
    category: 'Drinks',
    description: 'Rich, slow-simmered Pakistani cardamom tea brewed in full-cream milk. A comforting traditional classic.',
    basePrice: 120,
    sizes: [
      { name: 'Standard Cup', price: 120 },
      { name: 'Kulhad Large Cup', price: 180 },
    ],
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    alt: 'Steaming hot traditional Pakistani karak chai in a cup with cardamom aroma',
  },

  // Deals / Combos
  {
    id: 'deal-solo-feast',
    name: 'Habibi Solo Zinger Feast',
    category: 'Deals / Combos',
    description: '1 Classic Crispy Zinger Burger + 1 Regular Masala Crispy Fries + 1 Chilled Soft Drink (Can). The ultimate individual meal.',
    basePrice: 650,
    sizes: [
      { name: 'Solo Combo Box', price: 650 },
    ],
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=800&q=80',
    alt: 'Complete fast food combo with burger, crispy fries, and soft drink',
    popular: true,
  },
  {
    id: 'deal-duo-wrap',
    name: 'Duo Wrap Crunch Box',
    category: 'Deals / Combos',
    description: '2 Signature Zinger Wraps + 1 Large Loaded Cheesy Fiesta Fries + 2 Chilled Soft Drinks. Best value for two hungry foodies.',
    basePrice: 1190,
    sizes: [
      { name: 'Duo Box Deal', price: 1190 },
    ],
    image: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=800&q=80',
    alt: 'Two delicious chicken wraps paired with loaded golden fries and beverages',
    popular: true,
  },
  {
    id: 'deal-family-mega',
    name: 'Habibi Mega Family Deal',
    category: 'Deals / Combos',
    description: '2 Classic Zinger Burgers + 2 Signature Zinger Wraps + 1 Jumbo Masala Fries + 6 Crispy Hot Wings + 1.5L Chilled Soft Drink Bottle.',
    basePrice: 2350,
    sizes: [
      { name: 'Family Mega Feast', price: 2350 },
    ],
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    alt: 'Large family meal combo spread with burgers, wraps, hot wings, and drinks',
  },
];

export const CUSTOMER_REVIEWS: CustomerReview[] = [
  {
    id: 'review-1',
    quote: 'The taste is amazing, along with prise and staff.',
    author: 'Satisfied Customer',
    badge: 'Verified Local Diner',
    dishRecommended: 'Zinger Burger & Masala Fries',
    rating: 5,
  },
  {
    id: 'review-2',
    quote: 'Everything here is delicious and very affordable. The wrap especially is amazing-packed with flavor and loaded with tasty sauces. Definitely a must-try!',
    author: 'Food Enthusiast',
    badge: 'Frequent Customer',
    dishRecommended: 'Signature Zinger Wrap',
    rating: 5,
  },
  {
    id: 'review-3',
    quote: 'I ordered Zinger Wrap it was fantastic and juicy.',
    author: 'Wrap Lover',
    badge: 'Online Order',
    dishRecommended: 'Zinger Wrap',
    rating: 5,
  },
];

export const WHY_CHOOSE_ITEMS: FeaturePoint[] = [
  {
    id: 'feat-taste',
    title: 'Amazing Taste',
    description: 'Freshly prepared food packed with flavor.',
    iconName: 'Flame',
  },
  {
    id: 'feat-price',
    title: 'Affordable Prices',
    description: 'Delicious food at prices customers can enjoy.',
    iconName: 'BadgePercent',
  },
  {
    id: 'feat-ingredients',
    title: 'Fresh Ingredients',
    description: 'Quality ingredients prepared with care.',
    iconName: 'Leaf',
  },
  {
    id: 'feat-staff',
    title: 'Friendly Staff',
    description: 'Warm and welcoming customer service.',
    iconName: 'HeartHandshake',
  },
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-1',
    question: 'How can I place an order?',
    answer: 'Use the online order form and provide your name, phone number, delivery location, selected item, size, and any notes.',
  },
  {
    id: 'faq-2',
    question: 'Can I add a special note to my order?',
    answer: 'Yes. Use the “Note for Delivery Man or Chef” field.',
  },
  {
    id: 'faq-3',
    question: 'How will my order be confirmed?',
    answer: 'After submitting an order request, Habibi Bites can contact the customer using the provided phone number to confirm the order.',
  },
  {
    id: 'faq-4',
    question: 'Where is Habibi Bites located?',
    answer: 'Use the supplied Google Maps link through the “Get Directions” button.',
  },
  {
    id: 'faq-5',
    question: 'How can I contact Habibi Bites?',
    answer: 'Call 0343 4100089.',
  },
];
