import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./middleware/AuthController.jsx";
import { RollbasedProvider } from "./middleware/RollBasedAccessController.jsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RollbasedProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </RollbasedProvider>
    </QueryClientProvider>
  </StrictMode>
);
