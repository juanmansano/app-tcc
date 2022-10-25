import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Dispositivos from '../pages/Dispositivos';


const Stack = createNativeStackNavigator();

function AppRoutes(){
    return(
        <Stack.Navigator>
            <Stack.Screen name="Dispositivos" component={Dispositivos} options={{ headerShown: false}}/>
        </Stack.Navigator>
    )
}

export default AppRoutes;