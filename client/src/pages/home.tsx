import { TaskList } from "@/components/task-list";
import { TaskForm } from "@/components/task-form";
import { SearchBar } from "@/components/search-bar";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Task } from "@shared/schema";

export default function Home() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  const filterTasks = (tasks: Task[]) => {
    return tasks
      .filter((task) => 
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.description?.toLowerCase().includes(search.toLowerCase())
      )
      .filter((task) => {
        if (filter === "all") return true;
        return task.status === filter;
      });
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <Card className="mx-auto max-w-4xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Task Manager
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <TaskForm />
          <SearchBar 
            search={search}
            onSearchChange={setSearch}
            filter={filter}
            onFilterChange={setFilter}
          />
          <TaskList filterFn={filterTasks} />
        </CardContent>
      </Card>
    </div>
  );
}
