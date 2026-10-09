"use client";

import * as React from "react";
import {
  FileTextIcon,
  ExternalLinkIcon,
  CopyIcon,
  CheckIcon,
  Maximize2Icon,
  AlertTriangleIcon,
  ImageIcon,
  UsersIcon,
  XIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export interface IdCardMember {
  id: string;
  name: string;
  collegeIdUrl?: string | null;
}

interface IdCardPreviewProps {
  primaryUrl?: string | null;
  candidateName: string;
  college?: string;
  members?: IdCardMember[];
}

export function IdCardPreview({
  primaryUrl,
  candidateName,
  college,
  members = [],
}: IdCardPreviewProps) {
  // Collect all unique documents available for this candidate/team
  const availableDocs = React.useMemo(() => {
    const list: Array<{ label: string; url: string; memberName: string }> = [];
    const seenUrls = new Set<string>();

    if (primaryUrl && primaryUrl.trim()) {
      list.push({
        label: "Leader / Main ID",
        url: primaryUrl.trim(),
        memberName: candidateName,
      });
      seenUrls.add(primaryUrl.trim());
    }

    members.forEach((m) => {
      if (m.collegeIdUrl && m.collegeIdUrl.trim() && !seenUrls.has(m.collegeIdUrl.trim())) {
        list.push({
          label: m.name,
          url: m.collegeIdUrl.trim(),
          memberName: m.name,
        });
        seenUrls.add(m.collegeIdUrl.trim());
      }
    });

    return list;
  }, [primaryUrl, candidateName, members]);

  // Selected document state
  const [selectedDocIndex, setSelectedDocIndex] = React.useState<number>(0);
  const activeDoc = availableDocs[selectedDocIndex] || availableDocs[0] || null;

  const [copied, setCopied] = React.useState(false);
  const [fullscreenOpen, setFullscreenOpen] = React.useState(false);

  // Synchronous boolean: check if active document is PDF
  const isPdf = Boolean(
    activeDoc?.url &&
      (activeDoc.url.toLowerCase().endsWith(".pdf") ||
        activeDoc.url.toLowerCase().includes(".pdf?") ||
        activeDoc.url.toLowerCase().includes("application/pdf"))
  );

  const handleCopyLink = async () => {
    if (!activeDoc?.url) return;
    try {
      await navigator.clipboard.writeText(activeDoc.url);
      setCopied(true);
      toast.success("Tigris S3 Document URL copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  // If no document exists
  if (!activeDoc?.url) {
    return (
      <div className="border border-[#222222] bg-[#0A0A0A] p-4 text-center space-y-1.5 font-mono">
        <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-400 uppercase">
          <AlertTriangleIcon className="size-4 shrink-0" />
          <span>[ NO COLLEGE ID DOCUMENT ATTACHED ]</span>
        </div>
        <p className="text-[10px] text-[#737373]">
          Candidate registered without uploading a verification document.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 font-mono">
      {/* ── Document Header & Team Switcher ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#222222] pb-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#A3A3A3] flex items-center gap-1">
            {isPdf ? (
              <FileTextIcon className="size-3 text-red-400" />
            ) : (
              <ImageIcon className="size-3 text-cyan-400" />
            )}
            <span>UPLOADED COLLEGE ID:</span>
          </span>

          <Badge
            variant="outline"
            className="rounded-none border-[#2E2E2E] bg-[#141414] text-[9px] uppercase font-mono px-1.5 py-0 text-white"
          >
            {isPdf ? "PDF DOCUMENT" : "IMAGE CARD"}
          </Badge>
        </div>

        {/* Quick Toolbar: Copy S3 link & External Tab */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCopyLink}
            className="h-6 px-1.5 rounded-none text-[9px] text-[#A3A3A3] hover:text-white uppercase font-mono cursor-pointer"
            title="Copy Tigris S3 link"
          >
            {copied ? (
              <CheckIcon className="size-3 text-emerald-400" />
            ) : (
              <CopyIcon className="size-3" />
            )}
            <span className="ml-1 hidden xs:inline">{copied ? "Copied" : "Copy Link"}</span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setFullscreenOpen(true)}
            className="h-6 px-1.5 rounded-none text-[9px] text-[#A3A3A3] hover:text-white uppercase font-mono cursor-pointer"
            title="Expand Full Screen"
          >
            <Maximize2Icon className="size-3" />
            <span className="ml-1 hidden xs:inline">Expand</span>
          </Button>

          <a
            href={activeDoc.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 h-6 px-1.5 text-[9px] text-white hover:text-white bg-[#141414] border border-[#2E2E2E] hover:border-white uppercase font-mono transition-colors"
            title="Open raw file in new browser tab"
          >
            <ExternalLinkIcon className="size-2.5" />
            <span className="hidden xs:inline">Open</span>
          </a>
        </div>
      </div>

      {/* ── Team Member Selector Pills (If multiple documents uploaded) ── */}
      {availableDocs.length > 1 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-[9px] text-[#737373] uppercase shrink-0 font-bold flex items-center gap-1">
            <UsersIcon className="size-2.5" />
            <span>Select:</span>
          </span>
          {availableDocs.map((doc, idx) => (
            <button
              key={`${doc.url}-${idx}`}
              type="button"
              onClick={() => setSelectedDocIndex(idx)}
              className={`px-2 py-0.5 text-[9px] uppercase font-mono font-bold border transition-colors cursor-pointer shrink-0 ${
                selectedDocIndex === idx
                  ? "bg-white text-black border-white"
                  : "bg-[#101010] text-[#A3A3A3] border-[#262626] hover:text-white hover:border-[#404040]"
              }`}
            >
              {doc.label}
            </button>
          ))}
        </div>
      )}

      {/* ── Document Container ── */}
      <div
        key={activeDoc.url}
        className="relative border border-[#222222] bg-black overflow-hidden group"
      >
        {isPdf ? (
          /* PDF Viewer */
          <div className="w-full">
            {/* Desktop Embedded Viewer (>= sm) */}
            <div className="hidden sm:block h-72 sm:h-80 w-full relative">
              <iframe
                src={`${activeDoc.url}#toolbar=0&navpanes=0`}
                title={`College ID - ${activeDoc.memberName}`}
                className="size-full border-0 bg-[#080808]"
              />
            </div>

            {/* Mobile Minimal Preview Card (< sm) */}
            <div className="block sm:hidden p-3.5 bg-[#0C0C0C] space-y-2 text-center">
              <div className="size-10 mx-auto bg-[#141414] border border-[#262626] flex items-center justify-center text-red-400">
                <FileTextIcon className="size-5" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-white block uppercase tracking-wider">
                  PDF College ID Document
                </span>
                <span className="text-[10px] text-[#737373] block truncate font-mono">
                  {activeDoc.memberName} • {college || "Verified Student"}
                </span>
              </div>
              <Button
                type="button"
                onClick={() => setFullscreenOpen(true)}
                className="w-full rounded-none bg-white text-black hover:bg-neutral-200 font-mono text-[11px] font-bold uppercase h-8 cursor-pointer mt-1"
              >
                <Maximize2Icon className="size-3 mr-1.5" />
                <span>[ View Full Document ]</span>
              </Button>
            </div>
          </div>
        ) : (
          /* Image Viewer */
          <div
            onClick={() => setFullscreenOpen(true)}
            className="relative cursor-pointer max-h-72 sm:max-h-80 w-full flex items-center justify-center bg-[#050505] p-2"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeDoc.url}
              alt={`College ID - ${activeDoc.memberName}`}
              className="max-h-68 sm:max-h-76 w-auto object-contain transition-transform group-hover:scale-[1.01]"
            />
            {/* Hover Fullscreen Hint */}
            <div className="absolute bottom-2 right-2 bg-black/80 border border-white/20 px-2 py-0.5 text-[9px] uppercase tracking-wider text-white opacity-90 group-hover:opacity-100 flex items-center gap-1">
              <Maximize2Icon className="size-2.5" />
              <span>Tap to Zoom</span>
            </div>
          </div>
        )}
      </div>

      {/* ── Fullscreen Lightbox Modal ── */}
      <Dialog open={fullscreenOpen} onOpenChange={setFullscreenOpen}>
        <DialogContent
          className="max-w-4xl w-[96vw] bg-[#0A0A0A] border border-[#2E2E2E] text-white p-0 font-mono max-h-[94vh] flex flex-col rounded-none shadow-2xl"
          showCloseButton={false}
        >
          {/* Header */}
          <DialogHeader className="p-3 sm:p-4 border-b border-[#222222] bg-[#0E0E0E] flex flex-row items-center justify-between space-y-0 shrink-0">
            <div className="min-w-0">
              <DialogTitle className="text-xs sm:text-sm font-bold uppercase text-white tracking-wider truncate">
                College ID Document: {activeDoc.memberName}
              </DialogTitle>
              <p className="text-[10px] text-[#737373] truncate">
                Tigris AWS S3 Verified Asset • {college || "Student Credential"}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href={activeDoc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 py-1 text-[10px] text-white bg-[#161616] border border-[#2E2E2E] hover:border-white uppercase font-mono"
              >
                <ExternalLinkIcon className="size-3" />
                <span className="hidden xs:inline">Open Raw</span>
              </a>

              <button
                type="button"
                onClick={() => setFullscreenOpen(false)}
                className="p-1 text-[#737373] hover:text-white border border-transparent hover:border-[#333333] hover:bg-[#161616] cursor-pointer"
              >
                <XIcon className="size-4" />
                <span className="sr-only">Close</span>
              </button>
            </div>
          </DialogHeader>

          {/* Modal Document Body */}
          <div className="relative flex-1 bg-black min-h-[60vh] sm:min-h-[70vh] flex items-center justify-center p-2 overflow-auto">
            {isPdf ? (
              <iframe
                src={`${activeDoc.url}#toolbar=1&navpanes=1`}
                title={`Full College ID - ${activeDoc.memberName}`}
                className="size-full border-0 bg-[#080808] min-h-[60vh] sm:min-h-[70vh]"
              />
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={activeDoc.url}
                alt={`Full College ID - ${activeDoc.memberName}`}
                className="max-h-[80vh] w-auto object-contain"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default IdCardPreview;
