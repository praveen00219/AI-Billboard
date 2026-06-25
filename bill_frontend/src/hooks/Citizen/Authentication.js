import { useMutation } from "@tanstack/react-query";
import { authApi } from "../../api/auth.api";
import { useAuth } from "../../middleware/AuthController";

// ─── Citizen Signup ───────────────────────────────────────────────────────────
export function CitizenSignup() {
  const { login } = useAuth();

  const mutation = useMutation({
    mutationFn: (userData) => authApi.citizenRegister(userData),
    onSuccess: (data) => {
      // Tokens are now stored in HTTP-only cookies
      localStorage.setItem("userRole", "citizen");
      login(data.user);
    },
  });

  const signup = async (userData) => {
    try {
      const data = await mutation.mutateAsync(userData);
      return { ok: true, data };
    } catch (err) {
      console.error("❌ Signup Error:", err);
      return {
        ok: false,
        data: { message: err.response?.data?.message || "Server error, please try again." },
      };
    }
  };

  return { signup, loading: mutation.isPending };
}

// ─── Citizen Login ────────────────────────────────────────────────────────────
export const CitizenLogin = () => {
  const { login } = useAuth();

  const mutation = useMutation({
    mutationFn: (credentials) => authApi.citizenLogin(credentials),
    onSuccess: (data) => {
      // Tokens are now stored in HTTP-only cookies
      localStorage.setItem("userRole", "citizen");
      login(data.user);
    },
  });

  const loginUser = async (credentials) => {
    try {
      const data = await mutation.mutateAsync(credentials);
      return { success: true, user: data.user };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || err.message,
      };
    }
  };

  return {
    loginUser,
    loading: mutation.isPending,
    error: mutation.error?.response?.data?.message || mutation.error?.message,
  };
};
