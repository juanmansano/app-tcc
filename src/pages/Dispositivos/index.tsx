import React, { useEffect, useState, useContext } from 'react';
import { SafeAreaView, StyleSheet, View, Text, FlatList, TouchableOpacity, Pressable, Modal, TextInput, Switch } from 'react-native';

import { AuthContext } from '../../contexts/AuthContext';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-community/picker';

import Header from '../Header'
import Footer from '../Footer'

import { api } from '../../services/api'

type DispositivoProps ={
    atividade: Array<string>,
    ativo: boolean,
    id: number,
    id_ultima_atividade: number,
    id_usuario_ultima_atividade: number,
    ligado: boolean,
    nome: string,
    owner: number,
    usuarios_autorizados: Array<string>
}

type AtividadesProps ={
    id: number,
    nome: string,
    iluminancia: number
}

export default function App(){

    const { signOut, user } = useContext(AuthContext);

  const [dispositivos, setDispositivos] = useState<DispositivoProps[]>([])
  const [atividades, setAtividades] = useState<AtividadesProps[]>([])
  const [modalEditarDispostivo, setVisivelModalEditarDispositivo] = useState(false)
  const [modalNovoDispositivo, setVisivelModalNovoDispositivo] = useState(false)
  const [dispositivoSelecionado, setDispositivoSelecionado] = useState<DispositivoProps>()
  const [atividadeSelecionada, setAtividadeSelecionada] = useState(0)
  const [dispositivoLigado, setDispositivoLigado] = useState(false)
  const [modalAdicionarUsuario, setVisivelModalAdicionarUsuario] = useState(false)
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')

  async function loadDispositivos(){
    const request_one = await api.get('/dispositivos/usuario='+ user.id);
    setDispositivos(request_one.data);
    setDispositivoSelecionado(request_one.data[0]);
  }

  async function loadAtividades(){
    const request_two = await api.get('/atividades');
    setAtividades(request_two.data);
    loadDispositivos();
  }

  useEffect(() => {

    loadAtividades();

  },[]);


  let atividadesItem = atividades.map( (v: AtividadesProps,k) => {
    return <Picker.Item key={v.id} value={v.id} label={v.nome} />
  })

  function getAtividade(item: DispositivoProps){
    return item.ligado ? "Atividade Atual: " + item.atividade.map((atividade: AtividadesProps) => atividade.nome) : "Desligado"
  }

  function carregaIcone(data: DispositivoProps){
    return data.ligado ? "lightbulb-on" : "lightbulb-outline"
  }
  
  function carregaColor(data: DispositivoProps){
    return data.ligado ? "#ffebaf" : "#aaaaaa"
  }

  async function changeLigado(data: DispositivoProps){
    let payload = { usuario_ultima_atualizacao: 1, ligado: !data.ligado }
    await api.post('statusDispositivo/id=' + data.id, payload);
    loadDispositivos();
  }

  async function changeConfigurations(data: DispositivoProps){
    setDispositivoLigado(! data.ligado)
    let payload = { usuario_ultima_atualizacao: 1, ligado: dispositivoLigado , id_ultima_atividade:  + atividadeSelecionada }
    if(nome){
      Object.assign(payload, {nome: nome})  
    }
    setNome('');
    await api.post('configuracaoDispositivo/id=' + data.id, payload);
    loadDispositivos();
    setVisivelModalEditarDispositivo(false);
  }

  async function newDevice(){
    let payload = { usuario_ultima_atualizacao: 1, nome: nome }
    // setNome('');
    // await api.post('novoDispositivo',payload);
    // loadDispositivos();
    setVisivelModalNovoDispositivo(false);
  }

  async function addUser(data: DispositivoProps){
    let id_dispositivo = data.id;
    let ativo = 1;

    const response = await api.post('/novaAutorizacao',{
      email,
      id_dispositivo,
      ativo
    })
    setVisivelModalAdicionarUsuario(false);
  }

  return(
    <SafeAreaView style={styles.container}>
      <Header />
        <View>
          <TouchableOpacity style={styles.addDevice} onPress={() => setVisivelModalNovoDispositivo(true)}>
            <MaterialCommunityIcons name="plus-box" size={24} color="#100D30" />
            <Text style={styles.textAddDevice}>Adicionar novo dispositivo</Text>
          </TouchableOpacity>
        </View>
        
      <FlatList
      data={dispositivos}
      renderItem={({ item }: { item: DispositivoProps} ) => (
        <View style={styles.containerDevices}>
        
          <TouchableOpacity style={styles.btn} onPress={ () => changeLigado(item) }>
              <MaterialCommunityIcons name={carregaIcone(item)} size={30} color={carregaColor(item)} />
          </TouchableOpacity>
          <Pressable style={styles.atributos} onPress={() => {  setAtividadeSelecionada(item.id_ultima_atividade); 
                                                                setDispositivoSelecionado(item);
                                                                setDispositivoLigado(item.ligado);
                                                                setVisivelModalEditarDispositivo(true)} } >
              <Text style={styles.titulo} > { item.nome.toUpperCase() } </Text>
              <Text style={styles.atividade}> { getAtividade(item) } </Text>
          </Pressable>
          
        </View>
      )} 
      />

        <View style={{justifyContent:'center', alignItems:'center'}}>
            <TouchableOpacity style={styles.logOut} onPress={() => signOut()}>
                <MaterialCommunityIcons name="exit-to-app" size={24} color="#100D30" />
                <Text style={styles.textAddDevice}>Sair</Text>
            </TouchableOpacity>
        </View>

      <Modal animationType='slide' transparent={true} visible={modalEditarDispostivo}>
        <View style={styles.containerModalExterno}>
          <View style={styles.containerModalInterno}>
            <View style={styles.tituloModalEditarDispositivo}>
              <Text style={styles.textoTituloModalEditarDispositivo}>Editar { dispositivoSelecionado?.nome.toLocaleUpperCase() }</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems:'center', justifyContent: 'center'}}> 
              <Text style={{fontSize: 15}}>Nome: </Text>
              <TextInput 
                style={styles.inputText}
                defaultValue={ dispositivoSelecionado?.nome }
                onChangeText={ (texto) => setNome(texto)}
              />
            </View>
            <View style={{flexDirection: 'row', alignItems:'center', justifyContent: 'center'}}> 
              <Text style={{fontSize: 15, marginLeft: 40}}>Atividade: </Text>
              <Picker
                style={styles.inputText}
                selectedValue={atividadeSelecionada}
                onValueChange={(itemValue, itemIndex) => setAtividadeSelecionada(Number(itemValue)) } >
                  { atividadesItem }
              </Picker>
            </View>
            <View style={{flexDirection: 'row', alignItems:'center'}}> 
              <Text style={{fontSize: 15, marginLeft: 40}}>Ligado: </Text>
              <Switch 
              value={!! dispositivoLigado}
              onValueChange={ (valorSelecionado) => setDispositivoLigado(valorSelecionado)}
              thumbColor={dispositivoLigado ? '#100D30' : '#F4F4F4'}
              />
            </View>
                { user.id === dispositivoSelecionado?.owner ? (
                <View style={{justifyContent:'center', alignItems:'center'}}>
                <TouchableOpacity style={styles.addUser} onPress={() => setVisivelModalAdicionarUsuario(true)}>
                  <MaterialCommunityIcons name="plus-box" size={24} color="#100D30" />
                  <Text style={styles.textAddUser}>Adicionar outro Usuario</Text>
                </TouchableOpacity>
                </View> ) : (<Text></Text>) 
                }
              
            
            <View>
              <TouchableOpacity style={styles.btnModalAplicar} onPress={() => changeConfigurations(dispositivoSelecionado)}> 
                  <Text style={styles.btnModalAplicarText}> Aplicar </Text> 
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnModalVoltar} onPress={() => setVisivelModalEditarDispositivo(false)}> 
                <Text  style={styles.btnModalVoltarText}> Voltar </Text> 
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal animationType='slide' transparent={true} visible={modalNovoDispositivo}>
        <View style={styles.containerModalExterno}>
          <View style={styles.containerModalInterno}>
            <View style={{flexDirection: 'row', alignItems:'center', justifyContent: 'center'}}> 
              <Text style={{fontSize: 10, marginRight: 27}}>Nome: </Text>
              <TextInput
                style={styles.inputText}
                onChangeText={ (texto) => setNome(texto)}
              />
            </View>
            <View>
              <TouchableOpacity style={styles.btnModalAplicar} onPress={() => newDevice()}> 
                  <Text style={styles.btnModalAplicarText}> Adicionar </Text> 
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnModalVoltar} onPress={() => setVisivelModalNovoDispositivo(false)}> 
                <Text  style={styles.btnModalVoltarText}> Voltar </Text> 
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal> 

      <Modal animationType='slide' transparent={true} visible={modalAdicionarUsuario}>
        <View style={styles.containerModalUsuarioExterno}>
          <View style={styles.containerModalUsuarioInterno}>
          <View style={styles.tituloModalEditarDispositivo}>
              <Text style={styles.textoTituloModalEditarDispositivo}>Adicionar Usuario</Text>
            </View>
            
            <View style={{flexDirection: 'row', alignItems:'center', justifyContent: 'center'}}> 
              <Text style={{fontSize: 10, marginRight: 27}}>E-mail: </Text>
                <TextInput
                    style={styles.inputText}
                    onChangeText={ (texto) => setEmail(texto)}
                />
            </View>
            <View>
              <TouchableOpacity style={styles.btnModalAplicar} onPress={() => {setVisivelModalAdicionarUsuario(false); 
                                                                                addUser(dispositivoSelecionado)}}> 
                  <Text style={styles.btnModalAplicarText}> Adicionar </Text> 
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnModalVoltar} onPress={() => setVisivelModalAdicionarUsuario(false)}> 
                <Text  style={styles.btnModalVoltarText}> Voltar </Text> 
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal> 

      <Footer />

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between'
  },
  addDevice:{
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    elevation: 2,
    marginTop: 10,
    marginLeft: 80,
    marginRight: 80,
    backgroundColor: "#aaaaaa"
  },
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
    backgroundColor: "#aaaaaa"
  },
  textAddDevice:{
    margin:10,
    color: '#100D30',
    fontStyle: 'italic',
  },
  containerDevices: {
    flex: 1,
    backgroundColor: '#100D30',
    margin: 15,
    elevation: 2,
    flexDirection: 'row',
    borderRadius: 10
  },
  btn:{
    justifyContent:'center',
    paddingLeft:10,
    paddingRight: 10
  },
  atributos:{
    flex: 1,
    flexDirection:'column',
    alignContent: 'center',
    justifyContent: 'center',
  },
  titulo:{
    fontSize: 20,
    color: '#FFF',
    fontWeight: 'bold',
    paddingTop: 10,
    paddingLeft: 10
  },
  atividade:{
    fontSize: 15,
    color: '#FFF',
    padding: 10
  },
  containerModalExterno:{
    marginLeft: 10,
    marginRight: 10,
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center'
  },
  containerModalInterno:{
    height: 430,
    borderColor: '#100D30',
    borderWidth: 1,
    backgroundColor: '#FFF' ,
    borderRadius: 5,
    marginLeft: 10,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2
  },
  inputText:{
    height: 40,
    width: 250,
    borderWidth: 1,
    borderColor: '#aaaaaa',
    margin: 10,
    padding: 10,
    fontSize: 15,
  }, 
  btnModalAplicar:{
    width: 130,
    height: 50,
    backgroundColor: '#100D30',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15
  },
  btnModalAplicarText:{
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFF'
  },
  btnModalVoltar:{
    width: 130,
    height: 50,
    backgroundColor: '#FFF',
    borderColor: '#100D30',
    borderWidth: 2,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15
  },
  btnModalVoltarText:{
    fontSize: 17,
    fontStyle: 'italic',
    color: '#100D30'
  },
  addUser:{
    width: '60%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    elevation: 2,
    marginTop: 10,
    marginLeft: 80,
    marginRight: 80,
    marginBottom: 10,
    backgroundColor: "#aaaaaa"
  },
  textAddUser:{
    margin:10,
    color: '#100D30',
    fontStyle: 'italic',
  },
  tituloModalEditarDispositivo:{
    paddingBottom: 5,
  },
  textoTituloModalEditarDispositivo:{
    fontWeight: 'bold',
    fontSize: 20,
  },
  containerModalUsuarioExterno:{
    marginLeft: 10,
    marginRight: 10,
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center'
  },
  containerModalUsuarioInterno:{
    height: 350,
    borderColor: '#100D30',
    borderWidth: 1,
    backgroundColor: '#FFF' ,
    borderRadius: 5,
    marginLeft: 10,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2
  }
})