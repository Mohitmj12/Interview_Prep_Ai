import React from "react";
import { HiOutlineLightBulb } from "react-icons/hi";

function QuestionPlaceholder() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-10 text-slate-600">
      <HiOutlineLightBulb className="text-6xl text-orange-400 mb-4" />

      <h2 className="text-xl font-semibold mb-2">
        Select a Question
      </h2>

      <p className="text-sm max-w-md leading-relaxed">
        Choose a question from the left panel to see AI-powered
        explanations, examples, and best practices for the selected topic.
      </p>

      <div className="mt-6 flex gap-2 text-xs">
        <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full">
          Concepts
        </span>
        <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full">
          Explanation
        </span>
        <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full">
          Examples
        </span>
      </div>
    </div>
  );
}

export default QuestionPlaceholder;
