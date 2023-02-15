import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Button, ScrollView } from 'react-native';

export default function Lista({ data, excluir }) {

    function testando() {
        console.log(data);
    }

    return (
        <View style={styles.containerLista}>
            <Text style={styles.itemTitle}>{data.produto}</Text>
            <Text style={styles.item}>{data.doseha}</Text>
            <Text style={styles.item}>{data.completa}</Text>
            <Text style={styles.item}>{data.incompleta}</Text>
            <Button title='X' onPress={() => excluir(data)} color='#7CC81C' />
        </View>
    );
}

const styles = StyleSheet.create({
    containerLista: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 2,
    },
    itemTitle: {
        width: 120,
        height: 28,
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 13,
        fontWeight: '500',
    },
    item: {
        width: 70,
        height: 28,
        textAlign: 'center',
        textAlignVertical: 'center',
        fontSize: 13,
        fontWeight: '500',
    },
})