import { QueryClient } from "@tanstack/react-query";

// Mock API for frontend-only version
const mockTasks = [
  {
    id: 1,
    title: "Example Task",
    description: "This is an example task",
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: null,
    completedAt: null,
  },
];

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<any> {
  // Simulate API calls
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (method === "GET" && url === "/api/tasks") {
    return { json: () => mockTasks };
  }
  
  if (method === "POST" && url === "/api/tasks") {
    const newTask = {
      id: mockTasks.length + 1,
      ...data,
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: null,
      completedAt: null,
    };
    mockTasks.push(newTask);
    return { json: () => newTask };
  }
  
  return { json: () => ({}) };
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
