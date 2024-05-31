import React from 'react';

const Modal = ({ isOpen, onClose, onConfirm, title, message }) => {
  return (
    <>
     {isOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
            <div className="relative bg-white rounded-lg w-96 p-6">
              <span className="absolute top-0 right-0 p-4 cursor-pointer" onClick={onClose}>&times;</span>
              <h2 className="text-xl font-semibold mb-4">{title}</h2>
              <p className="mb-4">{message}</p>
              <div className="flex justify-end">
                <button className="px-4 py-2 bg-gray-300 rounded-md mr-2" onClick={onClose}>No</button>
                <button className="px-4 py-2 bg-red-500 text-white rounded-md" onClick={onConfirm}>Yes</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
