import React, { useEffect } from 'react';

const PopupNotification = ({ message, onClose }) => {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onClose();
    }, 10000); // Close the notification after 20 seconds

    return () => clearTimeout(timeoutId);
  }, [onClose]);

  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-md border border-gray-300 shadow-md">
      <p>{message}</p>
    </div>
  );
};

export default PopupNotification;
