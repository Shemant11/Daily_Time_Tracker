import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/services/db";

export function useCategories() {
  return useLiveQuery(() => db.categories.orderBy("order").toArray(), [], []);
}

export function useSubtasks(categoryId?: string) {
  return useLiveQuery(
    () =>
      categoryId
        ? db.subtasks.where("categoryId").equals(categoryId).sortBy("order")
        : db.subtasks.orderBy("order").toArray(),
    [categoryId],
    []
  );
}

export function useAllSubtasks() {
  return useLiveQuery(() => db.subtasks.toArray(), [], []);
}

export function useSessions() {
  return useLiveQuery(() => db.sessions.orderBy("startTime").reverse().toArray(), [], []);
}

export function useSessionsForDate(date: string) {
  return useLiveQuery(() => db.sessions.where("date").equals(date).toArray(), [date], []);
}
