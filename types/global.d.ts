interface Window {
  gtag: (
    command: 'config' | 'event',
    targetId: string,
    options?: {
      page_path?: string;
      event_category?: string;
      event_label?: string;
      value?: number;
      [key: string]: any;
    }
  ) => void;
} 