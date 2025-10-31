import { useState, useEffect } from "react";
import RecipeGrid from "../components/makanan/RecipeGrid";

export default function FavoritePage() {
  const [favoritesMakanan, setFavoritesMakanan] = useState([]);
  const [favoritesMinuman, setFavoritesMinuman] = useState([]);

  // Ambil data dari localStorage
  useEffect(() => {
    const savedMakanan = localStorage.getItem("favorites_makanan");
    const savedMinuman = localStorage.getItem("favorites_minuman");

    if (savedMakanan) setFavoritesMakanan(JSON.parse(savedMakanan));
    if (savedMinuman) setFavoritesMinuman(JSON.parse(savedMinuman));
  }, []);

  // Hapus dari favorit makanan
  const toggleFavoriteMakanan = (recipe) => {
    const updated = favoritesMakanan.filter((f) => f.id !== recipe.id);
    setFavoritesMakanan(updated);
    localStorage.setItem("favorites_makanan", JSON.stringify(updated));
  };

  // Hapus dari favorit minuman
  const toggleFavoriteMinuman = (recipe) => {
    const updated = favoritesMinuman.filter((f) => f.id !== recipe.id);
    setFavoritesMinuman(updated);
    localStorage.setItem("favorites_minuman", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-indigo-50 pb-20 md:pb-8">
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <h1 className="text-3xl font-bold mb-10 text-gray-800 text-center">
          ❤️ Favorit Saya
        </h1>

        {/* 🍛 Favorit Makanan */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            🍛 Favorit Makanan
          </h2>
          {favoritesMakanan.length > 0 ? (
            <RecipeGrid
              recipes={favoritesMakanan}
              favorites={favoritesMakanan}
              onToggleFavorite={toggleFavoriteMakanan}
            />
          ) : (
            <p className="text-gray-500 italic text-center">
              Belum ada makanan favorit.
            </p>
          )}
        </section>

        {/* 🍹 Favorit Minuman */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            🍹 Favorit Minuman
          </h2>
          {favoritesMinuman.length > 0 ? (
            <RecipeGrid
              recipes={favoritesMinuman}
              favorites={favoritesMinuman}
              onToggleFavorite={toggleFavoriteMinuman}
            />
          ) : (
            <p className="text-gray-500 italic text-center">
              Belum ada minuman favorit.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
