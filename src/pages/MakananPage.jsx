import { useState, useEffect } from "react";
import { ResepMakanan } from "../data/makanan";
import RecipeGrid from "../components/makanan/RecipeGrid";

export default function MakananPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites_makanan");
    return saved ? JSON.parse(saved) : [];
  });

  const allMakanan = Object.values(ResepMakanan.resep);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredRecipes(allMakanan);
    } else {
      const lower = searchQuery.toLowerCase();
      const filtered = allMakanan.filter((r) =>
        r.name.toLowerCase().includes(lower)
      );
      setFilteredRecipes(filtered);
    }
  }, [searchQuery]);

  useEffect(() => {
    localStorage.setItem("favorites_makanan", JSON.stringify(favorites));
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pb-20 md:pb-8">
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <h1 className="text-2xl font-semibold mb-6">Daftar Resep Makanan</h1>

        <input
          type="text"
          placeholder="Cari resep..."
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
