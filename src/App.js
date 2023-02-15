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
  Button
} from 'react-native';
import uuid from 'react-native-uuid';
import moment from 'moment';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';


import getRealm from './services/realm';
import Lista from './pages/Lista';



export default function App() {
  const [fazenda, setFazenda] = useState('');
  const [area, setArea] = useState('');
  const [havoo, setHavoo] = useState('');
  const [editableInput, setEditableInput] = useState(true);


  const fullaplic = parseInt(area / havoo);
  const unfullaplic = parseInt(area - (fullaplic * havoo));

  const [produto, setProduto] = useState('');
  const [doseha, setDoseha] = useState('');
  const completa = (havoo * doseha).toFixed(2);
  const incompleta = (unfullaplic * doseha).toFixed(2);
  const totalaplic = (area * doseha).toFixed(2);

  const currentDate = moment().format('LLL');


  const [prod, setProd] = useState([])

  const [lista, setLista] = useState([]);


  async function AddNovoProduto() {
    if (fazenda === '' || area === '' || havoo === '' || produto === '' || doseha === '') {
      alert('Preencha todos os campos!');
      return;
    }

    const realm = await getRealm();

    try {
      realm.write(() => {
        const cadastrado = realm.create("Products", {
          _id: new Date().getTime(),
          produto,
          doseha,
          completa,
          incompleta,
          totalaplic
        });
        console.log("Cadastro=>", cadastrado);
      });

      const dadosAlterados = await realm.objects('Products').sorted('_id', false).toJSON();
      setLista(dadosAlterados)
      setProduto('');
      setDoseha('');
      setEditableInput(false);
      alert("Adicionado com sucesso!")
    } catch (err) {
      alert(err);
    } finally {
      realm.close();
    }
  }

  async function excluirProduto(data) {
    const realm = await getRealm();
    const ID = data._id;
    console.log(ID);

    realm.write(() => {
      if (realm.objects('Products').filtered('_id =' + ID).length > 0) {
        realm.delete(
          realm.objects('Products').filtered('_id =' + ID)
        )
      }
    })

    const produtosAtuais = await realm.objects('Products').sorted('_id', false).toJSON();
    setLista(produtosAtuais);
    alert("Removido com sucesso!")
    realm.close();
  }

  async function resetProdutos() {
    const realm = await getRealm();

    realm.write(() => {
      realm.deleteAll();
    }
    )
    const listaVazia = await realm.objects('Products').sorted('_id', false).toJSON();

    setLista(listaVazia);
    setFazenda('');
    setArea('');
    setHavoo('');
    setProduto('');
    setDoseha('');
    setEditableInput(true);
    console.log(listaVazia);
    realm.close();
  }


  useEffect(() => {
    async function loadProdutos() {
      const realm = await getRealm();

      const data = realm.objects("Products").toJSON();

      setLista(data);
      console.log("Adicionado=>", lista);
    }

  }, [])


  const html = `
<html>
<head>
  <meta name="viewport" content=width=device-width, initial-scale=1.0,
  maxium-scale=1.0, minimum-scale=1.0, user-scalable=no"/>
</head>
<body>
  <header>
    <h1>Calculo para aplicação</h1>
  </header>
  <h1>Dados da fazenda/lote</h1>
  <p>Data: ${currentDate}</p>
  <p>Fazenda/Lote: ${fazenda}</p>
  <p> Área / hectáre: ${area} </p>
  <p> Hectáre p/ Aplic: ${havoo} </p>
  <p> Aplicações com carga cheia: ${fullaplic} </p>
  <p> Aplicação com carga incompleta: ${unfullaplic} </p>
  <h2>Produtos Utilizados</h1>
  <table>
    <tr>
      <th>Produto</th>
      <th>Dose/ha</th>
      <th>Carga<br>Cheia</th>
      <th>Carga<br>Incompleta</th>
    </tr>
    ${lista
      .map(
        data => `
      <tr>
        <td>${data.produto}}</td>
        <td>${data.doseha}</td>
        <td>${data.completa}</td>
        <td>${data.incompleta}</td>
      </tr>
    `,
      )
      .join('')}
  </table>
</body>
</html>
`;
  async function createPDF() {
    const options = {
      html: html,
      fileName: `aeroaplic-${fazenda}`,
      directory: 'Documents',
    };

    const file = await RNHTMLtoPDF.convert(options).then(file => {
      if (file) {
        Compartilhar(file);
      }
    });
    // console.log(file.filePath);
    alert(file.filePath);
  }

  async function Compartilhar(file) {
    Share.open(file)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        err && console.log(err);
      });
  }

  return (
    <SafeAreaView>
      <Pressable onPress={() => Keyboard.dismiss()}>

        <View style={styles.containerImage}>
          <Image source={require('./assets/Logo.png')} />
        </View>

        <View style={styles.containerTitle}>
          <Text style={styles.titleList}>Fazenda / Lote</Text>
          <TextInput
            style={styles.titleInput}
            value={fazenda}
            placeholder="Nome da fazenda"
            placeholderTextColor="#000"
            onChangeText={(text) => setFazenda(text)}
            editable={editableInput}
          />
        </View>

        <View style={styles.containerArea}>
          <Text style={styles.titleForm}>Área / hectáre</Text>
          <Text style={styles.titleForm}>Hectáre p/ Aplic</Text>
        </View>

        <View style={styles.containerForm}>
          <TextInput
            style={styles.textInput}
            keyboardType="numeric"
            placeholder="Área do terreno"
            placeholderTextColor="#000"
            value={area}
            onChangeText={(number) => setArea(number)}
            editable={editableInput}
          />

          <TextInput
            style={styles.textInput}
            keyboardType="numeric"
            placeholder="Hectáres por aplicação"
            placeholderTextColor="#000"
            value={havoo}
            onChangeText={(number) => setHavoo(number)}
            editable={editableInput}
          />
        </View>

        <View style={styles.areaInfo}>
          <Text style={styles.topInput}>Carga Cheia</Text>
          <Text style={styles.topInput}>Carga incompleta</Text>
        </View>

        <View style={styles.containerResArea}>
          <Text style={styles.textResult}>{fullaplic}</Text>
          <Text style={styles.textResult}>{unfullaplic}</Text>
        </View>

        <View style={styles.descProdutos}>
          <Text style={styles.topInput}>Produto</Text>
          <Text style={styles.topInput}>Dose/há</Text>
        </View>

        <View style={styles.containerProdutos}>

          <TextInput
            style={styles.productInput}
            value={produto}
            keyboardType="default"
            placeholder="Produto"
            placeholderTextColor="#000"
            onChangeText={(text) => setProduto(text)}
          />

          <TextInput
            style={styles.productInput}
            placeholder="Dose / há"
            keyboardType='numeric'
            value={doseha}
            onChangeText={(number) => setDoseha(number)}
          />

        </View>

        <View style={styles.containerAdd}>
          <Button title="Adicionar" color='#7CC81C' onPress={AddNovoProduto} />
          <Button title="Compartilhar" color='#7CC81C' onPress={Compartilhar} />
          <Button title="Novo" color='#7CC81C' onPress={resetProdutos} />
        </View>

        <View style={styles.containerProdutoTitle}>
          <Text style={styles.titleProd}>Produto</Text>
          <Text style={styles.titleRes}>Dose/ha</Text>
          <Text style={styles.titleRes}>Carga Cheia</Text>
          <Text style={styles.titleRes}>Carga incompleta</Text>
        </View>

        <View style={styles.containerResult}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={lista}
            keyExtractor={item => String(item._id)}
            renderItem={({ item }) => (<Lista data={item} excluir={excluirProduto} />)}
          />
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
    marginTop: 15
  },
  containerTitle: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  titleList: {
    fontSize: 16
  },
  titleInput: {
    width: '80%',
    height: 40,
    backgroundColor: '#D9D9D9',
    borderRadius: 20,
    borderWidth: 3,
    paddingLeft: 15,
    margin: 10,
    fontSize: 12,
    fontWeight: '500',
    borderColor: '#7CC81C',
    color: '#000',
  },
  containerArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginTop: 10,
  },
  titleForm: {
    fontSize: 16,
  },
  containerForm: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
    width: '90%',
    marginStart: 20,
  },
  textInput: {
    width: '42%',
    height: 40,
    backgroundColor: '#D9D9D9',
    borderRadius: 20,
    borderWidth: 3,
    paddingLeft: 15,
    margin: 10,
    fontSize: 12,
    fontWeight: '500',
    borderColor: '#7CC81C',
    color: '#000',
  },
  addProdutos: {
    margin: 10,
    fontSize: 20,
    fontWeight: '500',
    color: '#7CC81C',
    textAlign: 'center',
  },
  descProdutos: {
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    width: '90%',
    marginHorizontal: 20,
    marginTop: 10,
  },
  areaInfo: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
    width: '90%',
    marginHorizontal: 35,
    marginTop: 10,
  },
  containerResArea: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
    width: '90%',
    marginStart: 20,
  },
  textResult: {
    width: '42%',
    height: 40,
    backgroundColor: '#D9D9D9',
    borderRadius: 10,
    borderWidth: 3,
    paddingLeft: 15,
    justifyContent: 'center',
    alignItems: 'center',
    textAlignVertical: 'center',
    margin: 10,
    fontSize: 12,
    fontWeight: '500',
    borderColor: '#7CC81C',
    color: '#000',
  },
  containerProdutos: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginTop: 5,
  },
  productInput: {
    width: '42%',
    height: 40,
    backgroundColor: '#D9D9D9',
    borderRadius: 20,
    borderWidth: 3,
    paddingLeft: 15,
    marginTop: 5,
    fontSize: 12,
    fontWeight: '500',
    borderColor: '#7CC81C',
    color: '#000',
  },
  containerAdd: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 10,
  },
  addButton: {
    marginTop: 15,
    marginHorizontal: 10,
    width: 120,
    height: 40,
    backgroundColor: '#D9D9D9',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    borderWidth: 3,
    borderColor: '#019D10',
  },
  buttonAdic: {
    fontWeight: '500',
    fontSize: 14,
  },
  containerProdutoTitle: {
    flexDirection: 'row',
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerResult: {

  },
  titleProd: {
    width: 100,
    height: 35,
    textAlign: 'center',
    textAlignVertical: 'center',
    margin: 5,
    fontSize: 12,
    borderBottomWidth: 2,
  },
  titleRes: {
    width: 70,
    height: 35,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 12,
    fontWeight: '500',
    margin: 5,
    borderBottomWidth: 2,
  },
});