import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    ScrollView
} from 'react-native'

import { AtividadesProps } from '../../pages/EditDevice'

interface ModalPickerProps{
    options: AtividadesProps[];
    handleCloseModal: () => void;
    selectedItem: (item: AtividadesProps) => void;
}

const { width: WIDTH, height: HEIGHT } = Dimensions.get('window')

export function ModalPicker({options, handleCloseModal, selectedItem}: ModalPickerProps){

    function onPressItem(item: AtividadesProps){
        selectedItem(item);
        handleCloseModal();
    }
    
    const option = options.map((item, index) => (
        <TouchableOpacity key={item.id} style={styles.option} onPress={ () => onPressItem(item)}>
            <Text style={styles.item}>
                {item?.nome.toUpperCase()}
            </Text>
        </TouchableOpacity>
    ))

    return(
        <TouchableOpacity style={styles.container} onPress={handleCloseModal}>
            <View style={styles.content}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {option}
                </ScrollView>
            </View>
        </TouchableOpacity>

    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent: 'center',
        alignItems:'center'
    },
    content:{
        width: WIDTH - 20,
        height: HEIGHT / 2.8,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#aaa',
        borderTopWidth: 0,
        borderRadius: 4
    },
    option:{
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTopWidth: 0.8,
        borderTopColor: '#aaa'
    },
    item:{
        margin: 18,
        fontSize: 14,
        color: '#004aad'
    }
})