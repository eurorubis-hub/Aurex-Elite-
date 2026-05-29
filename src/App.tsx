import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Heart, 
  User as UserIcon, 
  MessageSquare, 
  Search, 
  Plus, 
  Trash2, 
  Edit, 
  ChevronRight, 
  Star, 
  X, 
  Check, 
  ArrowLeft, 
  ShieldCheck, 
  Sliders, 
  CreditCard, 
  Truck, 
  Award, 
  Settings, 
  Send,
  Eye,
  LogOut,
  Bell,
  Sparkles,
  Camera,
  Layers,
  ChevronDown,
  Lock
} from 'lucide-react';
import { Product, CartItem, User, Order, Review } from './types';

// Mock Default Products
const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Aurex Crown Horology GMT',
    price: 24500,
    description: 'A masterpiece of precision horology, featuring an 18-karat yellow gold fluted bezel, caliber 3285 dual-time movement, and elite sapphire crystal backing. Highly limited edition piece representing the pinnacle of global stature.',
    image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=600&auto=format&fit=crop',
    category: 'Horology',
    rating: 4.9,
    reviewsCount: 18,
    isFeatured: true,
    reviews: [
      { id: 'r1', userName: 'Alexandre Sterling', rating: 5, comment: 'Simply stunning craftsmanship. The 18k gold catches the light beautifully on my yacht.', date: '2026-04-12' },
      { id: 'r2', userName: 'Diana Vance', rating: 5, comment: 'The GMT dual-time helps keeping track of my London and Tokyo offices effortlessly.', date: '2026-05-01' }
    ]
  },
  {
    id: 'p2',
    name: 'Aurex Sovereign Black Sunglasses',
    price: 1350,
    description: 'Gold-finished high-grade titanium frame with deep velvet black, polarized impact-resistant lenses. Hand-finished temples engraved with the subtle Aurex signature crest. Elegant protection for your eyes.',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=600&auto=format&fit=crop',
    category: 'Eyewear',
    rating: 4.8,
    reviewsCount: 9,
    isFeatured: true,
    reviews: [
      { id: 'r3', userName: 'Marcus du Pont', rating: 5, comment: 'Exceptional visual clarity. Light on the nose, grand on presentation.', date: '2026-05-20' }
    ]
  },
  {
    id: 'p3',
    name: 'Royal Ivory Bespoke Peak Tuxedo',
    price: 5800,
    description: 'Tailored carefully from private reserve silk and fine Merino wool. It features elegant peak lapels adorned with subtle golden thread linings. Absolute essential apparel for royal gala dinners.',
    image: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=600&auto=format&fit=crop',
    category: 'Attire',
    rating: 5.0,
    reviewsCount: 6,
    isFeatured: true,
    reviews: [
      { id: 'r4', userName: 'Count Leopold', rating: 5, comment: 'Fitted perfectly. Received multiple compliments at the Grand Ball in Vienna.', date: '2026-03-15' }
    ]
  },
  {
    id: 'p4',
    name: 'Imperial Diamonds & Gold Ring',
    price: 15200,
    description: 'Exquisite 24-karat solid yellow gold band displaying an intricate hand-carved imperial weave, centered by a 1.5-carat flawless brilliant-cut diamond. Certified by general elite diamond institutes.',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop',
    category: 'Jewels',
    rating: 5.0,
    reviewsCount: 11,
    isFeatured: false,
    reviews: [
      { id: 'r5', userName: 'Baroness Beatrice', rating: 5, comment: 'An absolute showstopper ring. Sparkling fire is exceptional under candlelight.', date: '2026-05-18' }
    ]
  },
  {
    id: 'p5',
    name: 'Aurex Elite Chronograph 40',
    price: 31200,
    description: 'Engineered for high-society racing enthusiasts. Hand-assembled platinum chronograph featuring midnight black tachymeter scale bezel and luminous indices coated with real gold dust accents.',
    image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=600&auto=format&fit=crop',
    category: 'Horology',
    rating: 4.8,
    reviewsCount: 14,
    isFeatured: false,
    reviews: []
  },
  {
    id: 'p6',
    name: 'Savoy Crest Gold Trim Sunglasses',
    price: 1850,
    description: 'Inspired by Retro French Riviera style. Double-bridge golden browbar crafted with premium amber tortoiseshell frames. Premium anti-reflective polarized gold-mirror lenses.',
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=600&auto=format&fit=crop',
    category: 'Eyewear',
    rating: 4.7,
    reviewsCount: 5,
    isFeatured: false,
    reviews: []
  }
];

