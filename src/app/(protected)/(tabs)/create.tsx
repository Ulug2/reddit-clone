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
import { AntDesign } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { useState } from "react";
import { useAtom } from "jotai";
import { selectedGroupAtom } from "../../../atoms";

export default function CreateScreen() {
  const [title, setTitle] = useState<string>("");
  const [bodyText, setBodyText] = useState<string>("");
  // const [image, setImage] = useState<string | null>(null);
  const [group, setGroup] = useAtom(selectedGroupAtom);

  const goBack = () => {
    setTitle("");
    setBodyText("");
    router.back();
  };

  return (
    <SafeAreaView
      style={{ backgroundColor: "white", flex: 1, paddingHorizontal: 10 }}
    >
      {/* HEADER */}
      <Pressable
        onPress={goBack}
        style={{ flexDirection: "row", marginBottom: 5 }}
      >
        <AntDesign name="close" size={30} color="black" onPress={goBack} />
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
