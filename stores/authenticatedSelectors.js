import { createSelector } from "reselect"
import { useEventStore } from "./authenticatedStore"

export const eventSelectors = {
    allEventData: (state) => state.allEventData,
    getEventById: (eventId) => (state) => state.allEventData[eventId],
    getEventsByIds: (eventIds) => (state) => {
        return eventIds.map(eventId => state.allEventData[eventId]).filter(Boolean)
    },
    getLowestBuyPrice: (eventId) => (state) => {
        const event = state.allEventData[eventId]

        const allAskPrices = event.ticket_types.flatMap(ticketType => ticketType.user_asks).map(ask => parseFloat(ask.price))
        if (allAskPrices.length > 0) {
            return Math.min(...allAskPrices).toFixed(2)
        }
        else {
            return null
        }
    }
}

export const ticketSelectors = {
    allTicketData: (state) => state.allTicketData,
    getTicketById: (ticketId) => (state) => state.allTicketData[ticketId],
    getTicketHighestOffer: (ticketId) => (state) => {
        const ticket = state.allTicketData[ticketId]

        if (!ticket || ticket.user_offers.length == 0) {
            return "---"
        }
        return Math.max(...ticket.user_offers.map(ask => parseFloat(ask.price))).toFixed(2)
    },
    getTicketLowestAsk: (ticketId) => (state) => {
        const ticket = state.allTicketData[ticketId]

        if (!ticket || ticket.user_asks.length == 0) {
            return "---"
        }
        return Math.min(...ticket.user_asks.map(ask => parseFloat(ask.price))).toFixed(2)
    },
}