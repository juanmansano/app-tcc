import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Device from '../pages/Device';
import EditDevice from '../pages/EditDevice';
import EditNewDevice from '../pages/EditNewDevice';


export type StackAppParamsList = {
    Device: undefined,
    EditDevice: {
        id: number,
        nome: string,
        ultima_atividade_id: number,
        ultima_atividade_nome: string,
        owner: number,
        edit: boolean
    },
    EditNewDevice: {
        nome: string,
        owner: number,
        data_criacao: string
    }
}


const Stack = createNativeStackNavigator<StackAppParamsList>();

function StackAppRoutes(){
    return(
        <Stack.Navigator>
            <Stack.Screen name='Device' component={Device} options={{ headerShown: false}}/>
            <Stack.Screen name="EditDevice" component={EditDevice} options={{headerShown: false}}/>
            <Stack.Screen name="EditNewDevice" component={EditNewDevice} options={{headerShown: false}}/>
        </Stack.Navigator>
    )
}

export default StackAppRoutes;