'use client';
import React, { useState } from 'react';
import { Sparkles, Trophy, Heart, Send, CheckCircle2, AlertCircle, X, ShieldCheck } from 'lucide-react';
import { YarnBallIcon } from './CrochetIcons';

interface CommunityInterestModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'collector' | 'wrestler' | 'nomination';
}

export function CommunityInterestModal({
  isOpen,
  onClose,
  initialTab = 'collector'
}: CommunityInterestModalProps) {
  const [activeTab, setActiveTab] = useState<'collector' | 'wrestler' | 'nomination'>(initialTab);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [favoriteWrestler, setFavoriteWrestler] = useState('');
  const [ringName, setRingName] = useState('');
  const [socialProfile, setSocialProfile] = useState('');
  const [rightsControl, setRightsControl] = useState('yes_independent');
  const [proposalDetails, setProposalDetails] = useState('');
  const [nominatedWrestler, setNominatedWrestler] = useState('');
  const [nominationReason, setNominationReason] = useState('');
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState('');

  if (!isOpen) return null;

  const resetForm = () => {
    setName('');
    setEmail('');
    setFavoriteWrestler('');
    setRingName('');
    setSocialProfile('');
    setRightsControl('yes_independent');
    setProposalDetails('');
    setNominatedWrestler('');
    setNominationReason('');
    setConsent(false);
    setErrorMessage(null);
  };

  const handleTabChange = (tab: 'collector' | 'wrestler' | 'nomination') => {
    setActiveTab(tab);
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent) {
      setErrorMessage('Please confirm your consent to save your details.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    let detailsPayload = '';
    let submitName = name.trim();

    if (activeTab === 'collector') {
      detailsPayload = favoriteWrestler.trim()
        ? `Favorite Wrestler: ${favoriteWrestler.trim()}`
        : 'General Drop Updates';
    } else if (activeTab === 'wrestler') {
      detailsPayload = [
        `Ring Name: ${ringName.trim()}`,
        `Social / Handle: ${socialProfile.trim()}`,
        `Merchandise / Likeness Rights: ${rightsControl === 'yes_independent' ? 'Sole Owner / Independent Rights' : rightsControl === 'promotion_permission' ? 'Has Promotion Permission' : 'Exploring Rights'}`,
        `Proposal / Concept: ${proposalDetails.trim()}`
      ].join('\n');
    } else if (activeTab === 'nomination') {
      detailsPayload = [
        `Nominated Wrestler: ${nominatedWrestler.trim()}`,
        `Social Handle: ${socialProfile.trim()}`,
        `Reason / Match: ${nominationReason.trim() || 'Fan recommendation'}`
      ].join('\n');
    }

    try {
      const response = await fetch('/api/interest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          kind: activeTab,
          name: submitName,
          email: email.trim().toLowerCase(),
          details: detailsPayload,
          consent: true,
          website: honeypot, // honeypot anti-spam
        }),
      });

      const data = await response.json() as { ok?: boolean; error?: string };

      if (!response.ok || !data.ok) {
        throw new Error(data.error || 'Unable to submit your details. Please check required fields.');
      }

      if (activeTab === 'collector') {
        setSuccessMessage('You’re on the VIP Drop list! When Hazel opens the next production drop, you will receive an honest email announcement with the exact slot count and ship-by date.');
      } else if (activeTab === 'wrestler') {
        setSuccessMessage('Inquiry received! Hazel personally reviews all wrestler collaboration pitches. Note that submitting an inquiry is an initial chat, not a signed license.');
      } else {
        setSuccessMessage('Wrestler nominated! We have logged your vote into Hazel’s wishlist tracker. Popular suggestions help guide future drop selections.');
      }
      resetForm();
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while sending. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-2xl bg-[#14121d] border border-fuchsia-500/30 rounded-2xl shadow-2xl overflow-hidden text-gray-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header Decorative Stitches */}
        <div className="bg-gradient-to-r from-purple-900/60 via-pink-900/60 to-amber-900/60 px-6 py-5 border-b border-fuchsia-500/20 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/20 border border-pink-400/40 flex items-center justify-center text-pink-300">
              <YarnBallIcon className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-xs font-mono tracking-widest text-pink-400 uppercase font-semibold">
                Community & Side-Business Inquiries
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-serif text-white flex items-center gap-2">
                Hazel’s Inner Circle
              </h2>
            </div>
          </div>

          {/* Tab Selection */}
          <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => handleTabChange('collector')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'collector'
                  ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/30 border border-pink-400/50'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/5'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Collector Drop Club</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('wrestler')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'wrestler'
                  ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30 border border-amber-400/50'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/5'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Wrestler Collab</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('nomination')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'nomination'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 border border-purple-400/50'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/5'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Nominate Wrestler</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {successMessage ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-white">Record Saved Successfully!</h3>
              <p className="text-gray-300 text-sm max-w-md mx-auto leading-relaxed">
                {successMessage}
              </p>
              <div className="pt-4 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setSuccessMessage(null)}
                  className="px-4 py-2 rounded-lg text-sm bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  Submit Another
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 rounded-lg text-sm bg-pink-600 hover:bg-pink-500 text-white font-medium transition-colors"
                >
                  Return to Store
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Context Explanation */}
              <div className="bg-[#1b1827] border border-white/5 rounded-xl p-3.5 text-xs text-gray-300 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" />
                <div>
                  {activeTab === 'collector' && (
                    <p>
                      <strong>Managed Production Caps:</strong> Hazel makes dolls 1-by-1 taking 2–6 hours each.
                      Club members get a private early email when each single-wrestler drop opens, before slots fill up.
                    </p>
                  )}
                  {activeTab === 'wrestler' && (
                    <p>
                      <strong>Are you an independent wrestler or champion?</strong> Pitch a collaboration to have your ring gear, hairstyle, and championship belt stitched into a limited run with fair revenue sharing.
                      <em className="block text-gray-400 mt-1 font-mono text-[11px]">Note: Submitting this inquiry starts a conversation, not a signed merchandise license.</em>
                    </p>
                  )}
                  {activeTab === 'nomination' && (
                    <p>
                      <strong>Fan Nominations:</strong> Tell Hazel who you want to see immortalized in yarn next. We tally repeated suggestions to plan upcoming drops.
                    </p>
                  )}
                </div>
              </div>

              {/* Honeypot anti-spam (hidden) */}
              <input
                type="text"
                name="website"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
              />

              {/* Form Fields Depending on Tab */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    {activeTab === 'wrestler' ? 'Legal / Contact Name *' : 'Your Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={120}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Jordan Smith"
                    className="w-full bg-[#0e0d15] border border-white/10 rounded-lg px-3.5 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    maxLength={254}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className="w-full bg-[#0e0d15] border border-white/10 rounded-lg px-3.5 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                  />
                </div>
              </div>

              {/* Tab specific fields */}
              {activeTab === 'collector' && (
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                    Favorite Wrestler or Dream Doll (Optional)
                  </label>
                  <input
                    type="text"
                    maxLength={200}
                    value={favoriteWrestler}
                    onChange={(e) => setFavoriteWrestler(e.target.value)}
                    placeholder="e.g. Willow Nightingale, Orange Cassidy, El Hijo del Vikingo..."
                    className="w-full bg-[#0e0d15] border border-white/10 rounded-lg px-3.5 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                  />
                </div>
              )}

              {activeTab === 'wrestler' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                        Ring Name *
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={120}
                        value={ringName}
                        onChange={(e) => setRingName(e.target.value)}
                        placeholder="e.g. 'The Iron Valkyrie' Samira"
                        className="w-full bg-[#0e0d15] border border-white/10 rounded-lg px-3.5 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                        Social / Instagram Handle *
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={120}
                        value={socialProfile}
                        onChange={(e) => setSocialProfile(e.target.value)}
                        placeholder="@yourhandle or profile link"
                        className="w-full bg-[#0e0d15] border border-white/10 rounded-lg px-3.5 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                      Do you own / control your ring name & merchandise likeness? *
                    </label>
                    <select
                      value={rightsControl}
                      onChange={(e) => setRightsControl(e.target.value)}
                      className="w-full bg-[#0e0d15] border border-white/10 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="yes_independent">Yes — I am an independent wrestler and control 100% of my merchandise rights</option>
                      <option value="promotion_permission">Yes — My promotion agreement explicitly permits third-party merchandise / doll collabs</option>
                      <option value="exploring_rights">Not sure / Exploring — Need guidance on licensing & permissions</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                      Brief Collaboration Proposal & Iconic Attire *
                    </label>
                    <textarea
                      required
                      maxLength={1500}
                      rows={3}
                      value={proposalDetails}
                      onChange={(e) => setProposalDetails(e.target.value)}
                      placeholder="Describe your signature look (robe, mask, belt, jacket colors) and whether you want an autographed card edition..."
                      className="w-full bg-[#0e0d15] border border-white/10 rounded-lg px-3.5 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </>
              )}

              {activeTab === 'nomination' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                        Nominated Wrestler *
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={120}
                        value={nominatedWrestler}
                        onChange={(e) => setNominatedWrestler(e.target.value)}
                        placeholder="e.g. Kenny Omega, Kris Statlander..."
                        className="w-full bg-[#0e0d15] border border-white/10 rounded-lg px-3.5 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                        Their Social / Promotion Handle
                      </label>
                      <input
                        type="text"
                        maxLength={120}
                        value={socialProfile}
                        onChange={(e) => setSocialProfile(e.target.value)}
                        placeholder="@wrestlerhandle"
                        className="w-full bg-[#0e0d15] border border-white/10 rounded-lg px-3.5 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1">
                      Why should Hazel make them? (Optional)
                    </label>
                    <textarea
                      maxLength={1000}
                      rows={3}
                      value={nominationReason}
                      onChange={(e) => setNominationReason(e.target.value)}
                      placeholder="Their attire is iconic, championship reign, match of the year, favorite indy star..."
                      className="w-full bg-[#0e0d15] border border-white/10 rounded-lg px-3.5 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                </>
              )}

              {/* Consent Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-gray-400 select-none">
                  <input
                    type="checkbox"
                    required
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 rounded border-gray-600 text-pink-500 focus:ring-pink-500 bg-[#0e0d15]"
                  />
                  <span>
                    I agree to have my details securely stored and to be contacted by Hazel regarding this submission. 
                    <span className="text-gray-500 block">Personal contact details remain confidential and are never published publicly.</span>
                  </span>
                </label>
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-950/60 border border-red-500/40 rounded-lg text-xs text-red-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs sm:text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl font-medium text-xs sm:text-sm text-white bg-gradient-to-r from-pink-600 via-purple-600 to-amber-600 hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-pink-600/25 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>
                        {activeTab === 'collector'
                          ? 'Join Collector Club'
                          : activeTab === 'wrestler'
                          ? 'Send Collaboration Inquiry'
                          : 'Submit Nomination'}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
