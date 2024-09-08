import { createSelector } from "reselect"
import { useEventStore } from "./authenticatedStore"

export const eventSelectors = {
    allEventData: (state) => state.allEventData,
    getEventById: (eventId) => (state) => state.allEventData[eventId]
}
