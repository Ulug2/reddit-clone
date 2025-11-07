import React, { useState } from "react";
import {
  FlatList,
  Text,
  TextInput,
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Link, router } from "expo-router";
import { useSetAtom } from "jotai";
import { selectedGroupAtom } from "../../atoms";
import { useQuery } from "@tanstack/react-query";
import { fetchGroups } from "../../services/groupService";
import { Tables } from "../../types/database.types";

type Group = Tables<"groups">;

export default function GroupSelector() {
  const [searchText, setSearchText] = useState<string>("");
  const setGroup = useSetAtom(selectedGroupAtom);

  const { data, isLoading, error } = useQuery({
    queryKey: ["groups", { searchText }],
    queryFn: () => fetchGroups(searchText),
    staleTime: 10_000,
    placeholderData: (previousData) => previousData,
  });

  const onGroupSelected = (group: Group) => {
    setGroup(group);
    router.back();
  };

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error || !data) {
    return <Text>Oops...Error Fetching Groups...</Text>;
  }

  const filteredGroups = data.filter((group) =>
    group.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: "white", paddingHorizontal: 10 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        {/* HEADER */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <AntDesign
            name="close"
            size={30}
            color="black"
            onPress={() => router.back()}
          />
          <Text
            style={{
              flex: 1,
              textAlign: "center",
              paddingRight: 30,
              fontWeight: "600",
              fontSize: 15,
            }}
          >
            Post to
          </Text>
        </View>
        {/* SEARCH BAR */}
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "lightgrey",
            borderRadius: 5,
            gap: 5,
            marginVertical: 10,
            alignItems: "center",
            paddingHorizontal: 5,
          }}
        >
          <AntDesign name="search" size={16} color="gray" />
          <TextInput
            placeholder="Search for a community"
            placeholderTextColor={"gray"}
            style={{ paddingVertical: 10, flex: 1 }}
            value={searchText}
            onChangeText={(text) => setSearchText(text)}
          />
          {searchText && (
            <AntDesign
              name="close"
              size={15}
              color="#aeacacff"
              onPress={() => setSearchText("")}
            />
          )}
        </View>
        {/* LIST OF GROUPS */}
        <FlatList
          style={{ marginTop: 10 }}
          data={filteredGroups}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => onGroupSelected(item)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
                marginBottom: 20,
              }}
            >
              <Image
                source={{ uri: item.image }}
                style={{ width: 40, aspectRatio: 1, borderRadius: 20 }}
              />
              <View>
                <Text style={{ fontWeight: "600" }}>{item.name}</Text>
              </View>
            </Pressable>
          )}
        />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
