import React from "react";
import { Modal, Button, Typography } from "antd";

const { Title, Text } = Typography;

interface ConfirmationModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title = "Confirmation",
  message,
  confirmButtonText = "Confirm",
  cancelButtonText = "Cancel",
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      title={<Title level={4}>{title}</Title>}
      open={isOpen}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          {cancelButtonText}
        </Button>,
        <Button key="confirm" type="primary" onClick={onConfirm}>
          {confirmButtonText}
        </Button>,
      ]}
      centered
    >
      <Text>{message}</Text>
    </Modal>
  );
};

export default ConfirmationModal;
