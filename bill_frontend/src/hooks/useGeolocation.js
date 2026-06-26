import { useCallback, useState } from "react";

/**
 * useGeolocation — reusable wrapper around the browser Geolocation API.
 * Returns coordinates plus loading/error state and a `getLocation()` that
 * resolves with the coords (or null on failure) so callers can await it.
 */
export function useGeolocation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [coords, setCoords] = useState(null);

  const getLocation = useCallback(() => {
    return new Promise((resolve) => {
      if (!("geolocation" in navigator)) {
        setError("Geolocation is not supported by this browser. Enter coordinates manually.");
        resolve(null);
        return;
      }

      setLoading(true);
      setError("");

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const c = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
          };
          setCoords(c);
          setLoading(false);
          resolve(c);
        },
        (err) => {
          const msg =
            err.code === err.PERMISSION_DENIED
              ? "Location permission denied. You can enter coordinates manually."
              : err.code === err.TIMEOUT
              ? "Location request timed out. Try again or enter coordinates manually."
              : "Unable to detect location. Please enter coordinates manually.";
          setError(msg);
          setLoading(false);
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  }, []);

  return { loading, error, coords, getLocation, setError };
}

export default useGeolocation;
