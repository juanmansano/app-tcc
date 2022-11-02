import React, { useState, useContext } from "react";
import {
    Text, 
    StyleSheet,
    Image,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    Alert
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { AuthContext } from "../../contexts/AuthContext";
import { api } from "../../services/api";


export default function CreateUser(){
    const navigation = useNavigation();

    const { singIn, loadingAuth } = useContext(AuthContext)

    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [nome, setNome] = useState('')

    async function handleLogin(){

        if(email === '' || senha === ''){
            return;
        }
        await singIn({ email, senha })
    }

    async function createUser(){

        if(email === '' || senha === '' || nome  === ''){
            Alert.alert('Dados não preenchidos', 'Favor preencher todos os dados!', [{ text: 'OK', onPress: () => Keyboard.dismiss() }]);
            return;
        }

        let usuario = email.substring(0, email.indexOf("@"));
        let dominio = email.substring(email.indexOf("@")+ 1, email.length);


        if ((usuario.length >=1) &&
            (dominio.length >=3) &&
            (usuario.search("@")==-1) &&
            (dominio.search("@")==-1) &&
            (usuario.search(" ")==-1) &&
            (dominio.search(" ")==-1) &&
            (dominio.search(".")!=-1) &&
            (dominio.indexOf(".") >=1)&&
            (dominio.lastIndexOf(".") < dominio.length - 1)) {
            
                const response = await api.post('/createUser',{
                nome,
                email,
                senha
            })
            handleLogin();
        }
        else{
            Alert.alert('Email inválido', 'Favor preencher um email válido!', [{ text: 'OK', onPress: () => Keyboard.dismiss() }]);
            return;
        }
    }

    return(
        <TouchableWithoutFeedback
        touchSoundDisabled
        onPress={() => {Keyboard.dismiss()}}>
            <SafeAreaView style={styles.container}>

                <KeyboardAvoidingView 
                    behavior={Platform.OS == "ios" ? "padding" : "height"}
                    style={{alignItems: 'center', justifyContent: 'center', height:'100%'}}>
                        <Image
                            style={styles.logo}
                            source={require('../../assets/logo17.png')}
                            resizeMode='stretch'
                            />

                        <Text style={{marginBottom:5, fontWeight: 'bold', color: '#004aad'}}>Criar novo Usuario: </Text>
                    
                        <TextInput
                            placeholder='Nome'
                            style={styles.input}
                            value={nome}
                            onChangeText={ (texto) => setNome(texto)}
                        />
                        <TextInput
                            placeholder='E-mail'
                            style={styles.input}
                            value={email}
                            onChangeText={ (texto) => setEmail(texto)}
                            keyboardType={'email-address'}
                            autoCapitalize={'none'}
                        />
                        <TextInput
                            placeholder='Senha'
                            style={styles.input}
                            value={senha}
                            onChangeText={ (texto) => setSenha(texto)}
                            secureTextEntry={true}
                        />
                        
                        <TouchableOpacity style={styles.button} onPress={createUser}>
                            { loadingAuth ? (
                                <ActivityIndicator size={20} color="#FFF"/>
                            ) : (
                                <Text style={styles.buttonText}>Confirmar e Acessar</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.button} onPress={() => { navigation.goBack() }}>
                                <Text style={styles.buttonText}>Voltar</Text>
                        </TouchableOpacity>
                </KeyboardAvoidingView>

            </SafeAreaView>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF'
    },
    logo:{
        width:420,
        height: 187
    },
    input:{
        width: 250,
        height: 40,
        borderWidth: 1,
        borderColor: '#aaa',
        marginBottom: 10,
        borderRadius: 4,
        paddingHorizontal: 8,
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
})
