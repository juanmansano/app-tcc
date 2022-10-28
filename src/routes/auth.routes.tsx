import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SingIn from '../pages/SingIn';
import CreateUser from '../pages/NewUser';

export type StackParamsList = {
    SingIn: undefined,
    CreateUser: undefined
}


const Stack = createNativeStackNavigator<StackParamsList>();

function AuthRoutes(){
    return(
        <Stack.Navigator>
            <Stack.Screen name="SingIn" component={SingIn} options={{ headerShown: false}}/>
            <Stack.Screen name="CreateUser" component={CreateUser} options={{headerShown: false}}/>
        </Stack.Navigator>
    )
}

export default AuthRoutes;