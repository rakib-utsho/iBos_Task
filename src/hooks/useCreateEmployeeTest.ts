"use client";

import { createEmployeeTest } from "@/services/tests";
import { CreateTestPayload } from "@/types/exam";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateEmployeeTest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTestPayload) => createEmployeeTest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employee-tests"] });
      queryClient.invalidateQueries({ queryKey: ["candidate-tests"] });
    },
  });
};
