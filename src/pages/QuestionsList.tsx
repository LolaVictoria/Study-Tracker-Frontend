import { useState } from 'react';
import { useQuestions, useDeleteQuestion } from '../hooks/useQuestions';
import type { Status, Category, Question } from '../types';
import AddQuestionModal from '../components/AddQuestionModal';
import EditQuestionModal from '../components/EditQuestionModal';
import FilterPill from '../components/FilterPill';


const STATUSES: Status[] = ['PERFECT', 'MEDIUM', 'NEEDS_RETRY'];
const CATEGORIES: Category[] = [
  'ARRAY', 'STRING', 'LINKED_LIST', 'STACK', 'QUEUE', 'TREE', 'GRAPH',
  'HEAP', 'BACKTRACKING', 'DYNAMIC_PROGRAMMING', 'GREEDY', 'SLIDING_WINDOW',
  'TWO_POINTERS', 'BINARY_SEARCH', 'HASHING', 'RECURSION', 'MATH',
  'BIT_MANIPULATION', 'OTHER',
];

const statusStyles: Record<Status, string> = {
  PERFECT: 'bg-emerald-100 text-emerald-700',
  MEDIUM: 'bg-orange-100 text-orange-700',
  NEEDS_RETRY: 'bg-rose-100 text-rose-700',
};

export default function QuestionsList() {
  const [statusFilter, setStatusFilter] = useState<Status | undefined>();
  const [categoryFilter, setCategoryFilter] = useState<Category | undefined>();
  const [showAddModal, setShowAddModal] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const deleteQuestion = useDeleteQuestion();

  const { data: questions, isLoading } = useQuestions({
    status: statusFilter,
    category: categoryFilter,
  });

  return (
    <div className="min-h-screen bg-[#F6F3FF] relative overflow-x-hidden">
      <div className="fixed w-115 h-115 rounded-full bg-[#EFEAFF] blur-[70px] opacity-50 -top-40 -right-30 z-0" />
      <div className="fixed w-95 h-95 rounded-full bg-[#E3FBF0] blur-[70px] opacity-50 -bottom-36 -left-24 z-0" />

      <div className="relative z-10 max-w-2xl mx-auto px-7 py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-display text-2xl font-semibold">Questions</h1>
          
          <button
                onClick={() => setShowAddModal(true)}
                className="font-medium text-sm text-white px-4.5 py-2.5 rounded-full bg-linear-to-br from-violet-500 to-violet-400 shadow-lg shadow-violet-300/40"
                >
                + Add question
          </button>
        </div>


           <div className="flex flex-col gap-2 mb-5">
              <div className='flex gap-x-2'>
                  <FilterPill
                    label="All"
                    isActive={!statusFilter}
                    onClick={() => setStatusFilter(undefined)}
                  />
                  {STATUSES.map((s) => (
                    <FilterPill
                      key={s}
                      label={s === 'NEEDS_RETRY' ? 'Needs retry' : s.charAt(0) + s.slice(1).toLowerCase()}
                      isActive={statusFilter === s}
                      onClick={() => setStatusFilter(statusFilter === s ? undefined : s)}
                    />
                  ))}
                </div>
                <div className="h-px bg-[#6B6485]/25" />
                <div className='grid grid-cols-2 md:grid-cols-4 gap-3 '>
                  {CATEGORIES.map((c) => (
                    <FilterPill
                    key={c}
                    label={c.replace(/_/g, ' ').toLowerCase()}
                    isActive={categoryFilter === c}
                    onClick={() => setCategoryFilter(categoryFilter === c ? undefined : c)}
                    />
                  ))}
                </div>
              </div>

        {isLoading && <p className="font-mono text-xs text-[#6B6485]">Loading...</p>}

        <div className="flex flex-col gap-2.5">
          {questions?.map((q) => (
            <div key={q.id} className="bg-white/50 backdrop-blur-lg border border-white/80 rounded-[18px] p-4 shadow-lg shadow-violet-900/5">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm font-medium max-w-sm">{q.title}</p>
                    <a href={q.link}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-[10px] text-violet-700 hover:underline"
                    >
                    {q.link}
                    </a>
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setEditingQuestion(q)} 
                    className="w-7 h-7 rounded-[10px] border border-white/90 bg-white/65 flex items-center justify-center text-xs">
                      ✎
                  </button>
                  {confirmDeleteId === q.id ? (
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex gap-1">
                    <button
                      onClick={() => {
                        deleteQuestion.mutate(q.id, { onSuccess: () => setConfirmDeleteId(null) });
                      }}
                      className="text-[10px] font-mono px-2 py-1 rounded-lg bg-rose-500 text-white"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
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
                    onClick={() => setConfirmDeleteId(q.id)}
                    className="w-7 h-7 rounded-[10px] border border-white/90 bg-white/65 flex items-center justify-center text-xs"
                  >
                    ✕
                  </button>
                )}
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {q.category && (
                  <span className="font-mono text-[10px] font-medium px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-700">
                    {q.category.replace(/_/g, ' ').toLowerCase()}
                  </span>
                )}
                <span className={`font-mono text-[10px] font-medium px-2.5 py-1 rounded-full ${statusStyles[q.status]}`}>
                  {q.status === 'NEEDS_RETRY' ? 'retry' : q.status.toLowerCase()}
                </span>
                <span className="font-mono text-[10px] text-[#6B6485] ml-auto">
                  practiced {q.practiceCount}x
                </span>
              </div>
            </div>
          ))}
        </div>

        {!isLoading && questions?.length === 0 && (
          <p className="font-mono text-xs text-[#6B6485] text-center mt-8">No questions match this filter.</p>
        )}
      </div>
     
      {showAddModal && <AddQuestionModal onClose={() => setShowAddModal(false)} />}
      {editingQuestion && (
        <EditQuestionModal question={editingQuestion} onClose={() => setEditingQuestion(null)} />
      )}
    </div>
  );
}

