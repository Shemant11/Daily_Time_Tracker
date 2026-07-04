import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { db } from "@/services/db";
import type { Session, Category, Subtask } from "@/types";
import { format } from "date-fns";

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function sessionsToRows(sessions: Session[], categories: Category[], subtasks: Subtask[]) {
  return sessions.map((s) => ({
    Date: s.date,
    Category: categories.find((c) => c.id === s.categoryId)?.name ?? "Unknown",
    Subtask: subtasks.find((t) => t.id === s.subtaskId)?.name ?? "-",
    Start: format(new Date(s.startTime), "yyyy-MM-dd HH:mm"),
    End: format(new Date(s.endTime), "yyyy-MM-dd HH:mm"),
    "Duration (min)": Math.round(s.durationSeconds / 60),
    Notes: s.notes,
  }));
}

export async function exportCSV() {
  const [sessions, categories, subtasks] = await Promise.all([
    db.sessions.toArray(),
    db.categories.toArray(),
    db.subtasks.toArray(),
  ]);
  const rows = sessionsToRows(sessions, categories, subtasks);
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const csv = XLSX.utils.sheet_to_csv(worksheet);
  download(new Blob([csv], { type: "text/csv;charset=utf-8;" }), `sessions-${Date.now()}.csv`);
}

export async function exportExcel() {
  const [sessions, categories, subtasks] = await Promise.all([
    db.sessions.toArray(),
    db.categories.toArray(),
    db.subtasks.toArray(),
  ]);
  const rows = sessionsToRows(sessions, categories, subtasks);
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sessions");
  const buffer = XLSX.write(workbook, { type: "array", bookType: "xlsx" });
  download(
    new Blob([buffer], { type: "application/octet-stream" }),
    `sessions-${Date.now()}.xlsx`
  );
}

export async function exportPDF(title: string, summaryLines: string[], tableRows: (string | number)[][], tableHead: string[]) {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text(title, 14, 20);
  doc.setFontSize(11);
  summaryLines.forEach((line, i) => doc.text(line, 14, 30 + i * 6));

  autoTable(doc, {
    startY: 30 + summaryLines.length * 6 + 6,
    head: [tableHead],
    body: tableRows as any,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [99, 102, 241] },
  });

  doc.save(`${title.replace(/\s+/g, "-").toLowerCase()}-${Date.now()}.pdf`);
}

export async function exportJSONBackup() {
  const [sessions, categories, subtasks, settings] = await Promise.all([
    db.sessions.toArray(),
    db.categories.toArray(),
    db.subtasks.toArray(),
    db.settings.toArray(),
  ]);
  const backup = {
    version: 1,
    exportedAt: new Date().toISOString(),
    sessions,
    categories,
    subtasks,
    settings,
  };
  download(
    new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" }),
    `learning-tracker-backup-${Date.now()}.json`
  );
}

export async function importJSONBackup(file: File): Promise<void> {
  const text = await file.text();
  const parsed = JSON.parse(text);
  if (!parsed || !Array.isArray(parsed.sessions)) {
    throw new Error("Invalid backup file");
  }
  await db.transaction("rw", db.sessions, db.categories, db.subtasks, db.settings, async () => {
    if (parsed.categories?.length) {
      await db.categories.clear();
      await db.categories.bulkAdd(parsed.categories);
    }
    if (parsed.subtasks?.length) {
      await db.subtasks.clear();
      await db.subtasks.bulkAdd(parsed.subtasks);
    }
    if (parsed.sessions?.length) {
      await db.sessions.clear();
      await db.sessions.bulkAdd(parsed.sessions);
    }
    if (parsed.settings?.length) {
      await db.settings.clear();
      await db.settings.bulkAdd(parsed.settings);
    }
  });
}
