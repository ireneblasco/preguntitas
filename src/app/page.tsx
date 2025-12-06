"use client";

import Link from "next/link";

const categories = [
  { name: "Amigos", slug: "amigos" },
  { name: "Familiares", slug: "familiares" },
  { name: "Cumpleaños", slug: "cumpleanos" },
  { name: "Pareja", slug: "pareja" },
  { name: "Personales", slug: "personales" },
];

export default function Home() {
  return (
    <main className="animated-gradient min-h-screen flex flex-col relative">
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="w-full max-w-md space-y-16">
          <div className="text-center space-y-6">
            <h2 className="font-serif text-5xl md:text-6xl font-medium text-stone-800 leading-tight tracking-tight">
              Preguntitas
            </h2>
            <p className="text-stone-600 text-base leading-relaxed font-light max-w-sm mx-auto">
              Where conversations begin
            </p>
          </div>

          <div className="space-y-4">
            {categories.map((cat) => (
              <Link 
                key={cat.slug} 
                href={`/category/${cat.slug}`}
                className="block group"
              >
                <div className="bg-white border border-stone-200 rounded-3xl px-8 py-6 shadow-sm transition-all duration-300 ease-out hover:shadow-md hover:border-stone-300">
                  <h3 className="text-lg font-light text-stone-700 text-center tracking-tight">
                    {cat.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
