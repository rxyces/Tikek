import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://ojnqtryicwctykhmnxkq.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qbnF0cnlpY3djdHlraG1ueGtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjM0NjUzODYsImV4cCI6MjAzOTA0MTM4Nn0.I3Anj6kAGxWr-tWhUD_B2eb1ANE7SiETOgGp6Yk9ZDU"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
})