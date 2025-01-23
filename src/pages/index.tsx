"use client";

import { useState, useRef, useEffect } from "react";
import { DM_Sans } from "next/font/google";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { Todo } from "../types/todo";
import { motion, AnimatePresence } from "motion/react";
import { Trash } from "lucide-react";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

// Extended Todo type to include creation date
interface TodoWithDate extends Todo {
  createdAt: string;
}

const STORAGE_KEY = "todos-next-app";

export default function Home() {
  const [todos, setTodos] = useState<TodoWithDate[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load todos from localStorage on initial render
  useEffect(() => {
    const savedTodos = localStorage.getItem(STORAGE_KEY);
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([
        ...todos,
        {
          id: Date.now(),
          text: newTodo.trim(),
          completed: false,
          createdAt: new Date().toISOString(),
        },
      ]);
      setNewTodo("");
    }
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const startEditing = (id: number) => {
    setEditingId(id);
  };

  const finishEditing = (id: number, newText: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, text: newText.trim() } : todo
      )
    );
    setEditingId(null);
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  useEffect(() => {
    if (editingId === null && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingId]);

  return (
    <div
      className={`${dmSans.variable} min-h-screen  gap-8  font-[family-name:var(--font-dm-sans)] flex justify-center items-center  text-left flex-col font-medium tracking-tighter`}
    >
      <motion.div
        className="w-full max-w-md flex justify-center flex-col p-8"
        initial={false}
        animate={{ gap: todos.length === 0 ? "1rem" : "4rem" }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl opacity-40 font-bold text-left flex items-start justify-start">
          {new Date().toISOString().split("T")[0]}
        </h1>
        <div className="flex gap-4 flex-col">
          <AnimatePresence initial={false}>
            {todos.map((todo) => (
              <motion.div
                key={todo.id}
                className="flex items-center justify-between space-x-2"
                layout
                initial={{ opacity: 0, y: 50, filter: "blur(20px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: 50, filter: "blur(20px)" }}
                transition={{ duration: 0.3 }}
              >
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={() => toggleTodo(todo.id)}
                  className="mr-2 rounded-full size-6 border-2"
                />
                {editingId === todo.id ? (
                  <Input
                    value={todo.text}
                    className="border-t-0 border-r-0 border-l-0 focus-visible:outline-none focus-visible:ring-0 p-0 text-2xl"
                    onChange={(e) => {
                      const newText = e.target.value;
                      setTodos(
                        todos.map((t) =>
                          t.id === todo.id ? { ...t, text: newText } : t
                        )
                      );
                    }}
                    onBlur={() => finishEditing(todo.id, todo.text)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        finishEditing(todo.id, todo.text);
                      }
                    }}
                    autoFocus
                  />
                ) : (
                  <motion.span
                    className="flex-grow group relative text-2xl  overflow-clip text-ellipsis"
                    onClick={() => startEditing(todo.id)}
                    initial={false}
                    animate={{
                      opacity: todo.completed ? "60%" : "100%",
                      textDecoration: todo.completed ? "line-through" : "none",
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {todo.text}
                  </motion.span>
                )}
                <Button
                  variant="ghost"
                  className="rounded  flex transition-all "
                  size="icon"
                  onClick={() => deleteTodo(todo.id)}
                >
                  <Trash />
                </Button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <AnimatePresence initial={false}>
          <motion.div className="w-full max-w-md">
            <Input
              ref={inputRef}
              placeholder="Add a new todo"
              className="border-t-0 border-r-0 border-l-0 focus-visible:outline-none focus-visible:ring-0 text-2xl pb-4"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onBlur={addTodo}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addTodo();
                }
              }}
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
