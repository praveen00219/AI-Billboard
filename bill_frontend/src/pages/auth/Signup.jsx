import { useState, useEffect } from "react";
import { FaShieldAlt, FaUserTie, FaNetworkWired, FaFingerprint } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuthorityRegister } from "../../hooks/Authority/Authentication";
import { CitizenSignup } from "../../hooks/Citizen/Authentication";
import { UseRollBased } from "../../middleware/RollBasedAccessController";

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
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (!termsAccepted) {
      setLocalError("Protocol requires acceptance of Terms and Privacy constraints.");
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

    if (result?.ok || result?.success) { // Handle different potential success response structures
      navigate("/login");
    } else {
      setLocalError(result?.data?.message || result?.error || "Registration failed. Initialization aborted.");
    }
  };

  const isLoading = type === "citizen" ? citizenLoading : authorityLoading;

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden font-['Inter']">
      
      {/* Dynamic Background Elements */}
      <div 
        className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40"
        style={{
          background: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, ${type === 'authority' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.1)'} 0%, transparent 40%)`
        }}
      />
      
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_20%,transparent_100%)] pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-md my-8">
        
        {/* Animated Scanner Bar for Authority */}
        {type === "authority" && (
          <div className="absolute -top-1 left-0 right-0 h-[2px] bg-blue-500 overflow-hidden rounded-t-2xl z-20 shadow-[0_0_15px_rgba(59,130,246,0.8)]">
            <div className="w-1/3 h-full bg-white opacity-80 animate-[scanner_2s_ease-in-out_infinite]" />
          </div>
        )}

        <div className="bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-[0_0_40px_rgba(0,0,0,0.8)] relative overflow-hidden">
          
          {/* Subtle Glow inside the card */}
          <div className={`absolute top-0 right-0 w-64 h-64 bg-${type === 'authority' ? 'blue-500/10' : 'white/5'} rounded-full blur-[80px] -z-10`} />
          <div className={`absolute bottom-0 left-0 w-64 h-64 bg-${type === 'authority' ? 'blue-600/10' : 'gray-500/10'} rounded-full blur-[80px] -z-10`} />

          {/* Role Toggle */}
          <div className="flex bg-black/50 rounded-xl p-1 border border-white/5 mb-8 relative z-10">
            <button
              type="button"
              onClick={() => { setType("citizen"); setLocalError(""); }}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-all duration-300 ${
                type === "citizen"
                  ? "bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)] border border-white/10"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <FaUserTie className="w-4 h-4" />
              Citizen
            </button>
            <button
              type="button"
              onClick={() => { setType("authority"); setLocalError(""); }}
              className={`flex-1 py-2.5 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-all duration-300 ${
                type === "authority"
                  ? "bg-blue-600/20 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)] border border-blue-500/20"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <FaShieldAlt className="w-4 h-4" />
              Authority
            </button>
          </div>

          {/* Header */}
          <div className="text-center mb-8 relative z-10">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 border ${type === 'authority' ? 'bg-blue-500/10 border-blue-500/30' : 'bg-white/5 border-white/10'}`}>
              {type === "citizen" ? (
                <FaNetworkWired className="h-8 w-8 text-gray-300" />
              ) : (
                <FaFingerprint className="h-8 w-8 text-blue-400" />
              )}
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Initialize Profile
            </h1>
            <p className="text-sm text-gray-400 mt-2">
              {type === "citizen"
                ? "Establish a new citizen operative node"
                : "Register a new command center authority"}
            </p>
          </div>

          <form className="space-y-4 relative z-10" onSubmit={handleSubmit}>
            {[
              { id: 'name', label: 'Operative Designation', type: 'text', placeholder: 'Full Name', value: fullName, set: setFullName },
              { id: 'email', label: 'Comms Link (Email)', type: 'email', placeholder: 'email@grid.sys', value: email, set: setEmail },
              { id: 'phone', label: 'Telemetry (Phone)', type: 'tel', placeholder: '+1 (555) 000-0000', value: phoneNumber, set: setPhoneNumber },
              { id: 'password', label: 'Security Key', type: 'password', placeholder: '••••••••••••', value: password, set: setPassword },
            ].map((field) => (
              <div key={field.id} className="space-y-1">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">
                  {field.label}
                </label>
                <div className="relative group">
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={field.value}
                    onChange={(e) => field.set(e.target.value)}
                    required
                    className={`w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-${type === 'authority' ? 'blue-500/50' : 'white/30'} focus:bg-black/60 transition-all duration-300`}
                  />
                  <div className={`absolute inset-0 rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none border border-${type === 'authority' ? 'blue-500/50' : 'white/30'} shadow-[0_0_10px_${type === 'authority' ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.1)'}]`} />
                </div>
              </div>
            ))}

            <div className="flex items-center pt-2">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className={`h-4 w-4 bg-black/40 border-gray-600 rounded focus:ring-${type === 'authority' ? 'blue-500' : 'white'}/50 cursor-pointer`}
              />
              <label className="ml-3 text-xs text-gray-400">
                I accept the <span className="text-white hover:underline cursor-pointer">Protocol Terms</span> and <span className="text-white hover:underline cursor-pointer">Privacy Matrix</span>
              </label>
            </div>

            {localError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 flex items-center gap-3 animate-pulse mt-4">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                <p className="text-red-400 text-sm font-medium">{localError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 mt-6 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group ${
                type === "citizen"
                  ? "bg-white text-black hover:bg-gray-200 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                  : "bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.4)]"
              }`}
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    GENERATING PROFILE...
                  </>
                ) : (
                  "ESTABLISH NODE"
                )}
              </span>
            </button>
          </form>

          <div className="mt-8 text-center text-sm font-medium text-gray-500 relative z-10">
            Profile already established?{" "}
            <a href="/login" className={`transition-colors ${type === 'authority' ? 'text-blue-400 hover:text-blue-300' : 'text-gray-300 hover:text-white'}`}>
              Initialize Link
            </a>
          </div>
        </div>
      </div>

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

