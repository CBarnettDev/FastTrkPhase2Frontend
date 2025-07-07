"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Row, Space, Table, Typography } from "antd";
import AddVehicleModal from "@/app/components/Modals/AddVehicleModal";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import ConfirmationModal from "@/app/components/Modals/ConfirmationModal";

// Define the Vehicle type
type Vehicle = {
  id: number;
  model: string;
  name: string;
  price: number;
  userId: number;
  createdAt: string;
};

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<number | null>(
    null
  );

  const fetchVehicles = async () => {
    setLoading(true);
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
    try {
      const response = await fetch(`${baseUrl}/vehicles`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch vehicles");
      }

      const data = await response.json();
      setVehicles(data);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleDelete = async (id: number) => {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
    try {
      const response = await fetch(`${baseUrl}/vehicles/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete vehicle");
      }

      // Refresh the list by fetching latest data
      fetchVehicles();
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Model",
      dataIndex: "model",
      key: "model",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Vehicle) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedVehicleId(record.id);
              setIsEdit(true);
              setVisible(true);
            }}
            type="text"
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => {
              setSelectedVehicleId(record.id);
              setDeleteModalVisible(true);
            }}
            type="text"
            danger
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex justify-center bg-gray-50 p-4">
      <div className="w-full max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Your Vehicles</h1>
            <button
              onClick={() => setVisible(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors cursor-pointer"
            >
              Add Vehicle
            </button>
          </div>

          {/* Your existing vehicle list/grid content would go here */}
          <Table
            dataSource={vehicles}
            columns={columns}
            pagination={{ pageSize: 10 }}
            rowKey="id"
            style={{
              background: "white",
              borderRadius: "8px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          />
          <AddVehicleModal
            visible={visible}
            onCancel={() => {
              setVisible(false);
              setIsEdit(false);
              setSelectedVehicleId(null);
            }}
            onSuccess={() => {
              setVisible(false);
              setIsEdit(false);
              setSelectedVehicleId(null);
              fetchVehicles();
            }}
            isEdit={isEdit}
            selectedVehicleId={selectedVehicleId}
          />
          <ConfirmationModal
            isOpen={deleteModalVisible}
            title="Confirm Deletion"
            message="Are you sure you want to delete this vehicle?"
            confirmButtonText="Delete"
            cancelButtonText="Cancel"
            onConfirm={() => {
              if (selectedVehicleId) {
                handleDelete(selectedVehicleId);
              }
              setDeleteModalVisible(false);
            }}
            onCancel={() => setDeleteModalVisible(false)}
          />
        </div>
      </div>
    </div>
  );
}
