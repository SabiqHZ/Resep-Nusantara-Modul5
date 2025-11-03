// src/pages/ProfilePage.jsx
export default function ProfilePage() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
      <div className="flex flex-col items-center">
        {/* Profile Image */}
        <div className="mb-6">
          <img
            src="/evel.jpg"
            alt="Profile"
            className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover shadow-lg border-4 border-gray-100"
          />
        </div>

        {/* Profile Information */}
        <div className="text-center">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
            Jeremy Cavellino Sulistyo
          </h2>
          <p className="text-gray-600 text-lg">NIM: 21120123140058</p>
        </div>
      </div>
    </div>
  );
}
