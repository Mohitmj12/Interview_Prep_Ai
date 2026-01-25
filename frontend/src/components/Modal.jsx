import React from "react";

function Modal({ children, isOpen, onClose, title, hideHeader }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white relative p-5 rounded-lg min-w-[350px] max-w-[90vw] max-h-[90vh]">
        
        {!hideHeader && (
          <div className="mb-3">
            <h2 className="text-lg font-semibold">{title}</h2>
          </div>
        )}

        {/* Close button */}
        <button
          className="text-gray-400 hover:bg-orange-50 hover:text-black text-3xl absolute right-2 top-2 flex justify-center items-center rounded-lg"
          onClick={onClose}
        >
          ✕
        </button>

        {/* Modal Content */}
        <div className="overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;
