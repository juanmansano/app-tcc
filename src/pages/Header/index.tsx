import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";

import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Header() {

  return (
    <View style={styles.header}>
      <MaterialCommunityIcons name="home-automation" size={24} color="#FFF" />
      <Text style={styles.text}> LuNo : Luminosity iNovation </Text>
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
    borderBottomWidth: 0.2,
    paddingLeft: 15,
    paddingRight: 15,
    shadowColor: '#000',
    elevation: 2
  },
  logo:{
    height: 50,
    width: 50
  },
  text:{
    color: '#FFF',
    fontSize: 20,
    fontStyle: 'italic'
  }
});
