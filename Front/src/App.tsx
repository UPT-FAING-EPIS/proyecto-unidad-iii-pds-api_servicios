import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainServicesPages } from "./pages/MainServicesPages";
import { Navigation } from "./components/Navigation";
import { Toaster } from "react-hot-toast";
import { EducacionRoutes } from "./routes/EducacionRoutes";
import { InternetRoutes } from "./routes/InternetRoutes";
import { ClienteRoutes } from "./routes/ClienteRoutes";


function App() {
  return (
    <BrowserRouter>
      <div className="container mx-auto px-2">
        <Navigation />
        <Routes>
          <Route path="/" element={<Navigate to="/Servicios" />} />
          <Route path="/Servicios" element={<MainServicesPages />} />
          <Route path="/Servicios/Educacion/*" element={<EducacionRoutes />} />
          <Route path="/Servicios/Luz" element={< MainServicesPages/>} />
          <Route path="/Servicios/Internet/*" element={< InternetRoutes/>} />
          <Route path="/Cliente/*" element={< ClienteRoutes/>} />

        </Routes>
        <Toaster />
      </div>
    </BrowserRouter>
  );
}

export default App;
