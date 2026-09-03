import { useState } from 'react';
import { useDeleteQuestion } from '../hooks/useQuestions';
import { formatNextReview } from '../utils/formatNextReview';
import type { Question, Status } from '../types';

const statusStyles: Record<Status, string> = {
  PERFECT: 'bg-emerald-100 text-emerald-700',
  MEDIUM: 'bg-orange-100 text-orange-700',
  NEEDS_RETRY: 'bg-rose-100 text-rose-700',
};

interface QuestionCardProps {
  question: Question;
  onView: (question: Question) => void;
  onEdit: (question: Question) => void;
}

export default function QuestionCard({ question, onView, onEdit }: QuestionCardProps) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const deleteQuestion = useDeleteQuestion();

  return (
    <div>
        <div className="bg-white/50 backdrop-blur-lg border border-white/80 rounded-[18px] p-4 shadow-lg shadow-violet-900/5">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <div className="flex items-center">
                        <p className="text-sm font-medium max-w-sm">{question.title}</p>
                        <button
                        onClick={() => onView(question)}
                        className="w-7 h-7 rounded-[10px] border border-white/90 bg-white/65 flex items-center justify-center text-xs"
                        >
                        📖
                        </button>
                    </div>
                    
                    <a href={question.link}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-[10px] text-violet-700 hover:underline"
                    >
                        {question.link}
                    </a>
                </div>

                <div className="flex gap-1.5">
                    <button
                        onClick={() => onEdit(question)}
                        className="w-7 h-7 rounded-[10px] border border-white/90 bg-white/65 flex items-center justify-center text-xs"
                    >
                        ✎
                    </button>

                {confirmingDelete ? (
                    <div className="flex flex-col items-end gap-1">
                        <div className="flex gap-1">
                            <button
                            onClick={() => {
                                deleteQuestion.mutate(question.id, {
                                onSuccess: () => setConfirmingDelete(false),
                                });
                            }}
                            className="text-[10px] font-mono px-2 py-1 rounded-lg bg-rose-500 text-white"
                            >
                            Delete
                            </button>
                            <button
                            onClick={() => setConfirmingDelete(false)}
                            className="text-[10px] font-mono px-2 py-1 rounded-lg bg-white/70 border border-white/90 text-[#6B6485]"
                            >
                            Cancel
                            </button>
                        </div>
                        {deleteQuestion.isError && (
                            <p className="text-[10px] text-rose-600">Couldn't delete — try again</p>
                        )}
                    </div>
                ) : (
                    <button
                    onClick={() => setConfirmingDelete(true)}
                    className="w-7 h-7 rounded-[10px] border border-white/90 bg-white/65 flex items-center justify-center text-xs"
                    >
                    ✕
                    </button>
                )}
                </div>
            </div>

            <div className="flex items-center gap-1.5">
                {question.category && (
                <span className="font-mono text-[10px] font-medium px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-700">
                    {question.category.replace(/_/g, ' ').toLowerCase()}
                </span>
                )}
                <span className={`font-mono text-[10px] font-medium px-2.5 py-1 rounded-full ${statusStyles[question.status]}`}>
                {question.status === 'NEEDS_RETRY' ? 'retry' : question.status.toLowerCase()}
                </span>
                <span className="font-mono text-[10px] text-[#6B6485] ml-auto">
                practiced {question.practiceCount}x
                </span>
            </div>

            <p className="font-mono text-[12px] text-[#6B6485] mt-2.5">
                {formatNextReview(question.nextReviewAt)}
            </p>
        </div>
    </div>
  );
}