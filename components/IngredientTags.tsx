"use client";

import { useState } from "react";

interface Props {
  ingredients: string[];
  onChange: (ingredients: string[]) => void;
}

export default function IngredientTags({ ingredients, onChange }: Props) {
  const [input, setInput] = useState("");

  function remove(item: string) {
    onChange(ingredients.filter((i) => i !== item));
  }

  function add() {
    const trimmed = input.trim();
    if (trimmed && !ingredients.includes(trimmed)) {
      onChange([...ingredients, trimmed]);
    }
    setInput("");
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter") add();
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {ingredients.map((item) => (
          <button
            key={item}
            onClick={() => remove(item)}
            className="flex items-center gap-1 bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full text-sm font-medium
              hover:bg-red-100 hover:text-red-600 transition-colors group"
          >
            {item}
            <span className="text-orange-400 group-hover:text-red-500 text-xs">✕</span>
          </button>
        ))}
        {ingredients.length === 0 && (
          <p className="text-gray-400 text-sm py-1">재료를 추가해주세요</p>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="재료 직접 추가..."
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
        />
        <button
          onClick={add}
          disabled={!input.trim()}
          className="bg-orange-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium
            hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          추가
        </button>
      </div>
    </div>
  );
}
