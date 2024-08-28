import { supabase } from "../lib/supabase"

export const getRecords = async ({dbName}) => {
    const { data: popularEventData, error: popularEventsError } = await supabase
    .from(`${dbName ? dbName + "_" : ""}events`)
    .select('id')
    
    if (popularEventsError) {
        console.error(JSON.stringify(popularEventsError))
        return {data: null, error: "Failed fetching events, reload"}
    } 
    else {
        const eventIDs = popularEventData.map(event => event.id)
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
