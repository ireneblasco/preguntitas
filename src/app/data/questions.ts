export type MomentType = "date-night" | "deep-talk" | "chill-night" | "random-fun" | "too-many-hours-on-road" | "birthday" | "work-icebreakers" | "reflections";

export interface Question {
  id: string;
  text: string;
  category: string; // Para compatibilidad con favoritos
  moment: MomentType[];
}

export const questions: Question[] = [
  // Date night
  { id: "p1", text: "¿Cuál fue el momento en que supiste que esto era especial?", category: "pareja", moment: ["date-night"] },
  { id: "p2", text: "¿Qué pequeña cosa que hago te hace sonreír?", category: "pareja", moment: ["date-night"] },
  { id: "p3", text: "¿Qué sueño compartido te emociona más?", category: "pareja", moment: ["date-night"] },
  { id: "p4", text: "¿Cómo crees que hemos crecido juntos?", category: "pareja", moment: ["date-night"] },
  { id: "p5", text: "¿Qué vulnerabilidad mía te ha hecho sentir más cerca de mí?", category: "pareja", moment: ["date-night", "deep-talk"] },
  { id: "p6", text: "¿Qué conversación necesitamos tener pero hemos evitado?", category: "pareja", moment: ["date-night", "deep-talk"] },
  
  // Deep talk
  { id: "dt1", text: "¿Qué miedo compartirías solo conmigo?", category: "amigos", moment: ["deep-talk"] },
  { id: "dt2", text: "¿Cómo crees que nuestra amistad nos ha transformado?", category: "amigos", moment: ["deep-talk"] },
  { id: "dt3", text: "¿Qué conversación familiar nunca has tenido pero te gustaría tener?", category: "familiares", moment: ["deep-talk"] },
  { id: "dt4", text: "¿Qué verdad sobre ti mismo has aceptado recientemente?", category: "personales", moment: ["deep-talk", "reflections"] },
  { id: "dt5", text: "¿Qué conversación contigo mismo necesitas tener?", category: "personales", moment: ["deep-talk", "reflections"] },
  { id: "dt6", text: "¿Qué momento juntos te cambió la perspectiva sobre algo?", category: "amigos", moment: ["deep-talk"] },
  
  // Chill night
  { id: "cn1", text: "¿Cuál es tu recuerdo más divertido de nuestra amistad?", category: "amigos", moment: ["chill-night"] },
  { id: "cn2", text: "¿Qué canción te hace pensar en mí?", category: "amigos", moment: ["chill-night"] },
  { id: "cn3", text: "¿Cuál es tu comida favorita para compartir?", category: "amigos", moment: ["chill-night"] },
  { id: "cn4", text: "¿Qué admiras más de nuestra amistad?", category: "amigos", moment: ["chill-night"] },
  { id: "cn5", text: "¿Cuál es tu tradición familiar favorita?", category: "familiares", moment: ["chill-night"] },
  { id: "cn6", text: "¿Qué receta familiar te gustaría que nunca se perdiera?", category: "familiares", moment: ["chill-night"] },
  
  // Random / fun
  { id: "rf1", text: "Si fueras un sándwich, ¿qué tipo de sándwich serías y por qué?", category: "silly", moment: ["random-fun"] },
  { id: "rf2", text: "¿Qué superpoder inútil elegirías tener?", category: "silly", moment: ["random-fun"] },
  { id: "rf3", text: "Si pudieras tener una conversación con cualquier animal, ¿cuál sería y qué le preguntarías?", category: "silly", moment: ["random-fun"] },
  { id: "rf4", text: "¿Qué objeto de tu casa tiene la historia más rara?", category: "silly", moment: ["random-fun"] },
  { id: "rf5", text: "Si tu vida fuera una película, ¿qué actor te interpretaría?", category: "silly", moment: ["random-fun"] },
  { id: "rf6", text: "¿Cuál es la cosa más aleatoria que has hecho esta semana?", category: "silly", moment: ["random-fun"] },
  { id: "rf7", text: "Si pudieras cambiar una regla de la física, ¿cuál sería?", category: "silly", moment: ["random-fun"] },
  { id: "rf8", text: "¿Qué comida crearías si fueras chef por un día?", category: "silly", moment: ["random-fun"] },
  
  // Too many hours on the road
  { id: "tr1", text: "¿Qué lugar te ha cambiado más?", category: "amigos", moment: ["too-many-hours-on-road"] },
  { id: "tr2", text: "¿Cuál es tu mejor recuerdo de viaje?", category: "amigos", moment: ["too-many-hours-on-road"] },
  { id: "tr3", text: "¿Qué descubriste sobre ti mismo en tu último viaje?", category: "amigos", moment: ["too-many-hours-on-road"] },
  { id: "tr4", text: "¿Cuál es el lugar más inesperado donde has tenido una buena conversación?", category: "amigos", moment: ["too-many-hours-on-road"] },
  { id: "tr5", text: "¿Qué canción de viaje te trae los mejores recuerdos?", category: "amigos", moment: ["too-many-hours-on-road"] },
  
  // Birthday
  { id: "bd1", text: "¿Cuál es tu recuerdo de cumpleaños favorito?", category: "cumpleanos", moment: ["birthday"] },
  { id: "bd2", text: "¿Qué regalo te hizo más feliz?", category: "cumpleanos", moment: ["birthday"] },
  { id: "bd3", text: "¿Qué lección de vida has aprendido este año?", category: "cumpleanos", moment: ["birthday"] },
  { id: "bd4", text: "¿Qué momento del último año te cambió?", category: "cumpleanos", moment: ["birthday"] },
  { id: "bd5", text: "¿Qué sueño quieres cumplir este año?", category: "cumpleanos", moment: ["birthday"] },
  { id: "bd6", text: "¿Qué cualidad tuya has descubierto recientemente?", category: "cumpleanos", moment: ["birthday"] },
  
  // Work Icebreakers
  { id: "wi1", text: "¿Qué proyecto te ha hecho sentir más orgulloso?", category: "amigos", moment: ["work-icebreakers"] },
  { id: "wi2", text: "¿Qué valoras más de nuestro equipo?", category: "amigos", moment: ["work-icebreakers"] },
  { id: "wi3", text: "¿Qué aprendiste de un error profesional?", category: "amigos", moment: ["work-icebreakers"] },
  { id: "wi4", text: "¿Qué hábito de trabajo te ha cambiado la vida?", category: "amigos", moment: ["work-icebreakers"] },
  { id: "wi5", text: "¿Cuál es tu mejor momento de colaboración?", category: "amigos", moment: ["work-icebreakers"] },
  
  // Reflections
  { id: "by1", text: "¿Qué te hace sentir más tú mismo?", category: "personales", moment: ["reflections"] },
  { id: "by2", text: "¿Qué pequeño placer te da más felicidad?", category: "personales", moment: ["reflections"] },
  { id: "by3", text: "¿Qué decisión reciente te ha hecho sentir orgulloso?", category: "personales", moment: ["reflections"] },
  { id: "by4", text: "¿Qué miedo has superado este año?", category: "personales", moment: ["reflections"] },
  { id: "by5", text: "¿Qué rutina te ayuda a reconectar contigo mismo?", category: "personales", moment: ["reflections"] },
  { id: "by6", text: "¿Qué descubriste sobre ti mismo esta semana?", category: "personales", moment: ["reflections"] },
  { id: "by7", text: "¿Qué desafío profesional te ha hecho crecer más?", category: "amigos", moment: ["reflections"] },
  { id: "by8", text: "¿Cómo has cambiado tu perspectiva sobre el trabajo?", category: "amigos", moment: ["reflections"] },
];

export const momentOptions = [
  { value: "date-night", label: "Date night" },
  { value: "deep-talk", label: "Deep talk" },
  { value: "chill-night", label: "Chill night" },
  { value: "random-fun", label: "Random / fun" },
  { value: "too-many-hours-on-road", label: "On the Road" },
  { value: "birthday", label: "Birthday" },
  { value: "work-icebreakers", label: "Work Icebreakers" },
  { value: "reflections", label: "Reflections" },
];

export const categoryNames: Record<string, string> = {
  amigos: "Amigos",
  familiares: "Familiares",
  cumpleanos: "Cumpleaños",
  pareja: "Pareja",
  personales: "Personales",
  silly: "Silly",
};
