import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import Background from "../components/BackgroundAnimation";
import { FiPlus, FiX, FiChevronDown, FiChevronUp } from "react-icons/fi";

const backend_url = import.meta.env.BACKEND_URL || "http://localhost:9001";

const PostJob = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    skillsRequired: [],
    location: "",
    salaryRange: "",
    assessmentRequired: false,
    assessmentQuestions: [],
    minimumScore: 0,
  });
  const [currentSkill, setCurrentSkill] = useState("");
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.description ||
      !formData.location ||
      !formData.salaryRange
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (
      formData.assessmentRequired &&
      formData.assessmentQuestions.length === 0
    ) {
      toast.error("Please add at least one assessment question");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token"); // ✅ Fetch token

      const response = await fetch(
        `${backend_url}/api/jobs/`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            Authorization: token ? `Bearer ${token}` : "", // ✅ Send token
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Job posted successfully!");
        navigate("/recruiter-dashboard");
      } else {
        toast.error(data.message || "Failed to post job.");
      }
    } catch (error) {
      toast.error(error.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Skill handling
  const handleAddSkill = () => {
    const skill = currentSkill.trim();
    if (skill && !formData.skillsRequired.includes(skill)) {
      setFormData({
        ...formData,
        skillsRequired: [...formData.skillsRequired, skill],
      });
      setCurrentSkill("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skillsRequired: formData.skillsRequired.filter(
        (skill) => skill !== skillToRemove
      ),
    });
  };

  // Assessment handling
  const toggleAssessment = () => {
    setFormData({
      ...formData,
      assessmentRequired: !formData.assessmentRequired,
      assessmentQuestions: !formData.assessmentRequired
        ? []
        : formData.assessmentQuestions,
      minimumScore: !formData.assessmentRequired ? 0 : formData.minimumScore,
    });
  };

  const addQuestion = () => {
    const newQuestions = [
      ...formData.assessmentQuestions,
      {
        question: "",
        options: ["", "", "", ""],
        correctAnswer: "",
      },
    ];
    setFormData({ ...formData, assessmentQuestions: newQuestions });
    setExpandedQuestion(newQuestions.length - 1);
  };

  const updateQuestion = (index, field, value) => {
    const updatedQuestions = [...formData.assessmentQuestions];
    updatedQuestions[index][field] = value;
    setFormData({ ...formData, assessmentQuestions: updatedQuestions });
  };

  const updateOption = (qIndex, oIndex, value) => {
    const updatedQuestions = [...formData.assessmentQuestions];
    updatedQuestions[qIndex].options[oIndex] = value;
    setFormData({ ...formData, assessmentQuestions: updatedQuestions });
  };

  const removeQuestion = (index) => {
    const updatedQuestions = formData.assessmentQuestions.filter(
      (_, i) => i !== index
    );
    setFormData({ ...formData, assessmentQuestions: updatedQuestions });
    setExpandedQuestion(null);
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <Background />

      <div className="container mx-auto px-10 py-20 relative z-10">
        <div className="bg-gray-900/80 backdrop-blur-md rounded-3xl p-8 border border-gray-700 shadow-xl">
          <h2 className="text-4xl font-bold mb-8 text-pink-400 text-center">
            Post New Job Opportunity
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Left Column - Job Details */}
            <div className="space-y-6">
              <div>
                <label className="block text-gray-300 mb-2 text-lg font-medium">
                  Job Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Senior React Developer"
                  className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:border-pink-500 focus:ring-2 focus:ring-pink-400 outline-none transition-all placeholder:text-gray-300 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2 text-lg font-medium">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="Remote, Worldwide"
                  className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:border-pink-500 focus:ring-2 focus:ring-pink-400 outline-none transition-all placeholder:text-gray-300 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2 text-lg font-medium">
                  Salary Range
                </label>
                <input
                  type="text"
                  value={formData.salaryRange}
                  onChange={(e) =>
                    setFormData({ ...formData, salaryRange: e.target.value })
                  }
                  placeholder="₹7,00,000 - ₹12,00,000 per annum"
                  className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:border-pink-500 focus:ring-2 focus:ring-pink-400 outline-none transition-all placeholder:text-gray-300 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2 text-lg font-medium">
                  Skills Required
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={currentSkill}
                    onChange={(e) => setCurrentSkill(e.target.value)}
                    placeholder="React, Node.js, TypeScript"
                    className="flex-1 px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:border-pink-500 focus:ring-2 focus:ring-pink-400 outline-none transition-all placeholder:text-gray-300 text-white"
                    onKeyPress={(e) => e.key === "Enter" && handleAddSkill()}
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-3 rounded-xl transition-colors font-medium"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.skillsRequired.map((skill) => (
                    <span
                      key={skill}
                      className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full flex items-center gap-1 text-sm"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="text-purple-300 hover:text-purple-200 transition-colors"
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Description & Assessment */}
            <div className="space-y-6">
              <div>
                <label className="block text-gray-300 mb-2 text-lg font-medium">
                  Job Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Detailed job description..."
                  className="w-full h-48 px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 focus:border-pink-500 focus:ring-2 focus:ring-pink-400 outline-none resize-none transition-all placeholder:text-gray-300 text-white"
                  required
                />
              </div>

              <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-300 text-lg font-medium">
                    Include Assessment?
                  </span>
                  <button
                    type="button"
                    onClick={toggleAssessment}
                    className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${
                      formData.assessmentRequired
                        ? "bg-pink-500"
                        : "bg-gray-600"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                        formData.assessmentRequired
                          ? "translate-x-7"
                          : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                {formData.assessmentRequired && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      {formData.assessmentQuestions.map((q, qIndex) => (
                        <div
                          key={qIndex}
                          className="bg-gray-700/50 rounded-xl p-4 border border-gray-600"
                        >
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-gray-300 font-medium">
                              Question {qIndex + 1}
                            </span>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  setExpandedQuestion(
                                    expandedQuestion === qIndex ? null : qIndex
                                  )
                                }
                                className="text-pink-400 hover:text-pink-300 transition-colors"
                              >
                                {expandedQuestion === qIndex ? (
                                  <FiChevronUp />
                                ) : (
                                  <FiChevronDown />
                                )}
                              </button>
                              <button
                                type="button"
                                onClick={() => removeQuestion(qIndex)}
                                className="text-red-400 hover:text-red-300 transition-colors"
                              >
                                <FiX />
                              </button>
                            </div>
                          </div>

                          {expandedQuestion === qIndex && (
                            <div className="space-y-4">
                              <input
                                type="text"
                                value={q.question}
                                onChange={(e) =>
                                  updateQuestion(
                                    qIndex,
                                    "question",
                                    e.target.value
                                  )
                                }
                                placeholder="Enter question text"
                                className="w-full px-4 py-2 rounded-lg bg-gray-600 border border-gray-500 focus:border-pink-500 focus:ring-2 focus:ring-pink-400 outline-none transition-all placeholder:text-gray-300 text-white"
                              />

                              <div className="grid grid-cols-2 gap-3">
                                {q.options.map((option, oIndex) => (
                                  <input
                                    key={oIndex}
                                    type="text"
                                    value={option}
                                    onChange={(e) =>
                                      updateOption(
                                        qIndex,
                                        oIndex,
                                        e.target.value
                                      )
                                    }
                                    placeholder={`Option ${oIndex + 1}`}
                                    className="w-full px-3 py-2 rounded-lg bg-gray-600 border border-gray-500 focus:border-pink-500 focus:ring-2 focus:ring-pink-400 outline-none transition-all placeholder:text-gray-300 text-white"
                                  />
                                ))}
                              </div>

                              <select
                                value={q.correctAnswer}
                                onChange={(e) =>
                                  updateQuestion(
                                    qIndex,
                                    "correctAnswer",
                                    e.target.value
                                  )
                                }
                                className="w-full px-4 py-2 rounded-lg bg-gray-600 border border-gray-500 focus:border-pink-500 focus:ring-2 focus:ring-pink-400 outline-none transition-all"
                              >
                                <option value="">Select Correct Answer</option>
                                {q.options.map(
                                  (option, oIndex) =>
                                    option && (
                                      <option key={oIndex} value={option}>
                                        Option {oIndex + 1}
                                      </option>
                                    )
                                )}
                              </select>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={addQuestion}
                      className="w-full py-3 flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600 rounded-xl transition-colors font-medium"
                    >
                      <FiPlus />
                      Add Question
                    </button>

                    <div>
                      <label className="block text-gray-300 mb-2 font-medium">
                        Minimum Passing Score
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.minimumScore}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            minimumScore: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full px-4 py-2 rounded-lg bg-gray-600 border border-gray-500 focus:border-pink-500 focus:ring-2 focus:ring-pink-400 outline-none transition-all placeholder:text-gray-300 text-white"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="lg:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-xl text-xl font-bold hover:opacity-90 transition-all shadow-lg shadow-pink-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Publishing Job..." : "Publish Job Opportunity"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostJob;
