import { useState, useRef, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ZoomIn, ZoomOut, RotateCcw, Check, Move } from "lucide-react";

interface ImageCropDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageSrc: string | null;
  onConfirm: (croppedBlob: Blob) => void;
}

export function ImageCropDialog({
  open,
  onOpenChange,
  imageSrc,
  onConfirm,
}: ImageCropDialogProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (open) {
      setZoom(1);
      setPan({ x: 0, y: 0 });
    }
  }, [open, imageSrc]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleCrop = () => {
    if (!imageRef.current) return;
    const canvas = document.createElement("canvas");
    const targetSize = 512;
    canvas.width = targetSize;
    canvas.height = targetSize;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imageRef.current;
    const previewSize = 280; // visual crop box dimensions in px
    const scaleFactor = targetSize / previewSize;

    ctx.clearRect(0, 0, targetSize, targetSize);

    // Calculate aspect ratio
    const imgAspect = img.naturalWidth / img.naturalHeight;
    let baseWidth = previewSize;
    let baseHeight = previewSize;

    if (imgAspect > 1) {
      baseWidth = previewSize * imgAspect;
    } else {
      baseHeight = previewSize / imgAspect;
    }

    const drawW = baseWidth * zoom * scaleFactor;
    const drawH = baseHeight * zoom * scaleFactor;
    const drawX = (targetSize - drawW) / 2 + pan.x * scaleFactor;
    const drawY = (targetSize - drawH) / 2 + pan.y * scaleFactor;

    ctx.drawImage(img, drawX, drawY, drawW, drawH);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          onConfirm(blob);
          onOpenChange(false);
        }
      },
      "image/webp",
      0.9,
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass max-w-md rounded-[2.5rem] border-glass-border p-6 text-foreground">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-bold">Crop & Fit Profile Photo</DialogTitle>
          <p className="text-xs text-muted-foreground">Drag to reposition, use slider to zoom and center your face.</p>
        </DialogHeader>

        {imageSrc && (
          <div className="flex flex-col items-center gap-4 py-2">
            {/* Crop Window Container */}
            <div
              className="relative h-[280px] w-[280px] cursor-grab overflow-hidden rounded-full border-2 border-gold/60 bg-black/40 shadow-inner active:cursor-grabbing"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <img
                ref={imageRef}
                src={imageSrc}
                alt="Crop preview"
                className="pointer-events-none absolute select-none max-w-none"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                  transformOrigin: "center center",
                  transition: isDragging ? "none" : "transform 0.05s ease-out",
                }}
              />
              <div className="pointer-events-none absolute inset-0 rounded-full border-4 border-gold/40" />
            </div>

            <div className="flex w-full items-center gap-1 text-[11px] font-mono text-muted-foreground justify-center">
              <Move className="h-3 w-3 text-gold" /> Drag image to adjust positioning
            </div>

            {/* Zoom Slider */}
            <div className="w-full space-y-2 px-2 pt-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
                <span className="flex items-center gap-1"><ZoomOut className="h-3.5 w-3.5" /> 80%</span>
                <span className="text-gold font-semibold">{Math.round(zoom * 100)}%</span>
                <span className="flex items-center gap-1">250% <ZoomIn className="h-3.5 w-3.5" /></span>
              </div>
              <Slider
                value={[zoom]}
                min={0.8}
                max={2.5}
                step={0.05}
                onValueChange={([val]) => setZoom(val)}
                className="py-2"
              />
            </div>
          </div>
        )}

        <DialogFooter className="flex flex-row justify-between gap-2 sm:justify-between">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setZoom(1);
              setPan({ x: 0, y: 0 });
            }}
            className="gap-1 text-xs"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </Button>
          <div className="flex gap-2">
            <Button type="button" variant="glass" size="sm" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="button" variant="gold" size="sm" onClick={handleCrop} className="gap-1.5">
              <Check className="h-4 w-4" /> Apply & Save
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
