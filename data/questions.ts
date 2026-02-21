// Entry point for questions: list + texts by locale (same pattern as i18n)
// Do not edit manually - run scripts/fetch-questions.js and translation pipeline

import { questionTexts as enUS } from './questions.en-US';
import { questionTexts as esES } from './questions.es-ES';
import { questionTexts as enGB } from './questions.en-GB';
import { questionTexts as esMX } from './questions.es-MX';
import { questionTexts as ptBR } from './questions.pt-BR';
import { questionTexts as pt } from './questions.pt';
import { questionTexts as de } from './questions.de';
import { questionTexts as it } from './questions.it';
import { questionTexts as fr } from './questions.fr';
import type { TranslationMapKey } from '../i18n';

export type MomentType = "Date Night 🌙" | "Deep Talk 🧠" | "Ikigai 🌸" | "Road Trip 🚗" | "Table Talks 🍷";

export const momentOptions: Array<{
  id: MomentType;
  name: string;
  emoji: string;
}> = [
  { id: "Date Night 🌙", name: "Date Night", emoji: "🌙" },
  { id: "Deep Talk 🧠", name: "Deep Talk", emoji: "🧠" },
  { id: "Ikigai 🌸", name: "Ikigai", emoji: "🌸" },
  { id: "Road Trip 🚗", name: "Road Trip", emoji: "🚗" },
  { id: "Table Talks 🍷", name: "Table Talks", emoji: "🍷" }
];

export interface Question {
  id: string;
  moment: MomentType[];
}

