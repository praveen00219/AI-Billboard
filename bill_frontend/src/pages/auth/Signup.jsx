import { useState, useEffect } from "react";
import { FaShieldAlt, FaUserTie } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthorityRegister } from "../../hooks/Authority/Authentication";
import { CitizenSignup } from "../../hooks/Citizen/Authentication";
import { UseRollBased } from "../../middleware/RollBasedAccessController";
import Logo from "../../component/brand/Logo";

function Signup() {
  const { type, setType } = UseRollBased();
  const navigate = useNavigate();

  const { signup: signupCitizen, loading: citizenLoading } = CitizenSignup();
  const { signupAuthority, loading: authorityLoading } = useAuthorityRegister();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (!termsAccepted) {
      setLocalError("Please accept the Terms and Privacy Policy to continue.");
      return;
    }

    let result;
    if (type === "citizen") {
      result = await signupCitizen({
        name: fullName,
        email,
        password,
        number: phoneNumber,
        userType: "citizen",
      });
    } else {
      result = await signupAuthority({
        name: fullName,
        email,
        password,
        number: phoneNumber,
      });
    }

    if (result?.ok || result?.success) {
      navigate("/login");
    } else {
      setLocalError(result?.data?.message || result?.error || "Registration failed. Please try again.");
    }
  };

  const isLoading = type === "citizen" ? citizenLoading : authorityLoading;
  const isAuthority = type === "authority";

  const fields = [
    { id: "name", label: "Full Name", type: "text", placeholder: "Jane Doe", value: fullName, set: setFullName },
    { id: "email", label: "Email", type: "email", placeholder: "you@example.com", value: email, set: setEmail },
    { id: "phone", label: "Phone Number", type: "tel", placeholder: "+1 (555) 000-0000", value: phoneNumber, set: setPhoneNumber },
    { id: "password", label: "Password", type: "password", placeholder: "••••••••••••", value: password, set: setPassword },
  ];

  return (
    <div className="min-h-screen bg-ink-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          background: `radial-gradient(420px circle at ${mousePos.x}px ${mousePos.y}px, rgba(100,87,243,0.14) 0%, transparent 45%)`,
        }}
      />
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.12] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_20%,transparent_100%)] pointer-events-none" />
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[60%] h-[40%] rounded-full bg-brand-600/15 blur-[150px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md my-8"
      >
        <div className="flex justify-center mb-6">
          <Link to="/"><Logo size={34} /></Link>
        </div>

        <div className="glass-strong rounded-2xl p-8 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] relative overflow-hidden">
          {isAuthority && (
            <div className="absolute top-0 left-0 right-0 h-[2px] overflow-hidden rounded-t-2xl z-20">
              <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-brand-400 to-transparent animate-[scanner_2s_ease-in-out_infinite]" />
            </div>
          )}

          {/* Role Toggle */}
          <div className="flex bg-black/40 rounded-xl p-1 border border-white/5 mb-8">
            <button
              type="button"
              onClick={() => { setType("citizen"); setLocalError(""); }}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-all duration-300 ${
                type === "citizen"
                  ? "bg-white/10 text-white border border-white/10"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <FaUserTie className="w-4 h-4" /> Citizen
            </button>
            <button
              type="button"
              onClick={() => { setType("authority"); setLocalError(""); }}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-all duration-300 ${
                isAuthority
                  ? "bg-brand-500/20 text-brand-200 border border-brand-500/25"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <FaShieldAlt className="w-4 h-4" /> Authority
            </button>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <div
              className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 border ${
                isAuthority ? "bg-brand-500/10 border-brand-500/30" : "bg-white/5 border-white/10"
              }`}
            >
              {isAuthority ? (
                <FaShieldAlt className="h-6 w-6 text-brand-300" />
              ) : (
                <FaUserTie className="h-6 w-6 text-gray-300" />
              )}
            </div>
            <h1 className="font-display text-2xl font-bold text-white tracking-tight">Create your account</h1>
            <p className="text-sm text-gray-400 mt-2">
              {isAuthority ? "Register a new authority command center" : "Join Civix as a citizen reporter"}
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {fields.map((field) => (
              <div key={field.id} className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  value={field.value}
                  onChange={(e) => field.set(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-brand-500/60 focus:ring-2 focus:ring-brand-500/20 focus:bg-black/60 transition-all duration-300"
                />
              </div>
            ))}

            <div className="flex items-center pt-1">
              <input
                id="terms"
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="h-4 w-4 bg-black/40 border-gray-600 rounded accent-brand-500 cursor-pointer"
              />
              <label htmlFor="terms" className="ml-3 text-xs text-gray-400">
                I accept the <span className="text-gray-200 hover:underline cursor-pointer">Terms</span> and{" "}
                <span className="text-gray-200 hover:underline cursor-pointer">Privacy Policy</span>
              </label>
            </div>

            {localError && (
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3 flex items-center gap-3 mt-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <p className="text-rose-300 text-sm font-medium">{localError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 mt-4 rounded-xl font-semibold text-sm tracking-wide text-white bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 shadow-[0_12px_36px_-10px_rgba(100,87,243,0.7)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Creating account…
                  </>
                ) : (
                  "Create Account"
                )}
              </span>
            </button>
          </form>

          <div className="mt-8 text-center text-sm font-medium text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="text-brand-300 hover:text-brand-200 transition-colors">
              Sign in
            </Link>
          </div>
        </div>
      </motion.div>

      <style>{`
        @keyframes scanner {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  );
}

export default Signup;
