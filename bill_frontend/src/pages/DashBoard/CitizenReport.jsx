import {
  Calendar,
  Camera,
  Check,
  Loader2,
  MapPin,
  Upload,
  Video,
  X,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../middleware/AuthController";
import { reportApi } from "../../api/report.api";

function CitizenReport({ open, onOpenChange, onSuccess }) {
  const { authenticated, user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    coordinates: { lat: "", lng: "" },
  });
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!authenticated) {
      setError("You must be logged in to submit a report");
      setIsLoading(false);
      return;
    }

    if (!formData.title || !formData.description || !formData.location) {
      setError("Please fill in all required fields");
      setIsLoading(false);
      return;
    }

    if (files.length === 0) {
      setError("Please upload at least one image or video");
      setIsLoading(false);
      return;
    }

    try {
      const formPayload = new FormData();
      formPayload.append("title", formData.title);
      formPayload.append("description", formData.description);
      formPayload.append("location", formData.location);
      formPayload.append("date", new Date().toISOString().split("T")[0]);
      formPayload.append("latitude", formData.coordinates.lat?.toString() || "");
      formPayload.append("longitude", formData.coordinates.lng?.toString() || "");
      files.forEach((file) => {
        formPayload.append("photo", file);
      });

      console.log("📤 Step 1: AI Analysis...");
      const aiResponse = await reportApi.analyzeImages(formPayload);
      console.log("✅ AI Response received:", aiResponse);
      
      if (!aiResponse || !aiResponse.success || !aiResponse.finalRisk) {
        throw new Error(aiResponse?.error || "AI analysis failed to provide a valid risk assessment.");
      }

      const { finalRisk } = aiResponse;
      const extractedText = finalRisk.extractedText || "";
      const category = finalRisk.category || "Uncategorized";
      const riskLevel = finalRisk.riskLevel || "Low";
      const riskPercentage = finalRisk.riskPercentage || 0;
      const riskReason = finalRisk.riskReason || "";

      // Step 2: DB Submission
      console.log("📤 Step 2: DB Submission...");
      const dbPayload = new FormData();
      // citizenId is now handled by backend token, but we'll still send it for legacy support
      dbPayload.append("citizenId", user?.id || "1");
      dbPayload.append("title", formData.title);
      dbPayload.append("description", formData.description);
      dbPayload.append("location", formData.location);
      dbPayload.append("date", new Date().toISOString().split("T")[0]);
      
      if (formData.coordinates.lat && formData.coordinates.lng) {
        dbPayload.append("latitude", formData.coordinates.lat.toString());
        dbPayload.append("longitude", formData.coordinates.lng.toString());
      }
      
      files.forEach((file) => {
        dbPayload.append("photo", file);
      });

      dbPayload.append("extractedText", extractedText);
      dbPayload.append("category", category);
      dbPayload.append("riskLevel", riskLevel);
      dbPayload.append("riskPercentage", riskPercentage);
      dbPayload.append("riskReason", riskReason);

      const submitResponse = await reportApi.createReport(dbPayload);
      console.log("✅ Report submitted successfully:", submitResponse);

      setSuccess(true);
      if (onSuccess) onSuccess();
      setTimeout(() => {
        setSuccess(false);
        setFormData({
          title: "",
          description: "",
          location: "",
          coordinates: { lat: "", lng: "" },
        });
        setFiles([]);
        onOpenChange(false);
      }, 1500);
    } catch (err) {
      console.error("Submission Error:", err);
      setError(err.response?.data?.error || "Failed to submit report. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    const validFiles = selectedFiles.filter((file) => {
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");
      const isValidSize = file.size <= 10 * 1024 * 1024;
      return (isImage || isVideo) && isValidSize;
    });

    setFiles((prev) => [...prev, ...validFiles].slice(0, 5));
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleLocationDetect = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData((prev) => ({
            ...prev,
            coordinates: { lat: latitude.toString(), lng: longitude.toString() },
          }));
        },
        (error) => {
          console.error("Error getting location:", error);
          setError("Unable to detect location. Please enter manually.");
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "lat" || name === "lng") {
      setFormData((prev) => ({
        ...prev,
        coordinates: { ...prev.coordinates, [name]: value },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  if (success) {
    return (
      <div
        className={`fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        <div className="bg-gradient-to-b from-[#1A1A1A] to-[#0A0A0A] p-8 rounded-2xl shadow-2xl max-w-md w-full border border-[#2D2D2D]/50 transform transition-all duration-300 scale-100 sm:scale-105">
          <div className="text-center py-6">
            <div className="mx-auto flex items-center justify-center w-14 h-14 rounded-full bg-green-900/20 mb-4 border border-green-500/30">
              <Check className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-100 mb-2">
              Report Submitted Successfully!
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              Your violation report has been submitted and will be reviewed by authorities.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
    >
      <div className="bg-gradient-to-b from-[#1A1A1A] to-[#0A0A0A] rounded-2xl shadow-2xl w-full max-w-lg sm:max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 border border-[#2D2D2D]/50 transform transition-all duration-300 scale-100 sm:scale-100">
        <div className="space-y-5">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 tracking-tight">
            Report Billboard Violation
          </h2>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            Help keep your city compliant by reporting unauthorized or non-compliant billboards. Our AI will analyze the images to detect violations.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6 sm:mt-8">
          {error && (
            <div className="bg-red-900/20 border border-red-500/30 text-red-300 p-4 rounded-lg">
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Title */}
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="text-sm font-medium text-gray-200"
            >
              Report Title *
            </label>
            <input
              id="title"
              name="title"
              placeholder="Brief description of the violation"
              value={formData.title}
              onChange={handleChange}
              required
              disabled={isLoading}
              className="w-full p-3 bg-[#0A0A0A]/80 border border-[#2D2D2D]/50 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
            />
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">
              Upload Images/Videos *
            </label>
            <div className="border-2 border-dashed border-[#2D2D2D]/50 rounded-lg p-6 sm:p-8 text-center hover:border-blue-500/50 transition-colors duration-200">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <label htmlFor="file-upload" className="cursor-pointer">
                  <span className="mt-2 block text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors duration-200">
                    Click to upload files
                  </span>
                  <span className="mt-1 block text-xs text-gray-400">
                    PNG, JPG, MP4 up to 10MB (max 5 files)
                  </span>
                  <span className="mt-1 block text-xs text-blue-300">
                    AI will analyze images to detect violations
                  </span>
                </label>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isLoading}
                />
              </div>
            </div>

            {files.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="relative bg-[#0A0A0A]/80 border border-[#2D2D2D]/50 rounded-lg p-2 hover:border-gray-500/50 transition-colors duration-200"
                  >
                    <div className="aspect-video bg-gray-800/50 rounded flex items-center justify-center relative">
                      {file.type.startsWith("image/") ? (
                        <Camera className="h-8 w-8 text-gray-400" />
                      ) : (
                        <Video className="h-8 w-8 text-gray-400" />
                      )}
                      <button
                        type="button"
                        className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors duration-200"
                        onClick={() => removeFile(index)}
                        disabled={isLoading}
                      >
                        <X className="h-3 w-3 text-white" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 truncate">
                      {file.name}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="location"
              className="text-sm font-medium text-gray-200"
            >
              Address *
            </label>
            <input
              id="location"
              name="location"
              placeholder="Enter address"
              value={formData.location}
              onChange={handleChange}
              required
              disabled={isLoading}
              className="w-full p-3 bg-[#0A0A0A]/80 border border-[#2D2D2D]/50 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">
              Coordinates
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <label
                    htmlFor="lat"
                    className="text-xs font-medium text-gray-300"
                  >
                    Latitude
                  </label>
                  <input
                    id="lat"
                    name="lat"
                    type="number"
                    step="any"
                    placeholder="Enter latitude"
                    value={formData.coordinates.lat}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="w-full p-3 bg-[#0A0A0A]/80 border border-[#2D2D2D]/50 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleLocationDetect}
                  disabled={isLoading}
                  className="p-3 bg-[#0A0A0A]/80 border border-[#2D2D2D]/50 rounded-lg text-blue-400 hover:text-blue-300 hover:border-blue-500/50 transition-colors duration-200"
                >
                  <MapPin className="h-5 w-5" />
                </button>
              </div>
              <div>
                <label
                  htmlFor="lng"
                  className="text-xs font-medium text-gray-300"
                >
                  Longitude
                </label>
                <input
                  id="lng"
                  name="lng"
                  type="number"
                  step="any"
                  placeholder="Enter longitude"
                  value={formData.coordinates.lng}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full p-3 bg-[#0A0A0A]/80 border border-[#2D2D2D]/50 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">
              Timestamp
            </label>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Calendar className="h-5 w-5" />
              <span>{new Date().toLocaleString()}</span>
              <span className="text-xs">(Auto-filled)</span>
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="description"
              className="text-sm font-medium text-gray-200"
            >
              Detailed Description *
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Provide detailed information about the violation, including specific concerns and observations..."
              value={formData.description}
              onChange={handleChange}
              rows={5}
              required
              disabled={isLoading}
              className="w-full p-3 bg-[#0A0A0A]/80 border border-[#2D2D2D]/50 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-200 resize-y"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="px-4 sm:px-6 py-2 text-sm font-medium text-gray-300 hover:text-gray-100 bg-[#0A0A0A]/80 hover:bg-[#0A0A0A] rounded-lg transition-colors duration-200 border border-[#2D2D2D]/50 hover:border-gray-500/50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 sm:px-6 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors duration-200 border border-blue-500/50 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Report"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CitizenReport;