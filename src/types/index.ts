export type Status = 'PERFECT' | 'MEDIUM' | 'NEEDS_RETRY';

export type Category =
  | 'ARRAY' | 'STRING' | 'LINKED_LIST' | 'STACK' | 'QUEUE'
  | 'TREE' | 'GRAPH' | 'HEAP' | 'BACKTRACKING'
  | 'DYNAMIC_PROGRAMMING' | 'GREEDY' | 'SLIDING_WINDOW'
  | 'TWO_POINTERS' | 'BINARY_SEARCH' | 'HASHING'
  | 'RECURSION' | 'MATH' | 'BIT_MANIPULATION' | 'OTHER';

export interface Question {
  id: number;
  link: string;
  title: string;
  notes: string | null;
  status: Status;
  category: Category | null;
  practiceCount: number;
  lastPracticedAt: string | null;
  nextReviewAt: string | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface CategoryStats {
  category: Category;
  perfect: number;
  medium: number;
  needsRetry: number;
}

export interface AddQuestionRequest {
  link: string;
  title: string;
  category: Category;
  status: Status;
  notes : string;
}

export interface PracticeRequest {
  status: Status;
}