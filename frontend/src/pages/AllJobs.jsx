import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Background from "../components/BackgroundAnimation";

const backend_url = import.meta.env.BACKEND_URL || "http://localhost:9001";

const AllJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useAuth();

  useEffect(() => {
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
        setJobs(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.postedBy.organization
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <Background />
      <div className="max-w-7xl w-full px-6 py-8 relative z-10">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text text-center mb-8">
          All Jobs
        </h1>

        <div className="mb-8 max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Search jobs by title, company, or location..."
            className="w-full p-4 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
          {filteredJobs.map((job) => (
            <motion.div
              key={job._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-800 border border-purple-500 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-shadow w-full max-w-md"
            >
              <div className="flex flex-col h-full">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {job.title}
                  </h2>
                  <p className="text-purple-400 text-lg mb-4">
                    {job.postedBy.organization}
                  </p>

                  <div className="space-y-2 text-gray-300">
                    <div className="flex items-center">
                      <span className="mr-2">📍</span>
                      {job.location}
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">💰</span>
                      {job.salaryRange}
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">🛠️</span>
                      {job.skillsRequired.join(", ")}
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">📅</span>
                      {new Date(job.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-700 flex justify-end">
                  <Link
                    to={`/jobs/${job._id}`}
                    className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-400 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center text-gray-400 text-xl mt-12">
            No jobs found matching your search criteria
          </div>
        )}
      </div>
    </div>
  );
};

export default AllJobs;
