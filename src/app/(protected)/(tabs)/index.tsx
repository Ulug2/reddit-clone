import { useState, useEffect } from "react";
import { View, FlatList, Text, ActivityIndicator } from "react-native";
import { fetchPosts } from "../../../services/postService";
import { Tables } from "../../../types/database.types";
import PostListItem from "../../../components/PostListItem";
import { useQuery } from "@tanstack/react-query";
import { useSupabase } from "../../../lib/supabase";

type Post = Tables<"posts"> & {
  // user: Tables<"users">;
  group: Tables<"groups">;
};

const HomeScreen = () => {
  const supabase = useSupabase();
  const {
    data: posts,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: () => fetchPosts(supabase),
  });

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    console.log(error);
    return <Text>Error Fetching Posts</Text>;
  }

  return (
    <FlatList
      data={posts}
      renderItem={({ item }) => <PostListItem post={item} />}
      onRefresh={refetch}
      refreshing={isRefetching}
    />
  );
};

export default HomeScreen;
