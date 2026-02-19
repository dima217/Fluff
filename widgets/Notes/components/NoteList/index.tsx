import SerchLight from "@/assets/images/SearchLight.svg";
import { Colors } from "@/constants/design-tokens";
import TextInput from "@/shared/Inputs/TextInput";
import Circle from "@/shared/ui/Circle";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import NoteCard from "../NoteCard";

export interface NoteListItem {
  id: string;
  createdAt: string;
  title: string;
  onPress: () => void;
  onDelete: () => void;
}

interface NoteListProps {
  notes: NoteListItem[];
}

const NoteList = ({ notes }: NoteListProps) => {
 const [search, setSearch] = useState("");
 const [filteredNotes, setFilteredNotes] = useState<NoteListItem[]>(notes);
 
 const handleSearch = (text: string) => {
  setSearch(text);
 }

 useEffect(() => {
  setFilteredNotes(notes.filter((note) => note.title.toLowerCase().includes(search.toLowerCase())));
 }, [search, notes]);

  return (
    <View style={styles.listContainer}>
      <TextInput
        placeholder="Search"
        placeholderTextColor={Colors.text}
        style={styles.searchInput}
        inputContainerStyle={styles.searchInputContainer}
        right={<Circle onPress={() => {}} svg={<SerchLight />} />}
        onChangeText={handleSearch}
        value={search}
      />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {filteredNotes.map((note) => (
        <View key={note.id} style={styles.noteCardContainer}>
          <NoteCard key={note.id} {...note} />
        </View>
      ))}
    </ScrollView>
    </View>
  );
};

export default NoteList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    noteCardContainer: {
        marginBottom: 10,
    },
    listContainer: {
        flex: 1,
        gap: 10,
    },
    searchInput: {
      borderWidth: 0,
      backgroundColor: "transparent",
    },
    searchInputContainer: {
      borderWidth: 0,
      paddingRight: 6,
    },
});