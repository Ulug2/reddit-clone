import { useState, useRef, useCallback } from "react";
import { router, Stack, useLocalSearchParams } from "expo-router";
import {
  Text,
  View,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import PostListItem from "../../../components/PostListItem";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CommentListItem from "../../../components/CommentListItem";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deletePostById,
  fetchComments,
  fetchPostById,
} from "../../../services/postService";
import { Tables } from "../../../types/database.types";
import { useSupabase } from "../../../lib/supabase";
import { AntDesign, Entypo, MaterialIcons } from "@expo/vector-icons";

type Post = Tables<"posts"> & {
  user: Tables<"users">;
  group: Tables<"groups">;
};

export default function DetailedPost() {
  const supabase = useSupabase();
  const { id } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();

  const insets = useSafeAreaInsets();
  const [comment, setComment] = useState<string>("");
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
  const inputRef = useRef<TextInput | null>(null);

  const {
    data: post,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["posts", id],
    queryFn: () => fetchPostById(id, supabase),
  });

  const { data: comments } = useQuery({
    queryKey: ["comments", { postId: id }],
    queryFn: () => fetchComments(id, supabase),
  });

  console.log(JSON.stringify(comments, null, 2));

  const { mutate: remove } = useMutation({
    mutationFn: () => deletePostById(id, supabase),
    onSuccess: (data) => {
      console.log("Post deleted successfully");
      // invalidate queries that might have been affected by inserting a post.
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      router.back();
    },
    onError: (error) => {
      console.log("error: ", error);
      Alert.alert("Failed to delete post");
    },
  });

  // useCallback with memo inside CommentListItem prevents re-renders when replying to a comment
  const handleReplyPress = useCallback((commentId: string) => {
    console.log(commentId);
    inputRef.current?.focus();
  }, []);

  // do conditional rendering after all hooks
  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error || !post) {
    console.error("Error message: ", error);
    return <Text>Post Not Found!</Text>;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
      keyboardVerticalOffset={insets.top + 10}
    >
      <Stack.Screen
        options={{
          headerRight: () => (
            <View style={{ flexDirection: "row", gap: 10 }}>
              <Entypo
                name="trash"
                size={24}
                color="white"
                onPress={() => remove()}
              />
              <AntDesign name="search" size={24} color="white" />
              <MaterialIcons name="sort" size={27} color="white" />
              <Entypo name="dots-three-horizontal" size={24} color="white" />
            </View>
          ),
          animation: "slide_from_bottom",
        }}
      />
      <FlatList
        ListHeaderComponent={<PostListItem post={post} isDetailedPost />}
        data={comments}
        renderItem={({ item }) => (
          <CommentListItem
            comment={item}
            depth={0}
            handleReplyPress={handleReplyPress}
          />
        )}
      />
      {/* POST A COMMENT */}
      <View
        style={{
          paddingBottom: insets.bottom,
          borderBottomWidth: 1,
          borderBottomColor: "lightgrey",
          padding: 10,
          backgroundColor: "white",
          borderRadius: 10,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: -3,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3,

          elevation: 4,
        }}
      >
        <TextInput
          placeholder="Join the conversation"
          ref={inputRef}
          value={comment}
          onChangeText={(text) => setComment(text)}
          style={{ backgroundColor: "#E4E4E4", padding: 5, borderRadius: 5 }}
          multiline
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
        />
        {isInputFocused && (
          <Pressable
            disabled={!comment}
            onPress={() => console.error("Pressed")}
            style={{
              backgroundColor: !comment ? "lightgrey" : "#0d469b",
              borderRadius: 15,
              marginLeft: "auto",
              marginTop: 15,
            }}
          >
            <Text
              style={{
                color: "white",
                paddingVertical: 5,
                paddingHorizontal: 10,
                fontWeight: "bold",
                fontSize: 13,
              }}
            >
              Reply
            </Text>
          </Pressable>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
