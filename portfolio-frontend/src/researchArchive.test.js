import {
  ALL_AREAS,
  filterResearchEntries,
  getContentExcerpt,
  getEntryActions,
  getResearchAreas,
} from "./researchArchive";

const entries = [
  {
    id: 1,
    research_area: "Trustworthy AI",
    content: "Body",
    pdf_url: null,
  },
  {
    id: 2,
    research_area: "Cybersecurity",
    content: "",
    pdf_url: "https://example.test/paper.pdf",
  },
  {
    id: 3,
    research_area: "Trustworthy AI",
    content: "  ",
    pdf_url: null,
  },
];

test("builds a compact alphabetized research-area filter list", () => {
  expect(getResearchAreas(entries)).toEqual([
    ALL_AREAS,
    "Cybersecurity",
    "Trustworthy AI",
  ]);
});

test("filters by one area and keeps All unfiltered", () => {
  expect(filterResearchEntries(entries, "Trustworthy AI")).toHaveLength(2);
  expect(filterResearchEntries(entries, ALL_AREAS)).toEqual(entries);
});

test("derives only valid actions", () => {
  expect(getEntryActions(entries[0])).toEqual({
    canRead: true,
    canViewPdf: false,
  });
  expect(getEntryActions(entries[1])).toEqual({
    canRead: false,
    canViewPdf: true,
  });
  expect(getEntryActions(entries[2])).toEqual({
    canRead: false,
    canViewPdf: false,
  });
});

test("normalizes full content for a concise collapsed excerpt", () => {
  expect(getContentExcerpt("First paragraph.\n\nSecond   paragraph.")).toBe(
    "First paragraph. Second paragraph."
  );
});

test("truncates long collapsed excerpts without cutting a word", () => {
  const excerpt = getContentExcerpt(`${"research ".repeat(40)}private ending`);

  expect(excerpt).toMatch(/…$/);
  expect(excerpt.length).toBeLessThanOrEqual(260);
  expect(excerpt).not.toContain("private ending");
});
