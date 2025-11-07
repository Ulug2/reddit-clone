import { supabase } from "../lib/supabase"

export const fetchGroups = async (searchText: string) => {
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