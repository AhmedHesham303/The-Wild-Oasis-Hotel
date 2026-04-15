import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://krxfcdngpnedgzremomc.supabase.co";
const supabaseKey = "sb_publishable_Nv0c4ymuX4_DTOiKEGwGeA_sbkSaQFv";
const supabase = createClient(supabaseUrl, supabaseKey);
export default supabase;
