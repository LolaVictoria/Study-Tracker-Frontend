import { useState } from 'react';
import { useQuestions } from '../hooks/useQuestions';
import type { Status, Category, Question } from '../types';
import AddQuestionModal from '../components/AddQuestionModal';
import EditQuestionModal from '../components/EditQuestionModal';
import ViewQuestionModal from '../components/ViewQuestionModal';
import FilterPill from '../components/FilterPill';
import QuestionCard from '../components/QuestionCard';

const STATUSES: Status[] = ['PERFECT', 'MEDIUM', 'NEEDS_RETRY'];
const CATEGORIES: Category[] = [
  'ARRAY', 'STRING', 'LINKED_LIST', 'INTEGER', 'STACK', 'QUEUE', 'TREE', 'GRAPH',
  'HEAP', 'BACKTRACKING', 'DYNAMIC_PROGRAMMING', 'GREEDY', 'SLIDING_WINDOW',
  'TWO_POINTERS', 'BINARY_SEARCH', 'HASHING', 'RECURSION', 'MATH',
  'BIT_MANIPULATION', 'INTERVAL', 'TRIE', 'GREEDY', 'OTHER',
];

export default function QuestionsList() {
  const [statusFilter, setStatusFilter] = useState<Status | undefined>();
  const [categoryFilter, setCategoryFilter] = useState<Category | undefined>();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [viewQuestion, setViewQuestion] = useState<Question | null>(null);

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
          <div className="flex gap-x-2">
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
            <QuestionCard
              key={q.id}
              question={q}
              onView={setViewQuestion}
              onEdit={setEditingQuestion}
            />
          ))}
        </div>

        {!isLoading && questions?.length === 0 && (
          <p className="font-mono text-xs text-[#6B6485] text-center mt-8">No questions match this filter.</p>
        )}
      </div>

      {showAddModal && <AddQuestionModal onClose={() => setShowAddModal(false)} />}
      {viewQuestion && (
        <ViewQuestionModal question={viewQuestion} onClose={() => setViewQuestion(null)} />
      )}
      {editingQuestion && (
        <EditQuestionModal question={editingQuestion} onClose={() => setEditingQuestion(null)} />
      )}
    </div>
  );
}