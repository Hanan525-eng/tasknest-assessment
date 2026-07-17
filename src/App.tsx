// src/App.tsx

import { useEffect } from "react";
import AppRouter from "./routes/AppRouter";
import { useAuthStore } from "./stores/auth.store";
import { ToastContainer } from "./components/ToastContainer";

function App() {
  const restoreSession = useAuthStore((s) => s.restoreSession);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  return (
    <>
      <AppRouter />
      <ToastContainer />
    </>
  );
}

export default App;