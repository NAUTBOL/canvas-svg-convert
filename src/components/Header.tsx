
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, ExternalLink } from 'lucide-react';

const Header = () => {
  return (
    <header className="w-full border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <h1 className="text-xl font-semibold">SVG Converter</h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="btn-secondary"
          >
            <a
              href="https://www.paypal.com/paypalme/NAUTBOL"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2"
            >
              <Heart className="w-4 h-4" />
              <span>Donate</span>
            </a>
          </Button>
          
          <Button
            asChild
            variant="default"
            size="sm"
            className="btn-primary"
          >
            <a
              href="https://www.kuantyk.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2"
            >
              <ExternalLink className="w-4 h-4" />
              <span>More Apps</span>
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
