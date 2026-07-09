import { useEffect } from 'react';

interface SeoProps {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'video.movie' | 'video.tv_show' | 'profile';
}

export function useSeo({ 
  title, 
  description = "Star King OTT - Premium cinematic streaming for movies, TV shows, and anime. Browse and watch instantly in high quality.", 
  image = "/og-image.jpg", 
  url, 
  type = "website" 
}: SeoProps) {
  useEffect(() => {
    // Update Title
    const fullTitle = `${title} | Star King OTT`;
    document.title = fullTitle;

    // Update Meta Description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    // Update Open Graph tags
    const ogTags = {
      'og:title': fullTitle,
      'og:description': description,
      'og:image': image.startsWith('http') ? image : `${window.location.origin}${image}`,
      'og:type': type,
      'og:url': url ? `${window.location.origin}${url}` : window.location.href,
      'twitter:title': fullTitle,
      'twitter:description': description,
      'twitter:image': image.startsWith('http') ? image : `${window.location.origin}${image}`,
    };

    Object.entries(ogTags).forEach(([property, content]) => {
      // Handle og: tags
      if (property.startsWith('og:')) {
        let tag = document.querySelector(`meta[property="${property}"]`);
        if (!tag) {
          tag = document.createElement('meta');
          tag.setAttribute('property', property);
          document.head.appendChild(tag);
        }
        tag.setAttribute('content', content);
      } 
      // Handle twitter: tags
      else {
        let tag = document.querySelector(`meta[name="${property}"]`);
        if (!tag) {
          tag = document.createElement('meta');
          tag.setAttribute('name', property);
          document.head.appendChild(tag);
        }
        tag.setAttribute('content', content);
      }
    });

  }, [title, description, image, url, type]);
}
