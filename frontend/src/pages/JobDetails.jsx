import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Background from "../components/BackgroundAnimation";

const backend_url = import.meta.env.BACKEND_URL || "http://localhost:9001";

const JobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        const response = await fetch(
          `${backend_url}/api/jobs/`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch jobs: ${response.status}`);
        }

        const data = await response.json();
        const foundJob = data.find((j) => j._id === jobId);

        if (foundJob) {
          setJob(foundJob);
          // Check if current user has already applied
          if (user && foundJob.applicants.includes(user.id)) {
            setHasApplied(true);
          }
        } else {
          setError("Job not found");
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setError(error.message);
        toast.error("Failed to load job details");
      } finally {
        setLoading(false);
      }
    };

    fetchAllJobs();
  }, [jobId, user]); // Added user to dependencies

  const handleProceed = async () => {
    if (!user) {
      toast.error("Please login to apply for this job");
      return;
    }
  
    try {
      const response = await fetch(`${backend_url}/api/jobs/${jobId}/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          job: jobId,
          candidate: user.id,
          coverLetter: "I am interested in this position.",
        }),
      });
  
      if (!response.ok) {
        throw new Error("Application failed");
      }
  
      toast.success("Application submitted successfully!");
      setHasApplied(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to apply for this job.");
    }
  };
  

  const handleTakeAssessment = () => {
    if (!user) {
      toast.error("Please login to take the assessment");
      return;
    }
    navigate(`/jobs/${jobId}/assessment`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <Background />
      <div className="max-w-4xl mx-auto px-4 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 rounded-xl p-8 border border-purple-500 shadow-xl"
        >
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 mb-4">
              {job.title}
            </h1>
            <div className="flex items-center space-x-4 mb-4">
              <span className="text-purple-400 text-lg">
                {job.postedBy.organization}
              </span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-300">{job.location}</span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gray-900 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-white mb-4">
                Job Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
                <div className="flex items-center">
                  <span className="mr-2">💰 Salary:</span>
                  <span className="text-purple-400">{job.salaryRange}</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">📅 Posted:</span>
                  <span className="text-purple-400">
                    {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">🛠️ Skills Required:</span>
                  <span className="text-purple-400">
                    {job.skillsRequired.join(", ")}
                  </span>
                </div>
                {job.assessmentRequired && (
                  <div className="flex items-center">
                    <span className="mr-2">📝 Assessment:</span>
                    <span className="text-purple-400">
                      {job.assessmentQuestions.length} questions
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-900 p-6 rounded-lg">
              <h2 className="text-2xl font-bold text-white mb-4">
                Description
              </h2>
              <p className="text-gray-300 whitespace-pre-wrap">
                {job.description}
              </p>
            </div>

            <div className="flex justify-end space-x-4 mt-8">
              <Link
                to="/all-jobs"
                className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Back to Jobs
              </Link>
              {user?.role === "candidate" &&
                (hasApplied ? (
                  <button
                    disabled
                    className="px-6 py-3 bg-gray-600 text-gray-400 rounded-lg cursor-not-allowed"
                  >
                    Already Applied
                  </button>
                ) : job.assessmentRequired ? (
                  <button
                    onClick={handleTakeAssessment}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition-all"
                  >
                    Take Assessment
                  </button>
                ) : (
                  <button
                    onClick={handleProceed}
                    className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition-all"
                  >
                    Apply Now
                  </button>
                ))}
              {user?.role === "recruiter" && (
                <span className="text-gray-400 px-6 py-3">
                  Recruiter View Only
                </span>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default JobDetails;
