import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import StackAppRoutes from './stackApp.routes'
import NewDevice from '../pages/NewDevice';

const Drawer = createDrawerNavigator();

import DrawerApp from '../components/Drawer/drawer';

function AppRoutes(){
    return(
        <Drawer.Navigator
            drawerContent={DrawerApp}
            screenOptions={{
                headerShown: false,
                drawerActiveTintColor: '#004aad'
            }}>
            <Drawer.Screen 
            name='Gerenciar Dispositivos'
            component={StackAppRoutes}
            />
            <Drawer.Screen 
            name='Adicionar Dispositivos'
            component={NewDevice}
            />
        </Drawer.Navigator>
        
    )
}

export default AppRoutes;