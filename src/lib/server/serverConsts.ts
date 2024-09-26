import { createClient } from "@supabase/supabase-js";
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_DB_URL } from "$env/static/public";

const consts = {
    DB: createClient(PUBLIC_SUPABASE_DB_URL, PUBLIC_SUPABASE_ANON_KEY)
}

export default consts