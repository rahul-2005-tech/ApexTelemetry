import { f1Service } from "../services/f1Service.js";
import { useAsyncData } from "./useAsyncData.js";

export function useSeasons() {
  return useAsyncData("seasons", () => f1Service.getSeasons());
}

export function useRaces(season) {
  return useAsyncData(season ?? null, () => f1Service.getRaces(season));
}

export function useRaceResults(raceId) {
  return useAsyncData(raceId ?? null, () => f1Service.getRaceResults(raceId));
}
