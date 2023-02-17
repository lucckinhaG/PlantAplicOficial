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
  const momentShare = new Date().getTime();


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
      Keyboard.dismiss();
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
    realm.close();
  }


  useEffect(() => {
    async function loadProdutos() {
      const realm = await getRealm();

      const data = realm.objects("Products").toJSON();

      setLista(data);
    }
    loadProdutos();

  }, [])


  const html = `
<html>
  <head>
      <meta charset="utf-8">
      <title>Invoice</title>
      <link rel="license" href="https://www.opensource.org/licenses/mit-license/">
      <style>
        ${htmlStyles}
      </style>
    </head>
  <body>
    <header>
      <h1>PlantAplic</h1>
      <address>
        <h2>Dados da fazenda/lote</h2>
        <h3>Data: ${currentDate}</h3>
        <h3>Fazenda/Lote: ${fazenda}</h3>
        <h3> Área / hectáre: ${area}há </h3>
        <h3> Hectáre p/ Aplic: ${havoo} há/aplicação </h3>
        <h3> Quantidade de cargas: ${fullaplic} </h3>
        <h3> Uma carga de: ${unfullaplic} </h3>
      </address>
    </header>
    <h2>Produtos Utilizados</h1>
    <table class="inventory">
      <thead>
        <tr>
          <th> <Span> Produto </Span> </th>
          <th> <Span> Dose/ha </Span> </th>
          <th> <Span> Carga Cheia </Span> </th>
          <th> <Span> Carga Incompleta </Span> </th>
          <th> <Span> Total da Área </Span> </th>
        </tr>
      <thead>
      ${lista
      .map(
        data => `
      <tbody>
        <tr>
          <td> <span> ${data.produto} </span> </td>
          <td> <span> ${data.doseha} </span> </td>
          <td> <span> ${data.completa} </span> </td>
          <td> <span> ${data.incompleta} </span> </td>
          <td> <span> ${data.totalaplic} </span> </td>
        </tr>
      </tbody>
      `,
      )
      .join('')}
    </table>
  </body>
</html>
`;

  async function CompartilharPDF(fileUrl) {
    try {
      await Share.open({ url: 'file://' + fileUrl });
    } catch (error) {
    }
  }

  async function GerarPDF() {
    try {
      Share;
      const options = {
        html: html,
        fileName: `pdf-plantaplic`,
        base64: false,
      };
      const file = await RNHTMLtoPDF.convert(options).then(file => {
        if (file.filePath) {
          CompartilharPDF(file.filePath);
          console.log(file.filePath);
        }
      });
    } catch (error) {
    }
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
          <Button title="Compartilhar" color='#7CC81C' onPress={GerarPDF} />
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

const htmlStyles = `
  h1 { 
    font: bold 100% sans-serif;
    letter-spacing: 0.5em;
    text-align: center;
    text-transform: uppercase;
    }
/* table */
table { font-size: 75%; table-layout: fixed; width: 100%; }
table { border-collapse: separate; border-spacing: 2px; }
th, td { border-width: 1px; padding: 0.5em; position: relative; text-align: left; }
th, td { border-radius: 0.25em; border-style: solid; }
th { background: #EEE; border-color: #BBB; }
td { border-color: #DDD; }

/* header */
header { margin: 0 0 3em; }
header:after { clear: both; content: ""; display: table; }
header h1 { background: #7CC81C; border-radius: 0.25em; color: #FFF; margin: 0 0 1em; padding: 0.5em 0; }
header address { float: left; font-size: 75%; font-style: normal; line-height: 1.25; margin: 0 1em 1em 0; }
header address p { margin: 0 0 0.25em; }
header span, header img { display: block; float: right; }
header span { margin: 0 0 1em 1em; max-height: 25%; max-width: 60%; position: relative; }
header img { max-height: 100%; max-width: 100%; }

/* article */
article, article address, table.meta, table.inventory { margin: 0 0 3em; }
article:after { clear: both; content: ""; display: table; }
article h1 { clip: rect(0 0 0 0); position: absolute; }
article address { float: left; font-size: 125%; font-weight: bold; }

/* table meta & balance */
table.meta, table.balance { float: right; width: 36%; }
table.meta:after, table.balance:after { clear: both; content: ""; display: table; }

/* table meta */
table.meta th { width: 40%; }
table.meta td { width: 60%; }

/* table items */
table.inventory { clear: both; width: 100%; }
table.inventory th { font-weight: bold; text-align: center; }
table.inventory td:nth-child(1) { width: 26%; }
table.inventory td:nth-child(2) { width: 38%; }
table.inventory td:nth-child(3) { text-align: right; width: 12%; }
table.inventory td:nth-child(4) { text-align: right; width: 12%; }
table.inventory td:nth-child(5) { text-align: right; width: 12%; }

`;