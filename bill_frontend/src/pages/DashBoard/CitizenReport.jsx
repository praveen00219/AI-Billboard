import {
  Calendar,
  Check,
  Loader2,
  LocateFixed,
  Sparkles,
  Upload,
  Video,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { useAuth } from "../../middleware/AuthController";
import { reportApi } from "../../api/report.api";
import { useGeolocation } from "../../hooks/useGeolocation";

const EASE = [0.16, 1, 0.3, 1];
const MAX_FILES = 5;
const inputBase =
  "w-full p-3 bg-black/40 border border-white/10 rounded-xl text-gray-100 placeholder-gray-500 focus:outline-none focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/20 transition-all duration-200 disabled:opacity-50";

/** Small "Generate with AI" pill — module-scoped to avoid remounts on re-render. */
function AiGenButton({ onClick, busy, disabled, label, hint, loadingLabel }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={hint || label}
      aria-label={label}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-brand-200 bg-brand-500/10 border border-brand-500/25 hover:bg-brand-500/20 hover:border-brand-500/40 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
      {busy ? loadingLabel : "Generate with AI"}
    </button>
  );
}

function CitizenReport({ open, onOpenChange, onSuccess }) {
  const { authenticated, user } = useAuth();
  const geo = useGeolocation();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    coordinates: { lat: "", lng: "" },
  });
  const [items, setItems] = useState([]); // { id, file, url, isImage }
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // AI generation state
  const [titleGenerating, setTitleGenerating] = useState(false);
  const [descGenerating, setDescGenerating] = useState(false);
  const [aiError, setAiError] = useState("");
  const aiCache = useRef({ key: null, draft: null });

  const itemsRef = useRef(items);
  itemsRef.current = items;
  const titleRef = useRef(null);
  const openerRef = useRef(null);

  const hasImage = items.some((i) => i.isImage);
  const imageKey = useMemo(
    () => items.filter((i) => i.isImage).map((i) => i.id).join("|"),
    [items]
  );

  // ── Open/close side-effects: focus, ESC, scroll lock, restore focus ─────────
  useEffect(() => {
    if (!open) return;
    openerRef.current = document.activeElement;
    const t = setTimeout(() => titleRef.current?.focus(), 60);
    const onKey = (e) => {
      if (e.key === "Escape" && !isLoading) onOpenChange(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, isLoading, onOpenChange]);

  useEffect(() => {
    if (!open && openerRef.current?.focus) openerRef.current.focus();
  }, [open]);

  // Revoke any object URLs on unmount to avoid memory leaks
  useEffect(() => () => itemsRef.current.forEach((i) => URL.revokeObjectURL(i.url)), []);

  // ── File handling ───────────────────────────────────────────────────────────
  const handleFileUpload = (e) => {
    const selected = Array.from(e.target.files || []);
    const valid = selected.filter(
      (f) =>
        (f.type.startsWith("image/") || f.type.startsWith("video/")) &&
        f.size <= 10 * 1024 * 1024
    );
    if (valid.length < selected.length) {
      setError("Some files were skipped — only images/videos up to 10MB are allowed.");
    } else {
      setError("");
    }
    setItems((prev) => {
      const room = MAX_FILES - prev.length;
      const toAdd = valid.slice(0, Math.max(0, room)).map((f) => ({
        id: `${f.name}-${f.size}-${Math.random().toString(36).slice(2, 8)}`,
        file: f,
        url: URL.createObjectURL(f),
        isImage: f.type.startsWith("image/"),
      }));
      return [...prev, ...toAdd];
    });
    e.target.value = ""; // allow re-selecting the same file
  };

  const removeItem = (id) => {
    setItems((prev) => {
      const it = prev.find((x) => x.id === id);
      if (it) URL.revokeObjectURL(it.url);
      return prev.filter((x) => x.id !== id);
    });
    aiCache.current = { key: null, draft: null };
  };

  // ── AI draft (title + description) ───────────────────────────────────────────
  const ensureDraft = async () => {
    if (aiCache.current.draft && aiCache.current.key === imageKey) {
      return aiCache.current.draft;
    }
    const firstImage = items.find((i) => i.isImage);
    if (!firstImage) throw new Error("Please upload an image before generating AI content.");
    const fd = new FormData();
    fd.append("photo", firstImage.file);
    const res = await reportApi.generateDraft(fd);
    if (!res?.success || !res.draft) throw new Error(res?.error || "AI generation failed.");
    aiCache.current = { key: imageKey, draft: res.draft };
    return res.draft;
  };

  const handleGenerateTitle = async () => {
    setAiError("");
    setTitleGenerating(true);
    try {
      const draft = await ensureDraft();
      if (draft.title) setFormData((p) => ({ ...p, title: draft.title }));
    } catch (err) {
      setAiError(err.response?.data?.error || err.message);
    } finally {
      setTitleGenerating(false);
    }
  };

  const handleGenerateDescription = async () => {
    setAiError("");
    setDescGenerating(true);
    try {
      const draft = await ensureDraft();
      if (draft.description) setFormData((p) => ({ ...p, description: draft.description }));
    } catch (err) {
      setAiError(err.response?.data?.error || err.message);
    } finally {
      setDescGenerating(false);
    }
  };

  // ── Location ─────────────────────────────────────────────────────────────────
  const handleUseLocation = async () => {
    const c = await geo.getLocation();
    if (c) {
      setFormData((p) => ({
        ...p,
        coordinates: { lat: c.lat.toFixed(6), lng: c.lng.toFixed(6) },
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "lat" || name === "lng") {
      setFormData((prev) => ({ ...prev, coordinates: { ...prev.coordinates, [name]: value } }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const resetForm = () => {
    itemsRef.current.forEach((i) => URL.revokeObjectURL(i.url));
    setItems([]);
    setFormData({ title: "", description: "", location: "", coordinates: { lat: "", lng: "" } });
    aiCache.current = { key: null, draft: null };
  };

  // ── Submit (unchanged 2-step flow: AI analysis → DB) ─────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!authenticated) return setError("You must be logged in to submit a report");
    if (!formData.title || !formData.description || !formData.location) {
      return setError("Please fill in all required fields");
    }
    if (items.length === 0) return setError("Please upload at least one image or video");

    setIsLoading(true);
    const files = items.map((i) => i.file);
    try {
      const analysisPayload = new FormData();
      analysisPayload.append("title", formData.title);
      analysisPayload.append("description", formData.description);
      analysisPayload.append("location", formData.location);
      analysisPayload.append("date", new Date().toISOString().split("T")[0]);
      analysisPayload.append("latitude", formData.coordinates.lat?.toString() || "");
      analysisPayload.append("longitude", formData.coordinates.lng?.toString() || "");
      files.forEach((file) => analysisPayload.append("photo", file));

      const aiResponse = await reportApi.analyzeImages(analysisPayload);
      if (!aiResponse?.success || !aiResponse.finalRisk) {
        throw new Error(aiResponse?.error || "AI analysis failed to provide a valid risk assessment.");
      }

      const { finalRisk } = aiResponse;
      const dbPayload = new FormData();
      dbPayload.append("citizenId", user?.id || "1");
      dbPayload.append("title", formData.title);
      dbPayload.append("description", formData.description);
      dbPayload.append("location", formData.location);
      dbPayload.append("date", new Date().toISOString().split("T")[0]);
      if (formData.coordinates.lat && formData.coordinates.lng) {
        dbPayload.append("latitude", formData.coordinates.lat.toString());
        dbPayload.append("longitude", formData.coordinates.lng.toString());
      }
      files.forEach((file) => dbPayload.append("photo", file));
      dbPayload.append("extractedText", finalRisk.extractedText || "");
      dbPayload.append("category", finalRisk.category || "Uncategorized");
      dbPayload.append("riskLevel", finalRisk.riskLevel || "Low");
      dbPayload.append("riskPercentage", finalRisk.riskPercentage || 0);
      dbPayload.append("riskReason", finalRisk.riskReason || "");

      await reportApi.createReport(dbPayload);

      setSuccess(true);
      if (onSuccess) onSuccess();
      setTimeout(() => {
        setSuccess(false);
        resetForm();
        onOpenChange(false);
      }, 1600);
    } catch (err) {
      console.error("Submission Error:", err);
      setError(err.response?.data?.error || "Failed to submit report. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const aiHint = hasImage ? "" : "Please upload an image before generating AI content.";

  return (
    <AnimatePresence>
      {open && (
        <MotionConfig reducedMotion="user">
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
              aria-hidden="true"
              onClick={() => !isLoading && onOpenChange(false)}
            />

            {/* Panel */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="cr-title"
              aria-describedby="cr-desc"
              aria-busy={isLoading}
              initial={{ opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.98 }}
              transition={{ duration: 0.28, ease: EASE }}
              className="relative w-full max-w-lg sm:max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl border border-white/10 bg-gradient-to-b from-ink-850 to-ink-950 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)] p-6 sm:p-8"
            >
              {success ? (
                <div className="text-center py-10" aria-live="assertive">
                  <motion.div
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/15 mb-5 border border-emerald-500/30"
                  >
                    <Check className="w-9 h-9 text-emerald-400" />
                  </motion.div>
                  <h3 className="font-display text-2xl font-bold text-white mb-2">Report submitted!</h3>
                  <p className="text-sm text-gray-400 max-w-sm mx-auto">
                    Your violation report has been recorded and will be reviewed by the authorities.
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <h2 id="cr-title" className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                      Report Billboard Violation
                    </h2>
                    <p id="cr-desc" className="text-sm text-gray-400 leading-relaxed">
                      Help keep your city compliant. Upload a photo and our AI can draft the title and description for you.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6 mt-7">
                    <AnimatePresence>
                      {error && (
                        <motion.div
                          role="alert"
                          aria-live="assertive"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-rose-500/10 border border-rose-500/25 text-rose-300 px-4 py-3 rounded-xl text-sm"
                        >
                          {error}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Title */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <label htmlFor="title" className="text-sm font-medium text-gray-200">
                          Report Title <span className="text-rose-400">*</span>
                        </label>
                        <AiGenButton
                          onClick={handleGenerateTitle}
                          busy={titleGenerating}
                          disabled={!hasImage || titleGenerating || isLoading}
                          hint={aiHint}
                          label="Generate title with AI"
                          loadingLabel="Generating…"
                        />
                      </div>
                      <input
                        id="title"
                        name="title"
                        ref={titleRef}
                        placeholder="Brief description of the violation"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                        className={inputBase}
                      />
                    </div>

                    {/* File Upload */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-gray-200">
                        Upload Images/Videos <span className="text-rose-400">*</span>
                      </label>
                      <label
                        htmlFor="file-upload"
                        className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-white/10 rounded-xl p-7 text-center cursor-pointer hover:border-brand-500/50 hover:bg-white/[0.02] transition-colors"
                      >
                        <Upload className="h-9 w-9 text-gray-500" />
                        <span className="text-sm font-medium text-brand-300">Click to upload files</span>
                        <span className="text-xs text-gray-500">PNG, JPG, MP4 up to 10MB ({MAX_FILES} max)</span>
                        <span className="text-[11px] text-accent-400">AI will analyze images to detect violations</span>
                        <input
                          id="file-upload"
                          type="file"
                          multiple
                          accept="image/*,video/*"
                          onChange={handleFileUpload}
                          className="hidden"
                          disabled={isLoading || items.length >= MAX_FILES}
                        />
                      </label>

                      {/* Previews */}
                      {items.length > 0 && (
                        <div className={items.length === 1 ? "" : "grid grid-cols-2 sm:grid-cols-3 gap-3"}>
                          <AnimatePresence initial={false}>
                            {items.map((it) => (
                              <motion.div
                                key={it.id}
                                layout
                                initial={{ opacity: 0, scale: 0.92 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.92 }}
                                transition={{ duration: 0.25, ease: EASE }}
                                className="group relative rounded-xl overflow-hidden border border-white/10 bg-black"
                              >
                                {it.isImage ? (
                                  <img
                                    src={it.url}
                                    alt={`Uploaded file: ${it.file.name}`}
                                    className={
                                      items.length === 1
                                        ? "w-full max-h-80 object-contain bg-black"
                                        : "w-full aspect-video object-cover"
                                    }
                                  />
                                ) : (
                                  <div className="w-full aspect-video flex flex-col items-center justify-center gap-2 text-gray-400">
                                    <Video className="h-8 w-8" />
                                    <span className="text-[11px]">Video</span>
                                  </div>
                                )}
                                <button
                                  type="button"
                                  onClick={() => removeItem(it.id)}
                                  disabled={isLoading}
                                  aria-label={`Remove ${it.file.name}`}
                                  className="absolute top-2 right-2 h-7 w-7 bg-black/70 hover:bg-rose-500 border border-white/15 rounded-full flex items-center justify-center text-white transition-colors backdrop-blur"
                                >
                                  <X className="h-3.5 w-3.5" />
                                </button>
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-3 py-2">
                                  <p className="text-[11px] text-gray-300 truncate">{it.file.name}</p>
                                </div>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      )}
                    </div>

                    {/* Address */}
                    <div className="space-y-2">
                      <label htmlFor="location" className="text-sm font-medium text-gray-200">
                        Address <span className="text-rose-400">*</span>
                      </label>
                      <input
                        id="location"
                        name="location"
                        placeholder="Enter the billboard's address"
                        value={formData.location}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                        className={inputBase}
                      />
                    </div>

                    {/* Coordinates */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <label className="text-sm font-medium text-gray-200">Coordinates</label>
                        <button
                          type="button"
                          onClick={handleUseLocation}
                          disabled={geo.loading || isLoading}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-accent-300 bg-accent-500/10 border border-accent-500/25 hover:bg-accent-500/20 transition-colors disabled:opacity-50"
                        >
                          {geo.loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <LocateFixed className="h-3.5 w-3.5" />}
                          {geo.loading ? "Detecting…" : "Use current location"}
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label htmlFor="lat" className="sr-only">Latitude</label>
                          <input
                            id="lat"
                            name="lat"
                            type="number"
                            step="any"
                            placeholder="Latitude"
                            value={formData.coordinates.lat}
                            onChange={handleChange}
                            disabled={isLoading || geo.loading}
                            className={inputBase}
                          />
                        </div>
                        <div>
                          <label htmlFor="lng" className="sr-only">Longitude</label>
                          <input
                            id="lng"
                            name="lng"
                            type="number"
                            step="any"
                            placeholder="Longitude"
                            value={formData.coordinates.lng}
                            onChange={handleChange}
                            disabled={isLoading || geo.loading}
                            className={inputBase}
                          />
                        </div>
                      </div>
                      <AnimatePresence>
                        {geo.error && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-xs text-amber-400"
                          >
                            {geo.error}
                          </motion.p>
                        )}
                        {!geo.error && formData.coordinates.lat && formData.coordinates.lng && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-xs text-emerald-400 inline-flex items-center gap-1"
                          >
                            <Check className="h-3 w-3" /> Coordinates set
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Timestamp */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-200">Timestamp</label>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span>{new Date().toLocaleString()}</span>
                        <span className="text-xs text-gray-600">(auto-filled)</span>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <label htmlFor="description" className="text-sm font-medium text-gray-200">
                          Detailed Description <span className="text-rose-400">*</span>
                        </label>
                        <AiGenButton
                          onClick={handleGenerateDescription}
                          busy={descGenerating}
                          disabled={!hasImage || descGenerating || isLoading}
                          hint={aiHint}
                          label="Generate description with AI"
                          loadingLabel="Analyzing…"
                        />
                      </div>
                      <textarea
                        id="description"
                        name="description"
                        placeholder="Describe the violation, or upload an image and let AI draft it for you…"
                        value={formData.description}
                        onChange={handleChange}
                        rows={5}
                        required
                        disabled={isLoading}
                        className={`${inputBase} resize-y`}
                      />
                      <AnimatePresence>
                        {aiError && (
                          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-xs text-rose-400">
                            {aiError}
                          </motion.p>
                        )}
                        {aiHint && !aiError && (
                          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-gray-500">
                            {aiHint}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                        className="px-5 py-2.5 text-sm font-semibold text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/10 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 rounded-xl shadow-[0_10px_30px_-10px_rgba(100,87,243,0.7)] transition-all disabled:opacity-60"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" /> Submitting…
                          </>
                        ) : (
                          "Submit Report"
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        </MotionConfig>
      )}
    </AnimatePresence>
  );
}

export default CitizenReport;
