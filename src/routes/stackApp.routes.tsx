import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Device from '../pages/Device';
import EditDevice from '../pages/EditDevice';


export type StackAppParamsList = {
    Device: undefined,
    EditDevice: {
        id: number,
        nome: string,
        ligado: boolean,
        ultima_atividade_id: number,
        ultima_atividade_nome: string,
        owner: number
    }
}


const Stack = createNativeStackNavigator<StackAppParamsList>();

function StackAppRoutes(){
    return(
        <Stack.Navigator>
            <Stack.Screen name='Device' component={Device} options={{ headerShown: false}} initialParams={{hasUpdated: false}}/>
            <Stack.Screen name="EditDevice" component={EditDevice} options={{headerShown: false}}/>
        </Stack.Navigator>
    )
}

export default StackAppRoutes;