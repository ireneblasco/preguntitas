"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

const questionsByCategory: Record<string, string[]> = {
  cumpleanos: ["Pregunta 1", "Pregunta 2", "Pregunta 3"],
  roadtrip: ["Pregunta 1", "Pregunta 2", "Pregunta 3"],
  familia: ["Pregunta 1", "Pregunta 2", "Pregunta 3"],
  amigos: ["Pregunta 1", "Pregunta 2", "Pregunta 3"],
  personales: ["Pregunta 1", "Pregunta 2", "Pregunta 3"],
};

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug || "";
  const questions = questionsByCategory[slug] || ["No hay preguntas"];
  const [index, setIndex] = useState(Math.floor(Math.random() * questions.length));

  const handleNext = () => {
    let nextIndex = Math.floor(Math.random() * questions.length);
    while (questions.length > 1 && nextIndex === index) {
      nextIndex = Math.floor(Math.random() * questions.length);
    }
    setIndex(nextIndex);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6 text-center capitalize">{slug.replace("-", " ")}</h1>

      <div className="max-w-sm w-full mb-6 bg-white p-6 rounded-2xl shadow-md text-center">
        {questions[index]}
      </div>

      <button
        onClick={handleNext}
        className="px-6 py-3 bg-blue-400 text-white rounded-xl shadow hover:bg-blue-500 transition"
      >
        Otra pregunta
      </button>
    </main>
  );
}
