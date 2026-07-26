import { ToolType } from '../types';

export interface SEOProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  toolType?: ToolType;
}

export function updateSEO({
  title = 'Free QR Code Generator | Custom Styles & High Quality Downloads',
  description = 'Generate custom QR codes instantly for URLs, Contacts, WiFi, Text, Phone, Email, SMS, Location, Images, and PDFs. Free, fast, private, client-side QR generator.',
  canonicalUrl = window.location.href,
  toolType,
}: SEOProps) {
  // Page Title
  document.title = title;

  // Meta Description
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.setAttribute('name', 'description');
    document.head.appendChild(metaDesc);
  }
  metaDesc.setAttribute('content', description);

  // OpenGraph Meta Tags
  setMetaTag('og:title', title);
  setMetaTag('og:description', description);
  setMetaTag('og:url', canonicalUrl);
  setMetaTag('og:type', 'website');
  setMetaTag('og:site_name', 'QR Studio');

  // Twitter Meta Tags
  setMetaTag('twitter:card', 'summary_large_image');
  setMetaTag('twitter:title', title);
  setMetaTag('twitter:description', description);

  // Canonical Link
  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', canonicalUrl);

  // Schema.org Structured Data
  let schemaScript = document.getElementById('schema-org-jsonld');
  if (!schemaScript) {
    schemaScript = document.createElement('script');
    schemaScript.id = 'schema-org-jsonld';
    schemaScript.setAttribute('type', 'application/ld+json');
    document.head.appendChild(schemaScript);
  }

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'QR Studio - Premium Client-Side QR Code Generator',
    url: canonicalUrl,
    description: description,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'All',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [
      'URL to QR Generator',
      'Contact vCard QR Generator',
      'WiFi Network QR Generator',
      'Text and Phone QR Generator',
      'Email and SMS QR Code',
      'Location Map Pin QR',
      'Image and PDF Document QR',
      'Custom Colors, Gradients, and Eye Frames',
      'High Resolution PNG, SVG, and JPG Downloads',
    ],
  };

  schemaScript.textContent = JSON.stringify(schemaData);
}

function setMetaTag(property: string, content: string) {
  const isOg = property.startsWith('og:');
  const attrName = isOg ? 'property' : 'name';
  let tag = document.querySelector(`meta[${attrName}="${property}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attrName, property);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
}
