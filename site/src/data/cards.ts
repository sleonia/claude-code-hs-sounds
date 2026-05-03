import meta from "../../../meta.json";

export interface AudioClip {
  label: string;
  path: string;
}

export interface Card {
  title: string;
  set: string;
  image: string;
  source: string;
  audios: AudioClip[];
}

export const cards: Card[] = Object.entries(meta.packs).flatMap(
  ([packName, entries]) =>
    entries.map((entry) => ({
      title: entry.title,
      set: packName,
      image: entry.imageUrl ?? "",
      source: entry.blizzardUrl ?? "",
      audios: entry.audios.map((audioPath, i) => ({
        label: `аудио ${i + 1}`,
        // GitHub Pages matches URL bytes exactly; normalize to reduce 404s from
        // Cyrillic composed/decomposed path variants (e.g., й vs й).
        path: audioPath.normalize("NFD"),
      })),
    })),
);

export const totalClips = cards.reduce(
  (sum, card) => sum + card.audios.length,
  0,
);
