import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// The app root no longer mounts a TooltipProvider, so a Tooltip must work on
// its own and still honour an explicit provider's settings when one exists.
describe("Tooltip", () => {
  it("opens without a TooltipProvider above it", async () => {
    render(
      <Tooltip>
        <TooltipTrigger>Info</TooltipTrigger>
        <TooltipContent>Helpful text</TooltipContent>
      </Tooltip>,
    );
    await act(async () => {
      await userEvent.tab();
    });
    expect(await screen.findAllByText("Helpful text")).not.toHaveLength(0);
  });

  it("opens inside an explicit TooltipProvider", async () => {
    render(
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger>Info</TooltipTrigger>
          <TooltipContent>Inside provider</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );
    await act(async () => {
      await userEvent.tab();
    });
    expect(await screen.findAllByText("Inside provider")).not.toHaveLength(0);
  });
});
