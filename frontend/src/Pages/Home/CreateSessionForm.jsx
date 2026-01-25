import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import SpinnerLoader from "../../components/Loader/SpinnerLoader";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

function CreateSessionForm() {
  const [formData, setFormData] = useState({
    role: "",
    experience: "",
    topicsToFocus: "",
    description: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleChanges = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleCreateSession = async () => {
    const { role, experience, topicsToFocus, description } = formData;

    // ✅ Basic validation
    if (!role || !experience || !topicsToFocus) {
      setError("Please fill all the required fields.");
      return;
    }

    // ✅ Convert comma-separated topics → array (BACKEND EXPECTS ARRAY)
    const topicsArray = topicsToFocus
      .split(",")
      .map((topic) => topic.trim())
      .filter(Boolean);

    setError(null);
    setIsLoading(true);

    try {
      // 1️⃣ Generate AI questions
      const aiResponse = await axiosInstance.post(
        API_PATHS.AI.GENERATE_QUESTIONS,
        {
          role,
          experience,
          topicsToFocus: topicsArray,
          numberOfQuestions: 10,
        }
      );

      // ✅ Normalize AI response safely
      const generatedQuestions =
        aiResponse.data?.questions || aiResponse.data || [];

      if (!Array.isArray(generatedQuestions) || !generatedQuestions.length) {
        throw new Error("AI did not return valid questions.");
      }

      // 2️⃣ Create interview session
      const response = await axiosInstance.post(
        API_PATHS.SESSION.CREATE,
        {
          role,
          experience,
          topicsToFocus: topicsArray.join(", "),
          description,
          questions: generatedQuestions,
        }
      );

      // 3️⃣ Redirect to interview page
      if (response.data?.session?._id) {
        navigate(`/interview-prep/${response.data.session._id}`);
      }
    } catch (err) {
      console.error("Create session error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-[85vw] md:w-[35vw] p-7 flex flex-col justify-center">
      <h3 className="text-lg font-semibold text-black">
        Start a New Interview Journey
      </h3>

      <p className="text-xs text-slate-700 mt-[5px] mb-3">
        Fill out a few quick details and unlock your personalized set of
        interview questions!
      </p>

      {/* ⚠️ Intentionally NOT using form submit to avoid modal unmount warning */}
      <div className="flex flex-col gap-3">
        <Input
          value={formData.role}
          onChange={(e) => handleChanges("role", e.target.value)}
          label="Target Role *"
          placeholder="(e.g., Frontend Developer, UI/UX Designer)"
          type="text"
        />

        <Input
          value={formData.experience}
          onChange={(e) => handleChanges("experience", e.target.value)}
          label="Years of Experience *"
          placeholder="(e.g., 1, 3, 5+)"
          type="number"
        />

        <Input
          value={formData.topicsToFocus}
          onChange={(e) => handleChanges("topicsToFocus", e.target.value)}
          label="Topics to Focus On *"
          placeholder="React, Node.js, MongoDB"
          type="text"
        />

        <Input
          value={formData.description}
          onChange={(e) => handleChanges("description", e.target.value)}
          label="Description"
          placeholder="Optional notes or goals"
          type="text"
        />

        {error && (
          <p className="text-red-500 text-xs pb-2.5">{error}</p>
        )}

        <button
          type="button"
          disabled={isLoading}
          onClick={handleCreateSession}
          className="btn-primary w-full mt-2"
        >
          {isLoading && <SpinnerLoader />} Create Session
        </button>
      </div>
    </div>
  );
}

export default CreateSessionForm;