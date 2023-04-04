import React from 'react';
import { Text, View, Button, SafeAreaView, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5'

import Calcular from '../Calcular';
import Info from '../Info';

export default function Home() {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Image source={require('../../assets/Logo.png')} />
            </View>

            <View style={styles.containerButtons}>
                <TouchableOpacity style={styles.button} activeOpacity={0.8} onPress={() => { navigation.navigate('Calcular') }} >
                    <Text style={styles.txtButton}>Calcular</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.contact} activeOpacity={0.5} onPress={() => { navigation.navigate('Info') }}>
                <Icon name="building" color="#FFF" size={25} />
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F7F8',
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerButtons: {
        width: '80%',
        alignItems: 'center',
        marginVertical: 50,

    },
    button: {
        backgroundColor: '#7CC81C',
        width: '70%',
        height: 50,
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    txtButton: {
        fontSize: 20,
        fontWeight: '600',
        color: '#FFF'
    },
    contact: {
        position: 'relative',
        top: '28%',
        left: '40%',
        backgroundColor: '#7CC81C',
        padding: 8,
        borderRadius: 10,
        opacity: 0.7
    },
});