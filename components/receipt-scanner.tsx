"use client";
import React, { useEffect, useState, useRef } from "react";
import { openDB, deleteDB } from "idb";
import { Camera, FileText, Sparkles, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type ExtractedItem = {
  name: string;
  price: number;
  isFoodItem?: boolean;
  macros?: {
    protein: number;
    carbs: number;
    fiber: number;
    fat: number;
  };
  micros?: {
    vitaminB12: number;
    vitaminD: number;
    omega3: number;
    iron: number;
    zinc: number;
    iodine: number;
  };
};

type FoodItem = {
  id?: string;
  date: string;
  name: string;
  price: number;
  macros: {
    protein: number;
    carbs: number;
    fiber: number;
    fat: number;
  };
  micros: {
    vitaminB12: number;
    vitaminD: number;
    omega3: number;
    iron: number;
    zinc: number;
    iodine: number;
  };
};

type ReceiptScannerProps = {
  onItemExtracted: (item: Omit<FoodItem, "id">) => void;
};

export default function ReceiptScanner({ onItemExtracted }: ReceiptScannerProps) {
  // Approve/save a single item
  const handleApproveItem = (item: ExtractedItem, idx: number) => {
    const today = new Date().toISOString().split('T')[0];
    onItemExtracted({
      ...item,
      date: (item as any).date || today,
      macros: item.macros || { protein: 0, carbs: 0, fiber: 0, fat: 0 },
      micros: item.micros || { vitaminB12: 0, vitaminD: 0, omega3: 0, iron: 0, zinc: 0, iodine: 0 },
    });
    setExtractedItems(prev => prev.filter((_, i) => i !== idx));
    if (extractedItems.length === 1) setShowResults(false);
  };
  // Save/approve all extracted items
  const handleSaveAll = () => {
    extractedItems.forEach(item => {
      // Add today's date if not present
      const today = new Date().toISOString().split('T')[0];
      onItemExtracted({
        ...item,
        date: (item as any).date || today,
        macros: item.macros || { protein: 0, carbs: 0, fiber: 0, fat: 0 },
        micros: item.micros || { vitaminB12: 0, vitaminD: 0, omega3: 0, iron: 0, zinc: 0, iodine: 0 },
      });
    });
    setExtractedItems([]);
    setShowResults(false);
  };
  // Capture a frame from the video and send to extractFromImage
  const handleCapture = async () => {
    if (!videoRef.current) return;
    setIsScanning(true);
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL('image/png');
      await extractFromImage(imageData);
    }
    setIsScanning(false);
  };
  // ...existing code...
  const handleResetDatabase = async () => {
    await deleteDB("ReceiptDB");
    setExtractedItems([]);
    setShowResults(false);
    setErrorMessage(null);
  };
  const [isScanning, setIsScanning] = useState(false);
  const [extractedItems, setExtractedItems] = useState<ExtractedItem[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const extractFromImage = async (imageData?: string) => {
    // isScanning is now managed in handleCapture
    setShowCamera(false);
    setErrorMessage(null);
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    try {
      const res = await fetch("/api/ocr-openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageData }),
      });
      const data = await res.json();
      if (data.error) {
        setErrorMessage(data.error);
        setExtractedItems([]);
      } else if (Array.isArray(data.items)) {
        setExtractedItems(data.items);
      } else {
        setExtractedItems([]);
      }
    } catch (err: any) {
      setExtractedItems([]);
      setErrorMessage(err.message || "Failed to extract receipt text.");
    }
    setShowResults(true);
  };

  const handleScanReceipt = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      setStream(mediaStream);
      setShowCamera(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      }, 100);
    } catch (err) {
      alert("Could not access camera.");
    }
  };

  const handleAddItem = (item: ExtractedItem) => {
    setExtractedItems((prev) => prev.filter((i) => i.name !== item.name));
  };

  const handleDismiss = (itemName: string) => {
    setExtractedItems((prev) => prev.filter((i) => i.name !== itemName));
  };

  // ...existing code...
  return (
    <>
      <Card>
        {isScanning && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="mb-2">
              <span className="inline-block animate-spin rounded-full border-4 border-gray-300 border-t-primary h-8 w-8"></span>
            </div>
            <div className="text-sm text-muted-foreground">AI is processing your receipt...</div>
          </div>
        )}
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-2">
              <Camera className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Let's read your receipt next</CardTitle>
              <CardDescription>Take a photo and we will extract the info for you...</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {errorMessage && (
            <div className="mb-4 p-3 rounded bg-red-100 text-red-700 text-sm">
              {errorMessage}
            </div>
          )}
          {showCamera ? (
            <div className="flex flex-col items-center gap-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                style={{ width: '100%', maxWidth: 400, borderRadius: 12, background: '#000' }}
              />
              <div className="flex gap-2">
                <Button variant="default" size="lg" onClick={handleCapture} disabled={isScanning} aria-disabled={isScanning}>
                  <Camera className="mr-2 h-5 w-5" /> Capture
                </Button>
                <Button variant="ghost" size="lg" onClick={() => {
                  if (stream) stream.getTracks().forEach(track => track.stop());
                  setShowCamera(false);
                  setStream(null);
                }} disabled={isScanning} aria-disabled={isScanning}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : !showResults ? (
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/25 bg-muted/30 p-8">
              <Button variant="default" size="lg" onClick={handleScanReceipt} disabled={isScanning} aria-disabled={isScanning}>
                <Camera className="mr-2 h-5 w-5" /> Scan Receipt
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {extractedItems.length > 0 && (
                <div className="flex justify-end mb-2">
                  <Button variant="success" size="sm" onClick={handleSaveAll}>
                    Save All
                  </Button>
                </div>
              )}
              {extractedItems.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  All items processed!
                </p>
              ) : (
                extractedItems.map((item, idx) => (
                  <div
                    key={item.name}
                    className="rounded-lg border p-3 mb-2 bg-white"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <button
                          className="font-medium text-card-foreground w-full text-left"
                          onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
                        >
                          {item.name} <span className="text-muted-foreground">${item.price.toFixed(2)}</span>
                        </button>
                        {/* Non-food tag removed as requested */}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-primary hover:text-primary"
                          onClick={() => handleApproveItem(item, idx)}
                          title="Approve and save item"
                        >
                          <Check className="h-4 w-4" />
                          <span className="sr-only">Approve {item.name}</span>
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => handleDismiss(item.name)}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Dismiss {item.name}</span>
                        </Button>
                      </div>
                    </div>
                    {expandedIndex === idx && (
                      <div className="mt-4 p-3 rounded bg-muted/10">
                        <div className="mb-2">
                          <label className="block text-xs mb-1">Name</label>
                          <input
                            className="w-full border rounded px-2 py-1 text-sm placeholder:italic"
                            value={item.name}
                            placeholder="ex: Banana"
                            onChange={e => {
                              const newItems = [...extractedItems];
                              newItems[idx].name = e.target.value;
                              setExtractedItems(newItems);
                            }}
                          />
                        </div>
                        <div className="mb-2">
                          <label className="block text-xs mb-1">Price</label>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">R$</span>
                            <input
                              type="number"
                              className="border rounded px-2 py-1 text-sm flex-1 placeholder:italic placeholder:text-gray-400"
                              value={item.price}
                              placeholder="ex: 4.99"
                              onChange={e => {
                                const newItems = [...extractedItems];
                                newItems[idx].price = parseFloat(e.target.value);
                                setExtractedItems(newItems);
                              }}
                            />
                          </div>
                        </div>
                        <div className="mb-2">
                          <label className="block text-xs mb-1">Macros</label>
                          {Object.entries(item.macros || {}).map(([macro, value]) => {
                            type MacroKey = 'protein' | 'carbs' | 'fiber' | 'fat';
                            return (
                              <div key={macro} className="flex gap-2 items-center mb-1">
                                <span className="w-24 text-xs">{macro}</span>
                                <input
                                  type="number"
                                  className="border rounded px-2 py-1 text-sm w-20 placeholder:italic placeholder:text-gray-400"
                                  value={value as number}
                                  placeholder="ex: 0.2"
                                  onChange={e => {
                                    const newItems = [...extractedItems];
                                    if (newItems[idx].macros) {
                                      newItems[idx].macros[macro as MacroKey] = parseFloat(e.target.value);
                                    }
                                    setExtractedItems(newItems);
                                  }}
                                />
                                <span className="text-xs text-muted-foreground">g</span>
                              </div>
                            );
                          })}
                        </div>
                        <div className="mb-2">
                          <label className="block text-xs mb-1">Micros</label>
                          {Object.entries(item.micros || {}).map(([micro, value]) => {
                            type MicroKey = 'vitaminB12' | 'vitaminD' | 'omega3' | 'iron' | 'zinc' | 'iodine';
                            return (
                              <div key={micro} className="flex gap-2 items-center mb-1">
                                <span className="w-24 text-xs">{micro}</span>
                                <input
                                  type="number"
                                  className="border rounded px-2 py-1 text-sm w-20 placeholder:italic placeholder:text-gray-400"
                                  value={value as number}
                                  placeholder="ex: 0.003"
                                  onChange={e => {
                                    const newItems = [...extractedItems];
                                    if (newItems[idx].micros) {
                                      newItems[idx].micros[micro as MicroKey] = parseFloat(e.target.value);
                                    }
                                    setExtractedItems(newItems);
                                  }}
                                />
                                <span className="text-xs text-muted-foreground">mg</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}

