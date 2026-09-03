import { useForm } from 'react-hook-form';
import { useUpdateQuestion } from '../hooks/useQuestions';
import type { Question, Category, Status } from '../types';
import { useState } from 'react';

const CATEGORIES: Category[] = [
  'ARRAY', 'STRING', 'LINKED_LIST', 'STACK', 'QUEUE', 'TREE', 'GRAPH',
  'HEAP', 'BACKTRACKING', 'DYNAMIC_PROGRAMMING', 'GREEDY', 'SLIDING_WINDOW',
  'TWO_POINTERS', 'BINARY_SEARCH', 'HASHING', 'RECURSION', 'MATH',
  'BIT_MANIPULATION', 'OTHER',
];

const STATUSES: { value: Status; label: string }[] = [
  { value: 'NEEDS_RETRY', label: 'Needs retry' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'PERFECT', label: 'Perfect' },
];

interface EditQuestionModalProps {
  question: Question;
  onClose: () => void;
}

interface EditFormData {
  link: string;
  title: string;
  category: Category | '';
  notes: string;
  status: Status;
}

export default function EditQuestionModal({ question, onClose }: EditQuestionModalProps) {
  const updateQuestion = useUpdateQuestion();
  const [selectedStatus, setSelectedStatus] = useState<Status>('NEEDS_RETRY');
  const { register, handleSubmit } = useForm<EditFormData>({
    defaultValues: {
      title: question.title,
      link: question.link,
      category: question.category ?? '',
      notes: question.notes ?? '',
      status: question.status ?? 'NEEDS_RETRY'
    },
  });

  function onSubmit(data: EditFormData) {
    updateQuestion.mutate(
      {
        id: question.id,
        link: data.link,
        title: data.title,
        category: data.category || undefined,
        notes: data.notes,
        status: selectedStatus,
      },
      { onSuccess: () => onClose() }
    );
  }

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white/80 backdrop-blur-xl border border-white/90 rounded-3xl p-7 w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-5">
          <h2 className="font-display text-xl font-semibold">Edit question</h2>
          <button onClick={onClose} className="text-[#6B6485] text-lg leading-none">✕</button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <label className="block text-xs font-mono text-[#6B6485] mb-1">Link</label>
          <input
            {...register('link', { required: true })}
            className="w-full mb-4 px-3 py-2 rounded-xl bg-white/70 border border-white/90 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
          />
          <label className="block text-xs font-mono text-[#6B6485] mb-1">Title</label>
          <input
            {...register('title', { required: true })}
            className="w-full mb-4 px-3 py-2 rounded-xl bg-white/70 border border-white/90 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
          />

          <label className="block text-xs font-mono text-[#6B6485] mb-1">Category</label>
          <select
            {...register('category')}
            className="w-full mb-4 px-3 py-2 rounded-xl bg-white/70 border border-white/90 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
          >
            <option value="">No category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c.replace(/_/g, ' ').toLowerCase()}</option>
            ))}
          </select>

          <label className="block text-xs font-mono text-[#6B6485] mb-2">How well do you know it?</label>
          <div className="flex gap-2 mb-6">
            {STATUSES.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => setSelectedStatus(s.value)}
                className={`flex-1 font-mono text-[11px] py-2 rounded-xl border transition-colors ${
                  selectedStatus === s.value
                    ? 'bg-violet-500 text-white border-violet-500'
                    : 'bg-white/60 text-[#6B6485] border-white/90'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <label className="block text-xs font-mono text-[#6B6485] mb-1">Notes</label>
          <textarea
            {...register('notes')}
            rows={3}
            className="w-full mb-6 px-3 py-2 rounded-xl bg-white/70 border border-white/90 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 resize-none"
          />

          <button
            type="submit"
            disabled={updateQuestion.isPending}
            className="w-full py-2.5 rounded-full bg-linear-to-br from-violet-500 to-violet-400 text-white text-sm font-medium shadow-lg shadow-violet-300/40 disabled:opacity-60"
          >
            {updateQuestion.isPending ? 'Saving...' : 'Save changes'}
          </button>
        </form>
      </div>
    </div>
  );
}