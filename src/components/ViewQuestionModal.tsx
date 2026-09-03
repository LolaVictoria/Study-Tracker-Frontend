import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useUpdateNotes } from '../hooks/useQuestions';
import type { Question } from '../types';

interface ViewQuestionModalProps {
  question: Question;
  onClose: () => void;
}

interface ViewFormData {
  notes: string;
}

export default function ViewQuestionModal({ question, onClose }: ViewQuestionModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const updateNotes = useUpdateNotes();
  const { register, handleSubmit } = useForm<ViewFormData>({
    defaultValues: {
      notes: question.notes ?? '',
    },
  });

  function onSubmit(data: ViewFormData) {
    updateNotes.mutate(
      { id: question.id, notes: data.notes },
      { onSuccess: () => setIsEditing(false) }
    );
  }

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white/80 backdrop-blur-xl border border-white/90 rounded-3xl p-7 w-full max-w-md shadow-2xl">
        <div className="flex justify-between items-center mb-1">
          <h2 className="font-display text-xl font-semibold">📖 {question.title}</h2>
          <div className="flex items-center gap-2">
            {!isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="w-7 h-7 rounded-[10px] border border-white/90 bg-white/65 flex items-center justify-center text-xs"
              >
                ✎
              </button>
            )}
            <button onClick={onClose} className="text-[#6B6485] text-lg leading-none">✕</button>
          </div>
        </div>

        
         <a href={question.link}
          target="_blank"
          rel="noreferrer"
          className="font-mono text-[10px] text-violet-700 hover:underline block mb-5"
        >
          {question.link}
        </a>

        <form onSubmit={handleSubmit(onSubmit)}>
          <label className="block text-xs font-mono text-[#6B6485] mb-1">Notes</label>
          <textarea
            {...register('notes')}
            readOnly={!isEditing}
            rows={5}
            className={`w-full mb-6 px-3 py-2 rounded-xl border text-sm focus:outline-none resize-none ${
              isEditing
                ? 'bg-white/70 border-white/90 focus:ring-2 focus:ring-violet-300'
                : 'bg-white/30 border-white/50 text-[#6B6485] cursor-default'
            }`}
          />

          {updateNotes.isError && (
            <p className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2 mb-4">
              Couldn't save changes — try again.
            </p>
          )}

          {isEditing && (
            <button
              type="submit"
              disabled={updateNotes.isPending}
              className="w-full py-2.5 rounded-full bg-gradient-to-br from-violet-500 to-violet-400 text-white text-sm font-medium shadow-lg shadow-violet-300/40 disabled:opacity-60"
            >
              {updateNotes.isPending ? 'Saving...' : 'Save changes'}
            </button>
          )}
        </form>
      </div>
    </div>
  );
}