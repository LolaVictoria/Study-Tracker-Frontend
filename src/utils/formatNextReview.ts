export function formatNextReview(nextReviewAt: string | null): string {
  if (!nextReviewAt) return 'No review scheduled';

  const reviewDate = new Date(nextReviewAt);
  const now = new Date();
  const diffMs = reviewDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return `Overdue by ${Math.abs(diffDays)}d`;
  if (diffDays === 0) return 'Due today';
  if (diffDays === 1) return 'Due tomorrow';
  return `Due in ${diffDays}d`;
}