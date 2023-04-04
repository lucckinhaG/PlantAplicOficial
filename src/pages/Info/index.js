import React, { useState } from 'react';
import { View, Text, Image, SafeAreaView, StyleSheet, TouchableOpacity, Linking, TextInput, Alert } from 'react-native';
import Clipboard from "@react-native-community/clipboard";
import Icon from 'react-native-vector-icons/FontAwesome5'


export default function Info() {
    const text = ('Trabalhando desenvolvendo ferramentas para auxiliar em tarefas do trabalho ou do cotidiano.');
    const [teste, setTeste] = useState('');

    function Instagram() {
        Linking.openURL('https://instagram.com/plantaplicapp');
    }

    function copyMail() {
        Clipboard.getString('luccasmobiledev@gmail.com');
        Alert.alert("Email Copiado!", "luccasmobiledev@gmail.com");
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.logo}>
                <Image source={require('../../assets/Company.png')} />
            </View>

            <View style={styles.desc}>
                <Text style={styles.descText}>{text}</Text>
            </View>

            <View style={styles.containerLinks}>
                <Icon name="instagram" size={35} color="#FFDB1B" />
                <TouchableOpacity style={styles.button} onPress={Instagram}>
                    <Text style={styles.buttonTxt}>@plantaplicapp</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.containerLinks}>
                <Icon name="envelope" size={35} color="#FFDB1B" />
                <TouchableOpacity style={styles.button} onPress={copyMail}>
                    <Text style={styles.buttonTxt}>luccasmobiledev@gmail.com</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#D9D9D9'
    },
    logo: {
        marginTop: 80,
        marginBottom: 30,
    },
    desc: {
        marginBottom: 30,
        width: '90%'
    },
    descText: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '700',
    },
    containerLinks: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        margin: 5,
        paddingHorizontal: 15,
    },
    button: {
        marginHorizontal: 10,
        height: 35,
        width: '80%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFDB1B',
    },
    buttonTxt: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFF'
    }
})