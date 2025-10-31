import { useState, useEffect } from "react";
import { ResepMakanan } from "../data/makanan";
import { ResepMinuman } from "../data/minuman";
import RecipeGrid from "../components/makanan/RecipeGrid";

export default function ResepPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRecipes, setFilteredRecipes] = useState([]);

  // Ambil favorit terpisah dari localStorage
  const [favoritesMakanan, setFavoritesMakanan] = useState(() => {
    const saved = localStorage.getItem("favorites_makanan");
    return saved ? JSON.parse(saved) : [];
  });

  const [favoritesMinuman, setFavoritesMinuman] = useState(() => {
    const saved = localStorage.getItem("favorites_minuman");
    return saved ? JSON.parse(saved) : [];
  });

  // Gabungkan semua resep
  const allMakanan = Object.values(ResepMakanan.resep).map((r) => ({
    ...r,
    category: "Makanan",
  }));
  const allMinuman = Object.values(ResepMinuman.resep).map((r) => ({
    ...r,
    category: "Minuman",
  }));

  // Semua resep untuk pencarian gabungan
  const allRecipes = [...allMakanan, ...allMinuman];

  // 🔍 Filter pencarian
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredRecipes(allRecipes);
    } else {
      const lower = searchQuery.toLowerCase();
      setFilteredRecipes(
        allRecipes.filter((r) => r.name.toLowerCase().includes(lower))
      );
    }
  }, [searchQuery]);

  // 💾 Simpan perubahan favorit ke localStorage
  useEffect(() => {
    localStorage.setItem("favorites_makanan", JSON.stringify(favoritesMakanan));
  }, [favoritesMakanan]);

  useEffect(() => {
    localStorage.setItem("favorites_minuman", JSON.stringify(favoritesMinuman));
  }, [favoritesMinuman]);

  // ❤️ Toggle favorit makanan
  const toggleFavoriteMakanan = (recipe) => {
    const exists = favoritesMakanan.some((f) => f.id === recipe.id);
    const updated = exists
      ? favoritesMakanan.filter((f) => f.id !== recipe.id)
      : [...favoritesMakanan, recipe];
    setFavoritesMakanan(updated);
  };

  // 🧃 Toggle favorit minuman
  const toggleFavoriteMinuman = (recipe) => {
    const exists = favoritesMinuman.some((f) => f.id === recipe.id);
    const updated = exists
      ? favoritesMinuman.filter((f) => f.id !== recipe.id)
      : [...favoritesMinuman, recipe];
    setFavoritesMinuman(updated);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pb-20 md:pb-8">
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 text-center">
          🍽️ Semua Resep Nusantara
        </h1>

        {/* 🔎 Search bar */}
        <div className="flex justify-center mb-10">
          <input
            type="text"
            placeholder="🔍 Cari makanan atau minuman..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-1/2 p-3 border border-gray-300 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        {/* 🍛 Section Makanan */}
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          🍛 Makanan
        </h2>
        <RecipeGrid
          recipes={filteredRecipes.filter((r) => r.category === "Makanan")}
          favorites={favoritesMakanan}
          onToggleFavorite={toggleFavoriteMakanan}
        />

        {/* 🍹 Section Minuman */}
        <h2 className="text-2xl font-semibold mt-12 mb-4 text-gray-700">
          🍹 Minuman
        </h2>
        <RecipeGrid
          recipes={filteredRecipes.filter((r) => r.category === "Minuman")}
          favorites={favoritesMinuman}
          onToggleFavorite={toggleFavoriteMinuman}
        />
      </main>
    </div>
  );
}
