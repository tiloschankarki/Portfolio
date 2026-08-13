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

export const getContentExcerpt = (content = "") =>
  content.replace(/\s+/g, " ").trim();

export const getEntryActions = (entry) => ({
  canRead: Boolean(entry.content && entry.content.trim()),
  canViewPdf: Boolean(entry.pdf_url),
});
