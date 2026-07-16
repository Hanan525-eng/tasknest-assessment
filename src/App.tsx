// src/App.tsx

import { useEffect } from "react";

import AppRouter from "./routes/AppRouter";
import { useAuthStore } from "./stores/auth.store";

function App() {
  const restoreSession = useAuthStore((state) => state.restoreSession);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  return <AppRouter />;
}

export default App;