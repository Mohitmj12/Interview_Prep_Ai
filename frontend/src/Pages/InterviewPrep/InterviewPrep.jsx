import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import { AnimatePresence, motion } from "framer-motion";
import { LuCircleAlert, LuListCollapse } from "react-icons/lu";
import { toast } from "react-hot-toast";

import DashboardLayout from "../../components/layout/DashboardLayout";
import RoleInfoHeader from "./components/RoleInfoHeader";
import QuestionCard from "../../components/Cards/QuestionCard";
import Drawer from "../../components/Drawer";
import SkeletonLoader from "../../components/Loader/SkeletonLoader";
import SpinnerLoader from "../../components/Loader/SpinnerLoader";

import AIResponsePreview from "./components/AIResponsePreview";
import QuestionPlaceholder from "./components/QuestionPlaceholder";
import QuestionDetail from "./components/QuestionDetail";

import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

function InterviewPrep() {
  const { sessionId } = useParams();

  const [sessionData, setSessionData] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const [openLeanMoreDrawer, setOpenLeanMoreDrawer] = useState(false);
  const [explanation, setExplanation] = useState(null);
  const [errMsg, setErrMsg] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isUpdatedLoader, setIsUpdatedLoader] = useState(false);

  // ✅ Fetch session
  const fetchSessionById = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(
        API_PATHS.SESSION.GET_ONE(sessionId)
      );
      if (response.data?.session) {
        setSessionData(response.data.session);
      }
    } catch (e) {
      console.error("Error fetching session:", e);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Generate AI explanation (Drawer)
  const generateConceptExplanation = async (question) => {
    try {
      setErrMsg("");
      setExplanation(null);
      setIsLoading(true);
      setOpenLeanMoreDrawer(true);

      const response = await axiosInstance.post(
        API_PATHS.AI.GENERATE_EXPLANATION,
        { question }
      );

      if (response.data) {
        setExplanation(response.data);
      }
    } catch (e) {
      setErrMsg("Failed to generate explanation. Try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Load more questions
  const uploadMoreQuestions = async () => {
    try {
      setIsUpdatedLoader(true);

      const aiResponse = await axiosInstance.post(
        API_PATHS.AI.GENERATE_QUESTIONS,
        {
          role: sessionData?.role,
          experience: sessionData?.experience,
          topicsToFocus: sessionData?.topicsToFocus,
          numberOfQuestions: 10,
        }
      );

      await axiosInstance.post(API_PATHS.QUESTION.ADD_TO_SESSION, {
        sessionId,
        questions: aiResponse.data,
      });

      toast.success("Added more questions");
      fetchSessionById();
    } catch (e) {
      toast.error("Failed to load more questions");
    } finally {
      setIsUpdatedLoader(false);
    }
  };

  // ✅ Pin / Unpin
  const toggleQuestionPinStatus = async (questionId) => {
    try {
      await axiosInstance.post(API_PATHS.QUESTION.PIN(questionId));
      fetchSessionById();
    } catch (e) {
      console.error("Pin error:", e);
    }
  };

  useEffect(() => {
    if (sessionId) fetchSessionById();
  }, [sessionId]);

  return (
    <DashboardLayout>
      <RoleInfoHeader
        role={sessionData?.role || ""}
        topicsToFocus={sessionData?.topicsToFocus || ""}
        experience={sessionData?.experience || "-"}
        questions={sessionData?.questions?.length || "-"}
        description={sessionData?.description || ""}
        lastUpdated={
          sessionData?.updatedAt
            ? moment(sessionData.updatedAt).format("Do MMM YYYY")
            : ""
        }
      />

      <div className="container mx-auto pt-4 pb-4 px-4 md:px-17">
        <h2 className="text-lg font-semibold">Interview Q & A</h2>

        <div className="grid grid-cols-12 gap-4 mt-5 mb-10">

          {/* ✅ LEFT PANEL – QUESTIONS */}
          <div className="col-span-12 md:col-span-6">
            {isLoading ? (
              <SkeletonLoader />
            ) : (
              <AnimatePresence>
                {sessionData?.questions?.map((data, index) => (
                  <motion.div
                    key={data._id || index}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <QuestionCard
                      question={data?.question}
                      answer={data?.answer}
                      onClick={() => setSelectedQuestion(data)}
                      onLearnMore={() =>
                        generateConceptExplanation(data.question)
                      }
                      isPinned={data?.isPinned}
                      onTogglePin={() => toggleQuestionPinStatus(data._id)}
                    />

                    {!isLoading &&
                      sessionData?.questions?.length === index + 1 && (
                        <div className="flex justify-center mt-5">
                          <button
                            className="flex items-center gap-3 text-sm text-white font-medium bg-black px-5 py-2 rounded"
                            disabled={isUpdatedLoader}
                            onClick={uploadMoreQuestions}
                          >
                            {isUpdatedLoader ? (
                              <SpinnerLoader />
                            ) : (
                              <LuListCollapse className="text-lg" />
                            )}
                            Load More
                          </button>
                        </div>
                      )}
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          {/* ✅ RIGHT PANEL – PLACEHOLDER / ANSWER */}
          <div className="col-span-12 md:col-span-6 border-l bg-white rounded-lg">
            {selectedQuestion ? (
              <QuestionDetail question={selectedQuestion} />
            ) : (
              <QuestionPlaceholder />
            )}
          </div>
        </div>

        {/* ✅ AI EXPLANATION DRAWER */}
        <Drawer
          isOpen={openLeanMoreDrawer}
          onClose={() => setOpenLeanMoreDrawer(false)}
          title={!isLoading && explanation?.title}
        >
          {errMsg && (
            <p className="flex gap-2 text-sm text-amber-500 font-medium">
              <LuCircleAlert className="mt-1" /> {errMsg}
            </p>
          )}
          {isLoading && <SkeletonLoader />}
          {!isLoading && explanation && (
            <AIResponsePreview content={explanation?.explanation} />
          )}
        </Drawer>
      </div>
    </DashboardLayout>
  );
}

export default InterviewPrep;
