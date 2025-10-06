import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";

import SplashScreen from "./pages/SplashScreen";
import HomePage from "./pages/HomePage";
import MakananPage from "./pages/MakananPage";
import MinumanPage from "./pages/MinumanPage";
import FavoritePage from "./pages/FavoritePage";
import ProfilePage from "./pages/ProfilePage";

import DesktopNavbar from "./components/navbar/DesktopNavbar";
import MobileNavbar from "./components/navbar/MobileNavbar";
import PWABadge from "./PWABadge";

import "./index.css";

function AppRoot() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentPage, setCurrentPage] = useState("home");

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const handleNavigation = (page) => {
    setCurrentPage(page);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage />;
      case "makanan":
        return <MakananPage />;
      case "minuman":
        return <MinumanPage />;
      case "favorite":
        return <FavoritePage />;
      case "profile":
        return <ProfilePage />;
      default:
        return <HomePage />;
    }
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DesktopNavbar currentPage={currentPage} onNavigate={handleNavigation} />
      <main className="min-h-screen">{renderCurrentPage()}</main>

      <MobileNavbar currentPage={currentPage} onNavigate={handleNavigation} />

      <PWABadge />
    </div>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppRoot />
  </StrictMode>
);
