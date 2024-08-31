import { supabase } from "../lib/supabase"

export const getRecordsByDB = async ({ dbName }) => {
    const { data: specificEventData, error: specificEventsError } = await supabase
    .from(`${dbName}_events`)
    .select('id')
    
    if (specificEventsError) {
        console.error(JSON.stringify(specificEventsError))
        return {data: null, error: "Failed fetching events, reload"}
    } 
    else {
        const eventIDs = specificEventData.map(event => event.id)
        const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('*')
        .in('id', eventIDs)

        if (eventError) {
            console.error(JSON.stringify(eventError))
            return {data: null, error: "Failed fetching events, reload"}
        }
        else {
            return {data: eventData, error: null}
        }
    }
}

export const getRecordsByID = async ({id}) => {
    const { data: eventData, error: eventsError } = await supabase
    .from("events")
    .select('*')
    .eq('id', id)
    
    if (eventsError) {
        console.error(JSON.stringify(eventsError))
        return {data: null, error: "Failed fetching events, reload"}
    } 
    else {
        return {data: eventData, error: null}
    }
}
