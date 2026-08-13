import { render, screen } from "@testing-library/react";

jest.mock(
  "react-router-dom",
  () => {
    const React = require("react");
    return {
      BrowserRouter: ({ children }) => <>{children}</>,
      Routes: ({ children }) => <>{children}</>,
      Route: () => null,
      Link: React.forwardRef(({ children, to, ...props }, ref) => (
        <a href={to} ref={ref} {...props}>
          {children}
        </a>
      )),
    };
  },
  { virtual: true }
);

jest.mock("./pages/LandingPage", () => () => null);
jest.mock("./pages/Education", () => () => null);
jest.mock("./pages/Projects", () => () => null);
jest.mock("./pages/Blog", () => () => null);
jest.mock("./pages/Certifications", () => () => null);
jest.mock("./pages/Contact", () => () => null);
jest.mock("./pages/Hobby", () => () => null);

const App = require("./App").default;

test("renames Blog while preserving its route", () => {
  render(<App />);

  expect(
    screen.getByRole("link", { name: "Research Areas & Interests" })
  ).toHaveAttribute("href", "/blog");
});
