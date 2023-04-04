import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Button, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default function Lista({ data, excluir }) {

    return (
        <View style={styles.containerLista}>
            <Text style={styles.itemTitle}>{data.produto}</Text>
            <Text style={styles.item}>{data.doseha}</Text>
            <Text style={styles.item}>{data.completa}</Text>
            <Text style={styles.item}>{data.incompleta}</Text>
            <View style={styles.button}>
                <TouchableOpacity style={styles.button} onPress={() => excluir(data)}>
                    <Icon name="trash-alt" size={20} color="#FFF" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    containerLista: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '90%',
        marginVertical: 3,
        paddingVertical: 6,
        paddingStart: 20,
    },
    itemTitle: {
        width: '35%',
        height: 28,
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 13,
        fontWeight: '500',
        paddingStart: 25,
        borderBottomWidth: 1,
    },
    item: {
        width: '25%',
        height: 28,
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 13,
        fontWeight: '500',
        borderBottomWidth: 1,
        paddingStart: 15,
    },
    button: {
        marginHorizontal: 10,
        backgroundColor: '#7CC81C',
        paddingVertical: 3,
        borderRadius: 5,
    }
})