import { supabase } from "../lib/supabase"

export const getEventDataByCategory = async (category) => {
    const { data: categoryData, error: categoryError } = await supabase
    .from("categories")
    .select('id')
    .eq("name", category)
    
    if (!categoryError) {
        const categoryId = categoryData[0]?.id; 

        if (categoryId) {
            const { data: eventData, error: eventError } = await supabase
            .from("event_categories")
            .select(`
                events(
                    *, 
                    ticket_types(
                        *,
                        user_asks(*),
                        user_offers(*)
                    )
                    )
                `)
            .eq("category_id", categoryId)
            if (!eventError) {
                const formattedEventData = eventData.map(item => item.events)
                return formattedEventData
            }
            else {
                throw new Error(eventError.details)
            }
        }
        else {
            throw new Error("Error, category id not found")
        }
    }
    else {
        throw new Error(categoryError.details)
    }
}

export const getRecordsByID = async (id) => {
    const { data: eventData, error: eventError } = await supabase
    .from("events")
    .select(`
        *,
        ticket_types(
            *,
            user_asks(*),
            user_offers(*)
        )
        `)
    .eq('id', id)
    
    if (eventError) {
        throw new Error(eventError.details)
    } 
    else {
        return eventData
    }
}

export const getTicketAsksByEventID = async (id) => {
    const { data: ticketData, error: ticketError } = await supabase
    .from("ticket_types")
    .select(`
        *,
        user_asks(*),
        user_offers(*)
        `)
    .eq("id", id)
    
    if (ticketError) {
        console.error(JSON.stringify(eventsError))
        return {data: null, error: "Failed fetching tickets, reload"}
    } 
    else {
        return {data: ticketData, error: null}
    }
}

export const getTicketTypeByEventID = async (id) => {
    const { data: ticketData, error: ticketError } = await supabase
    .from("ticket_types")
    .select("*")
    .eq("event_id", id)
    
    if (ticketError) {
        console.error(JSON.stringify(eventsError))
        return {data: null, error: "Failed fetching ticket types, reload"}
    } 
    else {
        return {data: ticketData, error: null}
    }
}