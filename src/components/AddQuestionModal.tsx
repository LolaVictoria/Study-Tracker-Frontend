import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAddQuestion } from '../hooks/useQuestions';
import type { Category, Status, AddQuestionRequest } from '../types';
import TextArea from './textarea';

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

interface AddQuestionModalProps {
  onClose: () => void;
}

export default function AddQuestionModal({ onClose }: AddQuestionModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<Status>('NEEDS_RETRY');
  const addQuestion = useAddQuestion();
  const [text, setText] = useState('')

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
  }

  const { register, handleSubmit, formState: { errors } } = useForm<AddQuestionRequest>();

  function onSubmit(data: AddQuestionRequest) {
    addQuestion.mutate(
      { ...data, status: selectedStatus },
      { onSuccess: () => onClose() }
    );
  }

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white/80 backdrop-blur-xl border border-white/90 rounded-3xl p-7 w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-5">
          <h2 className="font-display text-xl font-semibold">Add question</h2>
          <button onClick={onClose} className="text-[#6B6485] text-lg leading-none">✕</button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <label className="block text-xs font-mono text-[#6B6485] mb-1">Link</label>
          <input
            {...register('link', { required: 'Link is required' })}
            placeholder="https://leetcode.com/problems/..."
            className="w-full mb-1 px-3 py-2 rounded-xl bg-white/70 border border-white/90 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
          />
          {errors.link && <p className="text-[11px] text-rose-600 mb-3">{errors.link.message}</p>}
          {!errors.link && <div className="mb-3" />}

          <label className="block text-xs font-mono text-[#6B6485] mb-1">Title</label>
          <input
            {...register('title', { required: 'Title is required' })}
            placeholder="Two Sum"
            className="w-full mb-1 px-3 py-2 rounded-xl bg-white/70 border border-white/90 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
          />
          {errors.title && <p className="text-[11px] text-rose-600 mb-3">{errors.title.message}</p>}
          {!errors.title && <div className="mb-3" />}

          <label className="block text-xs font-mono text-[#6B6485] mb-1">Notes</label>
          <TextArea
            {...register('notes', { required: 'Note is required' })}
            value={text}
            onChange={handleTextChange}
            placeholder="Anything hint, pattern, tip etc you will like to remember later..."
            autoHeight
            resize="none"
            className="max-w-md"
            // className="w-full mb-1 px-3 py-2 rounded-xl bg-white/70 border border-white/90 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
            rows={5}
          />  
          {errors.notes && <p className="text-[11px] text-rose-600 mb-3">{errors.notes.message}</p>}
          {!errors.notes && <div className="mb-3" />}

          <label className="block text-xs font-mono text-[#6B6485] mb-1">Category</label>
          <select
            {...register('category')}
            className="w-full mb-4 px-3 py-2 rounded-xl bg-white/70 border border-white/90 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300"
          >
            <option value="">Select a category</option>
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

          {addQuestion.isError && (
            <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2 mb-4">
              Couldn't add question — it may already be tracked.
            </p>
          )}

          <button
            type="submit"
            disabled={addQuestion.isPending}
            className="w-full py-2.5 rounded-full bg-gradient-to-br from-violet-500 to-violet-400 text-white text-sm font-medium shadow-lg shadow-violet-300/40 disabled:opacity-60"
          >
            {addQuestion.isPending ? 'Adding...' : 'Add question'}
          </button>
        </form>
      </div>
    </div>
  );
}