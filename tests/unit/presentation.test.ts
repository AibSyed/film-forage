import { describe, expect, it } from "vitest";
import {
  getPickerStatusMessage,
  getProviderFallbackMessage,
  getSearchFallbackMessage,
  getSourceLabel,
} from "@/features/picker/presentation";

describe("picker presentation helpers", () => {
  it("maps source labels to user-facing copy", () => {
    expect(getSourceLabel("live_tmdb")).toBe("Live movie data");
    expect(getSourceLabel("editorial_reserve")).toBe("Film Forage picks");
  });

  it("uses fallback copy that explains the fallback plainly", () => {
    expect(getPickerStatusMessage("live_tmdb")).toBe("Results updated.");
    expect(getPickerStatusMessage("editorial_reserve")).toContain("reserve picks");
    expect(getProviderFallbackMessage()).toContain("Service filters");
    expect(getSearchFallbackMessage()).toContain("reserve picks");
  });
});
