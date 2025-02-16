import { useQuery, useMutation } from "@tanstack/react-query";
import { Task } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { TaskForm } from "./task-form";

interface TaskListProps {
  filterFn: (tasks: Task[]) => Task[];
}

export function TaskList({ filterFn }: TaskListProps) {
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<number | null>(null);

  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: number; updates: Partial<Task> }) => {
      const res = await apiRequest("PATCH", `/api/tasks/${id}`, updates);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({
        title: "Task updated",
        description: "The task has been successfully updated.",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({
        title: "Task deleted",
        description: "The task has been successfully deleted.",
      });
    },
  });

  if (isLoading) {
    return <div className="text-center">Loading tasks...</div>;
  }

  const filteredTasks = filterFn(tasks);

  return (
    <div className="space-y-4">
      {filteredTasks.map((task) => (
        <Card key={task.id}>
          <CardContent className="p-4">
            {editingId === task.id ? (
              <div className="space-y-4">
                <TaskForm
                  task={task}
                  onSuccess={() => setEditingId(null)}
                  onCancel={() => setEditingId(null)}
                />
              </div>
            ) : (
              <div className="flex items-start gap-4">
                <Checkbox
                  checked={task.status === "completed"}
                  onCheckedChange={(checked) => {
                    updateMutation.mutate({
                      id: task.id,
                      updates: { status: checked ? "completed" : "active" },
                    });
                  }}
                />
                <div className="flex-1 min-w-0">
                  <h3 className={`font-semibold break-words ${
                    task.status === "completed" ? "line-through text-muted-foreground" : ""
                  }`}>
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className="text-sm text-muted-foreground mt-1 break-words">
                      {task.description}
                    </p>
                  )}
                  <div className="text-xs text-muted-foreground mt-2">
                    Created: {format(new Date(task.createdAt), "PPp")}
                    {task.completedAt && (
                      <span className="ml-4">
                        Completed: {format(new Date(task.completedAt), "PPp")}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingId(task.id)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Task</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this task? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <Button variant="ghost">Cancel</Button>
                        <Button
                          variant="destructive"
                          onClick={() => deleteMutation.mutate(task.id)}
                        >
                          Delete
                        </Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
      {filteredTasks.length === 0 && (
        <div className="text-center text-muted-foreground py-8">
          No tasks found
        </div>
      )}
    </div>
  );
}