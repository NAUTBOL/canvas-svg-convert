
import React from 'react';
import { ArrowRight, Zap, Palette, Download } from 'lucide-react';

const Hero = () => {
  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Convert SVG files to PNG instantly with our optimized processing'
    },
    {
      icon: Palette,
      title: 'Trouble Free',
      description: 'Get a social media ready image with a white background and your SVG inside'
    },
    {
      icon: Download,
      title: 'High Quality',
      description: 'Export in high resolution for professional use and social media'
    }
  ];

  return (
    <div className="text-center space-y-12 py-16">
      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="inline-flex items-center px-4 py-2 bg-secondary rounded-full text-sm font-medium">
          <Zap className="w-4 h-4 mr-2" />
          Professional SVG to PNG Conversion
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold leading-tight">
          Transform Your{' '}
          <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            SVG Files
          </span>{' '}
          Into Perfect PNGs
        </h1>
        
        <p className="text-xl text-muted-foreground leading-relaxed">
          Upload any SVG file and convert it to high-quality PNG optimized for all major social media platforms.
        </p>
        
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-card border border-border rounded-lg p-6 card-hover group"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <feature.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
            <p className="text-muted-foreground text-sm">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Scroll indicator */}
      <div className="flex flex-col items-center space-y-2 pt-8">
        <p className="text-sm text-muted-foreground">Start converting below</p>
        <ArrowRight className="w-5 h-5 text-muted-foreground rotate-90 animate-bounce" />
      </div>
    </div>
  );
};

export default Hero;
