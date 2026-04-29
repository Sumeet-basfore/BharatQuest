import { en } from "./content_locales/en";
import { hi } from "./content_locales/hi";
import { as } from "./content_locales/as";
import { useGame } from "../context/GameContext";

const locales = { en, hi, as };

export function useContent() {
  const { state } = useGame();
  return locales[state.language] || locales.en;
}
