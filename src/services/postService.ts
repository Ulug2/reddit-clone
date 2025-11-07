import { supabase } from "../lib/supabase"
import { TablesInsert } from "../types/database.types";

export const fetchPosts = async () => {
  const { data, error } = await supabase
    .from("posts")
    .select("*, group:groups(*), user:users!posts_user_id_fkey(*)")
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  } else {
    return data;
  }
};

export const fetchPostById = async (id : string) => {
    const {data, error} = await supabase
        .from("posts")
        .select("*, group:groups(*), user:users!posts_user_id_fkey(*)")
        .eq('id', id)
        .single();      // to return a single object, not an array

    if (error) {
        throw error;
    } else {
        console.log("The single fetched post by id: ", data)
        return data;
    }
};

export const insertPost = async (post: TablesInsert<'posts'>) => {
  const {data, error} = await supabase
                              .from("posts")
                              .insert(post)
                              .select()
                              .single();
  if (error) {
    throw error;
  }
  else {
    return data;
  }
}