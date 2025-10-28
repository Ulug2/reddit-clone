import { Text, View, Image, StyleSheet, FlatList } from "react-native";
import PostListitem from "../../../components/PostListItem";
import posts from "../../../../assets/data/posts.json";

export default function HomeScreen() {
  return (
    <View>
      <FlatList
        data={posts}
        renderItem={({ item }) => <PostListitem post={item} />}
      />
    </View>
  );
}
