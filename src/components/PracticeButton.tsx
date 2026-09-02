import { useState } from 'react';
import { useUpdateStatus } from '../hooks/useQuestions';
import type { Status } from '../types';

interface PracticeButtonProps {
  questionId: number;
}

export default function PracticeButton({ questionId }: PracticeButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const recordPractice = useUpdateStatus();

  function handleSelect(status: Status) {
    recordPractice.mutate(
      { id: questionId, status },
      { onSuccess: () => setIsOpen(false) }
    );
  }

  if (isOpen) {
    return (
      <>
      <div className="flex gap-1">
        <button
          onClick={() => handleSelect('PERFECT')}
         
          disabled={recordPractice.isPending}
          className="text-[10px] font-mono px-2 py-1 rounded-full bg-emerald-100 text-emerald-700"
        >
          Perfect
        </button>
        <button
          onClick={() => handleSelect('MEDIUM')}
          disabled={recordPractice.isPending}
          className="text-[10px] font-mono px-2 py-1 rounded-full bg-orange-100 text-orange-700"
        >
          Medium
        </button>
        <button
          onClick={() => handleSelect('NEEDS_RETRY')}
          disabled={recordPractice.isPending}
          className="text-[10px] font-mono px-2 py-1 rounded-full bg-rose-100 text-rose-700"
        >
          Retry
        </button>
      </div>
      {recordPractice.isError && (
        <p className="text-[10px] text-rose-600 font-mono">Failed — try again</p>
      )}
       </>
    );
  }

  return (
    <button
      onClick={() => setIsOpen(true)}
      className="text-xs font-medium px-3 py-1.5 rounded-full bg-violet-500 text-white"
    >
      Practice
    </button>
  );
}