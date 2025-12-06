"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

const questionsByCategory: Record<string, string[]> = {
  amigos: ["Pregunta 1", "Pregunta 2", "Pregunta 3"],
  familiares: ["Pregunta 1", "Pregunta 2", "Pregunta 3"],
  cumpleanos: ["Pregunta 1", "Pregunta 2", "Pregunta 3"],
  pareja: ["Pregunta 1", "Pregunta 2", "Pregunta 3"],
  personales: ["Pregunta 1", "Pregunta 2", "Pregunta 3"],
};

const categoryNames: Record<string, string> = {
  amigos: "Amigos",
  familiares: "Familiares",
  cumpleanos: "Cumpleaños",
  pareja: "Pareja",
  personales: "Personales",
};

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const slug = Array.isArray(params.slug) ? params.slug[0] : (params.slug || "");
  const questions = questionsByCategory[slug] || ["No hay preguntas"];
  const [index, setIndex] = useState(Math.floor(Math.random() * questions.length));
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleNext = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      let nextIndex = Math.floor(Math.random() * questions.length);
      while (questions.length > 1 && nextIndex === index) {
        nextIndex = Math.floor(Math.random() * questions.length);
      }
      setIndex(nextIndex);
      setIsTransitioning(false);
    }, 200);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-amber-50 to-stone-50 flex flex-col">
      <header className="px-6 pt-12 pb-4">
        <button
          onClick={() => router.back()}
          className="text-stone-600 text-base font-light hover:text-stone-800 transition-colors"
        >
          ← Volver
        </button>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="w-full max-w-md space-y-16">
          <div className="text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-medium text-stone-800 leading-tight tracking-tight">
              {categoryNames[slug] || slug.replace("-", " ")}
            </h1>
          </div>

          <div 
            className={`bg-white border border-stone-200 rounded-3xl px-10 py-16 text-center shadow-sm transition-opacity duration-200 ${
              isTransitioning ? "opacity-50" : "opacity-100"
            }`}
          >
            <p className="text-xl font-light text-stone-700 leading-relaxed tracking-tight">
              {questions[index]}
            </p>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleNext}
              className="bg-white border border-stone-200 rounded-full px-10 py-4 text-base font-light text-stone-700 shadow-sm hover:shadow-md hover:border-stone-300 transition-all duration-300 ease-out"
            >
              Otra pregunta
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
