import { useState, useEffect } from "react";
import RecipeGrid from "../components/makanan/RecipeGrid";
import RecipeGridMinuman from "../components/minuman/RecipeGrid";

export default function FavoritePage() {
  const [favMakanan, setFavMakanan] = useState([]);
  const [favMinuman, setFavMinuman] = useState([]);

  // 🔄 Ambil data favorit makanan & minuman dari localStorage
  useEffect(() => {
    const savedMakanan = localStorage.getItem("favorites_makanan");
    const savedMinuman = localStorage.getItem("favorites_minuman");

    if (savedMakanan) setFavMakanan(JSON.parse(savedMakanan));
    if (savedMinuman) setFavMinuman(JSON.parse(savedMinuman));
  }, []);

  // ❤️ Fungsi toggle favorit makanan
  const toggleFavMakanan = (recipe) => {
    const updated = favMakanan.some((fav) => fav.id === recipe.id)
      ? favMakanan.filter((fav) => fav.id !== recipe.id)
      : [...favMakanan, recipe];

    setFavMakanan(updated);
    localStorage.setItem("favorites_makanan", JSON.stringify(updated));
  };

  // ❤️ Fungsi toggle favorit minuman
  const toggleFavMinuman = (recipe) => {
    const updated = favMinuman.some((fav) => fav.id === recipe.id)
      ? favMinuman.filter((fav) => fav.id !== recipe.id)
      : [...favMinuman, recipe];

    setFavMinuman(updated);
    localStorage.setItem("favorites_minuman", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-red-50 pb-20 md:pb-8">
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        <h1 className="text-3xl font-bold text-slate-800 mb-6 text-center">
          Resep Favoritmu ❤️
        </h1>
        <p className="text-center text-slate-500 mb-8 max-w-xl mx-auto">
          Semua resep makanan dan minuman yang kamu tandai sebagai favorit akan
          muncul di sini.
        </p>

        {/* Bagian Makanan */}
        {favMakanan.length > 0 && (
          <section className="mb-16">
            <RecipeGrid
              recipes={favMakanan}
              favorites={favMakanan}
              onToggleFavorite={toggleFavMakanan}
            />
          </section>
        )}

        {/* Bagian Minuman */}
        {favMinuman.length > 0 && (
          <section>
            <RecipeGridMinuman recipes={favMinuman} favorites={favMinuman} />
          </section>
        )}

        {/* Jika belum ada favorit */}
        {favMakanan.length === 0 && favMinuman.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-500 text-lg">
              Belum ada resep yang kamu tandai favorit.
            </p>
            <p className="text-slate-400 text-sm mt-2">
              Kunjungi halaman Makanan atau Minuman untuk menambah favorit.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
