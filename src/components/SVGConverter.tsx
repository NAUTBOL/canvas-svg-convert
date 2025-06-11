
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Download, Image as ImageIcon, Settings, Palette } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PresetFormat {
  name: string;
  width: number;
  height: number;
  description: string;
}

const SVGConverter = () => {
  const [svgFile, setSvgFile] = useState<File | null>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [selectedFormat, setSelectedFormat] = useState<string>('custom');
  const [customWidth, setCustomWidth] = useState<number>(1080);
  const [customHeight, setCustomHeight] = useState<number>(1080);
  const [backgroundColor, setBackgroundColor] = useState<string>('#000000');
  const [svgColor, setSvgColor] = useState<string>('#ffffff');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const presetFormats: PresetFormat[] = [
    { name: 'Instagram Square', width: 1080, height: 1080, description: 'Perfect for Instagram posts' },
    { name: 'Instagram Story', width: 1080, height: 1920, description: 'Vertical Instagram stories' },
    { name: 'Twitter Post', width: 1200, height: 675, description: 'Twitter image posts' },
    { name: 'LinkedIn Post', width: 1200, height: 627, description: 'LinkedIn social posts' },
    { name: 'Facebook Cover', width: 1200, height: 630, description: 'Facebook cover photos' },
    { name: 'YouTube Thumbnail', width: 1280, height: 720, description: 'YouTube video thumbnails' },
  ];

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

  const getCurrentDimensions = () => {
    if (selectedFormat === 'custom') {
      return { width: customWidth, height: customHeight };
    }
    const preset = presetFormats.find(f => f.name === selectedFormat);
    return preset ? { width: preset.width, height: preset.height } : { width: 1080, height: 1080 };
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

    const { width, height } = getCurrentDimensions();
    
    // Create a canvas
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    // Fill background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    // Modify SVG content to change color
    let modifiedSvgContent = svgContent;
    if (svgColor !== '#ffffff') {
      modifiedSvgContent = modifiedSvgContent.replace(/fill="[^"]*"/g, `fill="${svgColor}"`);
      modifiedSvgContent = modifiedSvgContent.replace(/stroke="[^"]*"/g, `stroke="${svgColor}"`);
    }

    // Create an image from SVG
    const img = new Image();
    const blob = new Blob([modifiedSvgContent], { type: 'image/svg+xml' });
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
          a.download = `${svgFile?.name?.replace('.svg', '') || 'converted'}-${width}x${height}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(downloadUrl);
          
          toast({
            title: "PNG Downloaded",
            description: `Your PNG file (${width}x${height}) has been downloaded successfully.`,
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
                  Upload an SVG file to convert it to PNG with custom canvas settings
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
                  <p className="text-sm text-muted-foreground">Or drag and drop your SVG here</p>
                </div>
              </div>
            </div>

            {svgFile && (
              <div className="bg-secondary rounded-lg p-4 text-left">
                <p className="font-medium text-green-400">✓ File uploaded: {svgFile.name}</p>
                <p className="text-sm text-muted-foreground">Size: {(svgFile.size / 1024).toFixed(1)} KB</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Configuration Section */}
      {svgFile && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Format Selection */}
          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Settings className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Canvas Settings</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Format Preset</label>
                  <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="custom">Custom Size</SelectItem>
                      {presetFormats.map((format) => (
                        <SelectItem key={format.name} value={format.name}>
                          {format.name} ({format.width}×{format.height})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedFormat !== 'custom' && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {presetFormats.find(f => f.name === selectedFormat)?.description}
                    </p>
                  )}
                </div>

                {selectedFormat === 'custom' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Width</label>
                      <input
                        type="number"
                        value={customWidth}
                        onChange={(e) => setCustomWidth(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-secondary border border-border rounded-md"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">Height</label>
                      <input
                        type="number"
                        value={customHeight}
                        onChange={(e) => setCustomHeight(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-secondary border border-border rounded-md"
                        min="1"
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Color Customization */}
          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Palette className="w-5 h-5" />
                <h3 className="text-lg font-semibold">Color Settings</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Background Color</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="w-12 h-10 rounded border border-border cursor-pointer"
                    />
                    <input
                      type="text"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="flex-1 px-3 py-2 bg-secondary border border-border rounded-md font-mono text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">SVG Color</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={svgColor}
                      onChange={(e) => setSvgColor(e.target.value)}
                      className="w-12 h-10 rounded border border-border cursor-pointer"
                    />
                    <input
                      type="text"
                      value={svgColor}
                      onChange={(e) => setSvgColor(e.target.value)}
                      className="flex-1 px-3 py-2 bg-secondary border border-border rounded-md font-mono text-sm"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

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
                Convert to PNG ({getCurrentDimensions().width}×{getCurrentDimensions().height})
              </Button>
              <p className="text-sm text-muted-foreground mt-3">
                Click to convert and download your PNG file
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SVGConverter;
