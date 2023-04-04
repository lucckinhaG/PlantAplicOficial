import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    Image,
    SafeAreaView,
    FlatList,
    Pressable,
    Keyboard,
    KeyboardAvoidingView,
    Button,
    Alert,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';

import getRealm from '../../services/realm';


export default function Calcular() {
    const navigation = useNavigation();

    const [fazenda, setFazenda] = useState('');
    const [operador, setOperador] = useState('');
    const [veiculo, setVeiculo] = useState('');
    const [identific, setIdentific] = useState('');
    const [area, setArea] = useState('');
    const [tanque, setTanque] = useState('');
    const [vazao, setVazao] = useState('');
    const [plantio, setPlantio] = useState('');

    const [editableInput, setEditableInput] = useState(true);

    const haaplic = (tanque / vazao).toFixed(2);
    const fullaplic = parseInt(area / haaplic).toString();
    const unfullaplic = (area - (fullaplic * haaplic)).toFixed(2);

    const loteId = new Date().getTime();

    const currentDate = moment().format('DD/MM/YYYY');

    const [dados, setDados] = useState([]);


    async function AddProdutos() {
        if (fazenda === '' || operador === '' || veiculo === '' || identific === '' || area === '' || tanque === '' || vazao === '' || plantio === '') {
            alert('Preencha todos os campos!');
            return;
        }

        const realm = await getRealm();

        try {
            realm.write(() => {
                const cadastrado = realm.create("Lote", {
                    _id: new Date().getTime(),
                    createDate: currentDate,
                    fazenda,
                    operador,
                    veiculo,
                    identific,
                    area,
                    tanque,
                    vazao,
                    plantio,
                    haaplic,
                    fullaplic,
                    unfullaplic
                });
                console.log("Lote Cadastrado=>", cadastrado);
            });

            navigation.navigate('Adicionar', { createDate: currentDate, fazenda: fazenda, operador: operador, veiculo: veiculo, identific: identific, area: area, tanque: tanque, vazao: vazao, plantio: plantio, haaplic: haaplic, fullaplic: fullaplic, unfullaplic: unfullaplic })
            Keyboard.dismiss();
        } catch (err) {
            console.log(err);
            alert(err);
        } finally {
            realm.close();
        }
    }

    return (
        <SafeAreaView>
            <Pressable onPress={() => Keyboard.dismiss()}>

                <View style={styles.containerImage}>
                    <Image source={require('../../assets/Logo.png')} />
                </View>

                <View style={styles.containerForm}>

                    <View style={styles.form1}>
                        <Text style={styles.descTitle}>Fazenda/Lote</Text>
                        <TextInput
                            style={styles.inputTitle}
                            value={fazenda}
                            keyboardType="default"
                            placeholder="Nome da fazenda"
                            onChangeText={(text) => setFazenda(text)}
                        />
                    </View>

                    <View style={styles.form1}>
                        <Text style={styles.descTitle}>Operador responsável</Text>
                        <TextInput
                            style={styles.inputTitle}
                            value={operador}
                            keyboardType="default"
                            placeholder="Nome do operador"
                            onChangeText={(text) => setOperador(text)}
                        />
                    </View>

                    <View style={styles.titleForm}>
                        <Text style={styles.descTitle}>Veículo</Text>
                        <Text style={styles.descTitle}>Placa/Prefixo</Text>
                    </View>

                    <View style={styles.form2}>
                        <TextInput
                            style={styles.inputRow}
                            value={veiculo}
                            keyboardType="default"
                            placeholder="Ex: Trator"
                            onChangeText={(text) => setVeiculo(text)}
                        />

                        <TextInput
                            style={styles.inputRow}
                            value={identific}
                            keyboardType="default"
                            placeholder="Ex: ABC-1234"
                            onChangeText={(text) => setIdentific(text)}
                        />
                    </View>

                    <View style={styles.titleForm}>
                        <Text style={styles.descTitle}>Area / hectáre</Text>
                        <Text style={styles.descTitle}>Capacidade do Tanque</Text>
                    </View>

                    <View style={styles.form2}>
                        <TextInput
                            style={styles.inputRow}
                            value={area}
                            keyboardType="number-pad"
                            placeholder="Ex: 52.6"
                            onChangeText={(text) => setArea(text)}
                        />

                        <TextInput
                            style={styles.inputRow}
                            value={tanque}
                            keyboardType="number-pad"
                            placeholder="Ex: 25"
                            onChangeText={(text) => setTanque(text)}
                        />
                    </View>

                    <View style={styles.titleForm}>
                        <Text style={styles.descTitle}>Vazão</Text>
                        <Text style={styles.descTitle}>Lavoura de</Text>
                    </View>

                    <View style={styles.form2}>
                        <TextInput
                            style={styles.inputRow}
                            value={vazao}
                            keyboardType="number-pad"
                            placeholder="Ex: 10"
                            onChangeText={(text) => setVazao(text)}
                        />

                        <TextInput
                            style={styles.inputRow}
                            value={plantio}
                            keyboardType="default"
                            placeholder="Ex: Soja"
                            onChangeText={(text) => setPlantio(text)}
                        />


                    </View>

                    <View style={styles.titleForm}>
                        <Text style={styles.descTitle}>Hectáre p/ aplic</Text>
                        <Text style={styles.descTitle}>Cargas Cheias</Text>
                        <Text style={styles.descTitle}>Uma carga de</Text>
                    </View>

                    <View style={styles.form2}>
                        <Text style={styles.textResult}>{haaplic}</Text>
                        <Text style={styles.textResult}>{fullaplic}</Text>
                        <Text style={styles.textResult}>{unfullaplic}</Text>
                    </View>

                </View>

                <View style={styles.button}>
                    <Button title='Adicionar Produtos' color='#7CC81C' onPress={AddProdutos} />
                </View>


            </Pressable>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F7F8',
    },
    containerImage: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20
    },
    containerForm: {

    },
    form1: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    descTitle: {
        fontSize: 16
    },
    inputTitle: {
        width: '90%',
        height: 40,
        backgroundColor: '#D9D9D9',
        borderRadius: 20,
        borderWidth: 3,
        paddingLeft: 15,
        margin: 8,
        fontSize: 12,
        fontWeight: '500',
        borderColor: '#7CC81C',
        color: '#000',
    },
    titleForm: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    form2: {
        justifyContent: 'space-around',
        flexDirection: 'row'
    },
    inputRow: {
        width: '43%',
        height: 40,
        backgroundColor: '#D9D9D9',
        borderRadius: 20,
        borderWidth: 3,
        paddingLeft: 15,
        margin: 8,
        fontSize: 12,
        fontWeight: '500',
        borderColor: '#7CC81C',
        color: '#000',
    },
    textResult: {
        width: '25%',
        height: 40,
        backgroundColor: '#D9D9D9',
        borderRadius: 20,
        borderWidth: 3,
        paddingLeft: 15,
        justifyContent: 'center',
        alignItems: 'center',
        textAlignVertical: 'center',
        margin: 8,
        fontSize: 12,
        fontWeight: '500',
        borderColor: '#7CC81C',
        color: '#000',
    },
    button: {
        marginTop: 25,
    },
})
