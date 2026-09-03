import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import type { Question, CategoryStats, AddQuestionRequest, PracticeRequest, Status, Category } from '../types';

export function useQuestions(filters?: { status?: Status; category?: Category }) {
  return useQuery({
    queryKey: ['questions', filters],
    queryFn: async () => {
      const response = await api.get<Question[]>('/api/questions', { params: filters });
      return response.data;
    },
  });
}

export function useDueQuestions() {
  return useQuery({
    queryKey: ['questions', 'due'],
    queryFn: async () => {
      const response = await api.get<Question[]>('/api/questions/due');
      return response.data;
    },
  });
}

export function useAnalytics() {
  return useQuery({
    queryKey: ['questions', 'analytics'],
    queryFn: async () => {
      const response = await api.get<CategoryStats[]>('/api/questions/analytics');
      return response.data;
    },
  });
}

export function useAddQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: AddQuestionRequest) => {
      const response = await api.post<Question>('/api/questions', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
  });
}

export function useUpdateStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: Status }) => {
      const data: PracticeRequest = { status };
      const response = await api.patch<Question>(`/api/questions/update-status/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
  });


  
}

export function useUpdateQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: number; link: string; title: string; category?: Category; status?: Status; notes?: string }) => {
      const response = await api.patch<Question>(`/api/questions/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
  });
}

export function useUpdateQuestionFull() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: number; link?: string; title?: string; category?: Category; status?: Status; notes?: string }) => {
      const response = await api.patch<Question>(`/api/questions/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
  });
}

export function useUpdateNotes() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, notes }: { id: number; notes: string }) => {
      const response = await api.patch<Question>(`/api/questions/notes/${id}`, { notes });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
  });
}

export function useDeleteQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/api/questions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
  });
}