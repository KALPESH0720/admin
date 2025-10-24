import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fuqmkqnjjegfwqbwhilx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1cW1rcW5qamVnZndxYndoaWx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyMDM3MTEsImV4cCI6MjA3Njc3OTcxMX0.ouDZG3bdWD4d749QTmEOc0JvxvNMhgA0f7Svg2L2EGo';

if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase URL and/or Anon Key are missing. Please provide them in environment variables.");
}

export const supabase = createClient(supabaseUrl!, supabaseAnonKey!);