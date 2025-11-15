
import React from 'react';
import type { CaptionChefHook } from '../types';
import { CreditCard, Zap } from 'lucide-react';

const creditPacks = [
  { credits: 100, price: 5, popular: false },
  { credits: 300, price: 12, popular: true },
  { credits: 1000, price: 35, popular: false },
];

export const BillingView: React.FC<{ captionChef: CaptionChefHook }> = ({ captionChef }) => {
  const { credits, addCredits } = captionChef;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-dark-text-primary flex items-center gap-3">
          <CreditCard />
          Billing & Credits
        </h1>
        <p className="text-dark-text-secondary mt-1">
          Manage your credit balance and purchase more.
        </p>
      </header>

      <div className="bg-dark-surface p-6 rounded-lg border border-dark-border flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Current Balance</h2>
          <p className="text-dark-text-secondary text-sm">Credits available for generation.</p>
        </div>
        <div className="text-4xl font-bold text-brand-primary">
          {credits.toFixed(1)}
        </div>
      </div>

      <div className="bg-dark-surface p-6 rounded-lg border border-dark-border">
          <h2 className="text-xl font-semibold text-center mb-6">Purchase More Credits</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {creditPacks.map((pack) => (
                <div key={pack.credits} className={`relative p-6 rounded-lg border-2 ${pack.popular ? 'border-brand-primary' : 'border-dark-border'} flex flex-col items-center text-center bg-dark-bg`}>
                    {pack.popular && <div className="absolute top-0 -translate-y-1/2 bg-brand-primary text-white px-3 py-1 text-xs font-bold rounded-full">MOST POPULAR</div>}
                    <Zap className={`mb-2 ${pack.popular ? 'text-brand-primary' : 'text-dark-text-secondary'}`} size={32}/>
                    <h3 className="text-2xl font-bold">{pack.credits} Credits</h3>
                    <p className="text-4xl font-extrabold my-4">${pack.price}</p>
                    <p className="text-xs text-gray-500 mb-6">One-time payment</p>
                    <button
                        onClick={() => addCredits(pack.credits)}
                        className={`w-full mt-auto font-bold py-2 px-4 rounded-md transition ${pack.popular ? 'bg-brand-primary hover:bg-brand-secondary text-white' : 'bg-dark-border hover:bg-gray-600'}`}
                    >
                        Purchase
                    </button>
                </div>
            ))}
          </div>
           <p className="text-xs text-center text-gray-500 mt-6">This is a simulated checkout. Clicking "Purchase" will add credits to your account for demonstration purposes.</p>
      </div>
    </div>
  );
};
