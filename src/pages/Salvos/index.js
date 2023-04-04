import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, FlatList, StyleSheet, TextInput, Image, TouchableOpacity, Pressable, Keyboard, Button } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome5'

import getRealm from '../../services/realm';
import LoteLista from '../LoteLista';
import HeaderSearch from '../../components/HeaderSearch';


export default function Salvos() {

    const [dados, setDados] = useState([]);

    const [prods, setProds] = useState([]);

    async function Pesquisar() {
    }

    async function resetProdutos() {
        const realm = await getRealm();

        realm.write(() => {
            realm.deleteAll();
        }
        )
        const listaVazia = await realm.objects('Lote').sorted('_id', false).toJSON();

        setDados(listaVazia);
        realm.close();
    }

    useEffect(() => {
        async function loadProdutos() {
            const realm = await getRealm();

            const lote = realm.objects("Lote").toJSON();


            setDados(lote);
            //setProds(produtos);
            console.log("Lotes=>", lote);
        }
        loadProdutos();

    }, [])

    async function excluirProduto(data) {
        const realm = await getRealm();
        const ID = data._id;

        realm.write(() => {
            if (realm.objects('Lote').filtered('_id =' + ID).length > 0) {
                realm.delete(
                    realm.objects('Lote').filtered('_id =' + ID)
                )
            }
        })

        const lotesAtuais = await realm.objects('Lote').sorted('_id', false).toJSON();
        setDados(lotesAtuais);
        alert("Removido com sucesso!")
        realm.close();
    }

    async function visualizeList(data) {
        const realm = await getRealm();

        const ID = data._id;


    }

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <FlatList
                    data={dados}
                    keyExtractor={item => String(item._id)}
                    renderItem={({ item }) => (<LoteLista data={item} excluir={excluirProduto} />)}
                    ListHeaderComponent={<HeaderSearch reset={resetProdutos} />}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerImage: {
        alignItems: 'center',
        margin: 20,
    },
    containerSearch: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 10,
        borderBottomWidth: 5,
        borderBottomColor: '#7CC81C',
    },
    inputSearch: {
        width: '70%',
        borderWidth: 2,
        padding: 5,
        marginRight: 15,
        paddingHorizontal: 15,
        borderRadius: 10,
        borderColor: '#7CC81C',
        fontSize: 14,
    },
    searchButton: {
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderRadius: 25,
        borderColor: '#7CC81C',
        padding: 5,
    }
});