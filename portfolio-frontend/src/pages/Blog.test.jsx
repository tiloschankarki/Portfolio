import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Blog from "./Blog";

const records = [
  {
    id: 1,
    title: "Faithfulness in Language Models",
    description: "A proposal for evaluating explanation faithfulness.",
    content: "Full proposal text.",
    category: "AI/ML",
    content_type: "Proposal",
    status: "In Progress",
    research_area: "Trustworthy AI",
    created_at: "2026-08-01T00:00:00Z",
    reading_time: 6,
    pdf: "research_pdfs/faithfulness.pdf",
    pdf_url: "https://example.test/faithfulness.pdf",
    has_web_content: true,
    has_pdf: true,
  },
  {
    id: 2,
    title: "Network Anomaly Notes",
    description: "Early observations from IoT traffic experiments.",
    content: "Research note body.",
    category: "Engineering",
    content_type: "Research Note",
    status: "Draft",
    research_area: "Cybersecurity",
    created_at: "2026-07-01T00:00:00Z",
    reading_time: 3,
    pdf: null,
    pdf_url: null,
    has_web_content: true,
    has_pdf: false,
  },
];

const successfulResponse = (data = records) => ({
  ok: true,
  status: 200,
  json: async () => data,
});

beforeEach(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  global.fetch = jest.fn().mockResolvedValue(successfulResponse());
});

afterEach(() => {
  jest.restoreAllMocks();
});

test("renders archive labels and only valid actions", async () => {
  render(<Blog />);

  expect(
    await screen.findByText("Faithfulness in Language Models")
  ).toBeInTheDocument();
  expect(screen.getByText("Proposal")).toBeInTheDocument();
  expect(screen.getByText("In Progress")).toBeInTheDocument();
  expect(
    screen.getByRole("button", {
      name: "Read Faithfulness in Language Models",
    })
  ).toBeInTheDocument();
  expect(
    screen.getByRole("link", {
      name: "View PDF for Faithfulness in Language Models",
    })
  ).toHaveAttribute("href", "https://example.test/faithfulness.pdf");
  expect(
    screen.queryByRole("link", { name: "View PDF for Network Anomaly Notes" })
  ).not.toBeInTheDocument();
});

test("filters entries by one research area", async () => {
  const user = userEvent.setup();
  render(<Blog />);
  await screen.findByText("Faithfulness in Language Models");

  await user.click(screen.getByRole("button", { name: "Cybersecurity" }));

  expect(screen.getByText("Network Anomaly Notes")).toBeInTheDocument();
  expect(
    screen.queryByText("Faithfulness in Language Models")
  ).not.toBeInTheDocument();
});

test("opens and closes full content inline", async () => {
  const user = userEvent.setup();
  render(<Blog />);

  await user.click(
    await screen.findByRole("button", {
      name: "Read Faithfulness in Language Models",
    })
  );

  expect(screen.getByText("Full proposal text.")).toBeInTheDocument();
  await user.click(
    screen.getByRole("button", {
      name: "Close Faithfulness in Language Models",
    })
  );
  expect(screen.queryByText("Full proposal text.")).not.toBeInTheDocument();
});

test("offers retry after a request failure", async () => {
  global.fetch.mockRejectedValueOnce(new Error("offline"));
  render(<Blog />);

  expect(
    await screen.findByText(/could not load research work/i)
  ).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
});

test("shows a friendly message when the archive is empty", async () => {
  global.fetch.mockResolvedValueOnce(successfulResponse([]));
  render(<Blog />);

  expect(
    await screen.findByText("Research work coming soon.")
  ).toBeInTheDocument();
});

test("shows a stable loading state", () => {
  global.fetch.mockReturnValueOnce(new Promise(() => {}));
  render(<Blog />);

  expect(screen.getByText("Loading research work…")).toBeInTheDocument();
});
