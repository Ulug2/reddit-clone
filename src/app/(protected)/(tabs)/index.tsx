import { useState, useEffect } from "react";
import { View, FlatList, Text } from "react-native";
import { supabase } from "./../../../lib/supabase";
import { Tables } from "../../../types/database.types";
import PostListItem from "../../../components/PostListItem";

type Post = Tables<"posts"> & {
  user: Tables<"users">;
  group: Tables<"groups">;
};

const HomeScreen = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*, group:groups(*), user:users!posts_user_id_fkey(*)")
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error);
    } else {
      setPosts(data);
    }
  };

  return (
    <FlatList
      data={posts}
      renderItem={({ item }) => <PostListItem post={item} />}
    />
  );
};

export default HomeScreen;
