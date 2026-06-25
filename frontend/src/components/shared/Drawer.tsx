import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: string;
}

export default function Drawer({ open, onClose, title, children, footer, width = "max-w-md" }: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Focus trap
  useEffect(() => {
    if (open) {
      panelRef.current?.focus();
    }
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <div
        ref={panelRef}
        className={`drawer-panel ${width}`}
        role="dialog"
        aria-modal
        tabIndex={-1}
        aria-label={title || "Details"}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)] sticky top-0 bg-[var(--surface)] z-10">
            <h2 className="text-sm font-semibold text-white">{title}</h2>
            <button onClick={onClose} className="btn-icon btn-ghost" aria-label="Close drawer">
              <X size={16} />
            </button>
          </div>
        )}
        
        {/* Content */}
        <div className="flex-1 p-5 space-y-4">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="sticky bottom-0 bg-[var(--surface)] border-t border-[var(--border)] px-5 py-4">
            {footer}
          </div>
        )}
      </div>
    </>
  );
}
