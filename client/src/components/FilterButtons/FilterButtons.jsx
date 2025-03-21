import { useState } from 'react';

const categories = [
  'All',
  'Music',
  'News',
  'Gaming',
  'Live'
];

export default function FilterButtons({ selectedCategory, onSelectCategory }) {
  return (
    // Hide on mobile (small screens), show on medium screens and up
    <div className="hidden md:flex space-x-4 px-4 pb-4 overflow-x-auto no-scrollbar w-full">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelectCategory(category)}
          className={`capitalize cursor-pointer whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors
            ${
              selectedCategory === category
                ? 'bg-gray-200 text-gray-900'
                : 'bg-gray-800 text-gray-200 hover:bg-gray-700'
            }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}