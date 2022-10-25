import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";

import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Footer() {
  return (
    <View style={styles.header}>
      <MaterialCommunityIcons name="home-automation" size={24} color="#FFF" />
      <Text style={styles.text}> Bem-estar e Economia para dentro da sua casa!</Text>
      <MaterialCommunityIcons name="home-automation" size={24} color="#FFF" />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 55,
    backgroundColor: "#100D30",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingLeft: 15,
    paddingRight: 15,
    borderBottomWidth: 0.2,
    shadowColor: '#000',
    elevation: 2
  },
  logo:{
    height: 50,
    width: 50
  },
  text:{
    color: '#FFF',
    fontSize: 12,
    fontStyle: 'italic'
  }
});
