import { toast } from "react-toastify";
import { COLOR_MAP, DEFAULT_COLOR_TYPE } from "../../constants/constant";

/**
 * Downloads an image by converting the URL to a blob to prevent
 * the browser from just opening the link in a new tab.
 */
export const downloadImage = async (image, fileName = "creatdiv-ai-image") => {
  if (!image) return;
  
  try {
    const res = await fetch(image);
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    // Dynamic filename based on project name or timestamp
    a.download = `${fileName}-${Date.now()}.jpg`; 

    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Download failed:", error);
    toast.error("Failed to download image. Please try again.");
  }
};

/**
 * Capitalizes the first letter of a string. 
 * Useful for displaying "action" types or "tones" in the UI.
 */
export const capitalizeWord = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Returns a specific color class based on type (e.g., 'success', 'error', 'ai').
 */
export const getColorType = (type) => {
  return COLOR_MAP[type] || COLOR_MAP[DEFAULT_COLOR_TYPE];
};

/**
 * Copies text to clipboard and provides a sleek Toast feedback 
 * that matches your Glassmorphism UI.
 */
export const handleCopy = async (content) => {
  if (!content) {
    toast.warn("No content found to copy!");
    return;
  }
  
  try {
    await window.navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard!", {
      icon: "📋",
      style: {
        borderRadius: '12px',
        fontWeight: '600',
      }
    });
  } catch (error) {
    console.error(`Failed to copy. Error is ${error}`);
    toast.error("Clipboard access denied.");
  }
};