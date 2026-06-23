"use client";

import { useState } from "react";
import type { Recipe } from "@/app/actions";

interface Props {
  recipe: Recipe;
  rank: number;
}

export default function RecipeCard({ recipe, rank }: Props) {
  const [expanded, setExpanded] = useState(false);

  const matchColor =
    recipe.matchRate >= 80
      ? "text-green-600 bg-green-50"
      : recipe.matchRate >= 60
        ? "text-orange-600 bg-orange-50"
        : "text-red-600 bg-red-50";

  const barColor =
    recipe.matchRate >= 80
      ? "bg-green-400"
      : recipe.matchRate >= 60
        ? "bg-orange-400"
        : "bg-red-400";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-gray-200">#{rank}</span>
            <div>
              <h3 className="font-bold text-gray-800 text-lg leading-tight">{recipe.name}</h3>
              <p className="text-gray-400 text-xs mt-0.5">⏱ {recipe.cookTime}</p>
            </div>
          </div>
          <span className={`text-sm font-bold px-3 py-1.5 rounded-full shrink-0 ${matchColor}`}>
            {recipe.matchRate}%
          </span>
        </div>

        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>보유 재료 일치율</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${barColor}`}
              style={{ width: `${recipe.matchRate}%` }}
            />
          </div>
        </div>

        {recipe.missingIngredients.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            <span className="text-xs text-gray-400">부족 재료:</span>
            {recipe.missingIngredients.map((item) => (
              <span key={item} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                {item}
              </span>
            ))}
          </div>
        )}

        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 w-full text-center text-sm text-orange-500 font-medium py-1"
        >
          {expanded ? "조리법 닫기 ▲" : "조리법 보기 ▼"}
        </button>
      </div>

      {expanded && (
        <div className="border-t border-gray-50 bg-gray-50/50 px-4 py-4">
          <ol className="space-y-2">
            {recipe.steps.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm text-gray-700">
                <span className="shrink-0 w-6 h-6 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center font-bold">
                  {i + 1}
                </span>
                <span className="leading-relaxed pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
