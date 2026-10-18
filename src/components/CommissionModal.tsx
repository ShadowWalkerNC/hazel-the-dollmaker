import React, { useState } from 'react';
import { X, Scissors, Sparkles, Copy, Check, ExternalLink, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { InstagramIcon } from './InstagramIcon';
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
      <div className="relative w-full max-w-2xl my-8 bg-[#12141e] border border-gray-700 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-md">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Custom Wrestler Doll Inquiry
                <Sparkles className="w-4 h-4 text-pink-400" />
              </h2>
              <p className="text-xs text-gray-400">
                Direct DM Commission Format for @hazel_the_dollmaker
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Instructions banner */}
        <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-800/30 text-xs text-purple-200 flex items-center gap-2.5">
          <InstagramIcon className="w-4 h-4 text-pink-400 flex-shrink-0" />
          <span>
            Hazel accepts custom requests directly via Instagram DM. Fill in the details below to generate a formatted commission message ready to send!
          </span>
        </div>

        {/* Fields */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Wrestler / Persona Name *
              </label>
              <input
                type="text"
                value={wrestlerName}
                onChange={(e) => setWrestlerName(e.target.value)}
                placeholder="e.g. Nic Nemeth, Rip Byson, or yourself"
                className="w-full px-3 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Wrestling Promotion / League
              </label>
              <input
                type="text"
                value={promotion}
                onChange={(e) => setPromotion(e.target.value)}
                placeholder="e.g. Limitless Wrestling, AEW, Indie"
                className="w-full px-3 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Ring Gear & Attire Details
            </label>
            <input
              type="text"
              value={gearDetails}
              onChange={(e) => setGearDetails(e.target.value)}
              placeholder="e.g. Pink & black trunks, bleached hair, tall kickpads, entrance jacket"
              className="w-full px-3 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-sm text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Championship Belt Checkbox */}
          <div className="p-3 rounded-xl bg-gray-900/60 border border-gray-800 space-y-2">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={hasBelt}
                onChange={(e) => setHasBelt(e.target.checked)}
                className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 bg-gray-800 border-gray-700"
              />
              <span className="text-xs font-bold text-white flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                Include Custom Handcrafted Title Belt?
              </span>
            </label>

            {hasBelt && (
              <input
                type="text"
                value={beltName}
                onChange={(e) => setBeltName(e.target.value)}
                placeholder="e.g. World Championship, Limitless Title, Tag Team Belt"
                className="w-full px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            )}
          </div>

          {/* Props & Requester Instagram */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Special Props (Optional)
              </label>
              <input
                type="text"
                value={props}
                onChange={(e) => setProps(e.target.value)}
                placeholder="e.g. Aviator shades, entrance mask, chair"
                className="w-full px-3 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Your Instagram Handle
              </label>
              <input
                type="text"
                value={clientInstagram}
                onChange={(e) => setClientInstagram(e.target.value)}
                placeholder="@your_handle"
                className="w-full px-3 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-sm text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Preview of Generated DM Text */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-gray-400">
              Generated Message Preview:
            </span>
            <div className="p-3 rounded-xl bg-gray-950 border border-gray-800 text-xs text-gray-300 font-mono whitespace-pre-wrap max-h-36 overflow-y-auto">
              {generatedDmText}
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-750 text-gray-300 text-xs font-semibold transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleCopyAndOpenInstagram}
              className="px-6 py-2.5 rounded-xl text-white font-bold text-xs instagram-gradient hover:opacity-95 shadow-lg shadow-pink-600/30 flex items-center gap-2 transition-all"
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
