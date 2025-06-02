import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ChargerList from "./pages/ChargerList";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/chargers"
          element={
            <ProtectedRoute>
              <ChargerList />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
