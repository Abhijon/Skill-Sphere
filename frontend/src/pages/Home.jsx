import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Background from "../components/BackgroundAnimation";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const FeatureCard = ({ icon, title, description, delay }) => (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true, margin: "-100px" }}
      className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-gray-800 hover:border-purple-500 transition-colors duration-300 h-full"
    >
      <div className="text-3xl mb-4" aria-hidden="true">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
      <p className="text-gray-300 leading-relaxed">{description}</p>
    </motion.article>
  );

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <Background />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-24 pb-16 z-10">
        <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 text-center lg:text-left space-y-8"
          >
            <header>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight">
                <span className="block">SKILL-BASED</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
                  HIRING
                </span>
              </h1>
              <p className="text-gray-300 text-lg md:text-xl mt-6 max-w-xl mx-auto lg:mx-0">
                Traditional degrees don't always reflect skills. Our platform
                helps companies assess candidates based on practical skills, not
                just certifications.
              </p>
            </header>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              {!user ? (
                <>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg text-lg font-semibold shadow-lg hover:shadow-purple-500/20 transition-all"
                    onClick={() => navigate("/signup")}
                    aria-label="Get started with Skill-Based Hiring"
                  >
                    Get Started
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gray-900 border border-gray-700 text-white px-8 py-3 rounded-lg text-lg font-semibold shadow-lg hover:border-purple-500 transition-all"
                    onClick={() => navigate("/login")}
                    aria-label="Login to your account"
                  >
                    Login
                  </motion.button>
                </>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg text-lg font-semibold shadow-lg hover:shadow-purple-500/20 transition-all"
                  onClick={() =>
                    navigate(
                      user.role === "recruiter"
                        ? "/recruiter-dashboard"
                        : "/all-jobs"
                    )
                  }
                  aria-label="Go to Dashboard"
                >
                  Go to Dashboard
                </motion.button>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full lg:w-1/2 flex justify-center"
            aria-hidden="true"
          >
            <div className="relative max-w-2xl w-full">
              <div className="absolute -inset-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 opacity-30 blur-xl" />
              <div className="relative bg-gray-900 rounded-xl p-6 shadow-2xl">
                <div className="aspect-video bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg flex items-center justify-center backdrop-blur-lg">
                  <div className="text-center space-y-4">
                    <div className="text-2xl text-white font-bold">
                      Platform Preview
                    </div>
                    <p className="text-gray-300">
                      Interactive skill assessments
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section
        className="relative py-20 z-10 px-4"
        aria-labelledby="features-heading"
      >
        <div className="container mx-auto">
          <motion.header
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2
              id="features-heading"
              className="text-3xl md:text-4xl font-bold mb-4 text-white"
            >
              Why{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">
                Skill-Based
              </span>{" "}
              Hiring Works
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto text-lg">
              Transform your hiring process with data-driven skill assessments
            </p>
          </motion.header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: "🎯",
                title: "Precise Assessments",
                description:
                  "Real-world challenges instead of resume screening",
              },
              {
                icon: "🤖",
                title: "AI Matching",
                description: "Smart candidate-job matching algorithm",
              },
              {
                icon: "📊",
                title: "Analytics",
                description: "Detailed performance insights and metrics",
              },
              {
                icon: "👁️",
                title: "Blind Hiring",
                description: "Focus purely on demonstrated skills",
              },
            ].map((feature, index) => (
              <FeatureCard
                key={feature.title}
                {...feature}
                delay={index * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* New Impact Section */}
      <section
        className="relative py-20 z-10 px-4"
        aria-labelledby="impact-heading"
      >
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid md:grid-cols-3 gap-8 text-center"
          >
            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
              <h3 className="text-4xl font-bold text-purple-500 mb-2">3x</h3>
              <p className="text-gray-300">Faster Hiring Process</p>
            </div>
            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
              <h3 className="text-4xl font-bold text-pink-500 mb-2">85%</h3>
              <p className="text-gray-300">Candidate Satisfaction Rate</p>
            </div>
            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
              <h3 className="text-4xl font-bold text-purple-500 mb-2">92%</h3>
              <p className="text-gray-300">Retention Improvement</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-16 text-center"
          >
            <h2
              id="impact-heading"
              className="text-3xl md:text-4xl font-bold mb-6 text-white"
            >
              Proven Results Across Industries
            </h2>
            <p className="text-gray-300 max-w-3xl mx-auto mb-8">
              Companies using our platform report better hiring outcomes,
              reduced bias, and more efficient recruitment processes.
            </p>
            <div className="flex justify-center gap-4">
              {!user ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg text-lg font-semibold shadow-lg transition-all"
                  onClick={() => navigate("/signup")}
                >
                  Start Seeing Results
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-green-500 to-purple-500 text-white px-8 py-3 rounded-lg text-lg font-semibold shadow-lg transition-all"
                  onClick={() =>
                    navigate(
                      user.role === "recruiter" ? "/post-job" : "/all-jobs"
                    )
                  }
                >
                  {user.role === "recruiter" ? "Post a Job" : "Browse Jobs"}
                </motion.button>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
