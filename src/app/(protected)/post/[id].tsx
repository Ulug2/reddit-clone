import { useState, useRef, useCallback } from "react";
import { useLocalSearchParams } from "expo-router";
import {
  Text,
  View,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  ActivityIndicator,
} from "react-native";
import PostListItem from "../../../components/PostListItem";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import comments from "../../../../assets/data/comments.json";
import CommentListItem from "../../../components/CommentListItem";
import { useQuery } from "@tanstack/react-query";
import { fetchPostById } from "../../../services/postService";
import { Tables } from "../../../types/database.types";
import { useSupabase } from "../../../lib/supabase";

type Post = Tables<"posts"> & {
  user: Tables<"users">;
  group: Tables<"groups">;
};

export default function DetailedPost() {
  const supabase = useSupabase();
  const { id } = useLocalSearchParams<{ id: string }>();

  const insets = useSafeAreaInsets();
  const [comment, setComment] = useState<string>("");
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
  const inputRef = useRef<TextInput | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["posts", id],
    queryFn: () => fetchPostById(id, supabase),
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

  if (error || !data) {
    console.error("Error message: ", error);
    return <Text>Post Not Found!</Text>;
  }

  const postComments = comments.filter((comment) => comment.post_id === id);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
      keyboardVerticalOffset={insets.top + 10}
    >
      <FlatList
        ListHeaderComponent={<PostListItem post={data} isDetailedPost />}
        data={postComments}
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
