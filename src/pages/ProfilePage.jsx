// src/pages/ProfilePage.jsx
export default function ProfilePage() {
  return (
    <div className="p-4 md:p-8 pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
          Profile Pengguna
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center">
          {/* Foto Profil */}
          <img
            src="/saya.jpg"
            alt="Foto Profil Sabiq Habiburrahman Zarkasi"
            className="w-40 h-40 rounded-full object-cover mb-4 shadow-md"
          />

          {/* Nama */}
          <h2 className="text-xl font-semibold text-gray-800">
            Sabiq Habiburrahman Zarkasi
          </h2>

          {/* NIM */}
          <p className="text-gray-600 text-lg">21120123140058</p>
        </div>
      </div>
    </div>
  );
}
