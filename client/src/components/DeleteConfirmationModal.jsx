import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="delete-modal-overlay"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="delete-modal-content"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="delete-modal-header">
            <div className="delete-modal-title-section">
              <div className="delete-modal-icon">
                <AlertTriangle size={24} />
              </div>
              <h3 className="delete-modal-title">Delete Spoon</h3>
            </div>
            <button
              onClick={onClose}
              className="delete-modal-close-btn"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="delete-modal-body">
            <p className="delete-modal-message">
              Are you sure you want to delete this spoon?
            </p>
            <p className="delete-modal-warning">
              This action cannot be undone and will permanently remove all associated data.
            </p>
          </div>

          {/* Actions */}
          <div className="delete-modal-actions">
            <button
              onClick={onClose}
              className="delete-modal-btn delete-modal-btn-cancel"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="delete-modal-btn delete-modal-btn-delete"
            >
              Delete Spoon
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DeleteConfirmationModal;