import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import AppRoutes from "@/routes";

export default function App() {
  return (
    <Router>
      <AppRoutes />
      <Toaster />
    </Router>
  );
}
