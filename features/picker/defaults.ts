import type { PickRequestVM } from "@/features/picker/contracts";

export const defaultPickRequest: PickRequestVM = {
  region: "US",
  providers: [],
  runtimeMax: 130,
  genre: "any",
  vibe: "any",
  availabilityMode: "subscription",
  excludeIds: [],
};
