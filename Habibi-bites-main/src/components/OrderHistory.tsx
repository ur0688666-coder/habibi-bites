import React, { useState } from 'react';
import { Clock, RotateCcw, Trash2, Receipt, CheckCircle2, ChevronDown, ChevronUp, MapPin, Phone, MessageSquare } from 'lucide-react';
import { OrderHistoryItem } from '../types';
import { RESTAURANT_INFO } from '../data/restaurantData';

interface OrderHistoryProps {
  orders: OrderHistoryItem[];
  onReorder: (order: OrderHistoryItem) => void;
  onClearHistory: () => void;
  isCloudSynced?: boolean;
}

export const OrderHistory: React.FC<OrderHistoryProps> = ({
  orders,
  onReorder,
  onClearHistory,
  isCloudSynced = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  if (orders.length === 0) {
    return (
      <div id="order-history-empty" className="mt-12 rounded-2xl bg-[#11141b] border border-[#212734] p-6 text-center">
        <div className="w-10 h-10 rounded-xl bg-[#1a202c] border border-[#2e3748] text-[#9ea8b7] mx-auto flex items-center justify-center mb-3">
          <Clock className="w-5 h-5 text-[#d4af37]" />
        </div>
        <h4 className="font-heading font-bold text-white text-sm">No Recent Orders Yet</h4>
        <p className="text-xs text-[#8c96a5] mt-1 max-w-md mx-auto">
          When you submit an order, your order reference and receipt details will be stored locally here for quick tracking and one-tap reordering.
        </p>
      </div>
    );
  }

  return (
    <div id="order-history-section" className="mt-12 rounded-3xl bg-[#11151d] border border-[#232b3a] p-5 sm:p-7 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1f2635]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
            <Receipt className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-bold text-base sm:text-lg text-white">
                Recent Order History
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-[#1e2533] border border-[#313c50] text-[11px] font-bold text-[#d4af37]">
                {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
              </span>
              {isCloudSynced && (
                <span className="px-2 py-0.5 rounded-full bg-[#0d2818] border border-[#1b5e20] text-[10px] font-semibold text-[#4ade80] flex items-center gap-1">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  Cloud Synced
                </span>
              )}
            </div>
            <p className="text-xs text-[#828c9b]">
              {isCloudSynced
                ? 'Persisted to your personal Firestore account across devices'
                : 'Saved locally on this device. Sign in with Google to sync to cloud.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {showClearConfirm ? (
            <div className="flex items-center gap-2 bg-[#1d1618] border border-[#e53e3e]/40 px-3 py-1.5 rounded-xl">
              <span className="text-[11px] text-[#fca5a5]">Clear all?</span>
              <button
                type="button"
                id="confirm-clear-history-btn"
                onClick={() => {
                  onClearHistory();
                  setShowClearConfirm(false);
                }}
                className="px-2 py-0.5 rounded bg-[#e53e3e] hover:bg-[#c53030] text-white text-[11px] font-bold transition-colors cursor-pointer"
              >
                Yes
              </button>
              <button
                type="button"
                id="cancel-clear-history-btn"
                onClick={() => setShowClearConfirm(false)}
                className="px-2 py-0.5 rounded bg-[#2b3342] hover:bg-[#394456] text-white text-[11px] transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              id="clear-order-history-btn"
              onClick={() => setShowClearConfirm(true)}
              className="px-3 py-1.5 rounded-xl bg-[#161a22] hover:bg-[#202734] border border-[#2b3444] text-[#8e98a7] hover:text-[#f87171] text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Clear order history"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}

          <button
            type="button"
            id="toggle-order-history-btn"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-xl bg-[#161a22] hover:bg-[#202734] border border-[#2b3444] text-[#8e98a7] hover:text-white transition-colors cursor-pointer"
            aria-label={isExpanded ? 'Collapse order history' : 'Expand order history'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Orders List */}
      {isExpanded && (
        <div className="mt-4 space-y-3">
          {orders.map((order, idx) => (
            <div
              key={order.referenceId || idx}
              id={`order-history-item-${order.referenceId}`}
              className="rounded-2xl bg-[#0b0e14] border border-[#1d2432] hover:border-[#d4af37]/40 p-4 sm:p-5 transition-all group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#181d28]">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-[#d4af37] bg-[#d4af37]/10 px-2 py-0.5 rounded border border-[#d4af37]/20">
                    Ref #{order.referenceId}
                  </span>
                  <span className="text-xs text-[#828c9b] flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#64748b]" />
                    {order.timestamp}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#4ade80] bg-[#4ade80]/10 px-2 py-0.5 rounded-full border border-[#4ade80]/20">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Submitted</span>
                  </span>
                  <span className="font-display font-black text-base text-[#f3e5ab]">
                    {RESTAURANT_INFO.currency} {order.price}
                  </span>
                </div>
              </div>

              {/* Order Details Body */}
              <div className="pt-3 grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs">
                {/* Item & Portion */}
                <div className="sm:col-span-6 space-y-1">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#6e7a8c]">
                    Item Ordered
                  </div>
                  <div className="font-bold text-white text-sm">
                    {order.itemName}
                  </div>
                  <div className="text-[#a0abbb] text-xs">
                    Portion / Size: <span className="text-[#f3e5ab] font-medium">{order.selectedSize}</span>
                  </div>
                  {order.deliveryChefNote && (
                    <div className="mt-1 flex items-start gap-1.5 text-[11px] text-[#8e98a7] bg-[#141923] p-2 rounded-lg border border-[#202734]">
                      <MessageSquare className="w-3 h-3 text-[#d4af37] shrink-0 mt-0.5" />
                      <span className="italic">"{order.deliveryChefNote}"</span>
                    </div>
                  )}
                </div>

                {/* Recipient & Location */}
                <div className="sm:col-span-6 space-y-1 sm:border-l sm:border-[#1c2230] sm:pl-4">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#6e7a8c]">
                    Delivery Information
                  </div>
                  <div className="font-medium text-white flex items-center gap-1.5">
                    <span>{order.customerName}</span>
                  </div>
                  <div className="text-[#9ea8b7] flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-[#d4af37] shrink-0" />
                    <span>{order.phoneNumber}</span>
                  </div>
                  <div className="text-[#9ea8b7] flex items-start gap-1.5">
                    <MapPin className="w-3 h-3 text-[#d4af37] shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{order.deliveryLocation}</span>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="mt-4 pt-3 border-t border-[#181d28] flex items-center justify-between">
                <div className="text-[11px] text-[#6e7a8c]">
                  Status: Restaurant will call to verify
                </div>

                <button
                  type="button"
                  id={`reorder-btn-${order.referenceId}`}
                  onClick={() => onReorder(order)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#1c232f] hover:bg-[#d4af37] text-[#f3e5ab] hover:text-[#11141a] border border-[#303c4f] hover:border-[#d4af37] text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reorder This</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
