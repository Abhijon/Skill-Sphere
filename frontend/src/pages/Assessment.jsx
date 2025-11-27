import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Background from "../components/BackgroundAnimation";

const backend_url = import.meta.env.BACKEND_URL || "http://localhost:9001";

const Assessment = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState([]);
  const [coverLetter, setCoverLetter] = useState("");
  const [result, setResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const token = localStorage.getItem("token"); // ✅ Fetch token

        const response = await fetch(
          `${backend_url}/api/jobs/`,
          {
            credentials: "include",
            headers: {
              Authorization: token ? `Bearer ${token}` : "", // ✅ Send token
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) throw new Error("Failed to load assessment");

        const data = await response.json();

        // Find the specific job using URL parameter jobId
        const job = data.find((job) => job._id === jobId);

        if (!job) {
          navigate(`/jobs`);
          toast.error("Job not found");
          return;
        }

        if (!job.assessmentRequired || job.assessmentQuestions.length === 0) {
          navigate(`/jobs/${jobId}`);
          toast.error("No assessment required for this job");
          return;
        }

        setJob(job);
        setAnswers(new Array(job.assessmentQuestions.length).fill(null));
      } catch (error) {
        toast.error(error.message);
        navigate(`/jobs/${jobId}`);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchAssessment();
    else navigate("/login");
  }, [jobId, user, navigate]);

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const evaluateAssessment = () => {
    let score = 0;
    job.assessmentQuestions.forEach((question, index) => {
      const selectedAnswer = question.options[answers[index]];
      if (selectedAnswer === question.correctAnswer) score++;
    });
    return { score };
  };

  const handleSubmitAssessment = () => {
    if (answers.some((answer) => answer === null)) {
      toast.error("Please answer all questions");
      return;
    }

    const result = evaluateAssessment();
    setResult(result);
    toast.success(
      `You scored ${result.score}/${job.assessmentQuestions.length}`
    );
  };

  const handleFinalApply = async () => {
    if (!result?.score) return;

    setIsSubmitting(true);
    try {
      // Get token from localStorage
      const token = localStorage.getItem("token");
      if (!token)
        throw new Error("Authentication failed. Please log in again.");

      // Calculate percentage score
      const totalQuestions = job.assessmentQuestions.length;
      const percentageScore = `${Math.round(
        (result.score / totalQuestions) * 100
      )}%`;

      const response = await fetch(
        `${backend_url}/api/jobs/${jobId}/apply`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ Include token in header
          },
          body: JSON.stringify({
            coverLetter,
            score: percentageScore,
          }),
        }
      );

      if (response.status === 201) {
        toast.success("Application submitted successfully!");
        navigate(`/jobs/${jobId}`);
      } else {
        throw new Error("Application failed");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
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
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 mb-8">
            {job.title} Assessment
          </h1>

          {!result ? (
            <>
              <div className="space-y-6 mb-8">
                {job.assessmentQuestions.map((question, qIndex) => (
                  <div key={qIndex} className="bg-gray-900 p-6 rounded-lg">
                    <h3 className="text-xl font-bold text-white mb-4">
                      Question {qIndex + 1}
                    </h3>
                    <p className="text-gray-300 mb-4">{question.question}</p>
                    <div className="space-y-3">
                      {question.options.map((option, oIndex) => (
                        <div
                          key={oIndex}
                          className={`p-3 rounded-lg cursor-pointer transition-all ${
                            answers[qIndex] === oIndex
                              ? "bg-purple-500/30 border border-purple-500"
                              : "bg-gray-800 hover:bg-gray-700"
                          }`}
                          onClick={() => handleAnswerSelect(qIndex, oIndex)}
                        >
                          <span className="text-gray-300">{option}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleSubmitAssessment}
                className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition-all"
              >
                Submit Assessment
              </button>
            </>
          ) : (
            <div className="space-y-6">
              <div className="bg-gray-900 p-6 rounded-lg">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Your Score: {result.score}/{job.assessmentQuestions.length}
                </h2>
                <p className="text-gray-300">
                  Minimum Required: {job.minimumScore}
                </p>
                <p
                  className={`text-lg ${
                    result.score >= job.minimumScore
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {result.score >= job.minimumScore
                    ? "🎉 You met the requirements!"
                    : "❌ You didn't meet the requirements"}
                </p>
              </div>

              <div className="bg-gray-900 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-white mb-4">
                  Final Application
                </h3>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Add your cover letter"
                  className="w-full p-4 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-purple-500"
                  rows="5"
                  required
                />
              </div>

              <button
                onClick={handleFinalApply}
                // disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-green-500 to-purple-500 text-white rounded-lg hover:opacity-90 transition-all"
              >
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </button>

              <button
                onClick={() => navigate(`/jobs/${jobId}`)}
                className="w-full py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Back to Job
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Assessment;
