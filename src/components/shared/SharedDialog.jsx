import { useEffect, useRef } from "react";
import { UI_CONSTANTS } from "../../constants/uiConstants.js";

// Shared dialog component for the entire project
export function AlertDialog({
  isOpen,
  onClose,
  title,
  message,
  type = "info",
}) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (isOpen && dialogRef.current) {
      dialogRef.current.showModal();
    }
  }, [isOpen]);

  const handleClose = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
    onClose();
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "warning":
        return "⚠️";
      default:
        return "ℹ️";
    }
  };

  const getButtonStyle = () => {
    const { COLORS } = UI_CONSTANTS;
    switch (type) {
      case "success":
        return {
          background: `linear-gradient(135deg, ${COLORS.SUCCESS} 0%, ${COLORS.SUCCESS_DARK} 100%)`,
          color: "white",
        };
      case "error":
        return {
          background: `linear-gradient(135deg, ${COLORS.ERROR} 0%, ${COLORS.ERROR_DARK} 100%)`,
          color: "white",
        };
      case "warning":
        return {
          background: `linear-gradient(135deg, ${COLORS.WARNING} 0%, ${COLORS.WARNING_DARK} 100%)`,
          color: "white",
        };
      default:
        return {
          background: `linear-gradient(135deg, ${COLORS.PRIMARY} 0%, ${COLORS.PRIMARY_LIGHT} 100%)`,
          color: "white",
        };
    }
  };

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      style={{
        border: "none",
        borderRadius: UI_CONSTANTS.BORDER_RADIUS.LG,
        padding: "0",
        boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px ${UI_CONSTANTS.COLORS.BORDER_LIGHT}`,
        maxWidth: UI_CONSTANTS.DIALOG.MAX_WIDTH,
        width: "90vw",
        background: "transparent",
      }}
    >
      <div
        style={{
          padding: "24px",
          background: `linear-gradient(135deg, #ffffff 0%, ${UI_CONSTANTS.COLORS.GRAY_LIGHT} 100%)`,
          borderRadius: UI_CONSTANTS.BORDER_RADIUS.LG,
          border: `2px solid ${UI_CONSTANTS.COLORS.BORDER_LIGHT}`,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "16px",
            paddingBottom: "12px",
            borderBottom: `2px solid ${UI_CONSTANTS.COLORS.BORDER_LIGHT}`,
          }}
        >
          <span style={{ fontSize: "24px", marginRight: "12px" }}>
            {getIcon()}
          </span>
          <h3
            style={{
              margin: "0",
              fontSize: "18px",
              fontWeight: "700",
              color: UI_CONSTANTS.COLORS.PRIMARY,
            }}
          >
            {title}
          </h3>
        </div>

        {/* Message */}
        <div
          style={{
            marginBottom: "24px",
            color: UI_CONSTANTS.COLORS.GRAY_MEDIUM,
            lineHeight: "1.6",
            fontSize: "14px",
          }}
        >
          {message}
        </div>

        {/* Button */}
        <div style={{ textAlign: "right" }}>
          <button
            onClick={handleClose}
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600",
              ...getButtonStyle(),
            }}
          >
            了解 / OK
          </button>
        </div>
      </div>
    </dialog>
  );
}

// Confirm Dialog component
export function ConfirmDialog({ isOpen, onClose, onConfirm, title, message }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (isOpen && dialogRef.current) {
      dialogRef.current.showModal();
    }
  }, [isOpen]);

  const handleClose = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
    onClose();
  };

  const handleConfirm = () => {
    onConfirm();
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      style={{
        border: "none",
        borderRadius: UI_CONSTANTS.BORDER_RADIUS.LG,
        padding: "0",
        boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px ${UI_CONSTANTS.COLORS.BORDER_LIGHT}`,
        maxWidth: UI_CONSTANTS.DIALOG.MAX_WIDTH,
        width: "90vw",
        background: "transparent",
      }}
    >
      <div
        style={{
          padding: "24px",
          background: `linear-gradient(135deg, #ffffff 0%, ${UI_CONSTANTS.COLORS.GRAY_LIGHT} 100%)`,
          borderRadius: UI_CONSTANTS.BORDER_RADIUS.LG,
          border: `2px solid ${UI_CONSTANTS.COLORS.BORDER_LIGHT}`,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "16px",
            paddingBottom: "12px",
            borderBottom: `2px solid ${UI_CONSTANTS.COLORS.BORDER_LIGHT}`,
          }}
        >
          <span style={{ fontSize: "24px", marginRight: "12px" }}>⚠️</span>
          <h3
            style={{
              margin: "0",
              fontSize: "18px",
              fontWeight: "700",
              color: UI_CONSTANTS.COLORS.PRIMARY,
            }}
          >
            {title}
          </h3>
        </div>

        {/* Message */}
        <div
          style={{
            marginBottom: "24px",
            color: UI_CONSTANTS.COLORS.GRAY_MEDIUM,
            lineHeight: "1.6",
            fontSize: "14px",
          }}
        >
          {message}
        </div>

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={handleClose}
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              border: "2px solid #d1d5db",
              background: "white",
              color: "#374151",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            キャンセル / Cancel
          </button>
          <button
            onClick={handleConfirm}
            style={{
              padding: "10px 20px",
              borderRadius: "8px",
              border: "none",
              background: "#dc2626",
              color: "white",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            確認 / Confirm
          </button>
        </div>
      </div>
    </dialog>
  );
}
