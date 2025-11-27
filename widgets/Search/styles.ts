import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    paddingHorizontal: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    color: 'gray',
    fontSize: 14,
  },
  popularTag: {
    backgroundColor: '#333333',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  selectedTag: {
    backgroundColor: 'white',
  },
  selectedTagText: {
    color: 'black',
  },
  tagText: {
    color: 'white',
  },
  separator: {
    height: 1,
    backgroundColor: 'transparent',
    marginVertical: 10,
  },
});