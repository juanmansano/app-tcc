import React, { useState, useContext } from 'react';
import { SafeAreaView, StyleSheet, View, TouchableOpacity, TextInput, Image, Text, Platform, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native';

import moment from 'moment';

import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';

import { AuthContext } from '../../contexts/AuthContext';
import { StackAppParamsList } from '../../routes/stackApp.routes'

export default function NewDevice(){
  const navigation = useNavigation();
  const stack_navigation = useNavigation<NativeStackNavigationProp<StackAppParamsList>>();
  const { user } = useContext(AuthContext);

  Location.requestForegroundPermissionsAsync()

  const [nome, setNome] = useState('');
  const [IP, setIP] = useState('');
  const [ssid, setSSID] = useState('');
  const [password, setPass] = useState('');
  const [correctIP, setCorrectIP] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setCorrectIP(false);
      const unsubscribe = NetInfo.addEventListener((state) => {setIP(state.details.ipAddress);});

      return () => {unsubscribe();}
    }, [])
  );

  async function verificaIP(){

      await NetInfo.fetch().then( (state) =>
        {setIP(state.details.ipAddress);}
      );
      if (IP !== undefined) {
        if(IP.startsWith('192.168.4')) {
          setCorrectIP(true);
        }
      }
  }  

  async function newDevice(){
    let data =  moment().format("DD/MM/YYYY HH:mm:ss");
    let payload = { id_usuario: user.id, nome: nome, ssid: ssid, pass: password, data_criacao: data };
    await axios.post('http://192.168.4.1/',payload);
    setCorrectIP(false);
    setNome('');
    setSSID('');
    setPass('');
    setIP('');
    stack_navigation.navigate('EditNewDevice', {nome: nome, owner: user.id, data_criacao: data} );
  }

  return(

    <TouchableWithoutFeedback
    touchSoundDisabled
    onPress={() => {Keyboard.dismiss()}}>
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
                    behavior={Platform.OS == "ios" ? "padding" : "height"}
                    style={{alignItems: 'center', justifyContent: 'flex-start', height:'100%'}}>
      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent:'flex-start'}}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <MaterialCommunityIcons name="menu" size={24} color="#004aad" />
        </TouchableOpacity>
        <Image
          style={styles.logo}
          source={require('../../assets/logo17.png')}
          resizeMode='stretch'
        />
      </View>
      { correctIP ? (
                <View style={{justifyContent:'center', alignItems:'center'}}>
                  <Text style={styles.text}>Já estamos quase terminando a configuração, por favor, 
                                            preencha os campos a baixo</Text>
                  <TextInput
                    placeholder='Nome do dispositivo'
                    style={styles.input}
                    value={nome}
                    onChangeText={ (texto) => setNome(texto.normalize('NFD').replace(/[\u0300-\u036f]/g,""))}
                  />
                  <TextInput
                    placeholder='Wi-fi para conectar o dispositivo'
                    style={styles.input}
                    value={ssid}
                    onChangeText={ (texto) => setSSID(texto)}
                  />
                  <TextInput
                    placeholder='Senha da wi-fi'
                    style={styles.input}
                    secureTextEntry={true}
                    value={password}
                    onChangeText={ (texto) => setPass(texto)}
                  />
                  <TouchableOpacity style={styles.button} onPress={newDevice}>
                                <Text style={styles.buttonText}>Adicionar</Text>
                        </TouchableOpacity>
                </View> ) : (
                <View style={{justifyContent:'center', alignItems:'center'}}>
                  <Text style={styles.text}>Muito obrigado por adquirir um produto LUNO!</Text>
                  <Text style={styles.text}>Para iniciar a configurações primeiramente 
                                            conecte seu dispositivo na tomada e
                                            acesse a rede wi-fi: LUNO-AP.</Text>
                  <Text style={styles.text}>Caso esteja ativado, favor desativar os dados móveis.</Text>
                  <Text style={styles.text}>Após isso, clique para prosseguir!</Text> 
                  <TouchableOpacity style={styles.button} onPress={verificaIP}>
                    <Text style={styles.buttonText}>Prosseguir</Text>
                  </TouchableOpacity>
                </View>
                )}
      </KeyboardAvoidingView>
    </SafeAreaView>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  logo:{
    width:200,
    height: 89,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button:{
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    height: 40,
    width: 150,
    elevation: 2,
    marginTop: 15,
    marginBottom: 10,
    marginLeft: 80,
    marginRight: 80,
    backgroundColor: "#004aad"
  },
  buttonText:{
      margin:10,
      color: '#FFF'
  },
  text:{ 
    marginTop:10, 
    alignItems:'center', 
    justifyContent:'center', 
    color:'#004aad',
    fontSize: 17,
    textAlign:'center',
    marginHorizontal:15
  },
  input:{
    width: 250,
    height: 40,
    borderWidth: 1,
    borderColor: '#aaa',
    margin: 10,
    borderRadius: 4,
    paddingHorizontal: 8,
    color: '#004aad'
  },
})