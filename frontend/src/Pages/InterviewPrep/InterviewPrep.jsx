// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import moment from "moment";
// import { AnimatePresence, motion, useScroll } from "framer-motion";
// import { LuCircleAlert, LuListCollapse } from "react-icons/lu";
// import SpinnerLoader from "../../components/Loader/SpinnerLoader";
// import { toast } from "react-hot-toast";
// import DashboardLayout from "../../components/layout/DashboardLayout";
// import RoleInfoHeader from "./components/RoleInfoHeader";
// import axiosInstance from "../../utils/axiosInstance";
// import { API_PATHS } from "../../utils/apiPaths";
// import QuestionCard from "../../components/Cards/QuestionCard";
// import AIResponsePreview from "./components/AIResponsePreview";
// import Drawer from "../../components/Drawer";
// import SkeletonLoader from "../../components/Loader/SkeletonLoader";

// function InterviewPrep() {
//   const { sessionId } = useParams();

//   const [sessionData, setSessionData] = useState(null);
//   const [errMsg, setErrMsg] = useState("");

//   const [openLeanMoreDrawer, setOpenLeanMoreDrawer] = useState(false);
//   const [explanation, setExplanation] = useState(null);

//   const [isLoading, setIsLoading] = useState(false);
//   const [isUpdatedLoader, setIsUpdatedLoader] = useState(false);

//   const generateConceptExplanation = async (question) => {
//     try{
//       setErrMsg("")
//       setExplanation(null)
//       setIsLoading(true)
//       setOpenLeanMoreDrawer(true)

//       const response = await axiosInstance.post(
//         API_PATHS.AI.GENERATE_EXPLANATION,{
//           question
//         }
//       )

//       if(response.data){
//         setExplanation(response.data)
//       }
//     }catch(e){
//       setExplanation(null)
//       setErrMsg("Failed to generate explanation, Try again later")
//     } finally{
//       setIsLoading(false)
//     }
//   };

//   const uploadMoreQuestions = async () => {};

//   const toggleQuestionPinStatus = async (questionId) => {
//     try{
//       const response = await axiosInstance.post(
//         API_PATHS.QUESTION.PIN(questionId)
//       )
//       if(response && response.data.question){
//         fetchSessionById()
//       }
//     }catch(e){
//       console.error("error: ", e);

//     }
//   };

//   useEffect(() => {
//   const fetchSessionById = async () => {
//     try {
//       setIsLoading(true); // ✅ Start loading first
//       const response = await axiosInstance.get(API_PATHS.SESSION.GET_ONE(sessionId));
//       if (response.data?.session) {
//         setSessionData(response.data.session);
//       }
//     } catch (e) {
//       console.error("error: ", e);
//     } finally {
//       setIsLoading(false); // ✅ Stop loading
//     }
//   };

//   if (sessionId) {
//     fetchSessionById(); // ✅ Call on mount
//   }
// }, []);
//   return (
//     <DashboardLayout>
//       <RoleInfoHeader
//         role={sessionData?.role || ""}
//         topicsToFocus={sessionData?.topicsToFocus || ""}
//         experience={sessionData?.experience || "-"}
//         questions={sessionData?.questions?.length || "-"}
//         description={sessionData?.description || ""}
//         lastUpdated={
//           sessionData?.updatedAt
//             ? moment(sessionData.updatedAt).format("Do MMM YYYY")
//             : ""
//         }
//       />

//       <div className="container mx-auto pt-4 pb-4 px-4 md:px-17">
//         <h2 className="text-lg font-semibold color-black">Interview Q & A</h2>
//         <div className="grid grid-cols-12 gap-4 mt-5 mb-10">
//           <div className={`col-span-12 ${
//             openLeanMoreDrawer ? "md:col-span-7" : "md:col-span-8"
//           }`}>
//              {isLoading ? (
//       <SkeletonLoader /> // ✅ Show skeleton while loading
//     ) : (
//             <AnimatePresence>
//               {sessionData?.questions?.map((data,index) => {
//                 return (
//                   <motion.div
//                   key={data._id || index}
//                   initial={{opacity: 0, y: -20}}
//                   animate={{opacity: 1, y: 0}}
//                   exit={{opacity: 0, y: 0.95}}
//                   transition={{
//                     duration: 0.4,
//                     type:"spring",
//                     stiffness:100,
//                     delay: index * 0.1,
//                     damping: 15
//                   }}
//                   layout
//                   layoutId={`question-${data._id || index}`}
//                   >
//                     <>
//                     <QuestionCard
//                     question={data?.question}
//                     answer={data?.answer}
//                     onLearnMore={() => generateConceptExplanation(data.question)}
//                     isPinned={data?.isPinned}
//                     onTogglePin={() => toggleQuestionPinStatus(data._id)}
//                     />
//                     </>
//                   </motion.div>
//                 )
//               })}
//             </AnimatePresence>
//     )}
//           </div>
//         </div>

