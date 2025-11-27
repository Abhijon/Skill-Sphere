import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import Background from "../components/BackgroundAnimation";

const backend_url = import.meta.env.BACKEND_URL || "http://localhost:9001";

const RecruiterDashboard = () => {
  const { user, isAuthenticating } = useAuth(); // Get isAuthenticating from context
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Wait until auth initialization completes
    if (isAuthenticating) return;

    // Check user after auth initialization
    if (!user || user?.role !== "recruiter") {
      navigate("/");
      return;
    }

    const fetchJobs = async () => {
      try {
        const response = await fetch(
          `${backend_url}/api/jobs/`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) throw new Error("Failed to fetch jobs");

        const data = await response.json();
        const recruiterJobs = data.filter(
          (job) => job.postedBy._id === user.id // Use user._id instead of user.id
        );
        setJobs(recruiterJobs);
      } catch (error) {
        setError(error.message);
        toast.error("Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [user, navigate, isAuthenticating]); // Add isAuthenticating to dependencies

  if (isAuthenticating) {
    return (
      <div className="text-center text-gray-400 min-h-screen flex items-center justify-center">
        Loading user...
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <Background />
      <div className="container mx-auto px-4 pt-20 pb-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/80 backdrop-blur-md rounded-2xl p-6 mb-8 border border-gray-800"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold text-pink-400 mb-2">
                Welcome, {user.name}
              </h1>
              <p className="text-gray-300">{user.organization}</p>
              <p className="text-gray-400 mt-2">Posted Jobs: {jobs?.length}</p>
            </div>
            <Link
              to="/post-job"
              className="mt-4 md:mt-0 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-all flex items-center"
            >
              Post New Job
            </Link>
          </div>
        </motion.div>

        {loading ? (
          <div className="text-center text-gray-400">Loading jobs...</div>
        ) : error ? (
          <div className="text-center text-red-400">{error}</div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {jobs?.map((job) => (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gray-900/80 backdrop-blur-md rounded-xl p-6 border border-gray-800 hover:border-pink-500/50 transition-all"
              >
                <h3 className="text-xl font-semibold text-white mb-2">
                  {job.title}
                </h3>
                <div className="space-y-2 text-gray-300 mb-4">
                  <p className="flex items-center">
                    <span className="text-pink-400 mr-2">Skills:</span>
                    {job.skillsRequired?.join(", ")}
                  </p>
                  <p className="flex items-center">
                    <span className="text-pink-400 mr-2">Location:</span>
                    {job.location}
                  </p>
                  <p className="flex items-center">
                    <span className="text-pink-400 mr-2">Salary:</span>
                    {job.salaryRange}
                  </p>
                  <p className="text-sm text-gray-400">
                    Posted: {new Date(job.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <Link
                    to={`/${job._id}/applications`}
                    className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all flex items-center"
                  >
                    View Applications
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {!loading && !error && jobs?.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-400 text-lg mb-4">
              You haven't posted any jobs yet.
            </p>
            <Link
              to="/post-job"
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-all inline-flex items-center"
            >
              Post Your First Job
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default RecruiterDashboard;
