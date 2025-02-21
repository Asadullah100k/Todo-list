import { useQuery } from "@tanstack/react-query";
import type { Task } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

export function TaskList() {
  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  return (
    <div className="w-full max-w-2xl">
      <ScrollArea className="h-[60vh]">
        <div className="space-y-4">
          {tasks.map((task) => (
            <Card key={task.id}>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Checkbox checked={task.status === "completed"} />
                  <CardTitle>{task.title}</CardTitle>
                </div>
                <CardDescription>
                  Created on {new Date(task.createdAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              {task.description && (
                <CardContent>
                  <p>{task.description}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
