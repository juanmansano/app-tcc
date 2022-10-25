import React, { useState, useContext } from "react";
import {
    View, 
    Text, 
    StyleSheet,
    Image,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Modal
} from 'react-native';

import { AuthContext } from "../../contexts/AuthContext";

import Header from '../Header'
import Footer from '../Footer'

import { api } from "../../services/api";

export default function SingIn(){
    const { singIn, loadingAuth } = useContext(AuthContext)

    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [nome, setNome] = useState('')
    const [modalCriarUsuario, setVisivelModalCriarUsuario] = useState(false)
    const [loadingCreate, setLoadingCreate] = useState(false)

    async function handleLogin(){

        if(email === '' || senha === ''){
            return;
        }
        await singIn({ email, senha })
    }

    async function createUser(){
        setLoadingCreate(true);

        try{

            const response = await api.post('/createUser',{
                nome,
                email,
                senha
            })

            setLoadingCreate(false);

        }catch(err){
            console.log('erro ao acessar', err);
            setLoadingCreate(false);
            setVisivelModalCriarUsuario(false);
            setEmail('');
            setSenha('');
            setNome('');
            return;
        }

        handleLogin();
        setVisivelModalCriarUsuario(false);
    }

    async function newUser(){
        if(email === '' || senha === '' || nome === ''){
            alert("Preencha TODOS os campos para prosseguir!");
        }
    }

    return(
        
        <View style={styles.container}>
            <Header />

            <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <Image
                    style={styles.logo}
                    source={require('../../assets/logo.png')}
                    />
            </View>
            
            <View style={styles.inputContainer}>
                <TextInput 
                    placeholder='Digite seu email'
                    style={styles.input}
                    placeholderTextColor='#100D30'
                    value={email}
                    onChangeText={setEmail}
                    keyboardType={'email-address'}
                    autoCapitalize={'none'}
                />
                <TextInput 
                    placeholder='Digite sua senha'
                    style={styles.input}
                    placeholderTextColor='#100D30'
                    secureTextEntry={true}
                    value={senha}
                    onChangeText={setSenha}
                />

                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    { loadingAuth ? (
                        <ActivityIndicator size={20} color="#FFF"/>
                    ) : (
                        <Text style={styles.buttonText}>Acessar</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => { setVisivelModalCriarUsuario(true) }}>
                    { loadingCreate ? (
                        <ActivityIndicator size={20} color="#FFF"/>
                    ) : (
                        <Text style={styles.buttonText}>Criar Novo Usuário</Text>
                    )}
                </TouchableOpacity>
            </View>

            <Modal animationType='slide' transparent={true} visible={modalCriarUsuario}>
                <View style={styles.containerModalExterno}>
                <View style={styles.containerModalInterno}>
                    <View style={{flexDirection: 'row', alignItems:'center', justifyContent: 'center'}}> 
                    <Text style={{fontSize: 10, marginRight: 27}}>Nome: </Text>
                    <TextInput
                        style={styles.inputText}
                        onChangeText={ (texto) => setNome(texto)}
                    />
                    </View>
                    <View style={{flexDirection: 'row', alignItems:'center', justifyContent: 'center'}}> 
                    <Text style={{fontSize: 10, marginRight: 27}}>E-mail: </Text>
                    <TextInput
                        style={styles.inputText}
                        onChangeText={ (texto) => setEmail(texto)}
                    />
                    </View>
                    <View style={{flexDirection: 'row', alignItems:'center', justifyContent: 'center'}}> 
                    <Text style={{fontSize: 10, marginRight: 27}}>Senha: </Text>
                    <TextInput
                        style={styles.inputText}
                        onChangeText={ (texto) => setSenha(texto)}
                        secureTextEntry={true}
                    />
                    </View>
                    <View>
                    <TouchableOpacity style={styles.btnModalAplicar} onPress={() => createUser()}> 
                        <Text style={styles.btnModalAplicarText}> Criar Usuário </Text> 
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnModalVoltar} onPress={() => setVisivelModalCriarUsuario(false)}> 
                        <Text  style={styles.btnModalVoltarText}> Voltar </Text> 
                    </TouchableOpacity>
                    </View>
                </View>
                </View>
            </Modal> 

            <Footer />
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#FFF'
    },
    logo:{
        marginBottom: 18,
        width: 225,
        height: 225,
        borderRadius: 25,
    },
    inputContainer:{
        width: '95%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 34,
        paddingHorizontal: 14
    },
    input:{
        width: '95%',
        height: 40,
        backgroundColor: '#aaa',
        marginBottom: 12,
        borderRadius: 4,
        paddingHorizontal: 8,
        color: '#100D30'
    },
    button:{
        width: '95%',
        height: 40,
        marginBottom: 12,
        backgroundColor: '#100D30',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText:{
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF'
    },
    containerModalExterno:{
        marginLeft: 10,
        marginRight: 10,
        flex: 1,
        alignContent: 'center',
        justifyContent: 'center'
      },
      containerModalInterno:{
        height: 330,
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
})