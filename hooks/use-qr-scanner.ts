"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import QrScanner from "qr-scanner";

export interface CameraDevice {
  id: string;
  label: string;
}

export function extractPassToken(rawScannedText: string): string {
  if (!rawScannedText) return "";
  const clean = rawScannedText.trim();
  // Match standard CodeHive format (CH26-XXXXXX or CH26-HEX) anywhere in the scanned URL or raw string
  const match = clean.match(/CH26-[A-Z0-9_-]+/i);
  return match ? match[0].toUpperCase() : clean.toUpperCase();
}

interface UseQrScannerOptions {
  onScan: (token: string, rawResult: string) => void;
  debounceMs?: number;
  autoStart?: boolean;
}

export function useQrScanner({
  onScan,
  debounceMs = 2500,
  autoStart = true,
}: UseQrScannerOptions) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const scannerRef = useRef<QrScanner | null>(null);

  const [hasCamera, setHasCamera] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [cameras, setCameras] = useState<CameraDevice[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>("environment");
  const [hasFlash, setHasFlash] = useState(false);
  const [isFlashOn, setIsFlashOn] = useState(false);
  const [scannerError, setScannerError] = useState<string | null>(null);

  const lastScannedTokenRef = useRef<string | null>(null);
  const lastScannedTimeRef = useRef<number>(0);
  const onScanRef = useRef(onScan);

  useEffect(() => {
    onScanRef.current = onScan;
  }, [onScan]);

  // Check hardware availability & list cameras
  useEffect(() => {
    let isMounted = true;

    async function initCameras() {
      try {
        const available = await QrScanner.hasCamera();
        if (!isMounted) return;
        setHasCamera(available);

        if (available) {
          try {
            const list = await QrScanner.listCameras(true);
            if (!isMounted) return;
            setCameras(
              list.map((c, i) => ({
                id: c.id,
                label: c.label || `Camera ${i + 1}`,
              }))
            );
          } catch {
            // Cannot enumerate camera labels before permissions
          }
        }
      } catch (err) {
        if (!isMounted) return;
        console.error("Camera check error:", err);
        setHasCamera(false);
      }
    }

    initCameras();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDecoded = useCallback(
    (result: QrScanner.ScanResult) => {
      const rawText = result.data;
      if (!rawText) return;

      const normalizedToken = extractPassToken(rawText);
      const now = Date.now();

      // Debounce protection to prevent repeated firing of the same pass while in front of the lens
      if (
        lastScannedTokenRef.current === normalizedToken &&
        now - lastScannedTimeRef.current < debounceMs
      ) {
        return;
      }

      lastScannedTokenRef.current = normalizedToken;
      lastScannedTimeRef.current = now;

      onScanRef.current(normalizedToken, rawText);
    },
    [debounceMs]
  );

  const startScanning = useCallback(async () => {
    if (!videoRef.current) return;
    setScannerError(null);
    setPermissionDenied(false);

    try {
      if (!scannerRef.current) {
        const scanner = new QrScanner(
          videoRef.current,
          (result) => handleDecoded(result),
          {
            preferredCamera: selectedCameraId || "environment",
            highlightScanRegion: false,
            highlightCodeOutline: false,
            maxScansPerSecond: 25,
            returnDetailedScanResult: true,
          }
        );
        scannerRef.current = scanner;
      } else {
        await scannerRef.current.setCamera(selectedCameraId || "environment");
      }

      await scannerRef.current.start();
      setIsScanning(true);

      // Check flash capability
      try {
        const flashAvailable = await scannerRef.current.hasFlash();
        setHasFlash(flashAvailable);
        setIsFlashOn(scannerRef.current.isFlashOn());
      } catch {
        setHasFlash(false);
      }

      // Refresh camera labels now that permission has been granted
      try {
        const list = await QrScanner.listCameras(true);
        setCameras(
          list.map((c, i) => ({
            id: c.id,
            label: c.label || `Camera ${i + 1}`,
          }))
        );
      } catch {
        // Ignore
      }
    } catch (err: unknown) {
      console.error("Failed to start QR scanner:", err);
      setIsScanning(false);
      const errStr = String(err);
      if (errStr.includes("Permission") || errStr.includes("NotAllowedError")) {
        setPermissionDenied(true);
        setScannerError("Camera permission was denied. Please allow camera access in your browser settings.");
      } else {
        setScannerError("Failed to access camera. Please ensure no other application is using it.");
      }
    }
  }, [handleDecoded, selectedCameraId]);

  const stopScanning = useCallback(() => {
    if (scannerRef.current) {
      try {
        scannerRef.current.stop();
      } catch {
        // Ignore
      }
      setIsScanning(false);
      setIsFlashOn(false);
    }
  }, []);

  const toggleFlash = useCallback(async () => {
    if (!scannerRef.current || !hasFlash) return;
    try {
      await scannerRef.current.toggleFlash();
      setIsFlashOn(scannerRef.current.isFlashOn());
    } catch (err) {
      console.warn("Toggle flash error:", err);
    }
  }, [hasFlash]);

  const changeCamera = useCallback(
    async (cameraId: string) => {
      setSelectedCameraId(cameraId);
      if (scannerRef.current) {
        try {
          await scannerRef.current.setCamera(cameraId);
          const flashAvailable = await scannerRef.current.hasFlash();
          setHasFlash(flashAvailable);
          setIsFlashOn(scannerRef.current.isFlashOn());
        } catch (err) {
          console.warn("Change camera error:", err);
        }
      }
    },
    []
  );

  // Scan from file (image / screenshot upload)
  const scanImageFile = useCallback(async (file: File | Blob): Promise<string> => {
    try {
      const result = await QrScanner.scanImage(file, {
        returnDetailedScanResult: true,
      });
      const normalized = extractPassToken(result.data);
      onScanRef.current(normalized, result.data);
      return normalized;
    } catch (err) {
      console.error("Scan image error:", err);
      throw new Error("No valid QR code detected in this image. Please ensure it is clear.");
    }
  }, []);

  // Initialize or cleanup
  useEffect(() => {
    let isCancelled = false;

    if (autoStart) {
      Promise.resolve().then(() => {
        if (!isCancelled) {
          startScanning();
        }
      });
    }

    return () => {
      isCancelled = true;
      if (scannerRef.current) {
        try {
          scannerRef.current.destroy();
        } catch {
          // Ignore
        }
        scannerRef.current = null;
      }
    };
  }, [autoStart, startScanning]);

  return {
    videoRef,
    hasCamera,
    isScanning,
    permissionDenied,
    cameras,
    selectedCameraId,
    hasFlash,
    isFlashOn,
    scannerError,
    startScanning,
    stopScanning,
    toggleFlash,
    changeCamera,
    scanImageFile,
  };
}
