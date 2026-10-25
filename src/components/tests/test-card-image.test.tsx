import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TestCardImage } from "./test-card-image";

const props = { testName: "Ferritin Blood Test", providerName: "Clinilabs" };

describe("TestCardImage", () => {
  it("renders the supplied product image", () => {
    render(
      <TestCardImage {...props} imageUrl="https://example.com/ferritin.jpg" />,
    );
    expect(
      screen.getByRole("img", { name: "Ferritin Blood Test by Clinilabs" }),
    ).toHaveAttribute("src", "https://example.com/ferritin.jpg");
    expect(
      screen.queryByTestId("test-card-image-placeholder"),
    ).not.toBeInTheDocument();
  });

  it.each([null, "", "   "])(
    "renders a neutral placeholder for %s",
    (imageUrl) => {
      render(<TestCardImage {...props} imageUrl={imageUrl} />);
      expect(screen.queryByRole("img")).not.toBeInTheDocument();
      expect(
        screen.getByTestId("test-card-image-placeholder"),
      ).toHaveTextContent("Ferritin Blood Test");
      expect(
        screen.getByTestId("test-card-image-placeholder"),
      ).toHaveTextContent("Clinilabs");
    },
  );

  it("switches to the placeholder when the image fails", () => {
    render(
      <TestCardImage {...props} imageUrl="https://example.com/broken.jpg" />,
    );
    fireEvent.error(screen.getByRole("img"));
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(
      screen.getByTestId("test-card-image-placeholder"),
    ).toBeInTheDocument();
  });

  it("tries a replacement image after the previous source fails", () => {
    const { rerender } = render(
      <TestCardImage {...props} imageUrl="https://example.com/broken.jpg" />,
    );
    fireEvent.error(screen.getByRole("img"));
    rerender(
      <TestCardImage
        {...props}
        imageUrl="https://example.com/replacement.jpg"
      />,
    );
    expect(screen.getByRole("img")).toHaveAttribute(
      "src",
      "https://example.com/replacement.jpg",
    );
  });
});
