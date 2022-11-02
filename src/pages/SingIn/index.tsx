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
    Alert,
    Keyboard
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { AuthContext } from "../../contexts/AuthContext";
import { StackParamsList } from "../../routes/auth.routes"



export default function SingIn(){
    const navigation = useNavigation<NativeStackNavigationProp<StackParamsList>>();

    const { singIn, loadingAuth } = useContext(AuthContext)

    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')

    async function handleLogin(){

        if(email === '' || senha === ''){
            Alert.alert('Dados não preenchidos', 'Favor preencher todos os dados!', [{ text: 'OK', onPress: () => Keyboard.dismiss() }]);
            return;
        }
        await singIn({ email, senha })
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
                    
                        <TextInput 
                            placeholder='E-mail'
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType={'email-address'}
                            autoCapitalize={'none'}
                        />
                        <TextInput 
                            placeholder='Senha'
                            style={styles.input}
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

                        <TouchableOpacity style={styles.button} onPress={() => { navigation.navigate('CreateUser') }}>
                                <Text style={styles.buttonText}>Criar Novo Usuário</Text>
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