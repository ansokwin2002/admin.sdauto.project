import { useEffect } from 'react';
import { setPageTitle } from '@/utilities/pageTitle';

interface MetadataOptions {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
}

export const useMetadata = (options: MetadataOptions) => {
  useEffect(() => {
    // Set page title
    if (options.title) {
      setPageTitle(options.title);
    }

    // Set meta description
    if (options.description) {
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', options.description);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = options.description;
        document.head.appendChild(meta);
      }
    }

    // Set meta keywords
    if (options.keywords?.length) {
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute('content', options.keywords.join(', '));
      } else {
        const meta = document.createElement('meta');
        meta.name = 'keywords';
        meta.content = options.keywords.join(', ');
        document.head.appendChild(meta);
      }
    }

    // Set Open Graph metadata
    if (options.ogTitle) {
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) {
        ogTitle.setAttribute('content', options.ogTitle);
      } else {
        const meta = document.createElement('meta');
        meta.setAttribute('property', 'og:title');
        meta.content = options.ogTitle;
        document.head.appendChild(meta);
      }
    }

    if (options.ogDescription) {
      const ogDescription = document.querySelector('meta[property="og:description"]');
      if (ogDescription) {
        ogDescription.setAttribute('content', options.ogDescription);
      } else {
        const meta = document.createElement('meta');
        meta.setAttribute('property', 'og:description');
        meta.content = options.ogDescription;
        document.head.appendChild(meta);
      }
    }

    if (options.ogImage) {
      const ogImage = document.querySelector('meta[property="og:image"]');
      if (ogImage) {
        ogImage.setAttribute('content', options.ogImage);
      } else {
        const meta = document.createElement('meta');
        meta.setAttribute('property', 'og:image');
        meta.content = options.ogImage;
        document.head.appendChild(meta);
      }
    }
  }, [options]);
}; 