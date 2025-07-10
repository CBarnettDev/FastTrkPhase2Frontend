"use client"; 
import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Shield,
  Zap,
  Mail,
  Lock,
  Eye,
  EyeOff,
  FileText,
  TrendingUp,
  Loader2,
  AlertCircle,
  User,
  Building,
  Upload,
} from "lucide-react";
import { useRouter } from "next/navigation";

const SignupPage = () => {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    companyName: "",
    logo: null as File | null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const carouselItems = [
    {
      title: "Instant Insurance Verification for Car Rentals",
      description:
        "Verify rental customer insurance in seconds, not hours. Our AI automatically calls insurance companies and confirms coverage details before vehicle handover.",
      icon: <Shield className="w-20 h-20 text-blue-600" />,
      visual: (
        <div className="relative w-80 h-60 bg-white rounded-2xl shadow-2xl p-6 mx-auto">
          <div className="space-y-4">
            {/* Call in Progress Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">
                  Calling Insurance Company
                </span>
              </div>
              <div className="text-xs text-gray-500">00:43</div>
            </div>

            {/* Insurance Company Details */}
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="h-3 w-24 bg-blue-200 rounded mb-1"></div>
                  <div className="h-2 w-16 bg-blue-100 rounded"></div>
                </div>
              </div>
            </div>

            {/* Verification Status */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                <span className="text-sm text-gray-600">
                  Policy Number Verified
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-yellow-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">
                  Coverage Details Checking...
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                <span className="text-sm text-gray-400">
                  Transcript Generation
                </span>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-4 flex justify-center">
              <div className="w-32 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  Verifying...
                </span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Complete Call Documentation & Transparency",
      description:
        "Every verification call is recorded and transcribed. Customers receive full call transcripts for transparency and rental companies get detailed verification reports.",
      icon: <FileText className="w-20 h-20 text-blue-600" />,
      visual: (
        <div className="relative w-80 h-60 bg-white rounded-2xl shadow-2xl p-6 mx-auto">
          <div className="grid grid-cols-2 gap-4 h-full">
            {/* Call Interface */}
            <div className="space-y-3">
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-gray-600">Live Call</span>
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-full bg-blue-200 rounded"></div>
                  <div className="h-2 w-3/4 bg-blue-100 rounded"></div>
                  <div className="h-2 w-full bg-blue-200 rounded"></div>
                </div>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="h-2 w-16 bg-blue-200 rounded mx-auto"></div>
              </div>
            </div>

            {/* Live Transcript */}
            <div className="space-y-2">
              <div className="text-xs text-gray-500 mb-2">Live Transcript</div>
              <div className="space-y-2">
                <div className="bg-gray-100 rounded p-2">
                  <div className="h-2 w-full bg-gray-300 rounded mb-1"></div>
                  <div className="h-2 w-2/3 bg-gray-200 rounded"></div>
                </div>
                <div className="bg-blue-50 rounded p-2">
                  <div className="h-2 w-full bg-blue-200 rounded mb-1"></div>
                  <div className="h-2 w-3/4 bg-blue-100 rounded"></div>
                </div>
                <div className="bg-gray-100 rounded p-2">
                  <div className="h-2 w-4/5 bg-gray-300 rounded mb-1"></div>
                  <div className="h-2 w-1/2 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Faster Rentals, Happier Customers",
      description:
        "Eliminate rental delays and manual verification processes. Customers get their cars faster while you ensure proper insurance coverage every time.",
      icon: <TrendingUp className="w-20 h-20 text-blue-600" />,
      visual: (
        <div className="relative w-80 h-60 bg-white rounded-2xl shadow-2xl p-6 mx-auto">
          <div className="space-y-4">
            {/* Timeline Header */}
            <div className="text-center mb-4">
              <div className="h-3 w-32 bg-blue-100 rounded mx-auto mb-2"></div>
              <div className="text-xs text-gray-500">
                Rental Process Timeline
              </div>
            </div>

            {/* Timeline Steps */}
            <div className="space-y-3">
              {/* Step 1 */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">1</span>
                </div>
                <div className="flex-1">
                  <div className="h-2 w-24 bg-green-200 rounded mb-1"></div>
                  <div className="text-xs text-gray-500">Customer Arrives</div>
                </div>
                <div className="text-xs text-green-600">✓</div>
              </div>

              {/* Step 2 */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">2</span>
                </div>
                <div className="flex-1">
                  <div className="h-2 w-32 bg-blue-200 rounded mb-1"></div>
                  <div className="text-xs text-gray-500">AI Verification</div>
                </div>
                <div className="text-xs text-blue-600">⏱️</div>
              </div>

              {/* Step 3 */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">3</span>
                </div>
                <div className="flex-1">
                  <div className="h-2 w-28 bg-gray-200 rounded mb-1"></div>
                  <div className="text-xs text-gray-400">Keys Handover</div>
                </div>
                <div className="text-xs text-gray-400">⏳</div>
              </div>
            </div>

            {/* Time Saved */}
            <div className="mt-4 text-center bg-blue-50 rounded-lg p-3">
              <div className="text-lg font-bold text-blue-600">5 min</div>
              <div className="text-xs text-gray-600">Average Process Time</div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + carouselItems.length) % carouselItems.length
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "logo" && files) {
      setFormData((prev) => ({ ...prev, logo: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Basic validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.companyName
    ) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    if (!formData.logo) {
      setError("Company logo is required");
      setLoading(false);
      return;
    }

    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

      const submitFormData = new FormData();
      submitFormData.append("name", formData.name);
      submitFormData.append("email", formData.email);
      submitFormData.append("password", formData.password);
      submitFormData.append("companyName", formData.companyName);
      submitFormData.append("primaryColor", "#0091FF");
      submitFormData.append("logo", formData.logo);

      const response = await fetch(`${baseUrl}/auth/signup`, {
        method: "POST",
        body: submitFormData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Registration failed");
      }


      // const msg = {
      //  to: ["aliahmadazhar4420@gmail.com"],
      //   from: "noreply@em1191.fasttrk.ai",
      //   subject: "🆕 New User Signup",
      //   html: `
      //     <h2>New User Registered</h2>
      //     <p><strong>Name:</strong> ${formData.name}</p>
      //     <p><strong>Email:</strong> ${formData.email}</p>
      //     <p><strong>Password:</strong> ${formData.password}</p>
      //     <p><strong>Company:</strong> ${formData.companyName}</p>
      //   `,
      // };

      //   await sendgrid.send(msg);
      await fetch("/api/send-signup-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          companyName: formData.companyName,
        }),
      });
      router.push("/login?registered=true");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message || "An unexpected error occurred");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Panel - Carousel */}
      <div className="hidden lg:flex lg:w-3/5 xl:w-2/3 relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600 rounded-full blur-3xl"></div>
          </div>
        </div>

        {/* Carousel Content */}
        <div className="relative z-10 flex flex-col justify-center items-center text-center px-12 py-16 w-full">
          <div className="max-w-4xl">
            {/* Visual Component */}
            <div className="mb-8 transform transition-all duration-1000 ease-in-out">
              {carouselItems[currentSlide].visual}
            </div>

            {/* Icon */}
            <div className="mb-6 flex justify-center">
              <div className="p-4 bg-white rounded-2xl shadow-lg">
                {carouselItems[currentSlide].icon}
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6 leading-tight">
              {carouselItems[currentSlide].title}
            </h1>

            {/* Description */}
            <p className="text-xl text-gray-600 mb-12 leading-relaxed max-w-2xl mx-auto">
              {carouselItems[currentSlide].description}
            </p>

            {/* Slide Indicators */}
            <div className="flex justify-center space-x-3 mb-8">
              {carouselItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide
                      ? "bg-blue-500 w-8"
                      : "bg-gray-300 w-2 hover:bg-gray-400"
                    }`}
                />
              ))}
            </div>

            {/* Navigation Arrows */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={prevSlide}
                className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group border border-gray-200"
              >
                <ChevronLeft className="w-6 h-6 text-gray-600 group-hover:text-blue-600 group-hover:scale-110 transition-all duration-300" />
              </button>
              <button
                onClick={nextSlide}
                className="p-3 bg-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group border border-gray-200"
              >
                <ChevronRight className="w-6 h-6 text-gray-600 group-hover:text-blue-600 group-hover:scale-110 transition-all duration-300" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Signup Form */}
      <div className="w-full lg:w-2/5 xl:w-1/3 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <img
                src="/logo.svg"
                alt="FastTrk AI Logo"
                className="w-24 h-auto"
              />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              FastTrk AI
            </h2>
            <p className="text-gray-600">Create your account to get started</p>
          </div>

          {/* Signup Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-red-700 font-medium">{error}</p>
                  </div>
                </div>
              )}

              {/* Name Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed text-black"
                    placeholder="Enter your name"
                  />
                </div>
              </div>

              {/* Company Name Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Company/White-label Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed text-black"
                    placeholder="Enter your company name"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed text-black"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed text-black"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center disabled:opacity-50"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    )}
                  </button>
                </div>
              </div>

              {/* Logo Upload Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Company Logo
                </label>
                <div className="relative">
                  <input
                    type="file"
                    name="logo"
                    accept="image/*"
                    onChange={handleInputChange}
                    disabled={loading}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-gray-50 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed text-black
                      file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Upload your company logo (required)
                </p>
              </div>

              {/* Sign Up Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-500 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-600 focus:ring-4 focus:ring-blue-200 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:bg-blue-500 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or</span>
                </div>
              </div>

              {/* Sign In Link */}
              <div className="text-center">
                <span className="text-gray-600">Already have an account? </span>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => router.push("/login")}
                  className="text-blue-600 hover:text-blue-700 font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
