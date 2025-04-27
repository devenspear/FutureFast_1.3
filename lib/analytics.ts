"use client";

// Google Analytics event tracking utility

// Define types for GA events
export interface GAEvent {
  action: string;
  category?: string;
  label?: string;
  value?: number;
  [key: string]: unknown; // Allow for custom properties with safer type
}

// Define window with gtag
interface WindowWithGtag {
  gtag?: (command: string, ...args: unknown[]) => void;
}

// Function to track page views
export const pageview = (url: string): void => {
  if (typeof window !== 'undefined') {
    const win = window as unknown as WindowWithGtag;
    if (win.gtag) {
      win.gtag('config', 'G-F4CGW7GF6P', {
        page_path: url,
      });
    }
  }
};

// Function to track events
export const event = ({ action, category, label, value, ...rest }: GAEvent): void => {
  if (typeof window !== 'undefined') {
    const win = window as unknown as WindowWithGtag;
    if (win.gtag) {
      win.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
        ...rest,
      });
    }
  }
};

// Common events for easier tracking
export const trackResourceClick = (resourceTitle: string, resourceUrl: string): void => {
  event({
    action: 'resource_click',
    category: 'resource_library',
    label: resourceTitle,
    resource_url: resourceUrl,
  });
};

export const trackNewsClick = (newsTitle: string, newsSource: string, newsUrl: string): void => {
  event({
    action: 'news_click',
    category: 'news',
    label: newsTitle,
    news_source: newsSource,
    news_url: newsUrl,
  });
};

export const trackDisruptionWeeklyClick = (): void => {
  event({
    action: 'disruption_weekly_click',
    category: 'newsletter',
    label: 'Disruption Weekly Subscribe',
  });
};
