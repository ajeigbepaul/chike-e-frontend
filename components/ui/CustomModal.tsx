"use client";
import React from "react";

interface ModalProps {
  open: boolean;
  title?: string;
  message: string;
  okText?: string;
  cancelText?: string;
  onOk: () => void;
  onCancel: () => void;
}

export default function CustomModal({
  open,
  title,
  message,
  okText = "OK",
  cancelText = "Cancel",
  onOk,
  onCancel,
}: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 animate-fade-in">
        {title && (
          <h3 className="text-lg font-bold mb-3 text-brand-yellow text-center">
            {title}
          </h3>
        )}
        <div className="mb-6 text-center text-gray-800">{message}</div>
        <div className="flex gap-3 justify-center">
          <button
            className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            className="px-4 py-2 rounded bg-brand-yellow text-gray-900 font-semibold hover:bg-yellow-400 transition"
            onClick={onOk}
          >
            {okText}
          </button>
        </div>
      </div>
    </div>
  );
}
