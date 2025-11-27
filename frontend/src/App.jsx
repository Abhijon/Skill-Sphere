import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AllJobs from "./pages/AllJobs";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import JobDetails from "./pages/JobDetails";
import PostJob from "./pages/PostJob";
import ViewApplications from "./pages/ViewApplications";
import Assessment from "./pages/Assessment";
import NotFound from "./components/NotFound";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />

          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/all-jobs" element={<AllJobs />} />
              <Route path="/jobs/:jobId/assessment" element={<Assessment />} />
              <Route path="/jobs/:jobId" element={<JobDetails />} />
              <Route path="/post-job" element={<PostJob />} />
              <Route
                path="/recruiter-dashboard"
                element={<RecruiterDashboard />}
              />
              <Route
                path="/:jobId/applications"
                element={<ViewApplications />}
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
