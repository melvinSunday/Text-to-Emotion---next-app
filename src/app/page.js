"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { FaInfoCircle, FaPaperPlane } from "react-icons/fa";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Home() {
  const [text, setText] = useState("");
  const [emotion, setEmotion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  const analyzeEmotion = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/emotion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();

      if (response.ok) {
        setEmotion(data);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err) {
      setError("Failed to connect to the server");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      analyzeEmotion();
    }
  };

  const chartData = emotion
    ? {
        labels: Object.keys(emotion),
        datasets: [
          {
            label: "Emotion Score",
            data: Object.values(emotion),
            backgroundColor: [
              "rgba(255, 99, 132, 0.6)",
              "rgba(54, 162, 235, 0.6)",
              "rgba(255, 206, 86, 0.6)",
              "rgba(75, 192, 192, 0.6)",
              "rgba(153, 102, 255, 0.6)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
            ],
            borderWidth: 1,
          },
        ],
      }
    : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          boxWidth: 10,
          font: {
            size: 12,
            family: "'Poppins', sans-serif",
          },
        },
      },
      title: {
        display: true,
        text: "Emotion Analysis Result",
        font: {
          size: 16,
          family: "'Poppins', sans-serif",
          weight: "bold",
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            size: 12,
            family: "'Poppins', sans-serif",
          },
        },
      },
      x: {
        ticks: {
          font: {
            size: 12,
            family: "'Poppins', sans-serif",
          },
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6 sm:p-10 text-gray-800 font-poppins">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl mx-auto"
      >
        <h1 className="text-3xl sm:text-4xl font-[poppins] font-bold mb-6 sm:mb-10 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-600">
          Text to Emotion Analysis
        </h1>

        <motion.button
          onClick={() => setShowInfo(!showInfo)}
          className="mb-6 px-4 py-2 bg-white text-blue-600 rounded-full shadow-md hover:shadow-lg focus:outline-none flex items-center text-sm sm:text-base transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaInfoCircle className="mr-2" />
          {showInfo ? "Hide Info" : "Show Info"}
        </motion.button>

        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6 p-4 sm:p-6 bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <h2 className="text-xl sm:text-2xl font-bold mb-3 text-blue-600">
                About This App
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-justify">
                This app uses the Text to Emotion API to analyze the emotions
                embedded in text. The API employs complex NLP algorithms to
                detect emotions such as happiness, surprise, anger, sadness, and
                fear. It processes the text, identifies emotion-expressing
                words, and provides a score (0.00 to 1.00) for each emotion
                category. This granular approach goes beyond simple sentiment
                analysis, offering insights into the nuanced feelings expressed
                in the text.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter some text to analyze..."
            rows={4}
            className="w-full p-4 rounded-lg bg-white border-2 border-blue-200 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm sm:text-base transition-all duration-300 shadow-md"
          />
          <motion.button
            onClick={analyzeEmotion}
            className={`absolute right-3 bottom-3 p-2 rounded-full transition-colors ${
              loading
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
            disabled={loading}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaPaperPlane />
          </motion.button>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-red-100 text-red-700 rounded-lg shadow-md text-sm sm:text-base"
          >
            <strong>Error:</strong> {error}
          </motion.div>
        )}

        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-8 flex flex-col items-center"
            >
              <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mb-4"></div>
              <p className="text-blue-600 font-semibold">Analyzing...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {emotion && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <h2 className="text-2xl font-bold mb-4 text-blue-600">
              Emotion Analysis Result:
            </h2>
            <div
              className="bg-white p-4 sm:p-6 rounded-lg shadow-lg"
              style={{ height: "400px" }}
            >
              <Bar data={chartData} options={chartOptions} />
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
