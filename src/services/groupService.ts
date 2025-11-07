import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../types/database.types";

export const fetchGroups = async (searchText: string, supabase: SupabaseClient<Database>) => {
    const {data, error} = await supabase
        .from("groups")
        .select("*")
        .ilike('name', `%${searchText}%`);
    
    if (error) {
        throw error
    }
    else {
        return data;
    }

};