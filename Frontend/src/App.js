import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useParams,
  Link,
} from "react-router-dom";
import CenterManagement from "./pages/Center.jsx";
import AddUserToCenter from "./pages/AddUserCenter.jsx";
import UsersInCenter from "./pages/UserInCenter.jsx";
import CreateSuperAdmin from "./pages/CreateUserAdmin.jsx";
import SuperAdminDashboard from "./pages/SuperAdminDashboard.jsx";
import CenterDashboard from "./pages/Dashboard-Center.jsx";
import DoctorDashboard from "./pages/DoctorDashboard.jsx"; 
import Login from "./pages/Login.jsx";
import ClientManagement from "./pages/Client.jsx";
import AddClinic from "./pages/Clinic.jsx";
import AddDoctor from "./pages/Doctor.jsx";
import DoctorLogin from "./pages/LoginDocter.jsx";
import labRoutes, { Lab } from "./pages/labTests/route.jsx";
import examRoutes, { Exam } from "./pages/medicalExams/route.jsx";
import Clientfit from "./pages/Clientfit.jsx";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    
    if (storedToken && storedRole) {
      setIsAuthenticated(true);
      setRole(storedRole);
    } else {
      setIsAuthenticated(false);
      setRole(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("center");
    setIsAuthenticated(false);
    setRole(null);
  };

  return (
    <Router>
      <AppContent
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
        role={role}
        setRole={setRole}
        handleLogout={handleLogout}
      />
    </Router>
  );
};

const AppContent = ({
  isAuthenticated,
  setIsAuthenticated,
  role,
  setRole,
  handleLogout,
}) => {
  return (
    <Routes>
      <Route path="/lab" element={<Lab />}>
        {labRoutes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Route>
      <Route path="/exam" element={<Exam />}>
        {examRoutes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Route>
      <Route
        path="/"
        element={isAuthenticated ? (
          role === "superAdmin" ? (
            <Navigate to="/dashboard-superAdmin" />
          ) : role === "docteradmin" ? (
            <Navigate to="/dashboard-doctor" />
          ) : (
            <Navigate to="/dashboard-center" />
          )
        ) : (
          <WelcomePage />
        )}
      />
      <Route
        path="/login"
        element={isAuthenticated ? (
          role === "superAdmin" ? (
            <Navigate to="/dashboard-superAdmin" />
          ) : (
            <Navigate to="/dashboard-center" />
          )
        ) : (
          <Login setIsAuthenticated={setIsAuthenticated} setRole={setRole} />
        )}
      />
      <Route
        path="/login-doctor"
        element={isAuthenticated ? (
          <Navigate to="/dashboard-doctor" />
        ) : (
          <DoctorLogin setIsAuthenticated={setIsAuthenticated} setRole={setRole} />
        )}
      />
      <Route
        path="/center"
        element={isAuthenticated && role === "superAdmin" ? (
          <CenterManagement onLogout={handleLogout} />
        ) : (
          <Navigate to="/login" />
        )}
      />
      <Route
        path="/adduser/:centerId"
        element={isAuthenticated && role === "superAdmin" ? (
          <AddUserToCenterWrapper />
        ) : (
          <Navigate to="/login" />
        )}
      />
      <Route
        path="/Clientfit/:clientId"
        element={isAuthenticated && role === "docteradmin" ? (
          <Clientfit />
        ) : (
          <Navigate to="/login" />
        )}
      />
      <Route
        path="/users/:centerId"
        element={isAuthenticated && role === "superAdmin" ? (
          <UsersInCenterWrapper />
        ) : (
          <Navigate to="/login" />
        )}
      />
      <Route
        path="/dashboard-superAdmin"
        element={isAuthenticated && role === "superAdmin" ? (
          <SuperAdminDashboard onLogout={handleLogout} />
        ) : (
          <Navigate to="/login" />
        )}
      />
      <Route
        path="/dashboard-center"
        element={isAuthenticated && ["centerAdmin", "centerUser"].includes(role) ? (
          <CenterDashboard onLogout={handleLogout} />
        ) : (
          <Navigate to="/login" />
        )}
      />
      <Route
        path="/form"
        element={isAuthenticated && ["centerAdmin", "centerUser"].includes(role) ? (
          <ClientManagement onLogout={handleLogout} />
        ) : (
          <Navigate to="/login" />
        )}
      />
      <Route
        path="/addclinic"
        element={isAuthenticated && ["centerAdmin", "centerUser"].includes(role) ? (
          <AddClinic onLogout={handleLogout} />
        ) : (
          <Navigate to="/login" />
        )}
      />
      <Route
        path="/adddocter"
        element={isAuthenticated && ["centerAdmin", "centerUser"].includes(role) ? (
          <AddDoctor onLogout={handleLogout} />
        ) : (
          <Navigate to="/login" />
        )}
      />
      <Route
        path="/dashboard-doctor"
        element={isAuthenticated && role === "docteradmin" ? (
          <DoctorDashboard onLogout={handleLogout} />
        ) : (
          <Navigate to="/login" />
        )}
      />
      <Route path="/create" element={<CreateSuperAdmin />} />
    </Routes>
  );
};

const WelcomePage = () => (
  <>
    <h1>Welcome to the App</h1>
    <div style={{ marginTop: "20px", textAlign: "center" }}>
      <Link to="/login-doctor">Are You A Doctor?</Link>
      <h3>OR</h3>
      <Link to="/login">Are You Admin?</Link>
    </div>
  </>
);

const AddUserToCenterWrapper = () => {
  const { centerId } = useParams();
  return <AddUserToCenter centerId={centerId} />;
};

const UsersInCenterWrapper = () => {
  const { centerId } = useParams();
  return <UsersInCenter centerId={centerId} />;
};

export default App;