export default function App() {
  // Database States
  const [products, setProducts] = useState<Product[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<{ id: string; text: string; time: string }[]>([]);

  // Search, Categories, and Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Page, Modal, Navigation States
  const [currentTab, setCurrentTab] = useState<'home' | 'wishlist' | 'concierge' | 'cart' | 'profile'>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  
  // Checkout & Ordering Workflows
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [checkoutAddress, setCheckoutAddress] = useState('');
  const [checkoutPaymentMethod, setCheckoutPaymentMethod] = useState<'COD' | 'ONLINE'>('COD');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentStep, setPaymentStep] = useState<number>(0); // 0 = Idle, 1 = Card Form, 2 = Success

  // Card details mock
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVC, setCardCVC] = useState('');

  // Admin States
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductDescription, setNewProductDescription] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('Horology');
  const [newProductImage, setNewProductImage] = useState('');

  // Login/Signup fields
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authError, setAuthError] = useState('');

  // Review fields
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  // Styling Concierge Chats
  const [conciergeMessages, setConciergeMessages] = useState<{ sender: 'user' | 'butler'; text: string; time: string }[]>([
    { sender: 'butler', text: 'Good day. I am Alfred, your private Aurex Concierge. It is my absolute pleasure to guide you through our select catalog. How may I elevate your style today?', time: '09:41' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isConciergeTyping, setIsConciergeTyping] = useState(false);

  // Initialize DB from LocalStorage or Defaults
  useEffect(() => {
    // 1. Initialize Products
    const storedProducts = localStorage.getItem('aurex_products');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      localStorage.setItem('aurex_products', JSON.stringify(INITIAL_PRODUCTS));
      setProducts(INITIAL_PRODUCTS);
    }

    // 2. Initialize Current User Session
    const storedUser = localStorage.getItem('aurex_current_user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }

    // 3. Initialize Wishlist & Cart & Orders
    const storedWish = localStorage.getItem('aurex_wishlist');
    if (storedWish) setWishlist(JSON.parse(storedWish));
    
    const storedCart = localStorage.getItem('aurex_cart');
    if (storedCart) setCart(JSON.parse(storedCart));

    const storedOrders = localStorage.getItem('aurex_orders');
    if (storedOrders) setOrderHistory(JSON.parse(storedOrders));

    // Preset admin credentials in database
    const storedUsers = localStorage.getItem('aurex_users');
    if (!storedUsers) {
      const defaultUsers = [
        { id: 'admin', name: 'Elite Store Comptroller', email: 'admin@aurex.com', phone: '+880 1711112233', password: 'admin123', isAdmin: true }
      ];
      localStorage.setItem('aurex_users', JSON.stringify(defaultUsers));
    }
  }, []);

  // Save changes to LocalStorage
  const saveProductsToDB = (updatedProducts: Product[]) => {
    setProducts(updatedProducts);
    localStorage.setItem('aurex_products', JSON.stringify(updatedProducts));
  };

  const handleUpdateCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('aurex_cart', JSON.stringify(newCart));
  };

  const handleUpdateWishlist = (newWishlist: string[]) => {
    setWishlist(newWishlist);
    localStorage.setItem('aurex_wishlist', JSON.stringify(newWishlist));
  };

  const addNotification = (text: string) => {
    const newNotif = {
      id: Date.now().toString(),
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setNotifications(prev => [newNotif, ...prev.slice(0, 9)]);
  };

  // Auth Functions
  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    const storedUsersString = localStorage.getItem('aurex_users') || '[]';
    const usersList: User[] = JSON.parse(storedUsersString);

    if (authMode === 'login') {
      const foundUser = usersList.find(u => u.email.toLowerCase() === authEmail.toLowerCase() && u.password === authPassword);
      if (foundUser) {
        const sanitizedUser: User = { 
          id: foundUser.id, 
          name: foundUser.name, 
          email: foundUser.email, 
          phone: foundUser.phone, 
          isAdmin: foundUser.isAdmin 
        };
        setCurrentUser(sanitizedUser);
        localStorage.setItem('aurex_current_user', JSON.stringify(sanitizedUser));
        addNotification(`Welcome back, ${sanitizedUser.name}!`);
        // If logged in, clear values and default tab
        setAuthEmail('');
        setAuthPassword('');
        setAuthName('');
        setAuthPhone('');
      } else {
        setAuthError('Invalid credentials. Check your email or try admin123.');
      }
    } else {
      // Sign Up Form validation
      if (!authName || !authEmail || !authPassword || !authPhone) {
        setAuthError('Please fill out all signature fields.');
        return;
      }
      
      const emailExists = usersList.some(u => u.email.toLowerCase() === authEmail.toLowerCase());
      if (emailExists) {
        setAuthError('An account with this email is already registered.');
        return;
      }

      const newUser: User & { password?: string } = {
        id: 'u_' + Date.now(),
        name: authName,
        email: authEmail.toLowerCase(),
        phone: authPhone,
        password: authPassword,
        isAdmin: authEmail.toLowerCase() === 'admin@aurex.com' // Automatic admin setup if they type this
      };

      usersList.push(newUser);
      localStorage.setItem('aurex_users', JSON.stringify(usersList));

      // Auto sign-in
      const savedUser: User = { id: newUser.id, name: newUser.name, email: newUser.email, phone: newUser.phone, isAdmin: newUser.isAdmin };
      setCurrentUser(savedUser);
      localStorage.setItem('aurex_current_user', JSON.stringify(savedUser));
      addNotification(`Elite Account registered successfully.`);
      
      // Clear values
      setAuthEmail('');
      setAuthPassword('');
      setAuthName('');
      setAuthPhone('');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('aurex_current_user');
    setCart([]);
    localStorage.removeItem('aurex_cart');
    setWishlist([]);
    localStorage.removeItem('aurex_wishlist');
    setOrderHistory([]);
    addNotification('Logged out from Aurex Private Registry.');
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1) => {
    if (!currentUser) {
      addNotification('Please enter authentication first.');
      setCurrentTab('profile');
      return;
    }

    const existingIndex = cart.findIndex(item => item.product.id === product.id);
    let newCart = [...cart];

    if (existingIndex > -1) {
      newCart[existingIndex].quantity += quantity;
    } else {
      newCart.push({ product, quantity });
    }

    handleUpdateCart(newCart);
    addNotification(`Added ${product.name} to Luxury Carriage.`);
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    let newCart = cart.map(item => {
      if (item.product.id === productId) {
        const nextQty = item.quantity + delta;
        return { ...item, quantity: nextQty < 1 ? 1 : nextQty };
      }
      return item;
    });
    handleUpdateCart(newCart);
  };

  const removeFromCart = (productId: string) => {
    const newCart = cart.filter(item => item.product.id !== productId);
    handleUpdateCart(newCart);
    addNotification('Item removed from carriage.');
  };

  const toggleWishlist = (productId: string) => {
    if (!currentUser) {
      addNotification('Authentication required.');
      setCurrentTab('profile');
      return;
    }

    let nextWish = [...wishlist];
    if (nextWish.includes(productId)) {
      nextWish = nextWish.filter(id => id !== productId);
      addNotification('Removed from imperial wishlist.');
    } else {
      nextWish.push(productId);
      addNotification('Added to imperial wishlist.');
    }
    handleUpdateWishlist(nextWish);
  };

  // Order Submission (Checkout Workflow)
  const initiateCheckout = () => {
    if (cart.length === 0) {
      addNotification('Your carriage is currently empty.');
      return;
    }
    setCheckoutAddress(currentUser?.phone || '');
    setCheckoutPaymentMethod('COD');
    setCheckoutModalOpen(true);
    setPaymentStep(0);
  };

  const submitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutAddress.trim()) {
      addNotification('Delivery address is strictly required.');
      return;
    }

    if (checkoutPaymentMethod === 'ONLINE') {
      // Go to fake secure Stripe terminal
      setPaymentStep(1);
    } else {
      // Cash on delivery directly places order
      finalizeOrderPlacement();
    }
  };

  const finalizeOrderPlacement = () => {
    const totalCost = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const newOrder: Order = {
      id: 'AX-' + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toISOString().split('T')[0],
      items: cart,
      totalPrice: totalCost,
      deliveryAddress: checkoutAddress,
      paymentMethod: checkoutPaymentMethod,
      status: 'Processing'
    };

    const nextOrders = [newOrder, ...orderHistory];
    setOrderHistory(nextOrders);
    localStorage.setItem('aurex_orders', JSON.stringify(nextOrders));

    // Clear cart
    handleUpdateCart([]);
    setCheckoutModalOpen(false);
    addNotification(`Bespoke Order ${newOrder.id} successfully queued.`);
  };

  const processMockOnlinePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardNumber || !cardExpiry || !cardCVC) {
      addNotification('Please enter absolute billing signatures.');
      return;
    }

    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setPaymentStep(2); // Show tick
      setTimeout(() => {
        finalizeOrderPlacement();
        setPaymentStep(0);
        // Clear billing card info
        setCardNumber('');
        setCardExpiry('');
        setCardCVC('');
      }, 1500);
    }, 2000);
  };

  // Add a Customer Product Review
  const submitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !currentUser) return;

    const newRev: Review = {
      id: 'rev_' + Date.now(),
      userName: currentUser.name,
      rating: reviewRating,
      comment: reviewComment || 'Magnificent product of absolute luxury caliber.',
      date: new Date().toISOString().split('T')[0]
    };

    const updatedProds = products.map(p => {
      if (p.id === selectedProduct.id) {
        const nextReviews = [newRev, ...(p.reviews || [])];
        const nextRating = parseFloat(((nextReviews.reduce((sum, r) => sum + r.rating, 0)) / nextReviews.length).toFixed(1));
        return {
          ...p,
          reviews: nextReviews,
          reviewsCount: nextReviews.length,
          rating: nextRating
        };
      }
      return p;
    });

    saveProductsToDB(updatedProds);
    
    // Update local single focus detail
    const modifiedSelected = updatedProds.find(p => p.id === selectedProduct.id);
    if (modifiedSelected) setSelectedProduct(modifiedSelected);

    // Reset Review fields
    setReviewComment('');
    setReviewRating(5);
    setReviewModalOpen(false);
    addNotification('Imperial review recorded.');
  };

  // Admin Catalog Management (Add/Edit/Delete)
  const openNewProductForm = () => {
    setEditingProduct(null);
    setNewProductName('');
    setNewProductPrice('');
    setNewProductDescription('');
    setNewProductCategory('Horology');
    setNewProductImage('');
    setAdminModalOpen(true);
  };

  const openEditProductForm = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid opening product details modal
    setEditingProduct(product);
    setNewProductName(product.name);
    setNewProductPrice(product.price.toString());
    setNewProductDescription(product.description);
    setNewProductCategory(product.category);
    setNewProductImage(product.image);
    setAdminModalOpen(true);
  };

  const handleSaveProductFromAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName || !newProductPrice || !newProductDescription) {
      addNotification('Please enter all premium catalog criteria.');
      return;
    }

    const priceNum = parseFloat(newProductPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      addNotification('Price must be a sovereign positive asset amount.');
      return;
    }

    // Default premium luxury placeholders if empty URL
    let finalImg = newProductImage.trim();
    if (!finalImg) {
      const placeholders: Record<string, string> = {
        'Horology': 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=600&auto=format&fit=crop',
        'Eyewear': 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=600&auto=format&fit=crop',
        'Attire': 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?q=80&w=600&auto=format&fit=crop',
        'Jewels': 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop'
      };
      finalImg = placeholders[newProductCategory] || 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=600&auto=format&fit=crop';
    }

    if (editingProduct) {
      // Edit catalogs
      const updated = products.map(p => {
        if (p.id === editingProduct.id) {
          return {
            ...p,
            name: newProductName,
            price: priceNum,
            description: newProductDescription,
            category: newProductCategory,
            image: finalImg
          };
        }
        return p;
      });
      saveProductsToDB(updated);
      addNotification(`Catalog updated: ${newProductName}`);
    } else {
      // Craft new product listing
      const newlyCrafted: Product = {
        id: 'p_' + Date.now(),
        name: newProductName,
        price: priceNum,
        description: newProductDescription,
        category: newProductCategory,
        image: finalImg,
        rating: 5.0,
        reviewsCount: 0,
        reviews: []
      };
      const updated = [newlyCrafted, ...products];
      saveProductsToDB(updated);
      addNotification(`Elite creation introduced: ${newProductName}`);
    }

    setAdminModalOpen(false);
  };

  const handleDeleteProductFromAdmin = (id: string, name: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid opening details
    const filtered = products.filter(p => p.id !== id);
    saveProductsToDB(filtered);
    addNotification(`Consigned ${name} to dustbin archives.`);
    if (selectedProduct?.id === id) {
      setSelectedProduct(null);
    }
  };

  // Concierge AI Styling Interactive System
  const sendConciergeMessage = (customText?: string) => {
    const textToSend = customText || chatInput;
    if (!textToSend.trim()) return;

    const userMsg = { sender: 'user' as const, text: textToSend, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setConciergeMessages(prev => [...prev, userMsg]);
    setChatInput('');

    setIsConciergeTyping(true);

    // Dynamic elite high-society replies
    setTimeout(() => {
      let butlerReply = '';
      const promptLower = textToSend.toLowerCase();

      if (promptLower.includes('watch') || promptLower.includes('horology') || promptLower.includes('time')) {
        butlerReply = `Ah, excellent taste. Might I recommend our magnificent Aurex Crown Horology GMT? Crafted in 18-karat yellow gold. Truly a sovereign addition to any wrist, perfect for flying direct on your private charter.`;
      } else if (promptLower.includes('glasses') || promptLower.includes('eyewear') || promptLower.includes('sunglasses')) {
        butlerReply = `For protective luxury under Mediterranean skylines, the Sovereign Titanium Sunglasses are unequaled. Polarized in velvet black with gold temples to command elegance in daylight.`;
      } else if (promptLower.includes('suit') || promptLower.includes('attire') || promptLower.includes('tuxedo') || promptLower.includes('wear')) {
        butlerReply = `Our Ivory Bespoke Tuxedo tailored out of private-reserve merino silk makes a defining silhouette. I would couple it with black patent loafers and a champagne quartz chronograph dial.`;
      } else if (promptLower.includes('gift') || promptLower.includes('diamond') || promptLower.includes('ring')) {
        butlerReply = `For a grand presentation of affection, the Imperial 2.0-carat flawless brilliant-cut diamond gold ring carries our historic lineage seal of quality. Exquisitely handcrafted.`;
      } else if (promptLower.includes('gold') || promptLower.includes('tuxedo pairing')) {
        butlerReply = `For an opulent attire pairing, align your 18k gold dial timepiece with our bespoke Silk Peak Tuxedo. A matching diamond crest ring on the right pinky provides a flawless final flourish.`;
      } else if (currentUser) {
        butlerReply = `Of course, ${currentUser.name.split(' ')[0]}. It is our highest mandate to curate only what suits your stature. Would you prefer a personal look-book for watches, customized rings, or Italian tailoring?`;
      } else {
        butlerReply = `A exceptional query, indeed. I would recommend authenticating your Aurex credentials first in your Profile, so I may retrieve your styling records and tailoring sizes.`;
      }

      const butlerMsg = { sender: 'butler' as const, text: butlerReply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      setConciergeMessages(prev => [...prev, butlerMsg]);
      setIsConciergeTyping(false);
    }, 1200);
  };

  const triggerAlfredQuickAction = (topic: string) => {
    sendConciergeMessage(topic);
  };

  // Filter products by category & search
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="aurex_root" class="min-h-screen bg-black flex flex-col items-center justify-center py-6 md:py-12 px-4 select-none">
      {/* Background Ambience Decorations (Desktop Only) */}
      <div id="ambient_aura_1" class="hidden md:block absolute top-10 left-10 w-96 h-96 rounded-full bg-amber-500/5 blur-3xl pointer-events-none"></div>
      <div id="ambient_aura_2" class="hidden md:block absolute bottom-10 right-10 w-96 h-96 rounded-full bg-yellow-600/5 blur-3xl pointer-events-none"></div>

      {/* Main Luxury Row layout containing descriptive branding and the Phone Simulator */}
      <div id="aurex_elite_container" class="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center gap-12 z-10">
        
        {/* Brand Typography & Desktop Introduction */}
        <div id="brand_billboard" class="hidden lg:flex flex-col max-w-md text-left space-y-6">
          <div id="brand_badge_label" class="inline-flex items-center gap-2 border border-amber-500/30 px-3 py-1.5 rounded-full w-fit bg-amber-950/20">
            <Award size={14} class="text-[#dfba6b] animate-pulse" />
            <span class="text-xs tracking-widest text-[#dfba6b] font-medium uppercase">Pre-engineered for Elite Stature</span>
          </div>
          
          <h1 id="brand_headline" class="text-5xl font-light tracking-tight text-white leading-tight">
            Aurex <span class="font-extrabold text-[#dfba6b]">Elite</span>
          </h1>
          <p id="brand_tagline" class="text-gray-400 font-light text-base leading-relaxed">
            Experience absolute sensory luxury. Explore horology, bespoke tailoring, master sunglasses, and elite gold jewels paired with our private lifestyle styling concierge.
          </p>

          <div id="brand_checklist" class="space-y-3 pt-4 border-t border-amber-500/10">
            <div id="chk_1" class="flex items-center gap-3 text-sm text-gray-300">
              <Check size={16} class="text-[#dfba6b]" />
              <span>Authentic 18-karat custom watches</span>
            </div>
            <div id="chk_2" class="flex items-center gap-3 text-sm text-gray-300">
              <Check size={16} class="text-[#dfba6b]" />
              <span>Secure mock checkout supporting COD & Stripe</span>
            </div>
            <div id="chk_3" class="flex items-center gap-3 text-sm text-gray-300">
              <Check size={16} class="text-[#dfba6b]" />
              <span>Integrated boutique catalogue administration</span>
            </div>
            <div id="chk_4" class="flex items-center gap-3 text-sm text-gray-300">
              <Check size={16} class="text-[#dfba6b]" />
              <span>Alfred - Your Luxury AI Styling Concierge</span>
            </div>
          </div>

          <div id="brand_footnote" class="text-xs text-amber-500/40 italic font-light pt-4">
            "Aurex Elite - Designed chronologically for high society circles."
          </div>
        </div>

        {/* ======================================================== */}
        {/* MOBILE SIMULATOR BEZEL PHONE FRAME                       */}
        {/* ======================================================== */}
        <div id="phone_wrapper_frame" class="w-full max-w-[400px] h-[780px] bg-[#121212] rounded-[48px] border-[6px] border-[#22211d] shadow-[0_25px_60px_-15px_rgba(223,186,107,0.15)] overflow-hidden relative flex flex-col">
          
          {/* SIMULATED SYSTEM STATUS BAR WITH NOTCH */}
          <div id="phone_notch_header" class="bg-black pt-1.5 pb-2.5 px-6 flex items-center justify-between text-xs text-white z-40 relative border-b border-white/[0.03]">
            {/* Clock */}
            <div id="mock_clock_text" class="font-medium tracking-tight">09:41</div>
            {/* Notch */}
            <div id="physical_notch_bezel" class="absolute left-1/2 -translate-x-1/2 top-0 bg-black w-[110px] h-4 rounded-b-2xl border-x border-b border-[#22211d]/20"></div>
            {/* Icons */}
            <div id="mock_telecom_status" class="flex items-center gap-1.5 scale-95 origin-right">
              <span class="text-[9px] tracking-wider font-extrabold text-[#dfba6b]">5G</span>
              <div id="signal_level" class="flex items-end gap-0.5 h-2.5">
                <div class="w-[2px] h-[3px] bg-[#dfba6b]"></div>
                <div class="w-[2px] h-[5px] bg-[#dfba6b]"></div>
                <div class="w-[2px] h-[7px] bg-[#dfba6b]"></div>
                <div class="w-[2px] h-[9px] bg-[#dfba6b]"></div>
              </div>
              <span class="text-[9.5px] font-bold">98%</span>
              <div id="battery_body" class="w-5 h-2.5 border border-white/50 rounded-sm p-[1px] flex items-center justify-start relative">
                <div class="bg-[#dfba6b] h-full w-[85%] rounded-[1px]"></div>
                <div class="absolute -right-[3px] top-1/2 -translate-y-1/2 w-[2px] h-1 bg-white/50 rounded-r-sm"></div>
              </div>
            </div>
          </div>

          {/* SIMULATED NOTIFICATION BANNER ACCENT PUSH TOASTS */}
          {notifications.length > 0 && (
            <div id="push_banner_container" class="absolute top-[38px] inset-x-3 z-50 pointer-events-none">
              <div id="push_toast_card" class="bg-gradient-to-r from-neutral-900 to-[#121211] border border-amber-500/40 rounded-xl p-3 shadow-2xl flex items-start gap-2.5 text-xs text-white max-h-16 animate-pulse pointer-events-auto">
                <Bell size={14} class="text-[#dfba6b] mt-0.5 shrink-0" />
                <div class="flex-1 min-w-0">
                  <p class="font-semibold text-amber-500 text-[10px] uppercase tracking-widest">Aurex Royal Dispatch</p>
                  <p class="truncate font-light text-gray-200 mt-0.5 pr-2">{notifications[0].text}</p>
                </div>
                <button id="close_toast_btn" onClick={() => setNotifications([])} class="text-white/40 hover:text-[#dfba6b]">
                  <X size={12} />
                </button>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* MIDDLE PHONE SCREEN PAGES AREA                           */}
          {/* ======================================================== */}
          <div id="screen_pages_viewport" class="flex-1 overflow-y-auto bg-black relative pb-16">
            
            {/* AUTH SCREEN INJECTION: Block Access If No User */}
            {!currentUser ? (
              <div id="auth_portal_panel" class="p-6 h-full flex flex-col justify-center text-center space-y-6 pt-12">
                <div id="auth_logo_sphere" class="mx-auto w-20 h-20 rounded-full border border-amber-500/30 flex items-center justify-center bg-gradient-to-b from-[#1c1911] to-black shadow-gold-sm">
                  <Award size={36} class="text-[#dfba6b] animate-pulse" />
                </div>
                
                <div>
                  <h2 id="auth_title_label" class="text-2xl font-light tracking-widest text-[#dfba6b] uppercase">AUREX ELITE</h2>
                  <p id="auth_subtitle_desc" class="text-xs text-gray-400 mt-1.5 font-light font-serif italic">"Signet of High-Stature Lifestyle"</p>
                </div>

                <form id="auth_signature_form" onSubmit={handleAuth} class="space-y-4 text-left">
                  {authMode === 'signup' && (
                    <div id="grp_name">
                      <label class="block text-[10px] uppercase tracking-widest text-[#dfba6b] font-semibold mb-1">Full Noble Name</label>
                      <input 
                        id="auth_name_input"
                        type="text" 
                        value={authName}
                        onChange={(e) => setAuthName(e.target.value)}
                        placeholder="e.g. Lord Charles Sterling"
                        class="w-full bg-[#121212] border border-neutral-800 rounded-lg py-2.5 px-3 text-sm text-white focus:outline-none focus:border-[#dfba6b] transition-colors font-light"
                      />
                    </div>
                  )}

                  <div id="grp_email">
                    <label class="block text-[10px] uppercase tracking-widest text-[#dfba6b] font-semibold mb-1">Royal Registry Email</label>
                    <input 
                      id="auth_email_input"
                      type="email" 
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder="e.g. charles@sterling.com"
                      class="w-full bg-[#121212] border border-neutral-800 rounded-lg py-2.5 px-3 text-sm text-white focus:outline-none focus:border-[#dfba6b] transition-colors font-light"
                    />
                  </div>

                  {authMode === 'signup' && (
                    <div id="grp_phone">
                      <label class="block text-[10px] uppercase tracking-widest text-[#dfba6b] font-semibold mb-1">Elite Dispatch Phone</label>
                      <input 
                        id="auth_phone_input"
                        type="text" 
                        value={authPhone}
                        onChange={(e) => setAuthPhone(e.target.value)}
                        placeholder="e.g. +880 1711223344"
                        class="w-full bg-[#121212] border border-neutral-800 rounded-lg py-2.5 px-3 text-sm text-white focus:outline-none focus:border-[#dfba6b] transition-colors font-light"
                      />
                    </div>
                  )}

                  <div id="grp_password">
                    <div class="flex justify-between items-center mb-1">
                      <label class="block text-[10px] uppercase tracking-widest text-[#dfba6b] font-semibold">Private Cipher Key</label>
                      <span class="text-[9px] text-[#dfba6b]/60 lowercase italic">admin: admin123</span>
                    </div>
                    <input 
                      id="auth_password_input"
                      type="password" 
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      placeholder="••••••••••••••"
                      class="w-full bg-[#121212] border border-neutral-800 rounded-lg py-2.5 px-3 text-sm text-white focus:outline-none focus:border-[#dfba6b] transition-colors font-light"
                    />
                  </div>

                  {authError && (
                    <p id="msg_auth_err" class="text-xs text-red-500 font-light italic text-center pt-2">{authError}</p>
                  )}

                  <button 
                    id="btn_auth_submit"
                    type="submit" 
                    class="w-full mt-4 bg-gradient-gold text-black hover:opacity-90 font-bold py-3 px-4 rounded-lg text-xs uppercase tracking-widest transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Lock size={12} />
                    {authMode === 'login' ? 'Validate Credentials' : 'Certify Handshake'}
                  </button>
                </form>

                <div id="auth_mode_toggle" class="pt-2 text-xs text-center">
                  <span class="text-gray-400 font-light">
                    {authMode === 'login' ? 'New peer to high society?' : 'Already recorded on our rolls?'}
                  </span>
                  <button 
                    id="btn_toggle_auth_mode"
                    onClick={() => {
                      setAuthMode(authMode === 'login' ? 'signup' : 'login');
                      setAuthError('');
                    }} 
                    class="text-[#dfba6b] font-semibold hover:underline ml-1 pb-1"
                  >
                    {authMode === 'login' ? 'Petition Admission' : 'Identify Registry'}
                  </button>
                </div>

                <div id="auth_disclaim_label" class="pt-8 text-[9px] text-gray-600 font-serif leading-relaxed italic border-t border-white/[0.04]">
                  "Entry into Aurex Elite is strictly regulated. High protocol data is shielded inside encrypted secure storage modules."
                </div>
              </div>
            ) : (
              // ========================================================
              // STANDARD MOBILE VIEWS ACCORDING TO TABS
              // ========================================================
              <>
                {/* -------------------- HOME VIEW -------------------- */}
                {currentTab === 'home' && (
                  <div id="home_tab_screen" class="space-y-6">
                    {/* Header Banner */}
                    <div id="home_top_header" class="px-5 pt-5 flex items-center justify-between">
                      <div>
                        <span class="text-[10px] tracking-widest text-[#dfba6b] uppercase block font-medium">Sovereign Lounge</span>
                        <h2 id="home_user_greeting" class="text-xl font-light text-white leading-tight">
                          Bonjour, <span class="font-extrabold text-gradient-gold">{currentUser.name.split(' ')[0]}</span>
                        </h2>
                      </div>
                      <div id="home_notif_bell" class="relative bg-neutral-900 border border-neutral-800 p-2 rounded-full cursor-pointer hover:border-[#dfba6b]" onClick={() => addNotification("VIP Concord Status: Active.")}>
                        <Bell size={15} class="text-[#dfba6b]" />
                        <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                      </div>
                    </div>

                    {/* Prominent Promo / Event Slider Banner */}
                    <div id="promo_hero_slider" class="px-5">
                      <div id="promo_slider_wrap" class="relative rounded-2xl overflow-hidden h-40 bg-gradient-to-r from-amber-950 to-neutral-950 border border-amber-500/20 shadow-md">
                        <img 
                          id="promo_backdrop" 
                          src="https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=600&auto=format&fit=crop" 
                          alt="Crown Horology Banner" 
                          class="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay"
                        />
                        <div id="promo_overlay_gradient" class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                        
                        <div id="promo_billboard_content" class="absolute bottom-4 left-4 right-4 text-left">
                          <span class="text-[8px] font-extrabold tracking-widest text-[#dfba6b] bg-amber-950/80 border border-amber-500/20 px-2 py-0.5 rounded-full uppercase">VIP Showcase</span>
                          <h3 id="promo_title" class="text-lg font-bold text-white tracking-tight mt-1">THE IMPERIAL DIADEMS</h3>
                          <p id="promo_subtitle" class="text-[10px] text-gray-300 font-light mt-0.5">Acquire hand-cut precious gold ring models & watches.</p>
                          <div class="flex items-center gap-1.5 text-[9px] text-[#dfba6b] mt-2 font-medium">
                            <span>Examine Exclusive Collection</span>
                            <ChevronRight size={10} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Luxurious Category Filter Bar */}
                    <div id="categories_filter_tier" class="space-y-2">
                      <div class="px-5 flex items-center justify-between">
                        <span class="text-[10px] uppercase tracking-widest text-[#dfba6b] font-semibold">Exquisite Departments</span>
                        <span class="text-[9px] text-gray-500 lowercase italic">Aurex curated lists</span>
                      </div>
                      
                      <div id="category_scroll_wrapper" class="flex gap-2.5 overflow-x-auto px-5 pb-1 select-none no-scrollbar">
                        {['All', 'Horology', 'Eyewear', 'Attire', 'Jewels'].map((cat) => (
                          <button
                            id={`cat_btn_${cat.toLowerCase()}`}
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            class={`px-4 py-2 rounded-full text-[10px] uppercase font-bold tracking-widest border transition-all whitespace-nowrap active:scale-95 ${
                              selectedCategory === cat 
                                ? 'bg-gradient-gold text-black border-[#dfba6b] shadow-gold-sm' 
                                : 'bg-[#121212] text-gray-400 border-neutral-800 hover:border-[#dfba6b]/40'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Premium Product Search Bar */}
                    <div id="home_search_container" class="px-5">
                      <div id="home_search_input_wrap" class="relative">
                        <input
                          id="search_field_input"
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search watches, attire, diamonds..."
                          class="w-full bg-[#121212] border border-neutral-800 rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-[#dfba6b] placeholder-neutral-600 font-light"
                        />
                        <Search size={14} class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                        {searchQuery && (
                          <button id="clear_search_btn" onClick={() => setSearchQuery('')} class="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                            <X size={12} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Real products display grid panel */}
                    <div id="products_grid_section" class="px-5 space-y-4">
                      <div class="flex items-center justify-between">
                        <span class="text-[10px] uppercase tracking-widest text-[#dfba6b] font-semibold">Select Masterworks</span>
                        <span class="text-[9px] text-gray-500">{filteredProducts.length} items found</span>
                      </div>

                      {filteredProducts.length === 0 ? (
                        <div id="empty_search_box" class="text-center py-10 bg-[#121212] rounded-xl border border-neutral-800">
                          <p class="text-xs text-gray-400 font-light">No select masterworks align with your search query.</p>
                          <button id="reset_filter_btn" onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }} class="text-xs text-[#dfba6b] font-bold mt-2 hover:underline">
                            Restore Standard Catalogue
                          </button>
                        </div>
                      ) : (
                        <div id="grid_card_wrapper" class="grid grid-cols-2 gap-4">
                          {filteredProducts.map((p) => (
                            <div 
                              id={`product_card_${p.id}`}
                              key={p.id}
                              onClick={() => setSelectedProduct(p)}
                              class="bg-gradient-to-b from-[#111] to-[#040404] border border-neutral-800/80 rounded-xl overflow-hidden cursor-pointer hover:border-amber-500/40 transition-all duration-300 group flex flex-col justify-between"
                            >
                              <div class="relative aspect-square overflow-hidden bg-neutral-900 border-b border-neutral-800/50">
                                <img 
                                  id={`prod_thumb_${p.id}`}
                                  src={p.image} 
                                  alt={p.name} 
                                  class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                
                                {/* Wishlist indicator crest icon */}
                                <button
                                  id={`fav_btn_${p.id}`}
                                  aria-label="Wishlist toggle"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleWishlist(p.id);
                                  }}
                                  class="absolute top-2.5 right-2.5 bg-black/70 border border-neutral-800 p-1.5 rounded-full hover:border-[#dfba6b] text-white transition-colors"
                                >
                                  <Heart size={11} class={wishlist.includes(p.id) ? "fill-[#dfba6b] text-[#dfba6b]" : "text-gray-400"} />
                                </button>

                                {/* Category Crest */}
                                <div id="dept_flag" class="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md border border-amber-500/20 px-2 py-0.5 rounded text-[8px] uppercase tracking-widest text-[#dfba6b]">
                                  {p.category}
                                </div>
                              </div>

                              <div class="p-3 text-left space-y-1.5 flex-1 flex flex-col justify-between">
                                <div class="space-y-0.5">
                                  <h4 id={`prod_title_${p.id}`} class="text-[11px] font-bold tracking-tight text-white line-clamp-1 group-hover:text-[#dfba6b] transition-colors">{p.name}</h4>
                                  <div class="flex items-center gap-1">
                                    <Star size={9} class="text-[#dfba6b] fill-[#dfba6b]" />
                                    <span class="text-[9px] text-gray-400 font-light">{p.rating} ({p.reviewsCount} reviews)</span>
                                  </div>
                                </div>

                                <div class="flex items-center justify-between pt-1 border-t border-neutral-900">
                                  <span id={`prod_price_${p.id}`} class="text-[12px] text-gradient-gold font-extrabold">${p.price.toLocaleString()}</span>
                                  <div id="interactive_indicator" class="w-5 h-5 bg-[#dfba6b] text-black rounded-full flex items-center justify-center group-hover:bg-white transition-colors">
                                    <Plus size={11} strokeWidth={3} />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ------------------ WISHLIST VIEW ------------------ */}
                {currentTab === 'wishlist' && (
                  <div id="wishlist_tab_screen" class="space-y-6 p-5">
                    <div id="wishlist_header">
                      <span class="text-[10px] tracking-widest text-[#dfba6b] uppercase block font-medium">Bespoke Curation</span>
                      <h2 class="text-xl font-light text-white">Your <span class="font-bold text-[#dfba6b]">Imperial Wishlist</span></h2>
                    </div>

                    {wishlist.length === 0 ? (
                      <div id="wish_empty_state" class="text-center py-20 bg-[#121212] rounded-2xl border border-neutral-800 space-y-4 px-4">
                        <Heart size={32} class="text-gray-600 mx-auto" />
                        <p class="text-xs text-gray-400 font-light leading-relaxed">No sovereign asset choices recorded in your list yet. Expand your signature catalog on the boutique store.</p>
                        <button id="wish_return_btn" onClick={() => setCurrentTab('home')} class="bg-gradient-gold text-black font-bold py-2.5 px-6 rounded-lg text-[10px] uppercase tracking-widest">
                          Consult Catalog Entries
                        </button>
                      </div>
                    ) : (
                      <div id="wish_items_list" class="space-y-3">
                        {products.filter(p => wishlist.includes(p.id)).map(p => (
                          <div 
                            id={`wish_item_card_${p.id}`}
                            key={p.id}
                            onClick={() => setSelectedProduct(p)}
                            class="bg-[#121212] border border-neutral-800 rounded-xl p-3 flex gap-3 items-center cursor-pointer hover:border-[#dfba6b]/40"
                          >
                            <img src={p.image} alt={p.name} class="w-14 h-14 rounded-lg object-cover bg-neutral-900 border border-neutral-800" />
                            <div class="flex-1 min-w-0 text-left space-y-0.5">
                              <h4 class="text-xs font-bold text-white truncate">{p.name}</h4>
                              <p class="text-[11px] text-[#dfba6b] font-extrabold">${p.price.toLocaleString()}</p>
                              <p class="text-[9px] text-gray-500 capitalize">{p.category} Department</p>
                            </div>
                            <div class="flex flex-col gap-1.5 items-end">
                              <button
                                id={`wish_add_btn_${p.id}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  addToCart(p);
                                }}
                                class="bg-gradient-gold text-black p-1.5 rounded-full hover:opacity-90 active:scale-95"
                              >
                                <ShoppingBag id={`wish_shop_bag_icon_${p.id}`} size={12} />
                              </button>
                              <button
                                id={`wish_del_btn_${p.id}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleWishlist(p.id);
                                }}
                                class="text-gray-500 hover:text-red-500 p-1"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ----------------- CONCIERGE CHAT ----------------- */}
                {currentTab === 'concierge' && (
                  <div id="concierge_tab_screen" class="h-full flex flex-col justify-between">
                    {/* Concierge Title Brand Header */}
                    <div id="concierge_top_panel" class="p-4 bg-gradient-to-b from-[#111] to-black border-b border-neutral-800/60 text-left flex items-center justify-between">
                      <div class="flex items-center gap-2.5">
                        <div class="w-9 h-9 rounded-full bg-gold border border-amber-500/30 flex items-center justify-center bg-gradient-to-br from-amber-700 to-black text-[#dfba6b] font-bold text-sm shadow-gold-sm">
                          <Sparkles size={16} />
                        </div>
                        <div>
                          <h3 class="text-xs font-extrabold text-white tracking-widest uppercase">Alfred Private Concierge</h3>
                          <span class="text-[8px] text-emerald-400 flex items-center gap-1 font-semibold uppercase tracking-wider">
                            <span class="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block animate-pulse"></span> Offline Style Assistant Ready
                          </span>
                        </div>
                      </div>
                      <div class="text-[9px] border border-amber-500/20 px-2 py-1 bg-amber-950/20 rounded-md text-[#dfba6b]">
                        Elite Suite
                      </div>
                    </div>

                    {/* Chat dialog displays section */}
                    <div id="chats_body_panel" class="flex-1 p-4 overflow-y-auto space-y-4 text-left min-h-[360px] max-h-[420px] bg-gradient-to-b from-black to-neutral-950">
                      {conciergeMessages.map((msg, idx) => (
                        <div key={idx} class={`flex flex-col max-w-[85%] ${msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
                          <div class={`p-3 rounded-2xl text-xs leading-relaxed ${
                            msg.sender === 'user' 
                              ? 'bg-gradient-gold text-black font-medium rounded-tr-none' 
                              : 'bg-[#141414] text-gray-200 border border-neutral-800 rounded-tl-none'
                          }`}>
                            {msg.text}
                          </div>
                          <span class="text-[8px] text-gray-600 mt-1 px-1">{msg.time}</span>
                        </div>
                      ))}

                      {isConciergeTyping && (
                        <div class="flex items-center gap-1.5 text-gray-500 text-[10px] pl-1 py-1">
                          <span class="w-1 h-1 bg-amber-500 rounded-full animate-bounce"></span>
                          <span class="w-1 h-1 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                          <span class="w-1 h-1 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                          <span class="italic font-light">Alfred is preparing recommendations...</span>
                        </div>
                      )}
                    </div>

                    {/* Styling Prompt Quick Selection Accents */}
                    <div id="concierge_prompter_bar" class="p-2 border-t border-neutral-800/40 bg-neutral-950 flex gap-1.5 overflow-x-auto no-scrollbar">
                      <button 
                        id="action_gold_pairing"
                        onClick={() => triggerAlfredQuickAction("Recommend gold tuxedo pairing")}
                        class="px-2.5 py-1.5 bg-[#121212] border border-amber-500/20 rounded-lg text-[9px] uppercase tracking-wider text-[#dfba6b] hover:bg-[#1f1a10] whitespace-nowrap"
                      >
                        ✨ Tuxedo Pairing
                      </button>
                      <button 
                        id="action_wrist_watch"
                        onClick={() => triggerAlfredQuickAction("Recommend exquisite wrist watches")}
                        class="px-2.5 py-1.5 bg-[#121212] border border-amber-500/20 rounded-lg text-[9px] uppercase tracking-wider text-[#dfba6b] hover:bg-[#1f1a10] whitespace-nowrap"
                      >
                        ⏱️ Timekeeper Curation
                      </button>
                      <button 
                        id="action_elite_gifts"
                        onClick={() => triggerAlfredQuickAction("Bespoke wedding or high tier gifts")}
                        class="px-2.5 py-1.5 bg-[#121212] border border-amber-500/20 rounded-lg text-[9px] uppercase tracking-wider text-[#dfba6b] hover:bg-[#1f1a10] whitespace-nowrap"
                      >
                        🎁 Prestige Gifts
                      </button>
                    </div>

                    {/* Send controls wrapper */}
                    <div id="concierge_input_tray" class="p-3 border-t border-neutral-900 bg-black flex gap-2">
                      <input 
                        id="chat_text_input"
                        type="text" 
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && sendConciergeMessage()}
                        placeholder="Inquire about matching dials, diamonds, dress codes..."
                        class="flex-1 bg-[#121212] border border-neutral-800 rounded-xl py-2 px-3.5 text-xs text-white focus:outline-none focus:border-[#dfba6b]"
                      />
                      <button 
                        id="send_chat_btn"
                        onClick={() => sendConciergeMessage()}
                        class="bg-gradient-gold text-black px-3.5 rounded-xl hover:opacity-90 active:scale-95 flex items-center justify-center"
                      >
                        <Send size={12} />
                      </button>
                    </div>
                  </div>
                )}

                {/* -------------------- CART & CARRIAGE VIEW -------------------- */}
                {currentTab === 'cart' && (
                  <div id="carriage_tab_screen" class="p-5 space-y-6 relative h-full flex flex-col justify-between">
                    <div id="cart_header">
                      <span class="text-[10px] tracking-widest text-[#dfba6b] uppercase block font-medium">Boutique Checkout Portal</span>
                      <h2 class="text-xl font-light text-white">Your <span class="font-bold text-[#dfba6b]">Luxury Carriage</span></h2>
                    </div>

                    {cart.length === 0 ? (
                      <div id="cart_empty_state" class="text-center py-20 bg-[#121212] rounded-2xl border border-neutral-800 space-y-4 flex-1 flex flex-col justify-center">
                        <ShoppingBag size={32} class="text-gray-600 mx-auto animate-bounce" />
                        <p class="text-xs text-gray-400 font-light leading-relaxed">Your Carriage currently houses no catalog select items.</p>
                        <button id="cart_shop_btn" onClick={() => setCurrentTab('home')} class="mx-auto bg-gradient-gold text-black font-bold py-2.5 px-6 rounded-lg text-[10px] uppercase tracking-widest select-none">
                          Inquire Catalogue Entries
                        </button>
                      </div>
                    ) : (
                      <div id="cart_non_empty" class="space-y-6 flex-1 flex flex-col justify-between">
                        {/* Carriage Item Stack */}
                        <div id="cart_scroll_list" class="space-y-3.5 overflow-y-auto max-h-[380px] pr-1">
                          {cart.map((item) => (
                            <div 
                              id={`cart_row_${item.product.id}`}
                              key={item.product.id}
                              class="bg-[#121212] border border-neutral-800/80 rounded-xl p-3 flex gap-3 text-left items-center justify-between"
                            >
                              <img src={item.product.image} alt={item.product.name} class="w-12 h-12 rounded-lg object-cover bg-neutral-900 border border-neutral-800" />
                              <div class="flex-1 min-w-0">
                                <h4 class="text-xs font-bold text-white truncate">{item.product.name}</h4>
                                <p class="text-[11px] text-[#dfba6b] font-extrabold mt-0.5">${item.product.price.toLocaleString()}</p>
                              </div>

                              {/* Quantity increments */}
                              <div class="flex items-center gap-2 border border-neutral-800 rounded-lg p-1">
                                <button id={`minus_qty_${item.product.id}`} onClick={() => updateCartQuantity(item.product.id, -1)} class="w-4 h-4 text-xs font-extrabold bg-[#1a1a1a] rounded flex items-center justify-center hover:text-[#dfba6b]">-</button>
                                <span class="text-xs text-white font-bold px-1">{item.quantity}</span>
                                <button id={`add_qty_${item.product.id}`} onClick={() => updateCartQuantity(item.product.id, 1)} class="w-4 h-4 text-xs font-extrabold bg-[#1a1a1a] rounded flex items-center justify-center hover:text-[#dfba6b]">+</button>
                              </div>

                              <button id={`cart_del_${item.product.id}`} onClick={() => removeFromCart(item.product.id)} class="text-gray-500 hover:text-red-500 pl-1">
                                <Trash2 size={13} />
                              </button>
                            </div>
                          ))}
                        </div>

                        {/* Invoice Pricing Overview */}
                        <div id="carriage_summary_section" class="bg-[#121212] border border-neutral-800 rounded-xl p-4 space-y-2.5">
                          <div class="flex justify-between text-xs text-gray-400">
                            <span>Subtotal</span>
                            <span class="text-white font-semibold text-right">${cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0).toLocaleString()}</span>
                          </div>
                          <div class="flex justify-between text-xs text-gray-400">
                            <span>Elite Guard Carriage Cargo</span>
                            <span class="text-emerald-400 font-semibold uppercase text-right">Gratis Complimentary</span>
                          </div>
                          <div class="border-t border-neutral-800 pt-2.5 flex justify-between text-sm">
                            <span class="text-white font-bold font-serif">Consolidated Stature Asset Sum</span>
                            <span id="grand_total_text" class="text-gradient-gold font-black text-right">${cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0).toLocaleString()}</span>
                          </div>

                          <button 
                            id="begin_checkout_workflow_btn"
                            onClick={initiateCheckout} 
                            class="w-full mt-3 bg-gradient-gold text-black font-extrabold py-3 rounded-lg text-xs tracking-widest uppercase transition-all duration-300 hover:opacity-95 bg-size active:scale-95 shadow-lg flex items-center justify-center gap-2"
                          >
                            <ShieldCheck size={14} />
                            Proceed to Secure Checkout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* -------------------- PROFILE VIEW & ADMIN PORTAL -------------------- */}
                {currentTab === 'profile' && (
                  <div id="profile_tab_screen" class="p-5 space-y-6">
                    {/* Core Elite Passport Profile Banner */}
                    <div id="profile_top_header" class="text-center bg-gradient-to-b from-[#1c1a12] to-neutral-950 border border-[#c49a45]/20 rounded-2xl p-5 space-y-3 relative shadow-gold-sm">
                      <div id="profile_banner_badge" class="absolute top-2.5 right-2.5 bg-gradient-gold text-black font-bold text-[8px] uppercase tracking-widest px-2.5 py-0.5 rounded-full shadow-md">
                        {currentUser.isAdmin ? 'Grand Comptrol' : 'Gold Charter Member'}
                      </div>

                      <div id="passport_avatar" class="w-16 h-16 rounded-full border border-gold bg-black mx-auto flex items-center justify-center text-[#dfba6b] shadow-inner">
                        <Award size={28} />
                      </div>

                      <div class="space-y-0.5">
                        <h3 class="text-md font-bold text-white tracking-wide">{currentUser.name}</h3>
                        <p class="text-[10px] text-[#dfba6b] uppercase tracking-widest font-serif">Id: {currentUser.id}</p>
                        <p class="text-xs text-gray-400 font-light mt-1 text-center">{currentUser.email}</p>
                      </div>

                      <button 
                        id="profile_logout_action"
                        onClick={handleLogout} 
                        class="mx-auto flex items-center gap-1 bg-[#1a1a1a]/80 hover:bg-red-950/20 hover:text-red-400 font-bold px-3 py-1.5 rounded-full border border-neutral-800 text-[9px] uppercase tracking-wider transition-colors"
                      >
                        <LogOut size={10} /> Logout Registry
                      </button>
                    </div>

                    {/* Conditional Admin Control Gate Section */}
                    {currentUser.isAdmin ? (
                      <div id="admin_control_terminal" class="border border-amber-500/30 rounded-xl overflow-hidden bg-[#121212] text-left">
                        <div class="bg-gradient-to-r from-amber-950 to-neutral-900 border-b border-amber-500/20 px-4 py-3 flex items-center justify-between">
                          <h3 class="text-xs font-black tracking-widest text-white uppercase flex items-center gap-1.5">
                            <Settings size={12} class="text-[#dfba6b]" /> Boutique Store Comptroller
                          </h3>
                          <span class="text-[8px] font-semibold text-[#dfba6b] bg-[#dfba6b]/10 border border-[#dfba6b]/20 px-1.5 py-0.5 rounded">Admin Mode</span>
                        </div>

                        <div class="p-4 space-y-3">
                          <p class="text-[10px] text-gray-400 font-light leading-relaxed">Define luxury catalog articles or modify specifications. Reflects instant updates inside user display grids.</p>
                          
                          <button 
                            id="admin_add_product_btn"
                            onClick={openNewProductForm}
                            class="w-full bg-gradient-gold text-black font-extrabold py-2.5 rounded-lg text-[10px] uppercase tracking-widest hover:opacity-90 flex items-center justify-center gap-1 px-4 active:scale-95 transition-transform"
                          >
                            <Plus size={12} strokeWidth={3} /> Introduce Catalog Masterwork
                          </button>

                          {/* Fast Admin listing table list */}
                          <div id="admin_listings_grid" class="pt-2 border-t border-neutral-900 space-y-2">
                            <span class="text-[9px] uppercase tracking-widest font-black text-[#dfba6b]">Existing Catalogue:</span>
                            <div class="h-44 overflow-y-auto space-y-1.5 pr-1 font-sans">
                              {products.map(p => (
                                <div key={p.id} class="flex items-center justify-between bg-black rounded-lg border border-neutral-900 p-2 text-xs">
                                  <div class="flex items-center gap-2 max-w-[65%]">
                                    <img src={p.image} alt={p.name} class="w-6 h-6 rounded object-cover" />
                                    <span class="truncate font-light text-white">{p.name}</span>
                                  </div>
                                  <span class="text-[#dfba6b] font-bold text-[10px]">${p.price.toLocaleString()}</span>
                                  <div class="flex items-center gap-1 pl-1">
                                    <button id={`admin_edit_${p.id}`} onClick={(e) => openEditProductForm(p, e)} class="text-gray-400 hover:text-[#dfba6b] p-1"><Edit size={11} /></button>
                                    <button id={`admin_del_${p.id}`} onClick={(e) => handleDeleteProductFromAdmin(p.id, p.name, e)} class="text-gray-400 hover:text-red-500 p-1"><Trash2 size={11} /></button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Past Order History for Standard Users */
                      <div id="client_history_logs" class="text-left space-y-3">
                        <div class="flex items-center justify-between">
                          <span class="text-[10px] uppercase tracking-widest text-[#dfba6b] font-semibold">Your Carriage Ledgers</span>
                          <span class="text-[9px] text-gray-500">{orderHistory.length} orders total</span>
                        </div>

                        {orderHistory.length === 0 ? (
                          <div id="leads_empty_panel" class="text-center py-10 bg-[#121212] rounded-xl border border-neutral-800">
                            <p class="text-[11px] text-gray-500 font-light italic">No historic ledger purchases logged under your profile.</p>
                          </div>
                        ) : (
                          <div id="historic_order_cards" class="space-y-3.5">
                            {orderHistory.map((ord) => (
                              <div key={ord.id} class="bg-[#121212] border border-neutral-800 rounded-xl p-3.5 space-y-2">
                                <div class="flex justify-between items-center text-[10px]">
                                  <span class="font-bold text-white uppercase tracking-widest">{ord.id}</span>
                                  <span class="text-gray-500 font-light">{ord.date}</span>
                                </div>

                                <div class="space-y-1">
                                  {ord.items.map((item, id) => (
                                    <div key={id} class="flex justify-between items-center text-xs">
                                      <span class="text-gray-400 truncate max-w-[75%] font-light">{item.product.name} <span class="text-[#dfba6b] font-medium font-mono">x{item.quantity}</span></span>
                                      <span class="text-white">${(item.product.price * item.quantity).toLocaleString()}</span>
                                    </div>
                                  ))}
                                </div>

                                <div class="pt-2 border-t border-neutral-900 flex justify-between items-center text-xs">
                                  <div>
                                    <span class="text-[10px] text-gray-500 font-light">Direct Status:</span>
                                    <span class="ml-1.5 text-xs text-amber-500 font-bold">{ord.status}</span>
                                  </div>
                                  <span class="text-[#dfba6b] font-bold">${ord.totalPrice.toLocaleString()}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* ======================================================== */}
          {/* BOTTOM NAVIGATION TABS CONTROL BAR                       */}
          {/* ======================================================== */}
          {currentUser && (
            <div id="phone_bottom_tab_bar" class="absolute bottom-0 inset-x-0 bg-black/95 backdrop-blur-md border-t border-white/[0.05] h-16 flex items-center justify-around px-4 z-40">
              <button 
                id="tab_home_action"
                onClick={() => setCurrentTab('home')} 
                class={`flex flex-col items-center gap-1 ${currentTab === 'home' ? 'text-[#dfba6b]' : 'text-gray-400 hover:text-[#dfba6b]'}`}
              >
                <ShoppingBag size={18} class={currentTab === 'home' ? 'text-[#dfba6b]' : 'text-gray-400'} />
                <span class="text-[9px] font-bold uppercase tracking-widest font-sans">Shop</span>
              </button>

              <button 
                id="tab_wish_action"
                onClick={() => setCurrentTab('wishlist')} 
                class={`flex flex-col items-center gap-1 ${currentTab === 'wishlist' ? 'text-[#dfba6b]' : 'text-gray-400 hover:text-[#dfba6b]'}`}
              >
                <Heart size={18} class={currentTab === 'wishlist' ? 'text-[#dfba6b] fill-[#dfba6b]' : 'text-gray-400'} />
                <span class="text-[9px] font-bold uppercase tracking-widest font-sans">Wishlist</span>
              </button>

              <button 
                id="tab_concierge_action"
                onClick={() => setCurrentTab('concierge')} 
                class={`flex flex-col items-center gap-1 ${currentTab === 'concierge' ? 'text-[#dfba6b]' : 'text-gray-400 hover:text-[#dfba6b]'}`}
              >
                <MessageSquare size={18} class={currentTab === 'concierge' ? 'text-[#dfba6b]' : 'text-gray-400'} />
                <span class="text-[9px] font-bold uppercase tracking-widest font-sans">Concierge</span>
              </button>

              <button 
                id="tab_cart_action"
                onClick={() => setCurrentTab('cart')} 
                class={`flex flex-col items-center gap-1 relative ${currentTab === 'cart' ? 'text-[#dfba6b]' : 'text-gray-400 hover:text-[#dfba6b]'}`}
              >
                <Layers size={18} class={currentTab === 'cart' ? 'text-[#dfba6b]' : 'text-gray-400'} />
                {cart.length > 0 && (
                  <span class="absolute -top-1.5 -right-2 bg-[#dfba6b] text-black font-extrabold text-[8px] w-4.5 h-4.5 rounded-full flex items-center justify-center border border-black shadow">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
                <span class="text-[9px] font-bold uppercase tracking-widest font-sans">Carriage</span>
              </button>

              <button 
                id="tab_profile_action"
                onClick={() => setCurrentTab('profile')} 
                class={`flex flex-col items-center gap-1 ${currentTab === 'profile' ? 'text-[#dfba6b]' : 'text-gray-400 hover:text-[#dfba6b]'}`}
              >
                <UserIcon size={18} class={currentTab === 'profile' ? 'text-[#dfba6b]' : 'text-gray-400'} />
                <span class="text-[9px] font-bold uppercase tracking-widest font-sans">Profile</span>
              </button>
            </div>
          )}

          {/* ======================================================== */}
          {/* FLOATING DETAIL DIALOG MODAL TYPE-OVER SHEETS            */}
          {/* ======================================================== */}
          {selectedProduct && (
            <div id="product_detail_overlay" class="absolute inset-x-0 top-[38px] bottom-0 bg-black/90 z-50 overflow-y-auto no-scrollbar flex items-end">
              <div id="product_detail_body" class="w-full bg-gradient-to-b from-[#111] to-black border-t border-[#c49a45]/30 rounded-t-[32px] overflow-hidden flex flex-col justify-between max-h-[95%]">
                
                {/* Visual Header image block layout */}
                <div id="detail_full_image_wrap" class="relative aspect-[4/3] bg-neutral-950">
                  <img src={selectedProduct.image} alt={selectedProduct.name} class="w-full h-full object-cover" />
                  
                  {/* Closing cross accent button */}
                  <button 
                    id="close_details_overlay_btn"
                    onClick={() => setSelectedProduct(null)} 
                    class="absolute top-4 left-4 bg-black/70 border border-neutral-800/80 hover:border-white text-white p-2.5 rounded-full shadow"
                  >
                    <ArrowLeft size={16} />
                  </button>

                  <button 
                    id="wish_toggle_inset_btn"
                    title="Toggle wishlist"
                    onClick={() => toggleWishlist(selectedProduct.id)}
                    class="absolute top-4 right-4 bg-black/70 border border-neutral-800/80 hover:border-white text-white p-2.5 rounded-full shadow"
                  >
                    <Heart size={16} class={wishlist.includes(selectedProduct.id) ? "fill-[#dfba6b] text-[#dfba6b]" : "text-white"} />
                  </button>

                  <div class="absolute bottom-4 left-4">
                    <span class="text-[9px] uppercase tracking-widest text-[#dfba6b] font-bold bg-black/70 border border-[#dfba6b]/30 px-3 py-1 rounded-md">
                      {selectedProduct.category} Department
                    </span>
                  </div>
                </div>

                <div class="p-6 text-left space-y-4">
                  <div class="space-y-1">
                    <h3 id="detail_prod_title" class="text-lg font-bold text-white tracking-tight">{selectedProduct.name}</h3>
                    <div class="flex items-center gap-2">
                      <div class="flex text-[#dfba6b]">
                        {[1,2,3,4,5].map((s) => (
                          <Star key={s} size={11} class={s <= Math.round(selectedProduct.rating) ? "fill-[#dfba6b]" : "text-gray-700"} />
                        ))}
                      </div>
                      <span class="text-xs text-gray-400 font-light">{selectedProduct.rating} ({selectedProduct.reviewsCount} high-status orders)</span>
                    </div>
                  </div>

                  <p id="detail_prod_price" class="text-2xl text-gradient-gold font-extrabold">${selectedProduct.price.toLocaleString()}</p>

                  <div id="detail_description_wrap" class="space-y-1.5 Pt-1 border-t border-neutral-900 pb-2">
                    <span class="text-[10px] tracking-widest text-[#dfba6b] uppercase block font-semibold">Exquisite Heritage Narrative</span>
                    <p id="detail_prod_desc" class="text-xs text-gray-300 font-light leading-relaxed">{selectedProduct.description}</p>
                  </div>

                  {/* Customer Review Accordion / Panel Section */}
                  <div id="reviews_section" class="border-t border-neutral-900 pt-3 space-y-3">
                    <div class="flex justify-between items-center">
                      <span class="text-[10px] tracking-widest text-[#dfba6b] uppercase block font-semibold">Distinguished Testimonials</span>
                      <button id="add_your_review_btn" onClick={() => setReviewModalOpen(true)} class="text-[10px] font-extrabold text-[#dfba6b] hover:underline flex items-center gap-1">
                        + Formulate Appraisal
                      </button>
                    </div>

                    {(selectedProduct.reviews || []).length === 0 ? (
                      <p class="text-[11px] text-gray-500 font-light italic">No high protocol testimonials logged yet for this item.</p>
                    ) : (
                      <div id="reviews_scroll_stack" class="space-y-2.5 max-h-36 overflow-y-auto pr-1">
                        {selectedProduct.reviews.map((rev) => (
                          <div key={rev.id} class="bg-[#121212] border border-neutral-900 p-2.5 rounded-lg text-[10px] space-y-1">
                            <div class="flex justify-between items-center font-bold">
                              <span class="text-white font-medium">{rev.userName}</span>
                              <span class="text-gray-500 font-light">{rev.date}</span>
                            </div>
                            <div class="flex text-[#dfba6b]">
                              {[1,2,3,4,5].map((s) => (
                                <Star key={s} size={8} class={s <= rev.rating ? "fill-[#dfba6b]" : "text-gray-800"} />
                              ))}
                            </div>
                            <p class="text-gray-400 font-light leading-relaxed">{rev.comment}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Purchasing Call to Action Drawer and Buttons */}
                  <div id="purchasing_tier_tray" class="flex gap-4 pt-4 border-t border-neutral-900">
                    <button 
                      id="detail_add_to_cart_btn"
                      onClick={() => addToCart(selectedProduct)} 
                      class="flex-1 bg-neutral-900 border border-[#dfba6b]/40 hover:bg-[#1a1a1a] text-white text-xs uppercase font-extrabold tracking-widest py-3.5 rounded-xl transition-transform active:scale-95"
                    >
                      Incorporate Carriage
                    </button>
                    <button 
                      id="detail_buy_now_btn"
                      onClick={() => {
                        addToCart(selectedProduct);
                        setSelectedProduct(null);
                        setCurrentTab('cart');
                        initiateCheckout();
                      }} 
                      class="flex-1 bg-gradient-gold text-black text-xs uppercase font-extrabold tracking-widest py-3.5 rounded-xl transition-all hover:opacity-95 shadow-md active:scale-95"
                    >
                      Acquire Instantly
                    </button>
                  </div>

                </div>

              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* SYSTEM SLIDE UP OVERLAYS / CHECKOUT MODULE SHEET        */}
          {/* ======================================================== */}
          {checkoutModalOpen && (
            <div id="checkout_overlay_sheet" class="absolute inset-x-0 top-[38px] bottom-0 bg-black/95 z-50 overflow-y-auto no-scrollbar flex items-end">
              <div id="checkout_overlay_body" class="w-full bg-gradient-to-b from-neutral-900 to-black border-t border-[#dfba6b]/40 rounded-t-[32px] p-6 text-left space-y-5">
                
                <div class="flex items-center justify-between">
                  <h3 class="text-md font-bold text-white uppercase tracking-widest font-serif flex items-center gap-1.5">
                    <Truck size={15} class="text-[#dfba6b]" /> Carriage Routing Panel
                  </h3>
                  <button id="close_checkout_form_btn" onClick={() => setCheckoutModalOpen(false)} class="text-gray-500 hover:text-white">
                    <X size={18} />
                  </button>
                </div>

                {paymentStep === 0 && (
                  <form id="checkout_address_form" onSubmit={submitOrder} class="space-y-4">
                    <div id="chk_shipping_address">
                      <label class="block text-[10px] uppercase tracking-widest text-[#dfba6b] font-bold mb-1.5">Consignment Destination Address</label>
                      <textarea
                        id="checkout_address_area"
                        required
                        rows={3}
                        value={checkoutAddress}
                        onChange={(e) => setCheckoutAddress(e.target.value)}
                        placeholder="Please enter dispatch manor street name, city and country..."
                        class="w-full bg-black border border-neutral-800 rounded-lg py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#dfba6b] font-light leading-relaxed"
                      />
                    </div>

                    <div id="chk_payment_method_select" class="space-y-2">
                      <label class="block text-[10px] uppercase tracking-widest text-[#dfba6b] font-bold">Secure Billing Currency Path</label>
                      
                      <div class="grid grid-cols-2 gap-3 pb-2 font-sans">
                        {/* Cash on delivery */}
                        <div 
                          id="pay_method_cod"
                          onClick={() => setCheckoutPaymentMethod('COD')}
                          class={`border rounded-lg p-3 flex flex-col items-start gap-1 cursor-pointer transition-colors ${
                            checkoutPaymentMethod === 'COD' 
                              ? 'border-[#dfba6b] bg-[#dfba6b]/5' 
                              : 'border-neutral-800 bg-neutral-950'
                          }`}
                        >
                          <span class="text-white text-xs font-bold uppercase tracking-wider">Cash Delivery</span>
                          <span class="text-[9px] text-[#dfba6b] font-medium uppercase mt-1">Cash on Delivery</span>
                        </div>

                        {/* Online stripe simulation */}
                        <div 
                          id="pay_method_online"
                          onClick={() => setCheckoutPaymentMethod('ONLINE')}
                          class={`border rounded-lg p-3 flex flex-col items-start gap-1 cursor-pointer transition-colors ${
                            checkoutPaymentMethod === 'ONLINE' 
                              ? 'border-[#dfba6b] bg-[#dfba6b]/5' 
                              : 'border-neutral-800 bg-neutral-950'
                          }`}
                        >
                          <span class="text-white text-xs font-bold uppercase tracking-wider">Online Visa/Stripe</span>
                          <span class="text-[9px] text-[#dfba6b] font-medium uppercase mt-1">Stripe & SSLCommerz BD</span>
                        </div>
                      </div>
                    </div>

                    {/* Invoice Pricing Check */}
                    <div id="checkout_pricing_row" class="bg-black/40 border border-neutral-900 rounded-lg p-3 flex justify-between items-center text-xs">
                      <span class="text-gray-400">Total Asset Procurement:</span>
                      <span class="text-[#dfba6b] font-black font-mono text-sm">${cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0).toLocaleString()}</span>
                    </div>

                    <button 
                      id="submit_dispatch_route_btn"
                      type="submit" 
                      class="w-full bg-gradient-gold text-black font-extrabold py-3.5 rounded-xl text-xs uppercase tracking-widest hover:opacity-90 active:scale-95 transition-transform"
                    >
                      Authorize Consignment
                    </button>
                  </form>
                )}

                {/* Secure Online Stripe Checkout Screen */}
                {paymentStep === 1 && (
                  <form id="online_payment_terminal" onSubmit={processMockOnlinePayment} class="space-y-4">
                    <div id="stripe_notif" class="bg-amber-950/20 border border-[#dfba6b]/30 rounded-lg p-3 flex items-start gap-2.5 text-[10px] text-gray-300">
                      <CreditCard size={14} class="text-[#dfba6b] shrink-0 mt-0.5 animate-pulse" />
                      <p class="leading-relaxed font-light">Secure Stripe Routing. Sign your authorization details. No real finances are triggered in this sandbox.</p>
                    </div>

                    <div id="card_criteria">
                      <label class="block text-[9px] uppercase tracking-widest text-[#dfba6b] font-bold mb-1">Vault Certificate Card Number</label>
                      <input 
                        id="card_number_input"
                        required
                        type="text" 
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4111 • 2026 • 8899 • 9900"
                        class="w-full bg-black border border-neutral-800 rounded-lg py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#dfba6b] font-sans"
                      />
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                      <div id="card_exp">
                        <label class="block text-[9px] uppercase tracking-widest text-[#dfba6b] font-bold mb-1">Expiration</label>
                        <input 
                          id="card_expiry_input"
                          required
                          type="text" 
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="12/28"
                          class="w-full bg-black border border-neutral-800 rounded-lg py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#dfba6b] font-sans"
                        />
                      </div>
                      <div id="card_cv">
                        <label class="block text-[9px] uppercase tracking-widest text-[#dfba6b] font-bold mb-1">Cipher Key (CVC)</label>
                        <input 
                          id="card_cvc_input"
                          required
                          type="password" 
                          value={cardCVC}
                          onChange={(e) => setCardCVC(e.target.value)}
                          placeholder="•••"
                          maxLength={4}
                          class="w-full bg-black border border-neutral-800 rounded-lg py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#dfba6b] font-sans"
                        />
                      </div>
                    </div>

                    <button 
                      id="card_payment_submit_btn"
                      type="submit" 
                      disabled={isProcessingPayment}
                      class="w-full bg-gradient-gold text-black font-extrabold py-3.5 rounded-xl text-xs uppercase tracking-widest hover:opacity-90 active:scale-95 flex items-center justify-center gap-2"
                    >
                      {isProcessingPayment ? (
                        <>
                          <span class="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                          Routing Secure Handshake...
                        </>
                      ) : (
                        `Authorize Payment For $${cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0).toLocaleString()}`
                      )}
                    </button>
                  </form>
                )}

                {/* Stripe Authorized success tick */}
                {paymentStep === 2 && (
                  <div id="payment_success_box" class="py-12 text-center space-y-4">
                    <div id="payment_success_icon_ring" class="w-16 h-16 rounded-full bg-[#dfba6b]/10 border-2 border-[#dfba6b] mx-auto flex items-center justify-center text-[#dfba6b] shadow-gold-sm">
                      <Check size={28} strokeWidth={3} class="animate-bounce" />
                    </div>
                    <div class="space-y-1">
                      <h4 class="text-md font-bold text-white uppercase tracking-widest">Billing Signature Absolute</h4>
                      <p class="text-xs text-gray-400 font-light">Your payments was captured. Re-routing dispatch ledgers...</p>
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* CUSTOMER TESTIMONIAL FORM RECORD WORKFLOWS              */}
          {/* ======================================================== */}
          {reviewModalOpen && (
            <div id="review_overlay" class="absolute inset-x-0 top-[38px] bottom-0 bg-black/95 z-50 p-6 flex flex-col justify-center text-left space-y-4">
              <div class="flex items-center justify-between border-b border-neutral-900 pb-2.5">
                <h3 class="text-xs font-black tracking-widest text-white uppercase">Formulate Sovereign Appraisal</h3>
                <button id="close_review_overlay_btn" onClick={() => setReviewModalOpen(false)} class="text-gray-500 hover:text-white"><X size={16} /></button>
              </div>

              <form id="product_review_form" onSubmit={submitReview} class="space-y-4">
                <div id="rate_slider">
                  <label class="block text-[10px] uppercase tracking-widest text-[#dfba6b] font-bold mb-1">Imperial Rating (Sovereign Stars)</label>
                  <div class="flex gap-2.5 items-center justify-start py-2">
                    {[1,2,3,4,5].map((num) => (
                      <button
                        id={`star_selector_${num}`}
                        key={num}
                        type="button"
                        onClick={() => setReviewRating(num)}
                        class="text-[#dfba6b] transition-transform hover:scale-110"
                      >
                        <Star size={24} class={num <= reviewRating ? "fill-[#dfba6b]" : "text-gray-700"} />
                      </button>
                    ))}
                    <span class="text-xs text-white font-bold ml-1.5">{reviewRating} out of 5</span>
                  </div>
                </div>

                <div id="comment_input">
                  <label class="block text-[10px] uppercase tracking-widest text-[#dfba6b] font-bold mb-1">Exclusive Experience Statement</label>
                  <textarea
                    id="review_comment_area"
                    rows={4}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Describe craftsmanship detailing, weight of wrist bezel, luxury apparel lining texture feels..."
                    class="w-full bg-[#121212] border border-neutral-800 rounded-lg py-2.5 px-3 text-xs text-white focus:outline-none focus:border-[#dfba6b] font-light leading-relaxed"
                  />
                </div>

                <button 
                  id="submit_review_form_btn"
                  type="submit" 
                  class="w-full bg-gradient-gold text-black font-extrabold py-3 rounded-lg text-xs tracking-widest uppercase hover:opacity-90 transition-transform active:scale-95"
                >
                  Record Appraisal Into Registry
                </button>
              </form>
            </div>
          )}

          {/* ======================================================== */}
          {/* CATALOGUE ADMIN FORM DIALOG WORKFLOWS                    */}
          {/* ======================================================== */}
          {adminModalOpen && (
            <div id="admin_overlay" class="absolute inset-x-0 top-[38px] bottom-0 bg-black/95 z-50 p-6 overflow-y-auto flex flex-col justify-between">
              <div class="space-y-5">
                <div class="flex items-center justify-between border-b border-neutral-900 pb-2.5 text-left">
                  <h3 class="text-xs font-black tracking-widest text-white uppercase flex items-center gap-1.5">
                    <Settings size={12} class="text-[#dfba6b]" /> {editingProduct ? 'Modify Heritage Product' : 'Charter Newly Crafted Creation'}
                  </h3>
                  <button id="close_admin_form_btn" onClick={() => setAdminModalOpen(false)} class="text-gray-500 hover:text-white"><X size={16} /></button>
                </div>

                <form id="admin_catalog_form" onSubmit={handleSaveProductFromAdmin} class="space-y-3 pb-6 text-left">
                  <div id="adm_name">
                    <label class="block text-[9px] uppercase tracking-widest text-[#dfba6b] font-bold mb-1">Item Sovereign Name</label>
                    <input 
                      id="adm_name_input"
                      required
                      type="text" 
                      value={newProductName}
                      onChange={(e) => setNewProductName(e.target.value)}
                      placeholder="e.g. Aurex Royal Chronograph"
                      class="w-full bg-neutral-900 border border-neutral-800 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-[#dfba6b]"
                    />
                  </div>

                  <div id="adm_price">
                    <label class="block text-[9px] uppercase tracking-widest text-[#dfba6b] font-bold mb-1">Procurement asset Price ($ USD)</label>
                    <input 
                      id="adm_price_input"
                      required
                      type="number" 
                      value={newProductPrice}
                      onChange={(e) => setNewProductPrice(e.target.value)}
                      placeholder="e.g. 24000"
                      class="w-full bg-neutral-900 border border-neutral-800 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-[#dfba6b] text-left"
                    />
                  </div>

                  <div id="adm_category">
                    <label class="block text-[9px] uppercase tracking-widest text-[#dfba6b] font-bold mb-1">Curated Department</label>
                    <select
                      id="adm_category_select"
                      value={newProductCategory}
                      onChange={(e) => setNewProductCategory(e.target.value)}
                      class="w-full bg-neutral-900 border border-neutral-800 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-[#dfba6b]"
                    >
                      <option value="Horology">Horology (Watches)</option>
                      <option value="Eyewear">Eyewear (Sunglasses)</option>
                      <option value="Attire">Attire (High-end Apparel)</option>
                      <option value="Jewels">Jewels (Rings & Diamonds)</option>
                    </select>
                  </div>

                  <div id="adm_image">
                    <label class="block text-[9px] uppercase tracking-widest text-[#dfba6b] font-bold mb-1">Aesthetic Representation (Unsplash Photo URL)</label>
                    <input 
                      id="adm_image_input"
                      type="text" 
                      value={newProductImage}
                      onChange={(e) => setNewProductImage(e.target.value)}
                      placeholder="Optional. URL to luxury represent image"
                      class="w-full bg-neutral-900 border border-neutral-800 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-[#dfba6b]"
                    />
                  </div>

                  <div id="adm_desc">
                    <label class="block text-[9px] uppercase tracking-widest text-[#dfba6b] font-bold mb-1">narrator description storytelling</label>
                    <textarea 
                      id="adm_desc_area"
                      required
                      rows={3}
                      value={newProductDescription}
                      onChange={(e) => setNewProductDescription(e.target.value)}
                      placeholder="e.g. Exquisite hand carvings showcasing diamond cluster rings..."
                      class="w-full bg-neutral-900 border border-neutral-800 rounded-lg py-2 px-3 text-xs text-white focus:outline-none focus:border-[#dfba6b] leading-relaxed"
                    />
                  </div>

                  <button 
                    id="save_catalog_item_btn"
                    type="submit" 
                    class="w-full mt-4 bg-gradient-gold text-black font-extrabold py-3 rounded-lg text-xs uppercase tracking-widest hover:opacity-90 active:scale-95 transition-transform"
                  >
                    Commit Masterpiece Entry
                  </button>
                </form>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
