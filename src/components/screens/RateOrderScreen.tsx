import React, { useState } from 'react';
import { ArrowLeft, Star, Heart, Check, ArrowRight, CheckCircle2 } from 'lucide-react';
import { HeaderMeatGharLogo } from '../MeatGharLogo';
import { GreenTickLottie } from '../GreenTickLottie';

interface RateOrderScreenProps {
  onBack: () => void;
  onSubmitReview: () => void;
}

export const RateOrderScreen: React.FC<RateOrderScreenProps> = ({
  onBack,
  onSubmitReview,
}) => {
  const [overallRating, setOverallRating] = useState(5);
  const [productQuality, setProductQuality] = useState(5);
  const [deliveryExp, setDeliveryExp] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([
    'Fresh & Tasty',
    'Well Packed',
    'Fast Delivery',
    'Good Quality',
    'Great Service',
  ]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const feedbackTags = [
    'Fresh & Tasty',
    'Well Packed',
    'Fast Delivery',
    'Good Quality',
    'Great Service',
  ];

  return (
    <div className="w-full h-full min-h-[780px] bg-slate-50 text-slate-800 flex flex-col justify-between relative overflow-hidden select-none">
      {/* Header */}
      <div className="bg-white px-4 pt-3 pb-3 border-b border-slate-200 shadow-2xs z-20 flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-1.5 rounded-full hover:bg-slate-100 text-[#A8071A] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <HeaderMeatGharLogo />

        <button className="text-xs font-bold text-[#A8071A] hover:underline cursor-pointer">
          Support
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 no-scrollbar pb-16">
        {/* Banner */}
        <div className="bg-red-50/60 border border-red-200 rounded-2xl p-3.5 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#A8071A] text-white flex items-center justify-center shrink-0 shadow-md">
            <Star className="w-6 h-6 fill-amber-300 text-amber-300" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900 leading-tight">
              Rate Your Order
            </h2>
            <p className="text-xs text-slate-500 font-normal">
              How was your Meat Ghar experience?
            </p>
          </div>
        </div>

        {/* Order Details Badge */}
        <div className="bg-white rounded-2xl p-3 border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Order #MM10284</span>
            <p className="text-xs font-bold text-slate-900">Delivered successfully</p>
            <p className="text-[10px] text-slate-400">Delivered on 29 Aug 2025 &bull; 10:28 AM</p>
          </div>
          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
            Delivered ✓
          </span>
        </div>

        {/* Star Rating Section */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-4 text-center">
          <div>
            <div className="flex items-center justify-center gap-2 mb-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  onClick={() => setOverallRating(s)}
                  className="p-1 cursor-pointer transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      s <= overallRating
                        ? 'fill-red-600 text-red-600'
                        : 'fill-slate-100 text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Tap a star to rate
            </p>
          </div>

          {/* Sub Categories */}
          <div className="space-y-3 pt-2 border-t border-slate-100 text-left">
            {/* Product Quality */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">Product Quality</p>
                <p className="text-[10px] text-slate-400">How was the quality of the meat?</p>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} onClick={() => setProductQuality(s)}>
                    <Star
                      className={`w-4 h-4 ${
                        s <= productQuality ? 'fill-red-600 text-red-600' : 'fill-slate-200 text-slate-200'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Delivery Experience */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">Delivery Experience</p>
                <p className="text-[10px] text-slate-400">How was the delivery service?</p>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} onClick={() => setDeliveryExp(s)}>
                    <Star
                      className={`w-4 h-4 ${
                        s <= deliveryExp ? 'fill-red-600 text-red-600' : 'fill-slate-200 text-slate-200'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Comment Box */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs space-y-1.5">
          <label className="text-xs font-extrabold text-slate-900 block">
            Your Comment <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={500}
            rows={3}
            placeholder="Share your thoughts about meat freshness, packaging or delivery..."
            className="w-full text-xs font-medium text-slate-800 bg-slate-50 border border-slate-200 rounded-xl p-2.5 outline-none focus:border-[#A8071A]"
          />
          <span className="text-[9px] text-slate-400 font-mono text-right block">
            {comment.length}/500
          </span>
        </div>

        {/* Quick Feedback Chips */}
        <div>
          <label className="text-xs font-extrabold text-slate-900 block mb-2">
            Quick Feedback <span className="text-slate-400 font-normal">(Select any that apply)</span>
          </label>

          <div className="flex flex-wrap gap-2">
            {feedbackTags.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : 'bg-white border border-slate-200 text-slate-600'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 text-emerald-700" />}
                  <span>{tag}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit Review Button */}
        <div className="space-y-2 pt-2">
          <button
            onClick={() => setIsSubmitted(true)}
            className="w-full py-3.5 px-6 bg-[#A8071A] hover:bg-red-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-red-900/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Star className="w-4 h-4 fill-white" />
            <span>Submit Review &rarr;</span>
          </button>

          <button
            onClick={onBack}
            className="w-full py-2.5 px-6 bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>Maybe Later &rarr;</span>
          </button>
        </div>

        <div className="text-center text-[10px] text-slate-400 font-medium pt-1">
          <span>✓ Your feedback helps us improve Meat Ghar.</span>
        </div>
      </div>

      {/* Success Modal with Green Tick Lottie */}
      {isSubmitted && (
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 text-center shadow-2xl max-w-xs w-full space-y-3 border border-slate-100">
            <GreenTickLottie className="w-24 h-24 mx-auto" loop={true} />
            <h3 className="text-lg font-black text-slate-900">
              Review Submitted!
            </h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Thank you for rating your delivery. You've earned 50 Meat Ghar reward points!
            </p>
            <button
              onClick={onSubmitReview}
              className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl shadow-md transition-all cursor-pointer mt-2"
            >
              Done &rarr;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
