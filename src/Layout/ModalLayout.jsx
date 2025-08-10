import React, { useState, useEffect, useRef } from 'react';


function Modal({ isOpen, onClose, children }) {
  const modalRef = useRef(null);

  // Effect to handle closing the modal with the 'Escape' key
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  // Effect to handle clicks outside the modal content
  const handleBackdropClick = (event) => {
    // We check if the click is on the backdrop itself, not on the modal content.
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    // Main modal container with backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/80 backdrop-blur-sm transition-opacity duration-300 ease-in-out"
      onClick={handleBackdropClick}
      aria-modal="true"
      role="dialog"
    >
      {/* Modal content panel */}
      <div
        ref={modalRef}
        className="relative bg-white w-full max-w-lg m-4 p-8 rounded-2xl shadow-2xl transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-fade-in-scale"
        // We stop propagation to prevent clicks inside the modal from closing it
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-full p-1 transition-colors duration-200"
          aria-label="Close modal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        {/* Child content is rendered here */}
        {children}
      </div>
      <style jsx global>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in-scale {
          animation: fadeInScale 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default Modal