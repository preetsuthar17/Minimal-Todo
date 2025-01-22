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
      className={`${dmSans.variable} min-h-screen p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-dm-sans)] flex justify-center items-center flex-col font-medium tracking-tighter`}
    >
      <div className="w-full max-w-md space-y-6 flex justify-center flex-col">
        <h1 className="text-3xl font-bold">
          {new Date().toISOString().split("T")[0]}
        </h1>
        <AnimatePresence initial={false}>
          {todos.map((todo) => (
            <motion.div
              key={todo.id}
              className="flex items-center space-x-2"
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
                  className="border-t-0 border-r-0 border-l-0 focus-visible:outline-none focus-visible:ring-0 p-0 text-3xl"
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
                  className="flex-grow group relative text-3xl text-nowrap overflow-clip text-ellipsis max-md:max-w-[10rem]"
                  onClick={() => startEditing(todo.id)}
                  initial={false}
                  animate={{
                    opacity: todo.completed ? "60%" : "100%",
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {todo.text}

                  {todo.completed && (
                    <motion.div
                      className="h-px bg-current absolute top-[56%]"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      exit={{ width: "0%" }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.span>
              )}
              <Button
                variant="destructive"
                className="rounded opacity-0 flex transition-all hover:opacity-100"
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
        <motion.div className="w-full max-w-md mt-6">
          <Input
            ref={inputRef}
            placeholder="Add a new todo"
            className="border-t-0 border-r-0 border-l-0 focus-visible:outline-none focus-visible:ring-0 text-3xl pb-4"
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
    </div>
  );
}
