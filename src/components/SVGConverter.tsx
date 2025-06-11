
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Download, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SVGConverter = () => {
  const [svgFile, setSvgFile] = useState<File | null>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'image/svg+xml') {
      setSvgFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setSvgContent(content);
      };
      reader.readAsText(file);
      toast({
        title: "SVG Uploaded Successfully",
        description: "Your SVG file is ready for conversion.",
      });
    } else {
      toast({
        title: "Invalid File Type",
        description: "Please upload a valid SVG file.",
        variant: "destructive",
      });
    }
  };

  const convertToPNG = () => {
    if (!svgContent) {
      toast({
        title: "No SVG File",
        description: "Please upload an SVG file first.",
        variant: "destructive",
      });
      return;
    }

    const width = 1080;
    const height = 1080;
    
    // Create a canvas
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    // Fill background with white
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Create an image from SVG (preserving original colors)
    const img = new Image();
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    img.onload = () => {
      // Calculate centered position for SVG
      const svgAspectRatio = img.width / img.height;
      const canvasAspectRatio = width / height;
      
      let drawWidth, drawHeight, drawX, drawY;
      
      if (svgAspectRatio > canvasAspectRatio) {
        // SVG is wider
        drawWidth = width * 0.8; // 80% of canvas width for padding
        drawHeight = drawWidth / svgAspectRatio;
      } else {
        // SVG is taller
        drawHeight = height * 0.8; // 80% of canvas height for padding
        drawWidth = drawHeight * svgAspectRatio;
      }
      
      drawX = (width - drawWidth) / 2;
      drawY = (height - drawHeight) / 2;
      
      ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
      
      // Convert to PNG and download
      canvas.toBlob((blob) => {
        if (blob) {
          const downloadUrl = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = downloadUrl;
          a.download = `${svgFile?.name?.replace('.svg', '') || 'converted'}-1080x1080.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(downloadUrl);
          
          toast({
            title: "PNG Downloaded",
            description: `Your PNG file (1080x1080) has been downloaded successfully.`,
          });
        }
      }, 'image/png');
      
      URL.revokeObjectURL(url);
    };
    
    img.src = url;
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Upload Section */}
      <Card className="card-hover">
        <CardContent className="p-8">
          <div className="text-center space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-2">Upload Your SVG</h2>
                <p className="text-muted-foreground">
                  Upload an SVG file to convert it to a 1080x1080 PNG with white background.
                </p>
              </div>
            </div>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-border rounded-lg p-8 cursor-pointer hover:border-accent-foreground/50 transition-colors"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".svg,image/svg+xml"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="flex flex-col items-center space-y-4">
                <ImageIcon className="w-12 h-12 text-muted-foreground" />
                <div>
                  <p className="text-lg font-medium">Click to upload SVG file</p>
                  <p className="text-sm text-muted-foreground">Or drag and drop your SVG here.</p>
                </div>
              </div>
            </div>

            {svgFile && (
              <div className="bg-secondary rounded-lg p-4 text-left">
                <p className="font-medium text-green-400">File uploaded: {svgFile.name}</p>
                <p className="text-sm text-muted-foreground">Size: {(svgFile.size / 1024).toFixed(1)} KB</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Convert Button */}
      {svgFile && (
        <Card className="card-hover">
          <CardContent className="p-6">
            <div className="text-center">
              <Button
                onClick={convertToPNG}
                size="lg"
                className="btn-primary px-8 py-3 text-lg"
              >
                <Download className="w-5 h-5 mr-2" />
                Convert to PNG
              </Button>
              <p className="text-sm text-muted-foreground mt-3">
                Click to convert and download your PNG file with white background.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SVGConverter;