export const questions: Question[] = [
  {
    "id": "ID-156",
    "moment": [
      "Deep Talk 🧠"
    ]
  },
  {
    "id": "ID-157",
    "moment": [
      "Deep Talk 🧠"
    ]
  },
  {
    "id": "ID-120",
    "moment": [
      "Table Talks 🍷",
      "Road Trip 🚗"
    ]
  },
  {
    "id": "ID-142",
    "moment": [
      "Deep Talk 🧠",
      "Date Night 🌙"
    ]
  },
  {
    "id": "ID-30",
    "moment": [
      "Table Talks 🍷",
      "Deep Talk 🧠"
    ]
  },
  {
    "id": "ID-24",
    "moment": [
      "Table Talks 🍷",
      "Road Trip 🚗"
    ]
  },
  {
    "id": "ID-108",
    "moment": [
      "Road Trip 🚗"
    ]
  },
  {
    "id": "ID-140",
    "moment": [
      "Date Night 🌙"
    ]
  },
  {
    "id": "ID-7",
    "moment": [
      "Table Talks 🍷"
    ]
  },
  {
    "id": "ID-35",
    "moment": [
      "Table Talks 🍷",
      "Road Trip 🚗"
    ]
  },
  {
    "id": "ID-33",
    "moment": [
      "Table Talks 🍷",
      "Deep Talk 🧠",
      "Date Night 🌙"
    ]
  },
  {
    "id": "ID-151",
    "moment": [
      "Deep Talk 🧠",
      "Date Night 🌙"
    ]
  },
  {
    "id": "ID-20",
    "moment": [
      "Deep Talk 🧠",
      "Table Talks 🍷"
    ]
  },
  {
    "id": "ID-32",
    "moment": [
      "Road Trip 🚗"
    ]
  },
  {
    "id": "ID-127",
    "moment": [
      "Deep Talk 🧠",
      "Table Talks 🍷"
    ]
  },
  {
    "id": "ID-2",
    "moment": [
      "Deep Talk 🧠"
    ]
  },
  {
    "id": "ID-19",
    "moment": [
      "Date Night 🌙",
      "Table Talks 🍷"
    ]
  },
  {
    "id": "ID-1",
    "moment": [
      "Road Trip 🚗",
      "Table Talks 🍷"
    ]
  },
  {
    "id": "ID-159",
    "moment": [
      "Deep Talk 🧠"
    ]
  },
  {
    "id": "ID-123",
    "moment": [
      "Table Talks 🍷",
      "Road Trip 🚗"
    ]
  },
  {
    "id": "ID-121",
    "moment": [
      "Table Talks 🍷",
      "Deep Talk 🧠"
    ]
  },
  {
    "id": "ID-126",
    "moment": [
      "Deep Talk 🧠"
    ]
  },
  {
    "id": "ID-22",
    "moment": [
      "Table Talks 🍷"
    ]
  },
  {
    "id": "ID-14",
    "moment": [
      "Road Trip 🚗"
    ]
  },
  {
    "id": "ID-129",
    "moment": [
      "Deep Talk 🧠"
    ]
  },
  {
    "id": "ID-119",
    "moment": [
      "Deep Talk 🧠"
    ]
  },
  {
    "id": "ID-15",
    "moment": [
      "Road Trip 🚗"
    ]
  },
  {
    "id": "ID-147",
    "moment": [
      "Deep Talk 🧠"
    ]
  },
  {
    "id": "ID-9",
    "moment": [
      "Table Talks 🍷",
      "Road Trip 🚗"
    ]
  },
  {
    "id": "ID-16",
    "moment": [
      "Road Trip 🚗"
    ]
  },
  {
    "id": "ID-23",
    "moment": [
      "Table Talks 🍷",
      "Date Night 🌙"
    ]
  },
  {
    "id": "ID-25",
    "moment": [
      "Date Night 🌙",
      "Table Talks 🍷"
    ]
  },
  {
    "id": "ID-17",
    "moment": [
      "Deep Talk 🧠",
      "Date Night 🌙"
    ]
  },
  {
    "id": "ID-110",
    "moment": [
      "Road Trip 🚗"
    ]
  },
  {
    "id": "ID-155",
    "moment": [
      "Deep Talk 🧠"
    ]
  },
  {
    "id": "ID-143",
    "moment": [
      "Deep Talk 🧠"
    ]
  },
  {
    "id": "ID-122",
    "moment": [
      "Deep Talk 🧠",
      "Date Night 🌙"
    ]
  },
  {
    "id": "ID-139",
    "moment": [
      "Deep Talk 🧠"
    ]
  },
  {
    "id": "ID-34",
    "moment": [
      "Table Talks 🍷",
      "Road Trip 🚗",
      "Date Night 🌙"
    ]
  },
  {
    "id": "ID-152",
    "moment": [
      "Road Trip 🚗",
      "Date Night 🌙"
    ]
  },
  {
    "id": "ID-135",
    "moment": [
      "Deep Talk 🧠",
      "Date Night 🌙"
    ]
  },
  {
    "id": "ID-154",
    "moment": [
      "Table Talks 🍷"
    ]
  },
  {
    "id": "ID-137",
    "moment": [
      "Table Talks 🍷",
      "Deep Talk 🧠",
      "Date Night 🌙"
    ]
  },
  {
    "id": "ID-31",
    "moment": [
      "Deep Talk 🧠"
    ]
  },
  {
    "id": "ID-29",
    "moment": [
      "Date Night 🌙",
      "Table Talks 🍷"
    ]
  },
  {
    "id": "ID-12",
    "moment": [
      "Table Talks 🍷"
    ]
  },
  {
    "id": "ID-115",
    "moment": [
      "Table Talks 🍷",
      "Deep Talk 🧠"
    ]
  },
  {
    "id": "ID-113",
    "moment": [
      "Deep Talk 🧠",
      "Ikigai 🌸"
    ]
  },
  {
    "id": "ID-149",
    "moment": [
      "Deep Talk 🧠"
    ]
  },
  {
    "id": "ID-131",
    "moment": [
      "Deep Talk 🧠",
      "Date Night 🌙"
    ]
  },
  {
    "id": "ID-134",
    "moment": [
      "Deep Talk 🧠"
    ]
  },
  {
    "id": "ID-10",
    "moment": [
      "Table Talks 🍷",
      "Date Night 🌙"
    ]
  },
  {
    "id": "ID-138",
    "moment": [
      "Deep Talk 🧠"
    ]
  },
  {
    "id": "ID-13",
    "moment": [
      "Table Talks 🍷",
      "Road Trip 🚗"
    ]
  },
  {
    "id": "ID-111",
    "moment": [
      "Deep Talk 🧠",
      "Table Talks 🍷"
    ]
  },
  {
    "id": "ID-4",
    "moment": [
      "Table Talks 🍷",
      "Road Trip 🚗"
    ]
  },
  {
    "id": "ID-145",
    "moment": [
      "Table Talks 🍷",
      "Deep Talk 🧠"
    ]
  },
  {
    "id": "ID-112",
    "moment": [
      "Deep Talk 🧠"
    ]
  },
  {
    "id": "ID-26",
    "moment": [
      "Table Talks 🍷"
    ]
  },
  {
    "id": "ID-133",
    "moment": [
      "Deep Talk 🧠"
    ]
  },
  {
    "id": "ID-8",
    "moment": [
      "Road Trip 🚗",
      "Date Night 🌙"
    ]
  },
  {
    "id": "ID-18",
    "moment": [
      "Road Trip 🚗"
    ]
  },
  {
    "id": "ID-116",
    "moment": [
      "Date Night 🌙"
    ]
  },
  {
    "id": "ID-125",
    "moment": [
      "Deep Talk 🧠"
    ]
  },
  {
    "id": "ID-11",
    "moment": [
      "Table Talks 🍷",
      "Road Trip 🚗"
    ]
  },
  {
    "id": "ID-141",
    "moment": [
      "Deep Talk 🧠",
      "Date Night 🌙"
    ]
  },
  {
    "id": "ID-3",
    "moment": [
      "Date Night 🌙",
      "Deep Talk 🧠",
      "Table Talks 🍷"
    ]
  },
  {
    "id": "ID-5",
    "moment": [
      "Deep Talk 🧠",
      "Table Talks 🍷"
    ]
  },
  {
    "id": "ID-28",
    "moment": [
      "Road Trip 🚗",
      "Table Talks 🍷"
    ]
  },
  {
    "id": "ID-124",
    "moment": [
      "Deep Talk 🧠",
      "Ikigai 🌸"
    ]
  },
  {
    "id": "ID-146",
    "moment": [
      "Deep Talk 🧠"
    ]
  },
  {
    "id": "ID-132",
    "moment": [
      "Deep Talk 🧠",
      "Table Talks 🍷"
    ]
  },
  {
    "id": "ID-114",
    "moment": [
      "Date Night 🌙"
    ]
  },
  {
    "id": "ID-158",
    "moment": [
      "Road Trip 🚗",
      "Table Talks 🍷"
    ]
  },
  {
    "id": "ID-27",
    "moment": [
      "Deep Talk 🧠",
      "Date Night 🌙"
    ]
  },
  {
    "id": "ID-144",
    "moment": [
      "Table Talks 🍷"
    ]
  },
  {
    "id": "ID-148",
    "moment": [
      "Date Night 🌙",
      "Table Talks 🍷",
      "Deep Talk 🧠"
    ]
  },
  {
    "id": "ID-130",
    "moment": [
      "Table Talks 🍷"
    ]
  },
  {
    "id": "ID-136",
    "moment": [
      "Table Talks 🍷",
      "Road Trip 🚗"
    ]
  },
  {
    "id": "ID-150",
    "moment": [
      "Deep Talk 🧠"
    ]
  },
  {
    "id": "ID-6",
    "moment": [
      "Road Trip 🚗",
      "Table Talks 🍷"
    ]
  },
  {
    "id": "ID-128",
    "moment": [
      "Deep Talk 🧠"
    ]
  },
  {
    "id": "ID-109",
    "moment": [
      "Road Trip 🚗",
      "Table Talks 🍷"
    ]
  },
  {
    "id": "ID-153",
    "moment": [
      "Deep Talk 🧠"
    ]
  },
  {
    "id": "ID-118",
    "moment": [
      "Table Talks 🍷",
      "Road Trip 🚗",
      "Date Night 🌙"
    ]
  },
  {
    "id": "ID-117",
    "moment": [
      "Table Talks 🍷",
      "Deep Talk 🧠"
    ]
  },
  {
    "id": "ID-21",
    "moment": [
      "Table Talks 🍷"
    ]
  }
];

export const questionTextByLocale: Record<TranslationMapKey, Record<string, string>> = {
  'en-US': enUS,
  'es-ES': esES,
  'en-GB': enGB,
  'es-MX': esMX,
  'pt-BR': ptBR,
  'pt': pt,
  'de': de,
  'it': it,
  'fr': fr,
};
