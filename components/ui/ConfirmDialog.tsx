"use client";

import { Modal } from "./Modal";
import { Button } from "./button";
import { AlertCircle } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "destructive" | "default";
}

export function ConfirmDialog({
  isOpen,
  onConfirm,
  onCancel,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "destructive"
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title}>
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className={`p-2 rounded-full ${variant === 'destructive' ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}>
            <AlertCircle size={24} />
          </div>
          <p className="text-muted-foreground font-medium leading-relaxed">
            {message}
          </p>
        </div>
        
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-muted">
          <Button variant="ghost" onClick={onCancel} className="rounded-xl font-bold">
            {cancelText}
          </Button>
          <Button 
            variant={variant === 'destructive' ? "destructive" : "default"}
            onClick={onConfirm} 
            className={`rounded-xl font-bold px-8 ${variant === 'default' ? 'bg-[#FF6B35] hover:bg-[#E85A24]' : ''}`}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
