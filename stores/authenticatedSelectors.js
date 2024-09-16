import { createSelector } from "reselect"
import { useEventStore } from "./authenticatedStore"

export const eventSelectors = {
    allEventData: (state) => state.allEventData,
    getEventById: (eventId) => (state) => state.allEventData[eventId],
    getEventsByIds: (eventIds) => (state) => {
        return eventIds.map(eventId => state.allEventData[eventId]).filter(Boolean)
    }
}

export const ticketSelectors = {
    allEventData: (state) => state.allTicketData,
    getTicketById: (ticketId) => (state) => state.allTicketData[ticketId]
}