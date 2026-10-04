import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { RetestReminderCard, validateRetestForm } from "../retest-reminder-card";

const setup = () => {
  const submit = vi.fn().mockResolvedValue(undefined);
  render(
    <RetestReminderCard
      interestType="biomarker"
      interestSlug="ferritin"
      interestLabel="Ferritin"
      submit={submit}
      now={() => new Date(2026, 9, 4)}
    />,
  );
  return { submit };
};

describe("validateRetestForm", () => {
  it("requires an email", () => {
    expect(validateRetestForm("", true).email).toBe("Enter your email address.");
  });
  it("rejects a malformed email", () => {
    expect(validateRetestForm("nope@", true).email).toBeDefined();
  });
  it("requires consent", () => {
    expect(validateRetestForm("a@b.co", false).consent).toBeDefined();
  });
  it("passes with valid email and consent", () => {
    expect(validateRetestForm("a@b.co", true)).toEqual({});
  });
});

describe("RetestReminderCard", () => {
  it("consent checkbox starts unticked", () => {
    setup();
    expect((screen.getByRole("checkbox") as HTMLInputElement).checked).toBe(false);
  });

  it("does not submit without consent", async () => {
    const { submit } = setup();
    fireEvent.change(screen.getByLabelText("Email address"), { target: { value: "a@b.co" } });
    fireEvent.click(screen.getByRole("button", { name: "Set reminder" }));
    expect(await screen.findByText("Tick the box so we can send you the email.")).toBeTruthy();
    expect(submit).not.toHaveBeenCalled();
  });

  it("does not submit with a bad email", async () => {
    const { submit } = setup();
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.change(screen.getByLabelText("Email address"), { target: { value: "bad" } });
    fireEvent.click(screen.getByRole("button", { name: "Set reminder" }));
    expect(await screen.findByText("Enter an email address like name@example.com.")).toBeTruthy();
    expect(submit).not.toHaveBeenCalled();
  });

  it("submits with consent and shows the reminder date", async () => {
    const { submit } = setup();
    fireEvent.change(screen.getByLabelText("Email address"), {
      target: { value: "Me@Example.com" },
    });
    fireEvent.change(screen.getByLabelText("Remind me in"), { target: { value: "3" } });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: "Set reminder" }));
    await waitFor(() => expect(submit).toHaveBeenCalledTimes(1));
    expect(submit.mock.calls[0][0]).toMatchObject({
      email: "me@example.com",
      intervalMonths: 3,
      consent: true,
      interestType: "biomarker",
      interestSlug: "ferritin",
    });
    expect(await screen.findByText("Done. We will email you on 4 January 2027.")).toBeTruthy();
  });
});
