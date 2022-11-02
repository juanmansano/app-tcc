import React, { useContext } from "react";
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { AuthContext } from '../../contexts/AuthContext';

export default function DrawerApp(props){

    const { signOut, user } = useContext(AuthContext);

    return(
        <DrawerContentScrollView {...props}>
            <View style={{marginTop: 30, alignItems:'center', justifyContent:'center'}}>
                <Text style={{color:'#004aad'}}> Bem-vindo { user.nome } !</Text>
            </View>
            
            <View style={{marginTop: 50}}>
                <DrawerItemList {...props}/>
            </View>

            <View style={{justifyContent:'flex-end', alignItems:'center', marginTop:50}}>
                <TouchableOpacity style={styles.logOut} onPress={() => { props.navigation.closeDrawer(); signOut(); } }>
                    <MaterialCommunityIcons name="exit-to-app" size={24} color="#fff" />
                    <Text style={styles.textAddDevice}>Sair</Text>
                </TouchableOpacity>
            </View>
        </DrawerContentScrollView>
    )
}

const styles = StyleSheet.create({
    logOut:{
      width: 80,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 4,
      elevation: 2,
      marginTop: 10,
      marginLeft: 80,
      marginRight: 80,
      marginBottom: 10,
      backgroundColor: "#004aad"
    },
    textAddDevice:{
      margin:10,
      color: '#FFF',
    },
  })