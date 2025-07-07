"use client";
import "@ant-design/v5-patch-for-react-19";
import React, { useState } from "react";
import { Modal, Form, Input, DatePicker, Button, InputNumber } from "antd";
import dayjs from "dayjs";

interface AddVehicleModalProps {
  visible: boolean;
  onCancel: () => void;
  isEdit: boolean;
  selectedVehicleId: number | null;
  onSuccess: () => void;
}

const AddVehicleModal: React.FC<AddVehicleModalProps> = ({
  visible,
  onCancel,
  isEdit,
  selectedVehicleId,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch vehicle data when editing
  React.useEffect(() => {
    if (isEdit && selectedVehicleId && visible) {
      fetchVehicleData();
    } else if (visible) {
      form.resetFields();
    }
  }, [isEdit, selectedVehicleId, visible]);

  const fetchVehicleData = async () => {
    setLoading(true);
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api";
      const url = `${baseUrl}/vehicles/${selectedVehicleId}`;

      const response = await fetch(url, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch vehicle data");
      }

      const vehicleData = await response.json();

      const yearDayjs = vehicleData.model
        ? dayjs().year(parseInt(vehicleData.model)).startOf("year")
        : null;

      form.setFieldsValue({
        name: vehicleData.name,
        price: vehicleData.price,
        year: yearDayjs,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const values = await form.validateFields();

      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api";
      const url = isEdit
        ? `${baseUrl}/vehicles/${selectedVehicleId}`
        : `${baseUrl}/vehicles`;

      const postObj = {
        model: values.year ? values.year.year().toString() : undefined,
        name: values.name,
        price: values.price,
      };

      const response = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postObj),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`Failed to ${isEdit ? "update" : "create"} vehicle`);
      }

      form.resetFields();
      onSuccess();
      onCancel();
    } catch (err: any) {
      if (err.errorFields) {
        console.log("Validation failed:", err);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={isEdit ? "Edit Vehicle" : "Add Vehicle"}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleSubmit}
          loading={loading}
        >
          {isEdit ? "Update" : "Submit"}
        </Button>,
      ]}
    >
      {error && <div style={{ color: "red", marginBottom: 16 }}>{error}</div>}
      <Form form={form} layout="vertical" name="addVehicleForm">
        <Form.Item
          name="year"
          label="Year"
          rules={[{ required: true, message: "Please select the year!" }]}
        >
          <DatePicker
            picker="year"
            disabledDate={(current) =>
              current && current > dayjs().endOf("day")
            }
            style={{ width: "100%" }}
            allowClear={true}
            placeholder="Select year"
          />
        </Form.Item>

        <Form.Item
          name="name"
          label="Vehicle Name"
          rules={[
            { required: true, message: "Please enter the vehicle name!" },
          ]}
        >
          <Input placeholder="Enter vehicle name" />
        </Form.Item>

        <Form.Item
          name="price"
          label="Price"
          rules={[{ required: true, message: "Please enter the price!" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            formatter={(value) =>
              `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            placeholder="Enter price"
            min={0}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddVehicleModal;
