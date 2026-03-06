import { describe, expect, it } from "vitest";
import {
  getPickerStatusMessage,
  getProviderFallbackMessage,
  getSearchFallbackMessage,
  getSourceLabel,
} from "@/features/picker/presentation";

describe("picker presentation helpers", () => {
  it("maps source labels to user-facing copy", () => {
    expect(getSourceLabel("live_tmdb")).toBe("Live TMDB");
    expect(getSourceLabel("editorial_reserve")).toBe("Forage reserve");
  });

  it("uses fallback copy that explains the fallback plainly", () => {
    expect(getPickerStatusMessage("live_tmdb")).toBe("Film Forage refreshed.");
    expect(getPickerStatusMessage("editorial_reserve")).toContain("reserve picks");
    expect(getProviderFallbackMessage()).toContain("provider filters");
    expect(getSearchFallbackMessage()).toContain("reserve picks");
  });
});
