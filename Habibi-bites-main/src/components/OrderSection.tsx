import React, { useState, useEffect } from 'react';
import { ShoppingBag, CheckCircle2, Phone, MapPin, User, FileText, Send, Sparkles, AlertCircle, LogIn, Cloud, ShieldCheck, Mail, Check, Copy } from 'lucide-react';
import { MENU_ITEMS, RESTAURANT_INFO } from '../data/restaurantData';
import { OrderFormValues, OrderHistoryItem } from '../types';
import { OrderHistory } from './OrderHistory';
import { useAuth } from '../context/AuthContext';
import { saveOrderToFirestore, subscribeToUserOrders } from '../lib/firebase';

const STORAGE_KEY = 'habibi_bites_order_history';

const loadOrderHistory = (): OrderHistoryItem[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to read order history from localStorage:', err);
  }
  return [];
};

const saveOrderHistory = (orders: OrderHistoryItem[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch (err) {
    console.error('Failed to save order history to localStorage:', err);
  }
};

interface OrderSectionProps {
  preselectedItemId?: string;
  preselectedSize?: string;
}

export const OrderSection: React.FC<OrderSectionProps> = ({
  preselectedItemId,
  preselectedSize,
}) => {
  const [formState, setFormState] = useState<OrderFormValues>({
    customerName: '',
    phoneNumber: '',
    deliveryLocation: '',
    selectedItemId: preselectedItemId || MENU_ITEMS[0].id,
    selectedSize: preselectedSize || MENU_ITEMS[0].sizes[0]?.name || 'Standard',
    deliveryChefNote: '',
  });

  const { user, loginWithGoogle } = useAuth();

  const [errors, setErrors] = useState<Partial<Record<keyof OrderFormValues, string>>>({});
  const [submittedOrder, setSubmittedOrder] = useState<{
    data: OrderFormValues;
    itemName: string;
    price: number;
    referenceId: string;
    timestamp: string;
  } | null>(null);

  const [orderHistory, setOrderHistory] = useState<OrderHistoryItem[]>(() => loadOrderHistory());
  const [emailSendingStatus, setEmailSendingStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [emailErrorMsg, setEmailErrorMsg] = useState<string>('');
  const [emailSentTo, setEmailSentTo] = useState<string>('ur0688666@gmail.com');
  const [copiedEmailData, setCopiedEmailData] = useState<boolean>(false);

  // Auto-populate customer name from authenticated user if empty
  useEffect(() => {
    if (user?.displayName && !formState.customerName) {
      setFormState((prev) => ({
        ...prev,
        customerName: user.displayName || '',
      }));
    }
  }, [user]);

  // Sync recipient email from server config
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        if (data?.orderEmailRecipient) {
          setEmailSentTo(data.orderEmailRecipient);
        }
      })
      .catch(() => {});
  }, []);

  // Subscribe to real-time Firestore orders when authenticated
  useEffect(() => {
    if (!user) {
      setOrderHistory(loadOrderHistory());
      return;
    }

    const unsubscribe = subscribeToUserOrders(user.uid, (cloudOrders) => {
      if (cloudOrders && cloudOrders.length > 0) {
        setOrderHistory(cloudOrders);
        saveOrderHistory(cloudOrders);
      }
    });

    return () => unsubscribe();
  }, [user]);

  // Sync when prop changes
  useEffect(() => {
    if (preselectedItemId) {
      const matchedItem = MENU_ITEMS.find((i) => i.id === preselectedItemId);
      if (matchedItem) {
        setFormState((prev) => {
          const availableSize = preselectedSize && matchedItem.sizes.some((s) => s.name === preselectedSize)
            ? preselectedSize
            : matchedItem.sizes[0]?.name || 'Standard';

          return {
            ...prev,
            selectedItemId: matchedItem.id,
            selectedSize: availableSize,
          };
        });
      }
    }
  }, [preselectedItemId, preselectedSize]);

  // Current chosen item object
  const currentItem = MENU_ITEMS.find((i) => i.id === formState.selectedItemId) || MENU_ITEMS[0];

  // Dynamic size options for current item
  const sizeOptions = currentItem.sizes;

  // Compute selected price
  const activeSizeObj = sizeOptions.find((s) => s.name === formState.selectedSize) || sizeOptions[0];
  const calculatedPrice = activeSizeObj ? activeSizeObj.price : currentItem.basePrice;

  const handleItemChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newItemId = e.target.value;
    const newItem = MENU_ITEMS.find((i) => i.id === newItemId) || MENU_ITEMS[0];
    const defaultSize = newItem.sizes[0]?.name || 'Standard';

    setFormState((prev) => ({
      ...prev,
      selectedItemId: newItemId,
      selectedSize: defaultSize,
    }));

    if (errors.selectedItemId) {
      setErrors((prev) => ({ ...prev, selectedItemId: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof OrderFormValues, string>> = {};

    if (!formState.customerName.trim()) {
      newErrors.customerName = 'Please enter your full name';
    }

    const cleanPhone = formState.phoneNumber.replace(/[^0-9+]/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      newErrors.phoneNumber = 'Please enter a valid Pakistani phone number (e.g. 0343 4100089)';
    }

    if (!formState.deliveryLocation.trim()) {
      newErrors.deliveryLocation = 'Please provide your delivery address or area landmark';
    }

    if (!formState.selectedItemId) {
      newErrors.selectedItemId = 'Please select a menu item';
    }

    if (!formState.selectedSize) {
      newErrors.selectedSize = 'Please choose a portion size';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    // Build unique reference code for customer convenience
    const ref = 'HB-' + Math.floor(100000 + Math.random() * 900000);
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newOrderRecord: OrderHistoryItem = {
      referenceId: ref,
      customerName: formState.customerName.trim(),
      phoneNumber: formState.phoneNumber.trim(),
      deliveryLocation: formState.deliveryLocation.trim(),
      selectedItemId: formState.selectedItemId,
      itemName: currentItem.name,
      selectedSize: formState.selectedSize,
      price: calculatedPrice,
      deliveryChefNote: formState.deliveryChefNote.trim() || undefined,
      timestamp: now,
      createdAt: Date.now(),
    };

    setSubmittedOrder({
      data: { ...formState },
      itemName: currentItem.name,
      price: calculatedPrice,
      referenceId: ref,
      timestamp: now,
    });

    // Persist to Firestore if user is signed in
    if (user?.uid) {
      saveOrderToFirestore(user.uid, newOrderRecord).catch((err) => {
        console.warn('Firestore order sync deferred or failed:', err);
      });
    }

    // Dispatch order form data to restaurant email
    setEmailSendingStatus('sending');
    setEmailErrorMsg('');
    fetch('/api/send-order-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        referenceId: ref,
        customerName: formState.customerName.trim(),
        phoneNumber: formState.phoneNumber.trim(),
        deliveryLocation: formState.deliveryLocation.trim(),
        selectedItemId: formState.selectedItemId,
        itemName: currentItem.name,
        selectedSize: formState.selectedSize,
        price: calculatedPrice,
        deliveryChefNote: formState.deliveryChefNote.trim() || undefined,
        timestamp: now,
        userEmail: user?.email || undefined,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.sentToEmail) {
          setEmailSentTo(data.sentToEmail);
        }
        if (data?.success && data?.sentToSmtp) {
          setEmailSendingStatus('sent');
        } else {
          setEmailSendingStatus('error');
          setEmailErrorMsg(data?.error || 'Email could not be delivered to inbox via SMTP.');
        }
      })
      .catch((err) => {
        console.warn('Order email dispatch warning:', err);
        setEmailSendingStatus('error');
        setEmailErrorMsg(err?.message || 'Network error connecting to email service');
      });

    setOrderHistory((prev) => {
      const updated = [newOrderRecord, ...prev.filter((o) => o.referenceId !== ref)].slice(0, 10);
      saveOrderHistory(updated);
      return updated;
    });
  };

  const handleReorder = (order: OrderHistoryItem) => {
    setSubmittedOrder(null);
    setEmailSendingStatus('idle');

    const matchedItem = MENU_ITEMS.find((i) => i.id === order.selectedItemId || i.name === order.itemName) || MENU_ITEMS[0];
    const sizeToUse = matchedItem.sizes.some((s) => s.name === order.selectedSize)
      ? order.selectedSize
      : matchedItem.sizes[0]?.name || 'Standard';

    setFormState({
      customerName: order.customerName,
      phoneNumber: order.phoneNumber,
      deliveryLocation: order.deliveryLocation,
      selectedItemId: matchedItem.id,
      selectedSize: sizeToUse,
      deliveryChefNote: order.deliveryChefNote || '',
    });
    setErrors({});

    const formElement = document.getElementById('order');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleClearHistory = () => {
    setOrderHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error('Failed to clear order history:', err);
    }
  };

  const handleReset = () => {
    setSubmittedOrder(null);
    setEmailSendingStatus('idle');
    setCopiedEmailData(false);
    setFormState({
      customerName: '',
      phoneNumber: '',
      deliveryLocation: '',
      selectedItemId: MENU_ITEMS[0].id,
      selectedSize: MENU_ITEMS[0].sizes[0]?.name || 'Standard',
      deliveryChefNote: '',
    });
    setErrors({});
  };

  // Web Gmail Compose URL (opens Gmail tab directly with order pre-filled)
  const buildGmailWebUrl = () => {
    if (!submittedOrder) return '#';
    const subject = `New Habibi Bites Order #${submittedOrder.referenceId} - ${submittedOrder.itemName}`;
    const body = `HABIBI BITES ORDER NOTIFICATION
--------------------------------------------------
Order Reference: #${submittedOrder.referenceId}
Placed At: ${submittedOrder.timestamp}

CUSTOMER INFORMATION:
- Name: ${submittedOrder.data.customerName}
- Phone Number: ${submittedOrder.data.phoneNumber}
- Delivery Location: ${submittedOrder.data.deliveryLocation}
${user?.email ? `- Account Email: ${user.email}\n` : ''}
ORDER DETAILS:
- Item: ${submittedOrder.itemName}
- Portion Size: ${submittedOrder.data.selectedSize}
- Estimated Total: Rs. ${submittedOrder.price}
- Chef / Rider Notes: ${submittedOrder.data.deliveryChefNote || 'None'}

Hotline: 0343 4100089 | Lahore, Pakistan`;
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(emailSentTo)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  // Direct mailto link generator for ur0688666@gmail.com
  const buildMailToUrl = () => {
    if (!submittedOrder) return '#';
    const subject = `New Habibi Bites Order #${submittedOrder.referenceId} - ${submittedOrder.itemName}`;
    const body = `HABIBI BITES ORDER NOTIFICATION
--------------------------------------------------
Order Reference: #${submittedOrder.referenceId}
Placed At: ${submittedOrder.timestamp}

CUSTOMER INFORMATION:
- Name: ${submittedOrder.data.customerName}
- Phone Number: ${submittedOrder.data.phoneNumber}
- Delivery Location: ${submittedOrder.data.deliveryLocation}
${user?.email ? `- Account Email: ${user.email}\n` : ''}
ORDER DETAILS:
- Item: ${submittedOrder.itemName}
- Portion Size: ${submittedOrder.data.selectedSize}
- Estimated Total: Rs. ${submittedOrder.price}
- Chef / Rider Notes: ${submittedOrder.data.deliveryChefNote || 'None'}

Hotline: 0343 4100089 | Lahore, Pakistan`;
    return `mailto:${encodeURIComponent(emailSentTo)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  // Copy plain text order summary for email/messages
  const handleCopyEmailData = async () => {
    if (!submittedOrder) return;
    const text = `Habibi Bites Order #${submittedOrder.referenceId}
Customer: ${submittedOrder.data.customerName}
Phone: ${submittedOrder.data.phoneNumber}
Location: ${submittedOrder.data.deliveryLocation}
Item: ${submittedOrder.itemName} (${submittedOrder.data.selectedSize})
Total: Rs. ${submittedOrder.price}
Note: ${submittedOrder.data.deliveryChefNote || 'None'}
Sent to: ${emailSentTo}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedEmailData(true);
      setTimeout(() => setCopiedEmailData(false), 2000);
    } catch (err) {
      console.error('Failed to copy order details:', err);
    }
  };

  // WhatsApp quick trigger
  const buildWhatsAppUrl = () => {
    if (!submittedOrder) return '#';
    const text = `*New Order Request - Habibi Bites*\nRef: ${submittedOrder.referenceId}\nName: ${submittedOrder.data.customerName}\nPhone: ${submittedOrder.data.phoneNumber}\nLocation: ${submittedOrder.data.deliveryLocation}\nItem: ${submittedOrder.itemName} (${submittedOrder.data.selectedSize})\nPrice: Rs. ${submittedOrder.price}\nNote: ${submittedOrder.data.deliveryChefNote || 'None'}`;
    return `https://wa.me/923434100089?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="order" className="py-20 sm:py-28 bg-[#0e1116] relative border-t border-b border-[#212733]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#181d26] border border-[#d4af37]/30 text-xs font-bold text-[#f3e5ab] uppercase tracking-wider mb-4">
            <ShoppingBag className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Fast Fresh Ordering</span>
          </div>

          <h2 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
            Order <span className="text-[#d4af37]">Now</span>
          </h2>

          <p className="mt-3 text-sm sm:text-base text-[#a2abb9]">
            Craving Habibi Bites? Complete your details below and we will prepare your fresh, hot order right away.
          </p>
        </div>

        {submittedOrder ? (
          /* Confirmation Success State */
          <div
            id="order-confirmation-box"
            className="max-w-2xl mx-auto rounded-3xl bg-[#131720] border border-[#d4af37]/40 p-6 sm:p-10 shadow-2xl relative overflow-hidden text-center animate-in fade-in zoom-in-95 duration-300"
          >
            <div className="w-16 h-16 rounded-2xl bg-[#d4af37]/20 border border-[#d4af37] text-[#d4af37] mx-auto flex items-center justify-center mb-6 shadow-lg shadow-[#d4af37]/20">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <span className="text-xs font-bold uppercase tracking-widest text-[#d4af37] block mb-2">
              Order Request Received • Ref #{submittedOrder.referenceId}
            </span>

            <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white mb-4">
              Thank You, {submittedOrder.data.customerName}!
            </h3>

            {/* Exact required confirmation message */}
            <div className="p-4 rounded-xl bg-[#1b222d] border border-[#2b3544] mb-6 text-sm sm:text-base text-[#f5f2eb] leading-relaxed font-medium">
              “Thank you! Your order request has been received. Habibi Bites will contact you on your provided phone number to confirm the order.”
            </div>

            {/* Order Summary Snapshot */}
            <div className="rounded-2xl bg-[#0b0d10] p-5 border border-[#222936] text-left text-xs sm:text-sm space-y-2 mb-8">
              <div className="flex justify-between text-[#8e98a7] pb-2 border-b border-[#1b212c]">
                <span>Time Received:</span>
                <span className="text-white font-medium">{submittedOrder.timestamp}</span>
              </div>
              <div className="flex justify-between text-[#8e98a7]">
                <span>Contact Phone:</span>
                <span className="text-[#f3e5ab] font-semibold">{submittedOrder.data.phoneNumber}</span>
              </div>
              <div className="flex justify-between text-[#8e98a7]">
                <span>Delivery Location:</span>
                <span className="text-white font-medium">{submittedOrder.data.deliveryLocation}</span>
              </div>
              <div className="flex justify-between text-[#8e98a7] pt-2 border-t border-[#1b212c]">
                <span>Selected Item:</span>
                <span className="text-white font-bold">{submittedOrder.itemName} ({submittedOrder.data.selectedSize})</span>
              </div>
              {submittedOrder.data.deliveryChefNote && (
                <div className="flex justify-between text-[#8e98a7] pt-1">
                  <span>Note for Chef / Rider:</span>
                  <span className="text-[#d2d8e3] italic text-right max-w-xs">{submittedOrder.data.deliveryChefNote}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-sm pt-3 border-t border-[#1b212c]">
                <span className="font-bold text-white">Estimated Subtotal:</span>
                <span className="font-display font-extrabold text-base text-[#d4af37]">
                  {RESTAURANT_INFO.currency} {submittedOrder.price}
                </span>
              </div>
            </div>

            {/* Email Dispatch Notification Status Banner */}
            <div className="rounded-2xl bg-[#0b0f16] p-4 border border-[#243042] mb-6 text-left">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    emailSendingStatus === 'sent' ? 'bg-[#0d2818] border border-[#1b5e20] text-[#4ade80]' :
                    emailSendingStatus === 'sending' ? 'bg-[#291f07] border border-[#78590c] text-[#d4af37] animate-pulse' :
                    emailSendingStatus === 'error' ? 'bg-[#2a1315] border border-[#581c20] text-[#f87171]' :
                    'bg-[#1a2332] border border-[#334155] text-[#93c5fd]'
                  }`}>
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-white">
                        {emailSendingStatus === 'sending' && 'Connecting to Gmail SMTP...'}
                        {emailSendingStatus === 'sent' && 'Order Successfully Delivered to Email'}
                        {emailSendingStatus === 'error' && 'Email Sending Status & Direct Send'}
                        {emailSendingStatus === 'idle' && 'Order Notification Ready'}
                      </span>
                      {emailSendingStatus === 'sent' && (
                        <span className="px-2 py-0.5 rounded-full bg-[#0d2818] border border-[#1b5e20] text-[10px] font-bold text-[#4ade80] flex items-center gap-1">
                          <Check className="w-2.5 h-2.5" /> Delivered via SMTP
                        </span>
                      )}
                      {emailSendingStatus === 'error' && (
                        <span className="px-2 py-0.5 rounded-full bg-[#2a1315] border border-[#581c20] text-[10px] font-bold text-[#f87171] flex items-center gap-1">
                          <AlertCircle className="w-2.5 h-2.5" /> Action Required
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#8e99aa] mt-0.5">
                      Destination: <strong className="text-[#f3e5ab] font-mono">{emailSentTo}</strong>
                    </p>
                    {emailSendingStatus === 'error' && emailErrorMsg && (
                      <p className="text-[11px] text-[#fca5a5] mt-1 bg-[#1c1214] px-2.5 py-1 rounded-lg border border-[#451a1d]">
                        {emailErrorMsg}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-start lg:justify-end shrink-0">
                  <a
                    href={buildGmailWebUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-[#c5221f]/20 hover:bg-[#c5221f]/35 border border-[#ea4335]/40 text-xs font-semibold text-[#fca5a5] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                    title="Open order directly inside Gmail Web"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#ea4335]" />
                    <span>Open in Gmail</span>
                  </a>
                  <a
                    href={buildMailToUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 rounded-xl bg-[#17202d] hover:bg-[#222e40] border border-[#2d3b4e] text-xs font-semibold text-[#93c5fd] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Open in your default mail app"
                  >
                    <span>Mail App</span>
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyEmailData}
                    className="px-3 py-2 rounded-xl bg-[#19202a] hover:bg-[#232b38] border border-[#2a3545] text-xs font-semibold text-[#cbd5e1] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="Copy formatted plain text order summary"
                  >
                    {copiedEmailData ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#4ade80]" />
                        <span className="text-[#4ade80]">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#8e99aa]" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={buildWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#25d366] hover:bg-[#20ba59] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Send via WhatsApp</span>
              </a>

              <a
                href={RESTAURANT_INFO.phoneTel}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#1d232f] hover:bg-[#27303f] border border-[#343e50] text-[#f3e5ab] text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all"
              >
                <Phone className="w-4 h-4 text-[#d4af37]" />
                <span>Call Directly: {RESTAURANT_INFO.phone}</span>
              </a>

              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-transparent hover:bg-white/5 text-[#a8b1c0] hover:text-white text-xs sm:text-sm font-medium transition-all"
              >
                Place Another Order
              </button>
            </div>
          </div>
        ) : (
          /* Order Form */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Form Column (7 cols) */}
            <div className="lg:col-span-7 bg-[#131720] rounded-3xl p-6 sm:p-8 border border-[#242b37] shadow-xl">
              {/* Google Sign-in / Cloud Status Banner */}
              <div className="mb-6 p-4 rounded-2xl bg-[#0e1219] border border-[#222b39] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                {user ? (
                  <div className="flex items-center gap-3">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || 'User'}
                        className="w-10 h-10 rounded-full border border-[#d4af37]"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#d4af37]/20 text-[#d4af37] flex items-center justify-center font-bold">
                        {(user.displayName || user.email || 'U')[0].toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{user.displayName || 'Habibi Diner'}</span>
                        <span className="px-2 py-0.5 rounded-full bg-[#0d2818] border border-[#1b5e20] text-[10px] font-bold text-[#4ade80] flex items-center gap-1">
                          <Cloud className="w-2.5 h-2.5" />
                          Firestore Synced
                        </span>
                      </div>
                      <p className="text-xs text-[#828c9b]">Your orders are automatically backed up to your cloud account</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] shrink-0">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">Save Orders & Fast Reorder</p>
                        <p className="text-[11px] text-[#8e98a7]">Sign in with Google to sync your orders via Firestore</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => loginWithGoogle()}
                      className="px-3.5 py-2 rounded-xl bg-[#1a212c] hover:bg-[#252f3f] border border-[#344156] text-xs font-bold text-[#f3e5ab] flex items-center gap-1.5 transition-colors cursor-pointer self-stretch sm:self-auto justify-center"
                    >
                      <LogIn className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>Sign in with Google</span>
                    </button>
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                
                {/* Customer Name */}
                <div>
                  <label htmlFor="order-customer-name" className="block text-xs sm:text-sm font-semibold text-[#d4af37] mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    <span>Customer Name *</span>
                  </label>
                  <input
                    type="text"
                    id="order-customer-name"
                    name="customerName"
                    value={formState.customerName}
                    onChange={(e) => {
                      setFormState({ ...formState, customerName: e.target.value });
                      if (errors.customerName) setErrors({ ...errors, customerName: undefined });
                    }}
                    placeholder="Enter your full name (e.g. Ali Khan)"
                    className={`w-full px-4 py-3 rounded-xl bg-[#0b0d10] border ${
                      errors.customerName ? 'border-red-500 ring-1 ring-red-500' : 'border-[#2c3442] focus:border-[#d4af37]'
                    } text-white placeholder-[#5d6778] text-sm focus:outline-none transition-colors`}
                  />
                  {errors.customerName && (
                    <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.customerName}
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label htmlFor="order-phone-number" className="block text-xs sm:text-sm font-semibold text-[#d4af37] mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" />
                    <span>Phone Number *</span>
                  </label>
                  <input
                    type="tel"
                    id="order-phone-number"
                    name="phoneNumber"
                    value={formState.phoneNumber}
                    onChange={(e) => {
                      setFormState({ ...formState, phoneNumber: e.target.value });
                      if (errors.phoneNumber) setErrors({ ...errors, phoneNumber: undefined });
                    }}
                    placeholder="0343 4100089 or 03XX XXXXXXX"
                    className={`w-full px-4 py-3 rounded-xl bg-[#0b0d10] border ${
                      errors.phoneNumber ? 'border-red-500 ring-1 ring-red-500' : 'border-[#2c3442] focus:border-[#d4af37]'
                    } text-white placeholder-[#5d6778] text-sm focus:outline-none transition-colors`}
                  />
                  {errors.phoneNumber ? (
                    <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.phoneNumber}
                    </p>
                  ) : (
                    <p className="mt-1 text-[11px] text-[#717b8b]">
                      We will call this number to verify your order details before dispatch.
                    </p>
                  )}
                </div>

                {/* Delivery Location */}
                <div>
                  <label htmlFor="order-delivery-location" className="block text-xs sm:text-sm font-semibold text-[#d4af37] mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Delivery Location / Address *</span>
                  </label>
                  <input
                    type="text"
                    id="order-delivery-location"
                    name="deliveryLocation"
                    value={formState.deliveryLocation}
                    onChange={(e) => {
                      setFormState({ ...formState, deliveryLocation: e.target.value });
                      if (errors.deliveryLocation) setErrors({ ...errors, deliveryLocation: undefined });
                    }}
                    placeholder="Street, Sector, House # or nearby landmark"
                    className={`w-full px-4 py-3 rounded-xl bg-[#0b0d10] border ${
                      errors.deliveryLocation ? 'border-red-500 ring-1 ring-red-500' : 'border-[#2c3442] focus:border-[#d4af37]'
                    } text-white placeholder-[#5d6778] text-sm focus:outline-none transition-colors`}
                  />
                  {errors.deliveryLocation && (
                    <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {errors.deliveryLocation}
                    </p>
                  )}
                </div>

                {/* Item & Size Selectors (Grid 2 Cols) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Select Item */}
                  <div>
                    <label htmlFor="order-select-item" className="block text-xs sm:text-sm font-semibold text-[#d4af37] mb-1.5">
                      Select Item *
                    </label>
                    <select
                      id="order-select-item"
                      name="selectedItemId"
                      value={formState.selectedItemId}
                      onChange={handleItemChange}
                      className="w-full px-3.5 py-3 rounded-xl bg-[#0b0d10] border border-[#2c3442] focus:border-[#d4af37] text-white text-sm focus:outline-none transition-colors cursor-pointer"
                    >
                      {MENU_ITEMS.map((item) => (
                        <option key={item.id} value={item.id} className="bg-[#12161d] text-white py-1">
                          {item.name} ({item.category})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Select Size (Dynamically updated) */}
                  <div>
                    <label htmlFor="order-select-size" className="block text-xs sm:text-sm font-semibold text-[#d4af37] mb-1.5">
                      Select Size *
                    </label>
                    <select
                      id="order-select-size"
                      name="selectedSize"
                      value={formState.selectedSize}
                      onChange={(e) => setFormState({ ...formState, selectedSize: e.target.value })}
                      className="w-full px-3.5 py-3 rounded-xl bg-[#0b0d10] border border-[#2c3442] focus:border-[#d4af37] text-white text-sm focus:outline-none transition-colors cursor-pointer"
                    >
                      {sizeOptions.map((s) => (
                        <option key={s.name} value={s.name} className="bg-[#12161d] text-white py-1">
                          {s.name} - {RESTAURANT_INFO.currency} {s.price}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Note for Delivery Man or Chef */}
                <div>
                  <label htmlFor="order-note" className="block text-xs sm:text-sm font-semibold text-[#d4af37] mb-1.5 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Note for Delivery Man or Chef</span>
                  </label>
                  <textarea
                    id="order-note"
                    name="deliveryChefNote"
                    rows={3}
                    value={formState.deliveryChefNote}
                    onChange={(e) => setFormState({ ...formState, deliveryChefNote: e.target.value })}
                    placeholder="E.g. Extra spicy, no mayo, please ring bell upon arrival, near main gate..."
                    className="w-full px-4 py-3 rounded-xl bg-[#0b0d10] border border-[#2c3442] focus:border-[#d4af37] text-white placeholder-[#5d6778] text-sm focus:outline-none transition-colors resize-none"
                  />
                </div>

                {/* Email Dispatch Notification Notice */}
                <div className="p-3 rounded-xl bg-[#0b0f16] border border-[#232d3d] text-xs text-[#9aa4b4] flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#d4af37]/15 text-[#d4af37] border border-[#d4af37]/30 flex items-center justify-center shrink-0">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-[#8e98a7]">Order form data is automatically routed to </span>
                    <strong className="text-[#f3e5ab] font-mono">{emailSentTo}</strong>
                    <span className="text-[#8e98a7]"> for real-time kitchen tracking.</span>
                  </div>
                </div>

                {/* Place Order Submit Button */}
                <button
                  type="submit"
                  id="order-submit-button"
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#e5c05b] to-[#c59b27] text-[#121417] text-base font-bold shadow-xl shadow-[#d4af37]/25 hover:shadow-[#d4af37]/45 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-5 h-5 text-[#121417]" />
                  <span>Place Order</span>
                </button>
              </form>
            </div>

            {/* Live Order Summary Column (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="rounded-3xl bg-[#131720] border border-[#242b37] p-6 shadow-xl">
                <div className="flex items-center justify-between pb-4 border-b border-[#232b38]">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#d4af37]">Live Order Summary</span>
                  <span className="text-[11px] text-[#788394]">Cash on Delivery</span>
                </div>

                {/* Visual Preview */}
                <div className="mt-4 flex gap-4 items-center">
                  <img
                    src={currentItem.image}
                    alt={currentItem.alt}
                    className="w-20 h-20 rounded-xl object-cover border border-[#2c3545]"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="font-heading font-bold text-white text-base leading-tight">
                      {currentItem.name}
                    </h4>
                    <p className="text-xs text-[#d4af37] font-semibold mt-1">
                      Portion: {formState.selectedSize}
                    </p>
                    <p className="text-xs text-[#8e99aa] line-clamp-1 mt-0.5">
                      {currentItem.category}
                    </p>
                  </div>
                </div>

                {/* Pricing Calculation */}
                <div className="mt-6 pt-4 border-t border-[#202735] space-y-2.5 text-xs text-[#a0aab8]">
                  <div className="flex justify-between">
                    <span>Base Item Price:</span>
                    <span className="text-white font-medium">{RESTAURANT_INFO.currency} {calculatedPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Packaging & Prep:</span>
                    <span className="text-white font-medium">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Delivery:</span>
                    <span className="text-[#a4e0a4] font-medium">Standard Neighborhood Rate</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-[#232b38] text-sm">
                    <span className="font-bold text-white">Estimated Total:</span>
                    <span className="font-display font-extrabold text-xl text-[#d4af37]">
                      {RESTAURANT_INFO.currency} {calculatedPrice}
                    </span>
                  </div>
                </div>

                <div className="mt-6 p-3.5 rounded-xl bg-[#0b0d10] border border-[#1f2633] text-[11px] text-[#828c9b] flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
                  <span>
                    Our kitchen staff immediately reviews each request. We call to confirm right before sending to the grill.
                  </span>
                </div>
              </div>

              {/* Direct Call Helper */}
              <div className="p-5 rounded-2xl bg-[#171c24] border border-[#28313f] flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-[#f3e5ab]">Prefer Ordering by Phone?</div>
                  <div className="text-sm font-bold text-white">{RESTAURANT_INFO.phone}</div>
                </div>
                <a
                  href={RESTAURANT_INFO.phoneTel}
                  className="px-4 py-2 rounded-xl bg-[#202734] hover:bg-[#2b3547] text-[#d4af37] border border-[#3b475c] text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Now</span>
                </a>
              </div>
            </div>

          </div>
        )}

        {/* Order History Component */}
        <OrderHistory
          orders={orderHistory}
          onReorder={handleReorder}
          onClearHistory={handleClearHistory}
          isCloudSynced={Boolean(user)}
        />
      </div>
    </section>
  );
};
