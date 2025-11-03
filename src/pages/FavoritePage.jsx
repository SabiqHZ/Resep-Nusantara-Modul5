// src/pages/FavoritePage.jsx
import { useState, useEffect } from "react";
import { useFavorites } from "../hooks/useFavorites";
import { Clock, Star, ChefHat, Heart, Trash2 } from "lucide-react";
import ConfirmModal from "../components/modals/ConfirmModal";
import LazyImage from "../components/common/LazyImage";

export default function FavoritePage({ onRecipeClick }) {
  const { favorites, loading, error, refetch } = useFavorites();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState(null);
  const [visibleCards, setVisibleCards] = useState(new Set());

  useEffect(() => {
    // Animation for cards
    favorites.forEach((_, index) => {
      setTimeout(() => {
        setVisibleCards((prev) => new Set(prev).add(index));
      }, index * 100);
    });
  }, [favorites]);

  const handleRemoveFavorite = (recipeId) => {
    setRecipeToDelete(recipeId);
    setShowDeleteModal(true);
  };

  const confirmRemoveFavorite = () => {
    if (recipeToDelete) {
      // Remove from localStorage
      const currentFavorites = JSON.parse(
        localStorage.getItem("favorites") || "[]"
      );
      const updatedFavorites = currentFavorites.filter(
        (id) => id !== recipeToDelete
      );
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));

      // Refetch favorites
      refetch();
      setShowDeleteModal(false);
      setRecipeToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-red-50 pb-20 md:pb-8">
        <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
            <p className="mt-4 text-slate-600">Memuat favorit...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-red-50 pb-20 md:pb-8">
        <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-red-600 font-semibold mb-2">
                Terjadi Kesalahan
              </p>
              <p className="text-red-500">{error}</p>
              <button
                onClick={refetch}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-red-50 pb-20 md:pb-8">
      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmRemoveFavorite}
        title="Hapus dari Favorit"
        message="Apakah Anda yakin ingin menghapus resep ini dari favorit?"
        confirmText="Ya, Hapus"
        cancelText="Batal"
        variant="danger"
      />

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="w-10 h-10 text-pink-600 fill-current" />
            <h1 className="text-3xl md:text-5xl font-bold text-slate-800">
              Resep Favorit
            </h1>
          </div>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Kumpulan resep pilihan yang telah Anda simpan
          </p>
        </div>

        {/* Empty State */}
        {favorites.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-white/40 max-w-md mx-auto">
              <Heart className="w-20 h-20 text-slate-300 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-slate-800 mb-3">
                Belum Ada Favorit
              </h3>
              <p className="text-slate-600 mb-6">
                Mulai tambahkan resep favorit Anda dengan menekan tombol hati
                pada resep yang Anda suka
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="mb-8 bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/40">
              <p className="text-center text-slate-700">
                <span className="font-bold text-2xl text-pink-600">
                  {favorites.length}
                </span>
                <span className="ml-2">resep tersimpan</span>
              </p>
            </div>

            {/* Favorites Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
              {favorites.map((recipe, index) => (
                <div
                  key={recipe.id}
                  className={`group transform transition-all duration-700 ${
                    visibleCards.has(index)
                      ? "translate-y-0 opacity-100"
                      : "translate-y-8 opacity-0"
                  }`}
                >
                  <div className="relative bg-white/15 backdrop-blur-xl border border-white/25 rounded-2xl md:rounded-3xl overflow-hidden shadow-lg md:shadow-2xl shadow-pink-500/5 hover:shadow-pink-500/15 transition-all duration-500 group-hover:scale-105 group-hover:bg-white/20">
                    {/* Recipe Image */}
                    <div className="relative h-32 md:h-56 overflow-hidden">
                      <LazyImage
                        src={recipe.image_url}
                        alt={recipe.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 cursor-pointer"
                        onClick={() =>
                          onRecipeClick &&
                          onRecipeClick(recipe.id, recipe.category)
                        }
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

                      {/* Remove Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFavorite(recipe.id);
                        }}
                        className="absolute top-3 right-3 z-10 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                        title="Hapus dari favorit"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Recipe Info */}
                    <div
                      className="relative z-10 p-4 md:p-8 cursor-pointer"
                      onClick={() =>
                        onRecipeClick &&
                        onRecipeClick(recipe.id, recipe.category)
                      }
                    >
                      <div className="flex items-center justify-between mb-3 md:mb-4">
                        <span
                          className={`text-xs font-semibold px-2 md:px-3 py-1 md:py-1.5 rounded-full ${
                            recipe.category === "makanan"
                              ? "text-blue-700 bg-blue-100/90"
                              : "text-green-700 bg-green-100/90"
                          }`}
                        >
                          {recipe.category === "makanan"
                            ? "Makanan"
                            : "Minuman"}
                        </span>

                        {recipe.average_rating > 0 && (
                          <div className="flex items-center space-x-1 bg-white/90 px-2 py-1 rounded-full">
                            <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-500 fill-current" />
                            <span className="text-xs md:text-sm font-semibold text-slate-700">
                              {recipe.average_rating.toFixed(1)}
                            </span>
                          </div>
                        )}
                      </div>

                      <h3 className="font-bold text-slate-800 mb-3 md:mb-4 text-base md:text-xl group-hover:text-pink-600 transition-colors duration-200 line-clamp-2">
                        {recipe.name}
                      </h3>

                      <div className="flex items-center justify-between text-xs md:text-sm text-slate-600">
                        <div className="flex items-center space-x-1 md:space-x-2 bg-white/70 px-2 md:px-3 py-1 md:py-2 rounded-full">
                          <Clock className="w-3 h-3 md:w-4 md:h-4" />
                          <span className="font-medium">
                            {recipe.prep_time} menit
                          </span>
                        </div>
                        <div className="flex items-center space-x-1 md:space-x-2 bg-white/70 px-2 md:px-3 py-1 md:py-2 rounded-full">
                          <ChefHat className="w-3 h-3 md:w-4 md:h-4" />
                          <span className="font-medium capitalize">
                            {recipe.difficulty}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
