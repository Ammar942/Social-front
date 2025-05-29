import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import PublicRoute from "./routes/PublicRoute";
import ProtectedRoute from "./routes/ProtectedRoute";
import Signup from "./pages/Signup";
import FeedPage from "./pages/FeedPage";
import { ToastContainer } from "react-toastify";
import PostPage from "./pages/PostPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/feed" replace />} />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/posts/:id" element={<PostPage />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
