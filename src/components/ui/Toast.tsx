import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ToastProps {
  message: string;
  onUndo?: () => void;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ 
  message, 
  onUndo, 
  onClose, 
  duration = 5000 
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50">
      <p>{message}</p>
      {onUndo && (
        <button
          onClick={(e) => {
            e.preventDefault();
            onUndo();
            onClose();
          }}
          className="text-blue-400 hover:text-blue-300 font-medium"
        >
          Undo
        </button>
      )}
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-300"
        aria-label="Close"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast; 