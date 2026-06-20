import { BaseObjectStorage } from "../config";

export interface PendingBiometry {
  gender: "male" | "female" | "other";
  birthDate: string;
  height: number;
  weight: number;
  sportActivity?: string;
  calculatedCalories: number;
}

const defaults: PendingBiometry = {
  gender: "other",
  birthDate: "",
  height: 0,
  weight: 0,
  calculatedCalories: 0,
};

class PendingBiometryStorage extends BaseObjectStorage<PendingBiometry> {
  hasPending(): boolean {
    const data = this.get();
    return data.calculatedCalories > 0 && data.birthDate !== "";
  }

  getPending(): PendingBiometry | null {
    return this.hasPending() ? this.get() : null;
  }
}

export const pendingBiometryStorage = new PendingBiometryStorage(
  "pendingBiometry",
  defaults,
);
