import React, {useState, createContext, ReactNode, useEffect } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { api } from '../services/api';

type UserProps ={
    id: number,
    nome: string,
    email: string,
    token: string
}

type AuthContexData = {
    user: UserProps;
    isAuthenticated: boolean;
    singIn: (info: SingInProps) => Promise<void>;
    loadingAuth: boolean;
    loading: boolean;
    signOut: () => Promise<void>;
}

type AuthProviderProps = {
    children: ReactNode;
}

type SingInProps ={
    email: string,
    senha: string
}

export const AuthContext = createContext({} as AuthContexData);

export function AuthProvider({children}: AuthProviderProps){
    const [user, setUser] = useState<UserProps>({
        id: 0,
        nome: '',
        email: '',
        token: ''
    })

    const [loadingAuth, setLoadingAuth] = useState(false)
    const [loading, setLoading] = useState(true)

    const isAuthenticated = !!user.nome;

    useEffect(() => {

        async function getUser(){
            
            const userInfo = await AsyncStorage.getItem('@login');
            let hasUser: UserProps = JSON.parse(userInfo || '{}');

            if(Object.keys(hasUser).length > 0){
                api.defaults.headers.common['Authorization'] = `Bearer ${hasUser.token}`;
                setUser({
                    id: hasUser.id,
                    nome: hasUser.nome,
                    email: hasUser.email,
                    token: hasUser.token
                })
            }

            setLoading(false);

        }

        getUser();
    }, [])

    async function singIn({ email, senha }: SingInProps){
        setLoadingAuth(true);

        try{
            let payload = { email: email, senha: senha }
            const response = await api.post('/authUser', payload)

            const { id, nome, token } = response.data;

            const data = {
                ...response.data
            }

            await AsyncStorage.setItem('@login', JSON.stringify(data));

            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            setUser({
                id,
                nome,
                email,
                token,
            })

            setLoadingAuth(false);

        }catch(err){
            console.log('erro ao acessar', err);
            setLoadingAuth(false);
        }
    }
    
    async function signOut(){
        await AsyncStorage.clear()
        .then( () => {
            setUser({
                id: 0,
                nome: '',
                email: '',
                token: ''
            })
        })
    }
    
    return(
        <AuthContext.Provider 
            value={{
                user, 
                isAuthenticated, 
                singIn, 
                loadingAuth, 
                loading, 
                signOut 
                }}
        >
            {children}
        </AuthContext.Provider>
    )
}