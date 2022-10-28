import React, { useState, useContext } from 'react';
import { SafeAreaView, StyleSheet, View, Text, FlatList, TouchableOpacity, Pressable, Switch, Image } from 'react-native';

import { useNavigation,  useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { AuthContext } from '../../contexts/AuthContext';
import { api } from '../../services/api'
import { StackAppParamsList } from "../../routes/stackApp.routes"

type DispositivoProps ={
    atividade: Array<string>,
    ativo: boolean,
    id: number,
    id_ultima_atividade: number,
    id_usuario_ultima_atividade: number,
    ligado: boolean,
    nome: string,
    owner: number,
    usuarios_autorizados: String[]
}

type AtividadesProps ={
    id: number,
    nome: string,
    iluminancia: number
}

export default function Device(){
  const navigation = useNavigation<NativeStackNavigationProp<StackAppParamsList>>();
  const { user } = useContext(AuthContext);

  const [dispositivos, setDispositivos] = useState<DispositivoProps[]>([])

  async function loadDispositivos(){
    const request_one = await api.get('/dispositivos/usuario='+ user.id);
    setDispositivos(request_one.data);
  }

  useFocusEffect(
    React.useCallback(() => {
      loadDispositivos();
    }, [])
   );

  function getAtividade(item: DispositivoProps){
    return item.ligado ? "Atividade Atual: " + item.atividade.map((atividade: AtividadesProps) => atividade.nome) : "Desligado"
  }

  function carregaIcone(data: DispositivoProps){
    return data.ligado ? "lightbulb-on" : "lightbulb-outline"
  }
  
  function carregaColor(data: DispositivoProps){
    return data.ligado ? "#fff100" : "#FFF"
  }

  async function changeLigado(data: DispositivoProps){
    let payload = { usuario_ultima_atualizacao: user.id, ligado: !data.ligado }
    await api.post('statusDispositivo/id=' + data.id, payload);
    loadDispositivos();
  }

  return(
    <SafeAreaView style={styles.container}>
      <View style={{flexDirection: 'row', alignItems:'center', justifyContent:'flex-start'}}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <MaterialCommunityIcons name="menu" size={24} color="#004aad" />
        </TouchableOpacity>
        <Image
          style={styles.logo}
          source={require('../../assets/logo17.png')}
          resizeMode='stretch'
        />
      </View>
        
      <FlatList
      data={dispositivos}
      renderItem={({ item }: { item: DispositivoProps} ) => (
        <View style={styles.containerDevices}>
          <Pressable style={{
                        flexDirection:'row', 
                        alignItems:'center', 
                        justifyContent: 'center'}} 
                    onPress={( ) => navigation.navigate('EditDevice', 
                                    {id: item.id, 
                                    ligado: item.ligado, 
                                    nome: item.nome, 
                                    ultima_atividade_id: item.id_ultima_atividade, 
                                    ultima_atividade_nome: (item.atividade.map((atividade: AtividadesProps) => atividade.nome)).toString(),
                                    owner: item.owner}) }>
              <MaterialCommunityIcons name={carregaIcone(item)} size={30} color={carregaColor(item)} />
              <View style={{flexDirection: 'column'}}>
                <Text style={styles.titulo} > { item.nome.substring(0,15) } </Text>
                <Text style={styles.atividade}> { getAtividade(item) } </Text>
              </View>
          </Pressable>
          <Switch 
              value={!! item.ligado}
              onValueChange={ () => changeLigado(item)}
              thumbColor={'#F4F4F4'}
              trackColor={{false:'#aaa', true:'#fff100'}}
              />
        </View>
      )} 
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo:{
    width:200,
    height: 89,
    alignItems: 'center',
    justifyContent: 'center',
},
  containerDevices: {
    flex: 1,
    width: 280,
    height: 60,
    backgroundColor: '#004aad',
    marginTop: 15,
    paddingHorizontal: 15,
    elevation: 2,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 10
  },
  titulo:{
    fontSize: 20,
    color: '#FFF',
    marginTop: 10,
    marginLeft: 10
  },
  atividade:{
    fontSize: 10,
    color: '#FFF',
    marginLeft: 15,
    marginBottom: 10
  },
})