"use client";

import { useState, useRef, useEffect } from "react";
import { DM_Sans } from "next/font/google";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { Todo } from "../types/todo";
import { motion } from "motion/react";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([
        ...todos,
        { id: Date.now(), text: newTodo.trim(), completed: false },
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
      className={`${dmSans.variable} grid grid-rows-[auto_1fr_auto] items-start justify-items-center min-h-screen p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-dm-sans)]`}
    >
      <div className="w-full max-w-md space-y-4">
        {todos.map((todo) => (
          <div key={todo.id} className="flex items-center space-x-2">
            <Checkbox
              checked={todo.completed}
              onCheckedChange={() => toggleTodo(todo.id)}
              className="mr-2"
            />
            {editingId === todo.id ? (
              <Input
                value={todo.text}
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
                className="flex-grow cursor-pointer"
                onClick={() => startEditing(todo.id)}
                initial={false}
                animate={{
                  textDecoration: todo.completed ? "line-through" : "none",
                }}
                transition={{ duration: 0.3 }}
              >
                {todo.text}
                {todo.completed && (
                  <motion.div
                    className="h-px bg-current"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.span>
            )}
            <Button
              variant="destructive"
              size="icon"
              onClick={() => deleteTodo(todo.id)}
            >
              X
            </Button>
          </div>
        ))}
      </div>
      <div className="w-full max-w-md">
        <Input
          ref={inputRef}
          placeholder="Add a new todo"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onBlur={addTodo}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addTodo();
            }
          }}
        />
      </div>
    </div>
  );
}
