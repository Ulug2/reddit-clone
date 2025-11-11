import {
  Pressable,
  Text,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign, Feather } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { useState } from "react";
import { useAtom } from "jotai";
import { selectedGroupAtom } from "../../../atoms";
import { insertPost } from "../../../services/postService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSupabase } from "../../../lib/supabase";
import * as ImagePicker from "expo-image-picker";
import { uploadImage } from "../../../utils/supabaseImages";

export default function CreateScreen() {
  const supabase = useSupabase();
  const [title, setTitle] = useState<string>("");
  const [bodyText, setBodyText] = useState<string>("");
  const [image, setImage] = useState<string | null>(null);

  const [group, setGroup] = useAtom(selectedGroupAtom);

  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: (imagePath: string | undefined) => {
      if (!group) {
        throw new Error("Please select a group");
      }
      if (!title) {
        throw new Error("Please select a group");
      }
      return insertPost(
        {
          title: title,
          description: bodyText,
          group_id: group.id,
          image: imagePath,
        },
        supabase
      );
    },
    onSuccess: (data) => {
      console.log("succesfully added a new post: ", data);

      // invalidate queries that might have been affected by inserting a post.
      queryClient.invalidateQueries({ queryKey: ["posts"] });

      goBack();
    },
    onError: (error) => {
      console.log("Error message: ", error);
      alert("Failed to insert!");
    },
  });

  const onPostClicked = async () => {
    let imagePath = image ? await uploadImage(image, supabase) : undefined;
    mutate(imagePath);
  };

  const goBack = () => {
    setTitle("");
    setBodyText("");
    setImage(null);
    router.back();
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView
      style={{ backgroundColor: "white", flex: 1, paddingHorizontal: 10 }}
    >
      {/* HEADER */}
      <AntDesign name="close" size={30} color="black" onPress={goBack} />
      <Pressable
        onPress={() => onPostClicked()}
        style={{ flexDirection: "row", marginBottom: 5 }}
        disabled={isPending}
      >
        <Text
          style={{
            backgroundColor: "#115BCA",
            color: "white",
            marginLeft: "auto",
            padding: 7,
            borderRadius: 15,
            fontWeight: "bold",
          }}
        >
          Post
        </Text>
      </Pressable>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={{ paddingVertical: 10 }}
          showsVerticalScrollIndicator={false}
        >
          {/* SELECTOR */}
          <Link href="groupSelector" asChild>
            <Pressable
              style={{
                flexDirection: "row",
                backgroundColor: "#EDEDED",
                gap: 5,
                padding: 10,
                borderRadius: 20,
                alignItems: "center",
                alignSelf: "flex-start",
              }}
            >
              {group ? (
                <>
                  <Image source={{ uri: group.image }} />
                  <Text>{group.name}</Text>
                </>
              ) : (
                <>
                  <Text
                    style={{
                      color: "white",
                      backgroundColor: "black",
                      paddingVertical: 1,
                      paddingHorizontal: 5,
                      borderRadius: 10,
                      fontWeight: "bold",
                    }}
                  >
                    r/
                  </Text>
                  <Text style={{ fontWeight: "600" }}>Select a community</Text>
                  <AntDesign name="down" size={15} color="black" />
                </>
              )}
            </Pressable>
          </Link>

          {/* INPUTS */}
          <TextInput
            placeholder="Title"
            style={{ fontSize: 20, fontWeight: "bold", paddingVertical: 20 }}
            value={title}
            onChangeText={(text) => setTitle(text)}
            multiline // to allow multiple lines
            scrollEnabled={false}
          />
          {image && (
            <View style={{ paddingBottom: 20, paddingTop: 10 }}>
              <AntDesign
                name="close"
                size={25}
                color="white"
                onPress={() => setImage(null)}
                style={{
                  position: "absolute",
                  zIndex: 1,
                  right: 10,
                  top: 10,
                  padding: 5,
                  backgroundColor: "#00000090",
                  borderRadius: 20,
                }}
              />
              <Image
                source={{ uri: image }}
                style={{ width: "100%", aspectRatio: 1 }}
              />
            </View>
          )}
          <TextInput
            placeholder="Body text (optional)"
            style={{}}
            value={bodyText}
            onChangeText={(text) => setBodyText(text)}
            multiline
            scrollEnabled={false}
          />
        </ScrollView>
        {/* FOOTER */}
        <View style={{ flexDirection: "row", gap: 20, padding: 10 }}>
          <Feather name="link" size={20} color="black" />
          <Feather name="image" size={20} color="black" onPress={pickImage} />
          <Feather name="youtube" size={20} color="black" />
          <Feather name="list" size={20} color="black" />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  postButtonStyle: {
    color: "white",
    backgroundColor: "#115BCA",
    borderRadius: 10,
    fontWeight: "bold",
    padding: 7,
  },
});
