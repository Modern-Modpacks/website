import { createClient } from "@supabase/supabase-js";
import { PUBLIC_SUPABASE_DB_URL } from "$env/static/public";
import { PRIVATE_SUPABASE_ANON_KEY } from "$env/static/private";

const consts = {
    DB: createClient(PUBLIC_SUPABASE_DB_URL, PRIVATE_SUPABASE_ANON_KEY)
}

export default consts