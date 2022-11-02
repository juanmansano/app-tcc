import React, { useEffect, useState, useContext } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity, Modal, TextInput, TouchableWithoutFeedback, Image, ScrollView, Dimensions, Keyboard } from 'react-native';

import { useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { AuthContext } from '../../contexts/AuthContext';
import { api } from '../../services/api'
import { StackAppParamsList } from '../../routes/stackApp.routes'
import { ModalPicker } from '../../components/ModalPicker'

type RouteParams ={
    Device:{
        id: number,
        nome: string,
        ultima_atividade_id: number,
        ultima_atividade_nome: string,
        owner: number,
        edit: boolean
    }
}

export type AtividadesProps = {
    id: number,
    nome: string
}

type AtividadesSelecionadaProps = {
    nome: string
}

type DeviceRouteProps = RouteProp<RouteParams, 'Device'>;

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window')


export default function EditDevice(){
    const route = useRoute<DeviceRouteProps>();
    const navigation = useNavigation<NativeStackNavigationProp<StackAppParamsList>>();
    const { user } = useContext(AuthContext);

    const [atividades, setAtividades] = useState<AtividadesProps | []>([])
    const [atividadeSelecionada, setAtividadeSelecionada] = useState<AtividadesSelecionadaProps>('')
    const [idAtividadeSelecionada, setIdAtividadeSelecionada] = useState(0)
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [modalAtividadesVisivel, setModalAtividadesVisivel] = useState(false)
    const [modalAddUser, setModalAddUser] = useState(false)
    const [autorizados, setAutorizados] = useState([])

    useEffect(() => {
        async function loadAtividades(){
            const request = await api.get('/atividades');
            setAtividades(request.data);
            setAtividadeSelecionada(route.params.ultima_atividade_nome);
            setIdAtividadeSelecionada(route.params.ultima_atividade_id);
            setNome(route.params.nome);
        }
        loadAtividades();
        loadAutorizados();
    },[]);

    async function loadAutorizados() {
        const request = await api.get('/autorizacao/dispositivo='+ route.params.id)
        setAutorizados(request.data)
    }

    async function changeConfigurations(){

        let payload = { usuario_ultima_atualizacao: user.id, id_ultima_atividade:  + idAtividadeSelecionada }
        if(nome){
        Object.assign(payload, {nome: nome})  
        }
        await api.post('configuracaoDispositivo/id=' + route.params.id, payload);
        setNome('');
        navigation.navigate('Device');
    }

    async function changeAutorization(ativo, email){
        
        let payload = { id_dispositivo: route.params.id, ativo: ativo, email: email}

        await api.post('/changeAutorizacao', payload)
        loadAutorizados();
        setModalAddUser(false);
        setEmail('');
    }

    function handleChangeAtividade(item: AtividadesProps){
        setAtividadeSelecionada(item.nome);
        setIdAtividadeSelecionada(item.id);
    }


    return(
        <TouchableWithoutFeedback
        touchSoundDisabled
        onPress={() => {Keyboard.dismiss()}}>
        
        <SafeAreaView style={styles.container}>
            
            <View style={{flexDirection: 'row', alignItems:'center', justifyContent:'center'}}>
                <Image
                    style={styles.logo}
                    source={require('../../assets/logo17.png')}
                    resizeMode='stretch'
                />
            </View>   
            <View style={styles.tituloModalEditarDispositivo}>
              <Text style={styles.textoTituloModalEditarDispositivo}>Editar { route.params.nome }</Text>
            </View>
            <View style={{flexDirection: 'row', alignItems:'center', justifyContent:'flex-start', marginLeft: 70, width:WIDTH}}> 
              <Text style={{fontSize: 15}}>Nome: </Text>
              <TextInput 
                style={[styles.inputText, {marginLeft:32}]}
                defaultValue={ route.params.nome }
                onChangeText={ (texto) => setNome(texto)}
              />
            </View>
            {atividades.length!==0 && (
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent:'flex-start', marginLeft: 70, width:WIDTH}}>
                    <Text style={{fontSize: 15}}>Atividade: </Text>
                    <TouchableOpacity style={[styles.inputText, {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'} ]} onPress={()=>setModalAtividadesVisivel(true)}>
                        <Text style={{color: "#004aad"}}>
                            {atividadeSelecionada.toUpperCase()}
                        </Text>
                        <MaterialCommunityIcons name="arrow-down-thin" size={20} color="#aaa" />
                    </TouchableOpacity>
                </View>
            )}
            <Modal 
            transparent={true}
            visible={modalAtividadesVisivel}
            animationType='fade'
            >
                <ModalPicker 
                    handleCloseModal ={( () => setModalAtividadesVisivel(false))}
                    options={atividades}
                    selectedItem={ handleChangeAtividade }
                />
            </Modal>
            { user.id === route.params.owner ? (
                <View style={{width:WIDTH}}>
                    <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center',}}>
                        <Text style={[styles.textoTituloModalEditarDispositivo, {marginRight: 10}]}>Usuários Autorizados</Text>
                        <TouchableOpacity onPress={() => { setModalAddUser(true) }}>
                            <MaterialCommunityIcons name="plus-box" size={25} color="#004aad" />
                        </TouchableOpacity>
                    </View>
                    <View>
                    <View style={{flexDirection: 'row', height:150, justifyContent:'flex-start', marginLeft: 30,}}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {autorizados.map((item, index) => (
                                <View key={item.id} style={{flexDirection:'row'}}>
                                    <Text style={styles.item}>
                                        {item.nome}
                                    </Text>
                                    { user.id !== item.id ? (
                                    <TouchableOpacity style={{marginLeft: 10, alignItems:'center', justifyContent:'center'}}onPress={() => {changeAutorization(0, item.email)}}>
                                        <MaterialCommunityIcons name="trash-can-outline" size={24} color="#FF0000" />
                                    </TouchableOpacity>
                                    ):(<Text></Text>)}
                                </View>
                                
                            ))}
                        </ScrollView>
                    </View>
                        <View style={{alignItems: 'center', justifyContent: 'center'}}>
                            
                        </View>
                    </View>
                </View>
                ) : (<Text></Text>) 
                }
            
            <View>
                <TouchableOpacity style={styles.button} onPress={ changeConfigurations }> 
                    <Text style={styles.buttonText}> Salvar </Text> 
                </TouchableOpacity>
                { route.params.edit ? (
                    <TouchableOpacity style={styles.button} onPress={() => { navigation.goBack() }}> 
                        <Text  style={styles.buttonText}> Cancelar </Text> 
                    </TouchableOpacity>) : (<Text></Text>) 
                }
            </View>

            <Modal
            transparent={true} 
            visible={modalAddUser}
            animationType='fade'
            >   
                <TouchableWithoutFeedback
                touchSoundDisabled
                onPress={() => {Keyboard.dismiss()}}>
                    <View style={styles.container}>
                        <View style={styles.content}>
                            <View style={{flexDirection: 'row', alignItems:'center', justifyContent:'center'}}>
                                <Image
                                    style={styles.logo}
                                    source={require('../../assets/logo17.png')}
                                    resizeMode='stretch'
                                />
                            </View> 
                            <Text style={styles.textoTituloModalEditarDispositivo}> Adicionar usuário - {route.params.nome}</Text>
                            <TextInput
                                placeholder='Digite o email do usuario'
                                style={[styles.inputText, {width: 250}]}
                                value={email}
                                onChangeText={ (texto) => setEmail(texto)}
                                keyboardType={'email-address'}
                                autoCapitalize={'none'}
                            />
                            <View>
                                <TouchableOpacity style={styles.button} onPress={ () => { changeAutorization(1, email) } }> 
                                    <Text style={styles.buttonText}> Adicionar </Text> 
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.button} onPress={() => { setModalAddUser(false) }}> 
                                    <Text  style={styles.buttonText}> Cancelar </Text> 
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
            
        </SafeAreaView>
        </TouchableWithoutFeedback>
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
    atividade:{
        fontSize: 10,
        color: '#FFF',
        marginLeft: 15,
        marginBottom: 10
    },
    inputText:{
        height: 40,
        width: 150,
        borderWidth: 1,
        borderColor: '#aaaaaa',
        margin: 10,
        padding: 10,
        fontSize: 15,
        color: '#004aad'
    }, 
    tituloModalEditarDispositivo:{
        paddingBottom: 5,
    },
    textoTituloModalEditarDispositivo:{
        color: '#004aad',
        fontSize: 17,
    },
    item:{
        margin: 5,
        fontSize: 14,
        color: '#004aad'
    },
    button:{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        height: 40,
        width: 200,
        elevation: 2,
        marginBottom: 10,
        marginLeft: 80,
        marginRight: 80,
        backgroundColor: "#004aad"
    },
    buttonText:{
        margin:10,
        color: '#FFF'
    },
    content:{
        width: WIDTH - 20,
        height: HEIGHT / 3,
        backgroundColor: '#FFF',
        borderTopWidth: 0,
        borderRadius: 4,
        alignItems:'center',
        justifyContent:'flex-start'
    },
})