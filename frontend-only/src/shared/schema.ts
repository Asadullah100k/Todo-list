import { z } from "zod";

export const insertTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(500).optional(),
});

export type InsertTask = z.infer<typeof insertTaskSchema>;

export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: "active" | "completed";
  createdAt: string;
  updatedAt: string | null;
  completedAt: string | null;
}
