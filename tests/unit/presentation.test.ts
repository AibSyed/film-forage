import { describe, expect, it } from "vitest";
import {
  getPickerStatusMessage,
  getProviderFallbackMessage,
  getSearchFallbackMessage,
  getSourceLabel,
} from "@/features/picker/presentation";

describe("picker presentation helpers", () => {
  it("maps source labels to user-facing copy", () => {
    expect(getSourceLabel("live_tmdb")).toBe("Live data");
    expect(getSourceLabel("editorial_reserve")).toBe("Fallback list");
  });

  it("uses fallback copy that explains the fallback plainly", () => {
    expect(getPickerStatusMessage("live_tmdb")).toBe("Results updated.");
    expect(getPickerStatusMessage("editorial_reserve")).toContain("fallback list");
    expect(getProviderFallbackMessage()).toContain("Service filters");
    expect(getSearchFallbackMessage()).toContain("fallback list");
  });
});
