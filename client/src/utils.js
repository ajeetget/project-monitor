export function getStage(p) {
  if (p.admCloseDate) return "closed";
  if (p.finCloseDate) return "finclose";
  if (p.techCloseDate) return "techclose";
  if (p.sanctionDate && (p.firstReleaseDate || p.expenditure)) return "active";
  if (p.sanctionDate) return "sanctioned";
  if (p.preTECDate || p.TECDate || p.RABDate || p.GCDate) return "committee";
  return "new";
}

export function fmtDate(d) {
  if (!d) return "";
  const dt = new Date(d);
  if (isNaN(dt)) return d;
  return dt.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function fmtLakhs(v) {
  if (v == null || v === "") return "";
  return (
    "₹" +
    Number(v).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

export function daysBetween(a, b) {
  return Math.round((b - a) / (1000 * 60 * 60 * 24));
}

export function uid() {
  return "row_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8);
}

export function escapeHtml(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Turn a local file path (or URL) into an href a browser can attempt to open.
export function localFileHref(path) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path) || /^file:\/\//i.test(path)) return path;
  return "file:///" + path.replace(/\\/g, "/").replace(/^\/+/, "");
}

export function downloadTextFile(filename, text, mime = "text/plain") {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Very small CSV builder that quotes fields containing commas/quotes/newlines.
export function toCSV(rows, columns) {
  const esc = (v) => {
    const s = v == null ? "" : String(v);
    if (/[",\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
    return s;
  };
  const header = columns.map((c) => esc(c.label)).join(",");
  const lines = rows.map((r) => columns.map((c) => esc(r[c.key])).join(","));
  return [header, ...lines].join("\r\n");
}

export function summarizeList(list, formatter) {
  if (!list || list.length === 0) return "";
  return list.map(formatter).join("; ");
}
