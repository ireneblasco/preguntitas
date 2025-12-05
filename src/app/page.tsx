"use client";

import Link from "next/link";

const categories = [
  { name: "Cumpleaños", color: "bg-pink-200", slug: "cumpleanos" },
  { name: "Road Trip", color: "bg-blue-200", slug: "roadtrip" },
  { name: "Familia – Sobremesa", color: "bg-green-200", slug: "familia" },
  { name: "Amigos – Sobremesa", color: "bg-yellow-200", slug: "amigos" },
  { name: "Personales / Autorreflexión", color: "bg-purple-200", slug: "personales" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 text-center">
        Preguntitas
      </h1>
      <p className="text-gray-700 mb-6 text-center max-w-xs">
        Preguntas para compartir y reflexionar. Sin prisa, solo momentos divertidos y profundos.
      </p>

      <div className="w-full max-w-sm flex flex-col gap-4">
        {categories.map((cat) => (
          <Link key={cat.slug} href={`/category/${cat.slug}`}>
            <div className={`p-6 rounded-2xl shadow-md ${cat.color} hover:scale-105 transform transition`}>
              <h2 className="text-lg font-semibold text-gray-900 text-center">
                {cat.name}
              </h2>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
