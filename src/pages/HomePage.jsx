// src/pages/HomePage.jsx
import { useState } from "react";
import { ResepMakanan } from "../data/makanan";
import { ResepMinuman } from "../data/minuman";
import HeroSection from "../components/home/HeroSection";
import FeaturedMakananSection from "../components/home/FeaturedMakananSection";
import FeaturedMinumanSection from "../components/home/FeaturedMinumanSection";

export default function HomePage() {
  // State untuk search bar
  const [searchQuery, setSearchQuery] = useState("");

  // State untuk pagination
  const [makananPage, setMakananPage] = useState(1);
  const [minumanPage, setMinumanPage] = useState(1);
  const itemsPerPage = 3;

  // Ambil data makanan & minuman
  const featuredMakanan = Object.values(ResepMakanan.resep);
  const featuredMinuman = Object.values(ResepMinuman.resep);

  // Filter berdasarkan input pencarian (berdasarkan "name")
  const filteredMakanan = featuredMakanan.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredMinuman = featuredMinuman.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Hitung total halaman
  const totalMakananPages = Math.ceil(filteredMakanan.length / itemsPerPage);
  const totalMinumanPages = Math.ceil(filteredMinuman.length / itemsPerPage);

  // Potong data untuk halaman aktif
  const paginatedMakanan = filteredMakanan.slice(
    (makananPage - 1) * itemsPerPage,
    makananPage * itemsPerPage
  );
  const paginatedMinuman = filteredMinuman.slice(
    (minumanPage - 1) * itemsPerPage,
    minumanPage * itemsPerPage
  );

  // Reset pagination ke halaman pertama saat user mengetik di search bar
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setMakananPage(1);
    setMinumanPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pb-20 md:pb-8">
      <HeroSection />

      {/* Search Bar */}
      <div className="max-w-3xl mx-auto mt-8 px-4">
        <input
          type="text"
          placeholder="🔍 Cari resep makanan atau minuman..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full px-5 py-3 border border-gray-300 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-700"
        />
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 space-y-12 md:space-y-16 mt-8">
        {/* Makanan */}
        <FeaturedMakananSection featuredMakanan={paginatedMakanan} />

        {/* Pagination Makanan */}
        {totalMakananPages > 1 && (
          <div className="flex justify-center space-x-2">
            {Array.from({ length: totalMakananPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setMakananPage(i + 1)}
                className={`px-3 py-1 rounded-full text-sm font-semibold transition ${
                  makananPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}

        {/* Minuman */}
        <FeaturedMinumanSection featuredMinuman={paginatedMinuman} />

        {/* Pagination Minuman */}
        {totalMinumanPages > 1 && (
          <div className="flex justify-center space-x-2">
            {Array.from({ length: totalMinumanPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setMinumanPage(i + 1)}
                className={`px-3 py-1 rounded-full text-sm font-semibold transition ${
                  minumanPage === i + 1
                    ? "bg-green-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
