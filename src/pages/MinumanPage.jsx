import { useState, useEffect } from "react";
import { ResepMinuman } from "../data/minuman";
import RecipeGrid from "../components/minuman/RecipeGrid";

export default function MinumanPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites_minuman");
    return saved ? JSON.parse(saved) : [];
  });

  const allMinuman = Object.values(ResepMinuman.resep);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredRecipes(allMinuman);
    } else {
      const lower = searchQuery.toLowerCase();
      const filtered = allMinuman.filter((r) =>
        r.name.toLowerCase().includes(lower)
      );
      setFilteredRecipes(filtered);
    }
  }, [searchQuery]);

  useEffect(() => {
    localStorage.setItem("favorites_minuman", JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (recipe) => {
    const exists = favorites.find((f) => f.id === recipe.id);
    if (exists) {
      setFavorites(favorites.filter((f) => f.id !== recipe.id));
    } else {
      setFavorites([...favorites, recipe]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-cyan-50 pb-20 md:pb-8">
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <h1 className="text-2xl font-semibold mb-6">Daftar Resep Minuman</h1>

        <input
          type="text"
          placeholder="Cari minuman..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-1/2 p-2 border border-gray-300 rounded-lg mb-6"
        />

        <RecipeGrid
          recipes={filteredRecipes}
          favorites={favorites}
          onToggleFavorite={addToFavorites}
        />
      </main>
    </div>
  );
}
