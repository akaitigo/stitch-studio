import type { ReactNode } from "react";

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
  minWidth?: number;
  maxWidth?: number;
}

export function Modal({ children, onClose, minWidth = 300, maxWidth }: ModalProps) {
  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-content" style={{ minWidth, maxWidth }}>
        {children}
      </div>
    </div>
  );
}
