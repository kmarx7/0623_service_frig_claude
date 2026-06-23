"use client";

import { useState } from "react";
import ImageUploader from "@/components/ImageUploader";
import IngredientTags from "@/components/IngredientTags";
import RecipeCard from "@/components/RecipeCard";
import { detectIngredients, getRecipes, type Recipe } from "@/app/actions";

type Step = "upload" | "ingredients" | "recipes";

export default function Home() {
  const [step, setStep] = useState<Step>("upload");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loadingVision, setLoadingVision] = useState(false);
  const [loadingRecipes, setLoadingRecipes] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleImageUpload(base64: string, mimeType: string) {
    setLoadingVision(true);
    setError(null);
    try {
      const detected = await detectIngredients(base64, mimeType);
      setIngredients(detected);
      setStep("ingredients");
    } catch {
      setError("재료 인식에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoadingVision(false);
    }
  }

  async function handleGetRecipes() {
    if (ingredients.length === 0) return;
    setLoadingRecipes(true);
    setError(null);
    try {
      const result = await getRecipes(ingredients);
      setRecipes(result);
      setStep("recipes");
    } catch {
      setError("레시피 추천에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoadingRecipes(false);
    }
  }

  function reset() {
    setStep("upload");
    setIngredients([]);
    setRecipes([]);
    setError(null);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">🍳 냉장고 요리사</h1>
          <p className="text-gray-500 text-sm mt-1">사진 한 장으로 오늘 뭐 먹을지 해결!</p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-8">
          {[
            { id: "upload", label: "사진" },
            { id: "ingredients", label: "재료" },
            { id: "recipes", label: "레시피" },
          ].map((s, i) => (
            <div key={s.id} className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors
                  ${step === s.id ? "bg-orange-500 text-white" :
                    (step === "ingredients" && s.id === "upload") || (step === "recipes" && s.id !== "recipes")
                      ? "bg-orange-200 text-orange-600" : "bg-gray-100 text-gray-400"}`}
              >
                {i + 1}
              </div>
              <span className={`text-xs ${step === s.id ? "text-orange-600 font-medium" : "text-gray-400"}`}>
                {s.label}
              </span>
              {i < 2 && <div className="w-6 h-px bg-gray-200" />}
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {step === "upload" && (
          <div className="space-y-4">
            <ImageUploader onUpload={handleImageUpload} loading={loadingVision} />
            {loadingVision && (
              <p className="text-center text-gray-400 text-sm">AI가 재료를 인식하는 중입니다...</p>
            )}
          </div>
        )}

        {step === "ingredients" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-800">
                  인식된 재료 <span className="text-orange-500">({ingredients.length})</span>
                </h2>
                <button onClick={reset} className="text-gray-400 text-xs hover:text-gray-600">
                  다시 찍기
                </button>
              </div>
              <p className="text-gray-400 text-xs mb-4">태그를 탭해서 삭제하거나, 빠진 재료를 추가하세요.</p>
              <IngredientTags ingredients={ingredients} onChange={setIngredients} />
            </div>

            <button
              onClick={handleGetRecipes}
              disabled={ingredients.length === 0 || loadingRecipes}
              className="w-full bg-orange-500 text-white py-4 rounded-2xl font-bold text-base
                hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-lg shadow-orange-200"
            >
              {loadingRecipes ? "레시피 찾는 중..." : "🍽 레시피 추천받기"}
            </button>
          </div>
        )}

        {step === "recipes" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-gray-800">
                추천 레시피 <span className="text-orange-500">({recipes.length})</span>
              </h2>
              <button onClick={() => setStep("ingredients")} className="text-orange-500 text-sm font-medium">
                재료 수정
              </button>
            </div>

            {recipes.map((recipe, i) => (
              <RecipeCard key={recipe.name} recipe={recipe} rank={i + 1} />
            ))}

            <button
              onClick={reset}
              className="w-full border-2 border-orange-200 text-orange-500 py-3.5 rounded-2xl font-bold
                hover:bg-orange-50 transition-colors"
            >
              처음부터 다시
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
