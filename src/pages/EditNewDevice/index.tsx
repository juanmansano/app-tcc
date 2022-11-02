import React, { useEffect, useState, useContext } from 'react';
import { SafeAreaView, StyleSheet, View, Text, ActivityIndicator, TouchableOpacity, Modal, TextInput, TouchableWithoutFeedback, Image, ScrollView, Dimensions, Keyboard } from 'react-native';

import { useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";


import { AuthContext } from '../../contexts/AuthContext';
import { api } from '../../services/api'
import { StackAppParamsList } from '../../routes/stackApp.routes'
import { ModalPicker } from '../../components/ModalPicker'
import moment from 'moment';

type RouteParams ={
    Device:{
        nome: string,
        owner: number,
        data_criacao: string
    }
}

type DeviceRouteProps = RouteProp<RouteParams, 'Device'>;

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window')


export default function EditNewDevice(){
    const route = useRoute<DeviceRouteProps>();
    const navigation = useNavigation<NativeStackNavigationProp<StackAppParamsList>>();
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const interval = setInterval(() => {
            loadDispositivos();
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    async function loadDispositivos(){
        const request_one = await api.get(`/novoDispositivo?nome=${route.params.nome}&owner=${user.id}&data_criacao=${route.params.data_criacao}`);


        request_one.data.forEach( item =>{
            if(item.nome === route.params.nome && 
                item.owner === route.params.owner && 
                moment(item.data_criacao).format("DD/MM/YYYY HH:mm:ss") === route.params.data_criacao){
                console.log('OLA');
                navigation.navigate('EditDevice', 
                                    {id: item.id, 
                                    nome: item.nome, 
                                    ultima_atividade_id: item.id_ultima_atividade, 
                                    ultima_atividade_nome: (item.atividade.map((atividade: AtividadesProps) => atividade.nome)).toString(),
                                    owner: item.owner,
                                    edit: false})
            }
            else{
                console.log('Alo')
            }
        });

    }

    return(
        
        <SafeAreaView style={styles.container}>
            
            <View style={{flexDirection: 'row', alignItems:'center', justifyContent:'center'}}>
                <Image
                    style={styles.logo}
                    source={require('../../assets/logo17.png')}
                    resizeMode='stretch'
                />
            </View>

            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text style={styles.text}>Aguarde enquanto cadastramos o teu dispositivo!</Text>
                <ActivityIndicator size={100} color="#004aad"/>
            </View>
        </SafeAreaView>
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
    text:{ 
        marginVertical: 10, 
        alignItems:'center', 
        justifyContent:'center', 
        color:'#004aad',
        fontSize: 17,
        textAlign:'center',
        marginHorizontal:15,
      },
})