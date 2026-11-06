import { describe, it, expect, vi, beforeEach } from "vitest";
import { forwardRef, type ComponentProps } from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { Heart } from "lucide-react";

const location = { pathname: "/", search: "", key: "/" };

vi.mock("@/lib/router-compat", () => ({
  useLocation: () => location,
  Link: forwardRef<HTMLAnchorElement, ComponentProps<"a"> & { to: string }>(
    function Link({ to, ...rest }, ref) {
      return <a ref={ref} href={to} {...rest} />;
    },
  ),
}));

import { CategoryPillDropdown } from "./CategoryPillDropdown";
import { DesktopCategoryToolbar } from "./DesktopCategoryToolbar";
import {
  categoryNavigationItems,
  primaryNavigationItems,
} from "@/components/header/NavigationItems";
import { displayLabel } from "@/lib/display-label";

const wellness = primaryNavigationItems.find(
  (i) => i.name === "General Wellness",
)!;

function renderPill() {
  const utils = render(
    <div>
      <CategoryPillDropdown
        item={wellness}
        color="#22c0d4"
        Icon={Heart}
        compact
        dense
      />
      <button type="button">Outside</button>
    </div>,
  );
  // The pill shows the sentence-case display label of the catalogue name.
  const pill = screen.getByRole("link", { name: "General wellness" });
  return { ...utils, pill };
}

const panel = () => screen.queryByTestId("category-panel");

// jsdom 20 has no PointerEvent, so pointerType would be lost.
if (typeof window.PointerEvent === "undefined") {
  class PointerEventPolyfill extends MouseEvent {
    pointerType: string;
    constructor(type: string, init: PointerEventInit = {}) {
      super(type, init);
      this.pointerType = init.pointerType ?? "";
    }
  }
  Object.defineProperty(window, "PointerEvent", {
    configurable: true,
    writable: true,
    value: PointerEventPolyfill,
  });
}

// Records whether the app let a link click navigate, then stops jsdom from
// attempting the navigation it does not implement.
let lastClickNavigated: boolean | null = null;
window.addEventListener("click", (e) => {
  lastClickNavigated = !e.defaultPrevented;
  e.preventDefault();
});

function click(el: Element, pointerType: string) {
  fireEvent.pointerDown(el, { pointerType });
  lastClickNavigated = null;
  fireEvent.click(el);
  return lastClickNavigated;
}
const tap = (el: Element) => click(el, "touch");

describe("CategoryPillDropdown", () => {
  beforeEach(() => {
    location.pathname = "/";
    location.key = "/";
  });

  it("opens the panel on a tap, without navigating, and sets aria-expanded", () => {
    const { pill } = renderPill();
    expect(pill).toHaveAttribute("aria-expanded", "false");
    expect(panel()).toBeNull();

    expect(tap(pill)).toBe(false); // navigation prevented
    expect(panel()).not.toBeNull();
    expect(pill).toHaveAttribute("aria-expanded", "true");
    expect(pill.getAttribute("aria-controls")).toBe(panel()!.id);
    expect(
      screen.getByRole("link", { name: "Heart health tests" }),
    ).toHaveAttribute("href", "/wellness?subcategory=heart-health");
  });

  it("follows the parent link on a second tap", () => {
    const { pill } = renderPill();
    tap(pill);
    expect(tap(pill)).toBe(true);
  });

  it("follows the link on a mouse click and opens on mouse hover", () => {
    const { pill } = renderPill();
    expect(click(pill, "mouse")).toBe(true);
    expect(panel()).toBeNull();

    fireEvent.pointerEnter(pill.parentElement!, { pointerType: "mouse" });
    expect(panel()).not.toBeNull();
  });

  it("closes on a click outside", () => {
    const { pill } = renderPill();
    tap(pill);
    expect(panel()).not.toBeNull();

    // A press inside the panel keeps it open.
    fireEvent.pointerDown(panel()!);
    expect(panel()).not.toBeNull();

    fireEvent.pointerDown(screen.getByRole("button", { name: "Outside" }));
    expect(panel()).toBeNull();
    expect(pill).toHaveAttribute("aria-expanded", "false");
  });

  it("closes on Escape and returns focus to the category", () => {
    const { pill } = renderPill();
    pill.focus();
    fireEvent.keyDown(pill, { key: "ArrowDown" });
    expect(panel()).not.toBeNull();
    expect(document.activeElement).toBe(
      screen.getByRole("link", { name: "General health tests" }),
    );

    fireEvent.keyDown(window, { key: "Escape" });
    expect(panel()).toBeNull();
    expect(document.activeElement).toBe(pill);
  });

  it("closes on route change", () => {
    const { pill, rerender } = renderPill();
    tap(pill);
    expect(panel()).not.toBeNull();
    location.pathname = "/wellness";
    location.key = "/wellness";
    act(() => {
      rerender(
        <div>
          <CategoryPillDropdown
            item={wellness}
            color="#22c0d4"
            Icon={Heart}
            compact
            dense
          />
          <button type="button">Outside</button>
        </div>,
      );
    });
    expect(panel()).toBeNull();
  });

  it("does not open a panel for a category without subcategories", () => {
    const popular = primaryNavigationItems.find(
      (i) => i.name === "Most popular tests",
    )!;
    render(
      <CategoryPillDropdown
        item={popular}
        color="#e70d69"
        Icon={Heart}
        compact
        dense
      />,
    );
    const pill = screen.getByRole("link", { name: "Most popular tests" });
    expect(pill).not.toHaveAttribute("aria-expanded");
    expect(tap(pill)).toBe(true);
    expect(panel()).toBeNull();
  });
});

describe("DesktopCategoryToolbar", () => {
  it("uses the shared category labels, the same list the menu drawer uses", () => {
    render(<DesktopCategoryToolbar />);
    const labels = screen
      .getAllByTestId("category-pill")
      .map((el) => el.textContent?.trim());
    expect(labels).toEqual(
      categoryNavigationItems.map((i) => displayLabel(i.name)),
    );
    expect(labels).toContain("Most popular tests");
    expect(labels).toContain("At-home test kits");
    expect(labels).not.toContain("How it works");
    // No short names: the row and the drawer use the same labels.
    expect(labels).not.toContain("Home tests");
    expect(labels).not.toContain("Most popular");
  });
});
