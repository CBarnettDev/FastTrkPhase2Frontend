"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  CheckCircle,
  FileText,
  Phone,
  AlertCircle,
  RotateCcw,
  User,
  Calendar,
  Car,
  Shield,
  Hash,
  MapPin,
  CreditCard,
  Loader2,
} from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

// Define the Vehicle type
type Vehicle = {
  id: string;
  description: string;
  createdAt?: string;
};

type ApiResponseServer = {
  callCompleted: boolean;
  success: string;
  callSummary?: string;
  transcription?: string;
};

type ApiResponse = {
  callCompleted: boolean;
  success: boolean;
  callSummary?: string;
  transcription?: string;
  errorMessage?: string;
};

type StartCallResponse = {
  success: boolean;
  callId?: string;
  errorMessage?: string;
};

export default function InsuranceVerificationForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [user, setUser, isUserLoading] = useLocalStorage("user", {
    id: "",
    companyName: "",
    email: "",
  });

  // Add vehicles state
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehiclesLoading, setVehiclesLoading] = useState(false);
  const [vehiclesError, setVehiclesError] = useState("");

  const [formData, setFormData] = useState({
    to: "",
    customerName: "",
    vehicleName: "",
    rentalStartDate: "",
    rentalDays: "",
    state: "",
    driverLicense: "",
    insuranceProvider: "",
    policyNumber: "",
    policyRegistrationPhone: "",
  });

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [callId, setCallId] = useState<string | null>(null);

  // Use useRef for polling interval to persist across re-renders
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch vehicles when component mounts or user changes
  useEffect(() => {
    const fetchVehicles = async () => {
      if (!user?.id) {
        setVehiclesLoading(false);
        return;
      }

      try {
        setVehiclesLoading(true);
        const baseUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
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
        const vehiclesData: Vehicle[] = data.map((vehicle: any) => ({
          id: vehicle.id,
          description: `${vehicle.model} ${vehicle.name} ${vehicle.price}$`,
        }));
        setVehicles(vehiclesData);
      } catch (err: unknown) {
        setVehiclesError(
          err instanceof Error ? err.message : "An unknown error occurred"
        );
      } finally {
        setVehiclesLoading(false);
      }
    };

    fetchVehicles();
  }, [user?.id]);

  // Cleanup polling interval on component unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Function to poll get-response API
  const pollResponse = async (callId: string) => {
    try {
      const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
      const res = await fetch(
        `${baseUrl}/get-response?callId=${callId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.ok) {
        const responseData: ApiResponseServer = await res.json();

        if (responseData.callCompleted) {
          // Stop polling
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }

          if (responseData.success === "completed") {
            setApiResponse({
              callCompleted: true,
              success: true,
              callSummary:
                responseData.callSummary ||
                "Verification completed successfully.",
              transcription:
                responseData.transcription || "Transcription not available.",
            });
            setStatus("success");
          } else {
            setStatus("error");

            const status = responseData.success;
            let errorMessage = "";

            switch (status) {
              case "busy":
                errorMessage =
                  "The line is currently busy. Please try again in a few minutes.";
                break;
              case "failed":
                errorMessage =
                  "The call could not be completed due to a technical issue. Please check your connection and try again.";
                break;
              case "no-answer":
                errorMessage =
                  "No one answered the call. Please try again later or contact them through an alternative method.";
                break;
              case "canceled":
                errorMessage =
                  "The call was canceled before connecting. You can try calling again when ready.";
                break;
              default:
                errorMessage =
                  "Verification failed. Please try again or contact FastTrk AI Support.";
            }

            setApiResponse({
              callCompleted: true,
              success: false,
              errorMessage: errorMessage,
            });
          }
          setCurrentStep(3);
        }
        // If callCompleted is false, continue polling (interval will handle this)
      } else {
        console.error("Failed to poll response:", res.statusText);
        // Continue polling even if individual request fails
      }
    } catch (err) {
      console.error("Error polling response:", err);
      // Continue polling even if individual request fails
    }
  };

  const handleSubmit = async () => {
    // Validate form
    if (
      !formData.customerName ||
      !formData.vehicleName ||
      !formData.rentalStartDate ||
      !formData.rentalDays ||
      !formData.state ||
      !formData.driverLicense ||
      !formData.insuranceProvider ||
      !formData.policyNumber ||
      !formData.to
    ) {
      alert("Please fill in all fields");
      return;
    }

    setStatus("loading");

    try {
      const postObj = {
        ...formData,
        userId: user.id, // Include user ID in the request
        companyName: user.companyName || "", // Include company name
        companyEmail: user.email || "", // Include company email
      };

      // First, call start-call to get the unique ID
      const baseUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";
      const res = await fetch(
        `${baseUrl}/start-call`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(postObj),
        }
      );

      if (res.ok) {
        const startCallResponse: StartCallResponse = await res.json();

        if (startCallResponse.success && startCallResponse.callId) {
          // Got the call ID, now move to step 2 and start polling
          setCallId(startCallResponse.callId);
          setCurrentStep(2);

          // Start polling every 10 seconds
          pollingIntervalRef.current = setInterval(() => {
            pollResponse(startCallResponse.callId!);
          }, 10000);

          // Also call immediately
          pollResponse(startCallResponse.callId);
        } else {
          // Handle error from start-call
          setStatus("error");
          setApiResponse({
            callCompleted: true,
            success: false,
            errorMessage:
              startCallResponse.errorMessage ||
              "Failed to start verification call. Please try again.",
          });
          setCurrentStep(3);
        }
      } else {
        setStatus("error");
        setApiResponse({
          callCompleted: true,
          success: false,
          errorMessage:
            "Failed to start verification call. Please try again or contact FastTrk AI Support.",
        });
        setCurrentStep(3);
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
      setApiResponse({
        callCompleted: true,
        success: false,
        errorMessage:
          "Network error occurred while trying to start verification. Please check your connection and try again.",
      });
      setCurrentStep(3);
    }
  };

  const resetForm = () => {
    // Clear any existing polling interval
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }

    setFormData({
      to: "",
      customerName: "",
      vehicleName: "",
      rentalStartDate: "",
      rentalDays: "",
      state: "",
      driverLicense: "",
      insuranceProvider: "",
      policyNumber: "",
      policyRegistrationPhone: "",
    });
    setStatus("idle");
    setCurrentStep(1);
    setApiResponse(null);
    setCallId(null);
  };

  const steps = [
    { number: 1, title: "Details", icon: FileText },
    { number: 2, title: "Processing", icon: Loader2 },
    { number: 3, title: "Results", icon: CheckCircle },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Phone className="h-8 w-8 text-blue-600 mr-2" />
            <h1 className="text-3xl font-bold text-gray-900">
              FastTrk AI Insurance Verification
            </h1>
          </div>
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-orange-100 text-orange-700 text-sm font-medium">
            <AlertCircle className="h-4 w-4 mr-2" />
            Beta Version !
          </div>
        </div>

        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;

              return (
                <div key={step.number} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                      isActive
                        ? "bg-blue-600 border-blue-600 text-white"
                        : isCompleted
                        ? "bg-green-600 border-green-600 text-white"
                        : "bg-white border-gray-300 text-gray-500"
                    }`}
                  >
                    <Icon
                      className={`h-6 w-6 ${
                        isActive && step.number === 2 ? "animate-spin" : ""
                      }`}
                    />
                  </div>
                  <div className="ml-3">
                    <div
                      className={`text-sm font-medium ${
                        isActive
                          ? "text-blue-600"
                          : isCompleted
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      Step {step.number}
                    </div>
                    <div
                      className={`text-xs ${
                        isActive
                          ? "text-blue-600"
                          : isCompleted
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      {step.title}
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-16 h-0.5 ml-6 ${
                        isCompleted ? "bg-green-600" : "bg-gray-300"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Step 1: Form */}
          {currentStep === 1 && (
            <div className="p-8">
              <div className="text-center mb-6">
                <FileText className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Enter Verification Details
                </h2>
                <p className="text-gray-600">
                  Please provide the information below to start the insurance
                  verification process
                </p>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="customerName"
                      className="flex items-center text-sm font-medium text-gray-700 mb-2"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Customer Name
                    </label>
                    <input
                      id="customerName"
                      name="customerName"
                      type="text"
                      placeholder="Enter customer name"
                      value={formData.customerName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="vehicleName"
                      className="flex items-center text-sm font-medium text-gray-700 mb-2"
                    >
                      <Car className="h-4 w-4 mr-2" />
                      Vehicle
                    </label>
                    <select
                      id="vehicleName"
                      name="vehicleName"
                      value={formData.vehicleName}
                      onChange={handleChange}
                      required
                      disabled={vehiclesLoading}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 transition-colors"
                    >
                      <option key="default" value="">
                        {vehiclesLoading
                          ? "Loading vehicles..."
                          : "Select Vehicle"}
                      </option>
                      {vehicles.map((vehicle) => (
                        <option key={vehicle.id} value={vehicle.description}>
                          {vehicle.description}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor="rentalStartDate"
                      className="flex items-center text-sm font-medium text-gray-700 mb-2"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Rental Start Date
                    </label>
                    <input
                      id="rentalStartDate"
                      name="rentalStartDate"
                      type="date"
                      value={formData.rentalStartDate}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="rentalDays"
                      className="flex items-center text-sm font-medium text-gray-700 mb-2"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Rental Days
                    </label>
                    <input
                      id="rentalDays"
                      name="rentalDays"
                      type="number"
                      placeholder="Number of days"
                      value={formData.rentalDays}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="state"
                      className="flex items-center text-sm font-medium text-gray-700 mb-2"
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      State
                    </label>
                    <input
                      id="state"
                      name="state"
                      type="text"
                      placeholder="Enter state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="driverLicense"
                      className="flex items-center text-sm font-medium text-gray-700 mb-2"
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Driver License Number
                    </label>
                    <input
                      id="driverLicense"
                      name="driverLicense"
                      type="text"
                      placeholder="Enter driver license number"
                      value={formData.driverLicense}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="insuranceProvider"
                      className="flex items-center text-sm font-medium text-gray-700 mb-2"
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Insurance Provider
                    </label>
                    <input
                      id="insuranceProvider"
                      name="insuranceProvider"
                      type="text"
                      placeholder="Enter insurance provider"
                      value={formData.insuranceProvider}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="policyNumber"
                      className="flex items-center text-sm font-medium text-gray-700 mb-2"
                    >
                      <Hash className="h-4 w-4 mr-2" />
                      Policy Number
                    </label>
                    <input
                      id="policyNumber"
                      name="policyNumber"
                      type="text"
                      placeholder="Enter policy number"
                      value={formData.policyNumber}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>{" "}
                  <div>
                    <label
                      htmlFor="to"
                      className="flex items-center text-sm font-medium text-gray-700 mb-2"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Insurance Phone Number
                    </label>
                    <input
                      id="to"
                      name="to"
                      type="tel"
                      placeholder="Enter insurance phone number"
                      value={formData.to}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="policyRegistrationPhone"
                      className="flex items-center text-sm font-medium text-gray-700 mb-2"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Policy Registration Phone Number
                    </label>
                    <input
                      id="policyRegistrationPhone"
                      name="policyRegistrationPhone"
                      type="tel"
                      placeholder="Enter policy registration phone number"
                      value={formData.policyRegistrationPhone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleSubmit}
                    disabled={status === "loading"}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center cursor-pointer disabled:cursor-not-allowed"
                  >
                    {status === "loading" ? (
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    ) : (
                      <Phone className="h-5 w-5 mr-2" />
                    )}
                    {status === "loading"
                      ? "Starting..."
                      : "Start Verification Call"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Processing */}
          {currentStep === 2 && (
            <div className="p-8 text-center">
              <div className="py-12">
                <Loader2 className="h-16 w-16 text-blue-600 mx-auto mb-6 animate-spin" />
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Processing Verification
                </h2>
                <p className="text-gray-600 mb-8">
                  Our AI is calling your insurance provider to verify coverage
                  details. This may take a few moments.
                </p>
                <div className="max-w-md mx-auto">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full animate-pulse"
                      style={{ width: "60%" }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Connected to {formData.insuranceProvider}...
                  </p>
                  {callId && (
                    <p className="text-xs text-gray-400 mt-1">
                      Call ID: {callId}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Results */}
          {currentStep === 3 && (
            <div className="p-8">
              <div className="text-center mb-6">
                {status === "success" ? (
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
                ) : (
                  <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-3" />
                )}
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {status === "success"
                    ? "Verification Successful"
                    : "Verification Failed"}
                </h2>
                <p className="text-gray-600">
                  {status === "success"
                    ? "Insurance coverage has been successfully verified"
                    : "We encountered an issue while verifying insurance coverage"}
                </p>
              </div>

              {status === "success" && apiResponse && (
                <div className="space-y-6">
                  {/* Call Summary */}
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-green-800 mb-3 flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Call Summary
                    </h3>
                    <div className="bg-white rounded-lg p-4 max-h-48 overflow-y-auto">
                      <p className="text-gray-700 leading-relaxed">
                        {apiResponse.callSummary}
                      </p>
                    </div>
                  </div>

                  {/* Transcription */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      Call Transcription
                    </h3>
                    <div className="bg-white rounded-lg p-4 max-h-64 overflow-y-auto">
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono leading-relaxed">
                        {apiResponse.transcription}
                      </pre>
                    </div>
                  </div>
                </div>
              )}

              {status === "error" && apiResponse && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-red-800 mb-3 flex items-center">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    Error Details
                  </h3>
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-gray-700">{apiResponse.errorMessage}</p>
                  </div>
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={resetForm}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center justify-center cursor-pointer"
                >
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Start New Verification
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
