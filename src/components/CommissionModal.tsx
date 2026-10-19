import React, { useState } from 'react';
import { X, Sparkles, Copy, Check, ExternalLink, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { InstagramIcon } from './InstagramIcon';
import { CrochetHookIcon, YarnBallIcon } from './CrochetIcons';
import { sounds } from '../utils/audio';

interface CommissionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommissionModal: React.FC<CommissionModalProps> = ({ isOpen, onClose }) => {
  const [wrestlerName, setWrestlerName] = useState('');
  const [promotion, setPromotion] = useState('');
  const [gearDetails, setGearDetails] = useState('');
  const [hasBelt, setHasBelt] = useState(false);
  const [beltName, setBeltName] = useState('');
  const [props, setProps] = useState('');
  const [clientInstagram, setClientInstagram] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const generatedDmText = `Hi Hazel! 🪡✨ I love your custom wrestling crochet dolls on Instagram (@hazel_the_dollmaker).

I'd love to inquire about commissioning a custom doll:
• Wrestler: ${wrestlerName || '[Wrestler Name]'}
• Promotion / Circuit: ${promotion || '[Promotion]'}
• Ring Gear / Attire: ${gearDetails || '[Describe gear, colors, boots]'}
${hasBelt ? `• Championship Belt: Yes (${beltName || 'Title Belt'})` : '• Championship Belt: None'}
${props ? `• Special Props / Accessories: ${props}` : ''}
• My Instagram: ${clientInstagram || '@your_instagram'}

Please let me know your current availability and commission details. Thank you for your amazing art!`;

  const handleCopyAndOpenInstagram = () => {
    navigator.clipboard.writeText(generatedDmText);
    setCopied(true);
    sounds.playLikeChime();
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 }
    });

    setTimeout(() => {
      window.open('https://www.instagram.com/hazel_the_dollmaker/', '_blank');
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl my-8 crochet-patch rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 border-2 border-dashed border-pink-400/40">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-dashed border-pink-400/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 flex items-center justify-center text-white shadow-md border border-dashed border-pink-300/40">
              <CrochetHookIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-crochet font-bold text-white flex items-center gap-2">
                Custom Wrestler Doll Inquiry
                <Sparkles className="w-4 h-4 text-pink-400" />
              </h2>
              <p className="text-xs text-pink-300 font-script">
                Direct DM Commission Format for @hazel_the_dollmaker
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Instructions banner */}
        <div className="p-3.5 rounded-2xl bg-black/40 border border-dashed border-pink-400/30 text-xs text-pink-200 flex items-center gap-2.5 font-script">
          <InstagramIcon className="w-4 h-4 text-pink-400 flex-shrink-0" />
          <span>
            Hazel accepts custom requests directly via Instagram DM. Fill in the details below to generate a formatted commission message ready to send!
          </span>
        </div>

        {/* Fields */}
        <div className="space-y-4 font-crochet">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">
                Wrestler / Persona Name *
              </label>
              <input
                type="text"
                value={wrestlerName}
                onChange={(e) => setWrestlerName(e.target.value)}
                placeholder="e.g. Nic Nemeth, Rip Byson, or yourself"
                className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-dashed border-pink-400/30 text-sm font-script text-white placeholder-gray-400 focus:outline-none focus:border-pink-400"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">
                Wrestling Promotion / League
              </label>
              <input
                type="text"
                value={promotion}
                onChange={(e) => setPromotion(e.target.value)}
                placeholder="e.g. Limitless Wrestling, AEW, Indie"
                className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-dashed border-pink-400/30 text-sm font-script text-white placeholder-gray-400 focus:outline-none focus:border-pink-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1">
              Ring Gear & Attire Details
            </label>
            <input
              type="text"
              value={gearDetails}
              onChange={(e) => setGearDetails(e.target.value)}
              placeholder="e.g. Pink & black trunks, bleached hair, tall kickpads, entrance jacket"
              className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-dashed border-pink-400/30 text-sm font-script text-white placeholder-gray-400 focus:outline-none focus:border-pink-400"
            />
          </div>

          {/* Championship Belt Checkbox */}
          <div className="p-3.5 rounded-xl bg-black/40 border border-dashed border-pink-400/25 space-y-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasBelt}
                onChange={(e) => setHasBelt(e.target.checked)}
                className="w-4 h-4 rounded text-pink-600 focus:ring-pink-500 bg-gray-900 border-gray-700"
              />
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>Include Custom Handcrafted Title Belt?</span>
              </span>
            </label>

            {hasBelt && (
              <input
                type="text"
                value={beltName}
                onChange={(e) => setBeltName(e.target.value)}
                placeholder="e.g. World Championship, Limitless Title, Tag Team Belt"
                className="w-full px-3 py-2 rounded-xl bg-black/60 border border-dashed border-pink-400/30 text-xs font-script text-white placeholder-gray-400 focus:outline-none focus:border-pink-400"
              />
            )}
          </div>

          {/* Props & Requester Instagram */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">
                Special Props (Optional)
              </label>
              <input
                type="text"
                value={props}
                onChange={(e) => setProps(e.target.value)}
                placeholder="e.g. Aviator shades, entrance mask, chair"
                className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-dashed border-pink-400/30 text-sm font-script text-white placeholder-gray-400 focus:outline-none focus:border-pink-400"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">
                Your Instagram Handle
              </label>
              <input
                type="text"
                value={clientInstagram}
                onChange={(e) => setClientInstagram(e.target.value)}
                placeholder="@your_handle"
                className="w-full px-3 py-2.5 rounded-xl bg-black/50 border border-dashed border-pink-400/30 text-sm font-script text-white placeholder-gray-400 focus:outline-none focus:border-pink-400"
              />
            </div>
          </div>

          {/* Preview of Generated DM Text */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
              <YarnBallIcon className="w-3.5 h-3.5 text-pink-400" />
              <span>Generated Message Preview:</span>
            </span>
            <div className="p-3 rounded-xl bg-black/70 border border-dashed border-pink-400/30 text-xs text-pink-200/90 font-mono whitespace-pre-wrap max-h-36 overflow-y-auto">
              {generatedDmText}
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-crochet font-bold border border-dashed border-white/20 transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleCopyAndOpenInstagram}
              className="px-6 py-2.5 rounded-xl text-white font-crochet font-bold text-xs bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 shadow-lg shadow-pink-600/30 border border-dashed border-pink-300/40 flex items-center gap-2 transition-all cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied! Opening Instagram...' : 'Copy & Open Hazel’s DM'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