//         <div>
//           <Drawer
//           isOpen={openLeanMoreDrawer}
//           onClose={() => setOpenLeanMoreDrawer(false)}
//           title={!isLoading && explanation?.title}
//           >
//             {
//               errMsg && (
//                 <p className="flex gap-2 text-sm text-amber-500 font-medium"><LuCircleAlert className="mt-1" /> {errMsg}</p>
//               )
//             }
//             {console.log("isLoading:", isLoading)}
//             {isLoading && <SkeletonLoader />}
//             {
//               !isLoading && explanation && (
//                 <AIResponsePreview content={explanation?.explanation} />
//               )
//             }
//           </Drawer>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// }

// export default InterviewPrep;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { LuCircleAlert, LuListCollapse } from "react-icons/lu";
import SpinnerLoader from "../../components/Loader/SpinnerLoader";
import { toast } from "react-hot-toast";
import DashboardLayout from "../../components/layout/DashboardLayout";
import RoleInfoHeader from "./components/RoleInfoHeader";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import QuestionCard from "../../components/Cards/QuestionCard";
import AIResponsePreview from "./components/AIResponsePreview";
import Drawer from "../../components/Drawer";
import SkeletonLoader from "../../components/Loader/SkeletonLoader";

function InterviewPrep() {
  const { sessionId } = useParams();

  const [sessionData, setSessionData] = useState(null);
  const [errMsg, setErrMsg] = useState("");

  const [openLeanMoreDrawer, setOpenLeanMoreDrawer] = useState(false);
  const [explanation, setExplanation] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isUpdatedLoader, setIsUpdatedLoader] = useState(false);

  const fetchSessionById = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.SESSION.GET_ONE(sessionId)
      );

      if (response.data && response.data.session) {
        setSessionData(response.data.session);
      }
    } catch (e) {
      console.error("error: ", e);
    }
  };

  const generateConceptExplanation = async (question) => {
    try {
      setErrMsg("");
      setExplanation(null);
      setIsLoading(true);
      setOpenLeanMoreDrawer(true);

      const response = await axiosInstance.post(
        API_PATHS.AI.GENERATE_EXPLANATION,
        {
          question,
        }
      );

      if (response.data) {
        setExplanation(response.data);
      }
    } catch (e) {
      setExplanation(null);
      setErrMsg("Failed to generate explanation, Try again later");
    } finally {
      setIsLoading(false);
    }
  };

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
      const generatedQuestions = aiResponse.data;
      const response = await axiosInstance.post(
        API_PATHS.QUESTION.ADD_TO_SESSION,
        {
          sessionId,
          questions: generatedQuestions,
        }
      );

      if (response.data) {
        toast.success("Added More Q&A !!");
        fetchSessionById();
      }
    } catch (e) {
      if (e.response && e.response.data.message) {
        setError(e.response.data.message);
      } else {
        setError("Something went wrong, Please try again.");
      }
    } finally {
      setIsUpdatedLoader(false);
      setIsLoading(false);
    }
  };

  const toggleQuestionPinStatus = async (questionId) => {
    try {
      const response = await axiosInstance.post(
        API_PATHS.QUESTION.PIN(questionId)
      );
      if (response && response.data.question) {
        fetchSessionById();
      }
    } catch (e) {
      console.error("error: ", e);
    }
  };

  useEffect(() => {
    if (sessionId) {
      fetchSessionById();
    }
    return () => {};
  }, []);
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
        <h2 className="text-lg font-semibold color-black">Interview Q & A</h2>
        <div className="grid grid-cols-12 gap-4 mt-5 mb-10">
          <div
            className={`col-span-12 ${
              openLeanMoreDrawer ? "md:col-span-7" : "md:col-span-8"
            }`}
          >
            <AnimatePresence>
              {sessionData?.questions?.map((data, index) => {
                return (
                  <motion.div
                    key={data._id || index}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 0.95 }}
                    transition={{
                      duration: 0.4,
                      type: "spring",
                      stiffness: 100,
                      delay: index * 0.1,
                      damping: 15,
                    }}
                    layout
                    layoutId={`question-${data._id || index}`}
                  >
                    <>
                      <QuestionCard
                        question={data?.question}
                        answer={data?.answer}
                        onLearnMore={() =>
                          generateConceptExplanation(data.question)
                        }
                        isPinned={data?.isPinned}
                        onTogglePin={() => toggleQuestionPinStatus(data._id)}
                      />

                      {!isLoading &&
                        sessionData?.questions?.length == index + 1 && (
                          <div className="flex items-center justify-center mt-5">
                            <button
                              className="flex items-center gap-3 text-sm text-white font-medium bg-black px-5 py-2 mr-2 rounded text-nowrap cursor-pointer"
                              disabled={isLoading || isUpdatedLoader}
                              onClick={uploadMoreQuestions}
                            >
                              {isUpdatedLoader ? (
                                <SpinnerLoader />
                              ) : (
                                <LuListCollapse className="text-lg" />
                              )}{" "}
                              Learn More
                            </button>
                          </div>
                        )}
                    </>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        <div>
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
      </div>
    </DashboardLayout>
  );
}

export default InterviewPrep;
