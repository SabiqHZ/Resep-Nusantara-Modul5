// src/components/common/ShareButton.jsx
import { useState } from "react";
import { Share2, Check, Copy } from "lucide-react";

export default function ShareButton({ recipeId, recipeName, size = "md" }) {
  const [copied, setCopied] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const handleShare = async (e) => {
    e.stopPropagation();

    const shareUrl = `${window.location.origin}?recipe=${recipeId}`;
    const shareData = {
      title: recipeName || "Resep Nusantara",
      text: `Lihat resep ${recipeName || "ini"} di Resep Nusantara!`,
      url: shareUrl,
    };

    // Check if Web Share API is supported
    if (
      navigator.share &&
      navigator.canShare &&
      navigator.canShare(shareData)
    ) {
      try {
        await navigator.share(shareData);
        console.log("Recipe shared successfully");
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Error sharing:", err);
          // Fallback to copy to clipboard
          copyToClipboard(shareUrl);
        }
      }
    } else {
      // Fallback: Copy to clipboard
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setShowTooltip(true);

      setTimeout(() => {
        setCopied(false);
        setShowTooltip(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
      // Fallback for older browsers
      fallbackCopyToClipboard(text);
    }
  };

  const fallbackCopyToClipboard = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand("copy");
      setCopied(true);
      setShowTooltip(true);

      setTimeout(() => {
        setCopied(false);
        setShowTooltip(false);
      }, 2000);
    } catch (err) {
      console.error("Fallback: Failed to copy", err);
    }

    document.body.removeChild(textArea);
  };

  return (
    <div className="relative">
      <button
        onClick={handleShare}
        className={`
          ${sizes[size]} rounded-full flex items-center justify-center
          transition-all duration-200
          ${
            copied
              ? "bg-green-500 text-white"
              : "bg-white/90 hover:bg-white text-slate-700 hover:text-blue-500"
          }
          backdrop-blur-sm shadow-md hover:shadow-lg
          group
        `}
        title="Share resep"
      >
        {copied ? (
          <Check className={`${iconSizes[size]} animate-bounce`} />
        ) : (
          <Share2
            className={`${iconSizes[size]} transition-transform group-hover:scale-110`}
          />
        )}
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs py-2 px-3 rounded-lg whitespace-nowrap animate-fadeIn">
          Link berhasil disalin!
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-slate-800"></div>
        </div>
      )}
    </div>
  );
}
