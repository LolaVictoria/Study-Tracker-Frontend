import { useDueQuestions, useAnalytics } from '../hooks/useQuestions';
import PracticeButton from '../components/PracticeButton';

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading, isError: statsError } = useAnalytics();
  const { data: dueQuestions, isLoading: dueLoading, isError: dueError } = useDueQuestions();
 
  
  const totals = stats?.reduce(
    (acc, s) => ({
      perfect: acc.perfect + s.perfect,
      medium: acc.medium + s.medium,
      needsRetry: acc.needsRetry + s.needsRetry,
    }),
    { perfect: 0, medium: 0, needsRetry: 0 }
  ) ?? { perfect: 0, medium: 0, needsRetry: 0 };

  return (
    <div className="min-h-screen bg-[#F6F3FF] relative overflow-x-hidden">
      {(dueLoading || statsLoading) && (
        <div className="bg-white/50 backdrop-blur-lg border border-white/80 rounded-[18px] p-4 mb-6 text-center">
          <p className="font-mono text-xs text-[#6B6485]">
            Waking up the server — this can take up to a minute after inactivity...
          </p>
        </div>
      )}

      {(dueError || statsError) && (
        <div className="bg-rose-50 border border-rose-200 rounded-[18px] p-4 mb-6 text-center">
          <p className="font-mono text-xs text-rose-600">
            Couldn't reach the server. Try refreshing in a moment.
          </p>
        </div>
      )}
      <div className="fixed w-[480px] h-[480px] rounded-full bg-[#EFEAFF] blur-[70px] opacity-50 -top-40 -left-30 z-0" />
      <div className="fixed w-[420px] h-[420px] rounded-full bg-[#E3FBF0] blur-[70px] opacity-50 -bottom-36 -right-24 z-0" />
      <div className="fixed w-[360px] h-[360px] rounded-full bg-[#FFF0E4] blur-[70px] opacity-50 top-[40%] right-[10%] z-0" />

      <div className="relative z-10 max-w-3xl mx-auto px-8 py-12">
        <div className="flex justify-between items-end mb-8">
          <div>
            <p className="font-mono text-xs text-[#6B6485] mt-1">
              {dueQuestions?.length ?? 0} question{dueQuestions?.length === 1 ? '' : 's'} due today
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard label="Total" value={totals.perfect + totals.medium + totals.needsRetry} color="text-violet-700" />
          <StatCard label="Perfect" value={totals.perfect} color="text-emerald-700" />
          <StatCard label="Medium" value={totals.medium} color="text-orange-700" />
          <StatCard label="Retry" value={totals.needsRetry} color="text-rose-700" />
        </div>

        <div className="bg-white/50 backdrop-blur-lg border border-white/80 rounded-[22px] p-6 mb-6 shadow-lg shadow-violet-900/5">
          <h2 className="font-display font-semibold text-base mb-4">Due today</h2>
          {dueLoading && <p className="font-mono text-xs text-[#6B6485]">Loading...</p>}
          {!dueLoading && dueQuestions?.length === 0 && (
            <p className="font-mono text-xs text-[#6B6485]">Nothing due — you're all caught up.</p>
          )}

          <div className="flex flex-col gap-2.5">
            {dueQuestions?.map((q) => (
              <div
                key={q.id}
                className="flex justify-between items-center bg-white/65 border border-white/90 rounded-2xl px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium">{q.title}</p>
                  <p className="font-mono text-[11px] text-[#6B6485] mt-1">
                    {q.category ?? 'uncategorized'} ·{' '}
                    {q.nextReviewAt && new Date(q.nextReviewAt) < new Date() ? 'overdue' : 'due today'}
                  </p>
                </div>
                <PracticeButton questionId={q.id} />
              </div>
            ))}
          </div>
        </div>

        {statsLoading && <p className="font-mono text-xs text-[#6B6485]">Loading topic breakdown...</p>}
        {stats && stats.length > 0 && (
          <div className="bg-white/50 backdrop-blur-lg border border-white/80 rounded-[22px] p-6 shadow-lg shadow-violet-900/5">
            <h2 className="font-display font-semibold text-base mb-4">By topic</h2>
            <div className="flex flex-col gap-4">
              {stats.map((s) => {
                const total = s.perfect + s.medium + s.needsRetry;
                return (
                  <div key={s.category}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span>{s.category}</span>
                      <span className="font-mono text-[11px] text-[#6B6485]">{total} solved</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/70 overflow-hidden flex">
                      <div className="bg-emerald-600" style={{ width: `${(s.perfect / total) * 100}%` }} />
                      <div className="bg-orange-500" style={{ width: `${(s.medium / total) * 100}%` }} />
                      <div className="bg-rose-500" style={{ width: `${(s.needsRetry / total) * 100}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-white/50 backdrop-blur-lg border border-white/80 rounded-[18px] p-5 shadow-lg shadow-violet-900/5">
      <p className="font-mono text-[11px] text-[#6B6485] uppercase tracking-wide mb-2">{label}</p>
      <p className={`font-display text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );
}