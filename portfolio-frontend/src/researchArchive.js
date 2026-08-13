export const ALL_AREAS = "All";

export const getResearchAreas = (entries) => [
  ALL_AREAS,
  ...Array.from(
    new Set(entries.map((entry) => entry.research_area).filter(Boolean))
  ).sort((left, right) => left.localeCompare(right)),
];

export const filterResearchEntries = (entries, area) =>
  area === ALL_AREAS
    ? entries
    : entries.filter((entry) => entry.research_area === area);

export const getContentExcerpt = (content = "", maxLength = 260) => {
  const normalized = content.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) {
    return normalized;
  }

  const clipped = normalized.slice(0, maxLength - 1);
  const lastSpace = clipped.lastIndexOf(" ");
  return `${clipped.slice(0, lastSpace > 0 ? lastSpace : undefined).trim()}…`;
};

export const getEntryActions = (entry) => ({
  canRead: Boolean(entry.content && entry.content.trim()),
  canViewPdf: Boolean(entry.pdf_url),
});
