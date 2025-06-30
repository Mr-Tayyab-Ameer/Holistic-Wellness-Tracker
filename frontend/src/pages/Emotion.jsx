import React, { useEffect, useState } from "react";
import axios from "axios";

const Emotion = () => {
  const [userInput, setUserInput] = useState("");
  const [error, setError] = useState("");
  const [detectedEmotion, setDetectedEmotion] = useState("");
  const [savedTips, setSavedTips] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validText = /^[A-Za-z\s]+$/;
    if (!validText.test(userInput)) {
      setError("Please enter only letters and spaces.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await axios.post(
        "http://localhost:5000/api/emotion",
        { input: userInput },
        { headers: { token } }
      );

      const { emotion, tips } = res.data;
      setDetectedEmotion(emotion);

      const saveRes = await axios.post(
        "http://localhost:5000/api/emotion/save",
        { emotion, tips },
        { headers: { token } }
      );

      setSavedTips((prev) => [...saveRes.data.tips, ...prev]);
      setUserInput("");
    } catch (err) {
      setError(err.response?.data?.message || "Error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/emotion/${id}`, {
        headers: { token },
      });
      setSavedTips((prev) => prev.filter((tip) => tip._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const fetchSavedTips = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/emotion/saved", {
        headers: { token },
      });
      setSavedTips(res.data);
    } catch (err) {
      console.error("Failed to fetch tips", err);
    }
  };

  useEffect(() => {
    fetchSavedTips();
  }, []);

  return (
    <div className="mx-auto md:mx-60">
      <h1 className="text-3xl font-bold text-primary mb-6">
        Emotion Insight & Tips
      </h1>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">
          How are you feeling today?
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Enter your emotion-related thoughts"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-primary text-white py-2 px-4 rounded-md hover:bg-primaryhover transition duration-200"
              disabled={loading}
            >
              {loading ? "Processing..." : "Get Tips"}
            </button>
            <button
              type="button"
              onClick={() => {
                setUserInput("");
                setDetectedEmotion("");
                setError("");
              }}
              className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded-md transition duration-200"
            >
              Clear
            </button>
          </div>
        </form>

        {error && <p className="text-red-600 mt-4">{error}</p>}
        {detectedEmotion && (
          <p className="text-green-700 font-medium mt-2">
            Detected Emotion:{" "}
            <span className="capitalize">{detectedEmotion}</span>
          </p>
        )}
      </div>

      {savedTips.length > 0 ? (
        savedTips.map((tip) => (
          <div
            key={tip._id}
            className="bg-white p-4 rounded-lg shadow mb-4 border-l-4 border-blue-500"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-700">
                Emotion: <span className="capitalize">{tip.emotion}</span>
              </h3>
              <button
                onClick={() => handleDelete(tip._id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-2">
              {new Date(tip.createdAt).toLocaleString()}
            </p>
            <p className="font-medium">{tip.title}</p>
            <a
              href={tip.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline block"
            >
              {tip.link}
            </a>
            <p>{tip.description}</p>
          </div>
        ))
      ) : (
        <p className="text-gray-600 text-center">No emotion tips saved yet.</p>
      )}
    </div>
  );
};

export default Emotion;
