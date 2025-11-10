import { TablesInsert } from "../types/database.types";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../types/database.types";

export const fetchPosts = async (supabase: SupabaseClient<Database>) => {
  const { data, error } = await supabase
    .from("posts")
    .select("*, group:groups(*), upvotes(value.sum())")
    .order("created_at", { ascending: false })

  if (error) {
    throw error;
  } else {
    return data;
  }
};

export const fetchPostById = async (id : string, supabase: SupabaseClient<Database>) => {
    const {data, error} = await supabase
        .from("posts")
        .select("*, group:groups(*), upvotes(value.sum())")
        .eq('id', id)
        .single();      // to return a single object, not an array
    console.log(data);

    if (error) {
        throw error;
    } else {
        // console.log("The single fetched post by id: ", data)
        return data;
    }
};

export const insertPost = async (post: TablesInsert<'posts'>, supabase: SupabaseClient<Database>) => {
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

export const deletePostById = async (
  id: string,
  supabase: SupabaseClient<Database>
) => {
  const {data, error} = await supabase.from("posts").delete().eq("id", id);
  if (error) {
    throw error;
  }
  else {
    return data;
  }
};