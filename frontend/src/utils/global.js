import { toast } from "react-toastify";

/**
 * Downloads an image by converting the URL to a blob
 * to prevent the browser from just opening the link in a new tab.
 */
export const downloadImage = async (imageUrl, fileName = "creatdiv-ai-image") => {
  if (!imageUrl) return;

  try {
    const res = await fetch(imageUrl);
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}-${Date.now()}.jpg`;
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Download failed:", error);
    toast.error("Failed to download image. Please try again.");
  }
};

/**
 * Capitalizes the first letter of a string.
 */
export const capitalizeWord = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Copies text to clipboard with toast feedback.
 */
export const handleCopy = async (content) => {
  if (!content) {
    toast.warn("No content found to copy!");
    return;
  }

  try {
    await navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard!", { icon: "📋" });
  } catch (error) {
    console.error("Failed to copy:", error);
    toast.error("Clipboard access denied.");
  }
};