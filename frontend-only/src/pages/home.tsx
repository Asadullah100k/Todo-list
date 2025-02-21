import { TaskForm } from "@/components/task-form";
import { TaskList } from "@/components/task-list";

export default function Home() {
  return (
    <main className="container mx-auto p-4 flex flex-col items-center space-y-8">
      <h1 className="text-3xl font-bold">Task Manager</h1>
      <TaskForm />
      <TaskList />
    </main>
  );
}
