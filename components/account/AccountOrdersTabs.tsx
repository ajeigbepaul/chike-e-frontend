import React from 'react';

const tabs = [
  { label: 'All Orders', value: 'all' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'In Transit', value: 'in-transit' },
  { label: 'Canceled', value: 'canceled' },
];

export default function AccountOrdersTabs({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) {
  return (
    <div className="flex gap-6 border-b border-gray-200 mb-6">
      {tabs.map(tab => (
        <button
          key={tab.value}
          className={`pb-2 text-lg font-medium transition-colors border-b-2 ${
            activeTab === tab.value ? 'border-brand-yellow text-brand-yellow' : 'border-transparent text-gray-700 hover:text-brand-yellow'
          }`}
          onClick={() => setActiveTab(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
} 