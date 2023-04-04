import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Button, ScrollView, TouchableOpacity } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome5'

export default function LoteLista({ data, excluir }) {

    return (
        <ScrollView>
            <View style={styles.containerLista}>
                <View style={styles.containerDesc}>
                    <Text style={styles.itemTitle}>Lote: {data.fazenda}</Text>
                    <Text style={styles.item}>Área: {data.area}</Text>
                    <Text style={styles.item}>Equipamento: {data.veiculo}</Text>
                    <Text style={styles.item}>Identificação: {data.identific}</Text>
                </View>

                <View style={styles.button}>
                    <TouchableOpacity style={styles.searchButton}>
                        <Icon name="eye" size={22} color="#7CC81C" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.searchButton}>
                        <Icon name="edit" size={22} color="#7CC81C" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.searchButton} onPress={() => excluir(data)}>
                        <Icon name="trash-alt" size={22} color="#7CC81C" />
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    containerLista: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 3,
        borderBottomColor: '#7CC81C',
        padding: 10,
        backgroundColor: '#D9D9D9'
    },
    containerDesc: {
        flexDirection: 'column',
        width: '70%'
    },
    itemTitle: {
        width: '90%',
        fontSize: 15,
        fontWeight: '800',
        paddingVertical: 3,
        color: '#474747',
        margin: 2,
    },
    item: {
        fontSize: 14,
        fontWeight: '800',
        color: '#474747',
        margin: 2,
    },
    button: {
        marginVertical: 2,
        width: '15%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchButton: {
        margin: 5,
        padding: 5,
        backgroundColor: '#fff',
        borderRadius: 10,
    }
})
