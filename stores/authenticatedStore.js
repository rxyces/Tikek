import { create } from "zustand"
import { produce } from "immer"

export const useEventStore = create((set) => ({
    allEventData: {},
    addEvent: (event) => set((state) => ({
        allEventData: {
            ...state.allEventData,
            [event.id]: event
        }
    })),
}))