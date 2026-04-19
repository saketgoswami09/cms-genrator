import {
  expandContent,
  generateArticle,
  generateSeoContent,
  rewriteContent,
  shortenContent,
} from "@/services/content";

/**
 * Page configuration for the dynamic GenerateContent page.
 * Each key maps to a URL param (e.g., /content/rewrite).
 * Uses camelCase keys for standard dot-access.
 */
export const PAGES = {
  rewrite: {
    header: "Rewrite content",
    subHeader: "Rewrite your content with AI",
    inputPlaceholder: "Enter the content you want to rewrite...",
    loadingText: "Rewriting...",
    buttonContent: "Rewrite content",
    outputHeader: "Rewritten content",
    redoInstruction: "Rewrite New",
    outputSubheader: "Your rewritten content will appear here",
    outputFormAction: "Fill out the form and click rewrite to generate new content",
    handler: rewriteContent,
  },
  expand: {
    header: "Expand content",
    subHeader: "Make your content more detailed with AI",
    inputPlaceholder: "Enter the content you want to expand...",
    loadingText: "Expanding...",
    buttonContent: "Expand content",
    outputHeader: "Expanded content",
    redoInstruction: "Expand New",
    outputSubheader: "Your expanded content will appear here",
    outputFormAction: "Fill out the form and click expand to generate new content",
    handler: expandContent,
  },
  shorten: {
    header: "Shorten content",
    subHeader: "Make your content more concise with AI",
    inputPlaceholder: "Enter the content you want to shorten...",
    loadingText: "Shortening...",
    buttonContent: "Shorten content",
    outputHeader: "Shorten content",
    redoInstruction: "Shorten New",
    outputSubheader: "Your shortened content will appear here",
    outputFormAction: "Fill out the form and click shorten to generate new content",
    handler: shortenContent,
  },
  "generate-article": {
    header: "Generate Article",
    subHeader: "Create a new article with AI",
    inputPlaceholder: "Enter the topic for the article...",
    loadingText: "Generating...",
    buttonContent: "Generate Article",
    outputHeader: "Generated Article",
    redoInstruction: "Generate New",
    outputSubheader: "Your article will appear here",
    outputFormAction: "Fill out the form and click generate to create new articles",
    handler: generateArticle,
  },
  "seo-content": {
    header: "SEO content generator",
    subHeader: "Automatically generate SEO title, keyword, and meta description",
    inputPlaceholder: "Paste your article content here...",
    loadingText: "Generating SEO content...",
    buttonContent: "Generate SEO content",
    outputHeader: "SEO content",
    redoInstruction: "Generate New",
    outputSubheader: "Your SEO content will appear here",
    outputFormAction: "Fill out the form and click generate to generate SEO content",
    handler: generateSeoContent,
  },
};
