// src/hooks/useFavorites.js
import { useState, useEffect, useCallback } from "react";
import favoriteService from "../services/favoriteService";
import recipeService from "../services/recipeService";
import userService from "../services/userService";

/**
 * Get user identifier from localStorage or generate new one
 */
const getUserIdentifier = () => {
  return userService.getUserIdentifier();
};

/**
 * Custom hook for fetching favorites from localStorage and getting recipe details
 * @returns {Object} - { favorites, loading, error, refetch }
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFavorites = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Get favorite IDs from localStorage
      const favoriteIds = JSON.parse(localStorage.getItem("favorites") || "[]");

      if (favoriteIds.length === 0) {
        setFavorites([]);
        setLoading(false);
        return;
      }

      // Fetch recipe details for each favorite ID
      const recipePromises = favoriteIds.map((id) =>
        recipeService.getRecipeById(id).catch((err) => {
          console.error(`Failed to fetch recipe ${id}:`, err);
          return null;
        })
      );

      const results = await Promise.all(recipePromises);

      // Filter out null results (failed fetches) and extract data
      const recipesData = results
        .filter((result) => result && result.success && result.data)
        .map((result) => result.data);

      setFavorites(recipesData);
    } catch (err) {
      setError(err.message || "An error occurred while fetching favorites");
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  return {
    favorites,
    loading,
    error,
    refetch: fetchFavorites,
  };
}

/**
 * Custom hook for toggling favorites
 * @returns {Object} - { toggleFavorite, loading, error }
 */
export function useToggleFavorite() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleFavorite = async (recipeId) => {
    try {
      setLoading(true);
      setError(null);

      // Get current favorites from localStorage
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      const index = favorites.indexOf(recipeId);

      let newFavoritedState;
      if (index > -1) {
        // Remove from favorites
        favorites.splice(index, 1);
        newFavoritedState = false;
      } else {
        // Add to favorites
        favorites.push(recipeId);
        newFavoritedState = true;
      }

      // Save to localStorage
      localStorage.setItem("favorites", JSON.stringify(favorites));

      return { action: newFavoritedState ? "added" : "removed" };
    } catch (err) {
      setError(err.message || "An error occurred while toggling favorite");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    toggleFavorite,
    loading,
    error,
  };
}

/**
 * Custom hook to check if a recipe is favorited
 * @param {string} recipeId - Recipe ID
 * @returns {Object} - { isFavorited, loading, toggleFavorite }
 */
export function useIsFavorited(recipeId) {
  const [isFavorited, setIsFavorited] = useState(false);
  const { toggleFavorite: toggle, loading: toggleLoading } =
    useToggleFavorite();

  // Check if favorited on mount and when recipeId changes
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsFavorited(favorites.includes(recipeId));
  }, [recipeId]);

  const toggleFavorite = async () => {
    const result = await toggle(recipeId);
    if (result) {
      // Update local state immediately
      setIsFavorited(result.action === "added");
    }
    return result;
  };

  return {
    isFavorited,
    loading: toggleLoading,
    toggleFavorite,
  };
}

export { getUserIdentifier };
