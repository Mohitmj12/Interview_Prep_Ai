import React from "react";

function QuestionDetail({ question }) {
  if (!question) return null;

  return (
    <div className="p-6 h-full overflow-y-auto">
      <h2 className="text-lg font-semibold mb-3">
        {question.question}
      </h2>

      <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
        {question.answer || "Answer will appear here."}
      </div>
    </div>
  );
}

export default QuestionDetail;
