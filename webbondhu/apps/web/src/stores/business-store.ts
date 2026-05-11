import { create } from "zustand";
interface BusinessSwitcherState { activeBusinessId?: string; setActiveBusinessId: (businessId: string) => void; }
export const useBusinessSwitcher = create<BusinessSwitcherState>((set) => ({ activeBusinessId: undefined, setActiveBusinessId: (businessId) => set({ activeBusinessId: businessId }) }));
