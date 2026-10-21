import React, { useState } from 'react';
import { X, Sparkles, Plus, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { DollItem } from '../types';
import { InstagramIcon } from './InstagramIcon';
import { sounds } from '../utils/audio';

interface AddInstagramModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDoll: (newDoll: DollItem) => void;
}

export const AddInstagramModal: React.FC<AddInstagramModalProps> = ({
  isOpen,
  onClose,
  onAddDoll
}) => {
  const [instagramUrl, setInstagramUrl] = useState('https://www.instagram.com/hazel_the_dollmaker/');
  const [wrestlerName, setWrestlerName] = useState('');
  const [dollTitle, setDollTitle] = useState('');
  const [promotion, setPromotion] = useState('Limitless Wrestling');
  const [gearDetailsText, setGearDetailsText] = useState('');
  const [story, setStory] = useState('');
  const [wrestlerImageUrl, setWrestlerImageUrl] = useState('');
  const [dollImageUrl, setDollImageUrl] = useState('');
  const [category, setCategory] = useState<DollItem['category']>('ringside-gift');

  if (!isOpen) return null;

  const extractShortcode = (url: string) => {
    const match = url.match(/\/(p|reel)\/([^/?#&]+)/);
    return match ? match[2] : undefined;
  };

  const handleQuickFillExample = () => {
    setInstagramUrl('https://www.instagram.com/hazel_the_dollmaker/');
    setWrestlerName('Nic Nemeth');
    setDollTitle('"The Wanted Man" Title Belt Tribute');
    setPromotion('Global Wrestling Showcase');
    setGearDetailsText('Bleached hair yarn, Hot pink and black trunks, Custom mini title belt');
    setStory('Hazel presented this one-of-a-kind crochet doll to Nic Nemeth backstage. He took photos proudly showcasing her detailed gear replication!');
    setWrestlerImageUrl('/hazel-logo.jpg');
    setDollImageUrl('/hazel-logo.jpg');
    setCategory('champion');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wrestlerName.trim()) return;

    const shortcode = extractShortcode(instagramUrl);
    const gearList = gearDetailsText
      ? gearDetailsText.split(',').map((g) => g.trim()).filter(Boolean)
      : ['Custom freehand crochet gear', 'Hand-stitched attire details'];

    const newDoll: DollItem = {
      id: `user-doll-${Date.now()}`,
      wrestlerName: wrestlerName.trim(),
      dollTitle: dollTitle.trim() || `${wrestlerName} Tribute Doll`,
      promotion: promotion.trim() || 'Independent Wrestling',
      date: 'Added Today',
      instagramUrl: instagramUrl.trim() || 'https://www.instagram.com/hazel_the_dollmaker/',
      instagramPostId: shortcode,
      gearDetails: gearList,
      story: story.trim() || `Crafted by Hazel (@hazel_the_dollmaker) to celebrate ${wrestlerName}’s iconic wrestling persona.`,
      wrestlerImageUrl: wrestlerImageUrl.trim() || '/hazel-logo.jpg',
      dollImageUrl: dollImageUrl.trim() || '/hazel-logo.jpg',
      category,
      featured: true,
      likesCount: 1,
      isUserAdded: true,
    };

    onAddDoll(newDoll);
    sounds.playLikeChime();
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 }
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl my-8 crochet-patch rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 border-2 border-dashed border-pink-400/40">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-dashed border-pink-400/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl instagram-gradient flex items-center justify-center text-white shadow-md border border-dashed border-pink-200/40">
              <InstagramIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-crochet font-bold text-white flex items-center gap-2">
                Put Hazel's Instagram Post
                <Sparkles className="w-4 h-4 text-pink-400" />
              </h2>
              <p className="text-xs text-pink-300 font-script">
                Showcase Hazel's wrestling & doll artwork directly on the site
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

        {/* Quick Fill Button */}
        <div className="flex items-center justify-between bg-purple-950/30 border border-purple-800/40 rounded-xl p-3 text-xs">
          <span className="text-purple-200">Want to test with a pre-filled sample?</span>
          <button
            type="button"
            onClick={handleQuickFillExample}
            className="px-2.5 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-colors"
          >
            Load Sample
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Instagram Post, Reel, or Profile URL
            </label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-3 w-4 h-4 text-pink-400" />
              <input
                type="text"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                placeholder="https://www.instagram.com/hazel_the_dollmaker/ or https://www.instagram.com/p/..."
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pink-500"
                required
              />
            </div>
            <p className="text-[11px] text-gray-500 mt-1">
              Paste Hazel's post link (<code className="text-pink-400">https://www.instagram.com/p/...</code>) or profile link
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Wrestler Name *
              </label>
              <input
                type="text"
                value={wrestlerName}
                onChange={(e) => setWrestlerName(e.target.value)}
                placeholder="e.g. Nic Nemeth, Rip Byson, Alec Price"
                className="w-full px-3 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Doll Title / Gear Name
              </label>
              <input
                type="text"
                value={dollTitle}
                onChange={(e) => setDollTitle(e.target.value)}
                placeholder="e.g. The 110% Champion Doll"
                className="w-full px-3 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Wrestling Promotion / Event
              </label>
              <input
                type="text"
                value={promotion}
                onChange={(e) => setPromotion(e.target.value)}
                placeholder="e.g. Limitless Wrestling, Independent, WWE, AEW"
                className="w-full px-3 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as DollItem['category'])}
                className="w-full px-3 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-sm text-white focus:outline-none focus:border-purple-500"
              >
                <option value="ringside-gift">Ringside Gift To Wrestler</option>
                <option value="champion">Champion & Title Belt</option>
                <option value="indie-favorite">Indie Favorite Likeness</option>
                <option value="custom-commission">Custom Commission</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Gear Details & Fiber Specs (comma separated)
            </label>
            <input
              type="text"
              value={gearDetailsText}
              onChange={(e) => setGearDetailsText(e.target.value)}
              placeholder="e.g. Gold championship belt, Bleached hair yarn, Leopard print trunks, Tall boots"
              className="w-full px-3 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">
              Ringside Moment / Wrestler's Reaction
            </label>
            <textarea
              rows={2}
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder="Describe the moment Hazel presented the doll, or the wrestler posing with it..."
              className="w-full px-3 py-2 rounded-xl bg-gray-900 border border-gray-700 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Wrestler Photo URL (optional)
              </label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="url"
                  value={wrestlerImageUrl}
                  onChange={(e) => setWrestlerImageUrl(e.target.value)}
                  placeholder="https://... (or leave blank)"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">
                Doll Artwork Photo URL (optional)
              </label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-3 w-4 h-4 text-pink-400" />
                <input
                  type="url"
                  value={dollImageUrl}
                  onChange={(e) => setDollImageUrl(e.target.value)}
                  placeholder="https://... (or leave blank)"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-gray-900 border border-gray-700 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pink-500"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-white font-bold text-sm instagram-gradient hover:opacity-95 shadow-lg shadow-pink-600/25 flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Showcase On Site</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
