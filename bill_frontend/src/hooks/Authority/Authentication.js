import { useState } from "react";
import { authorityApiClient } from "../../api/apiClient";

// ─── Authority Register ───────────────────────────────────────────────────────
export const useAuthorityRegister = () => {
  const [loading, setLoading] = useState(false);

  const signupAuthority = async ({ name, email, number, password }) => {
    try {
      setLoading(true);
      const response = await authorityApiClient.post('/auth/authorityAuth-register', {
        name, email, number, password,
      });
      return { ok: true, data: response.data };
    } catch (err) {
      const msg = err.response?.data?.message || "Network error";
      return { ok: false, data: { message: msg } };
    } finally {
      setLoading(false);
    }
  };

  return { signupAuthority, loading };
};

// ─── Authority Login ──────────────────────────────────────────────────────────
export const useAuthorityLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const authorityLogin = async ({ email, password }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authorityApiClient.post('/auth/authorityAuth-login', {
        email, password,
      });
      const data = response.data;

      return {
        success: true,
        authority: data.authority,
      };
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  return { authorityLogin, loading, error };
};
