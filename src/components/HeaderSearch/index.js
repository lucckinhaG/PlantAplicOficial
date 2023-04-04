import React, { useState } from 'react';
import { View, Image, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5'

export default function HeaderSearch({ resetProdutos }) {

  const [search, setSearch] = useState('');
  return (
    <View>
      <View style={styles.containerImage}>
        <Image source={require('../../assets/Logo.png')} />
      </View>

      <View style={styles.containerSearch}>
        <TextInput
          style={styles.inputSearch}
          value={search}
          keyboardType="default"
          placeholder="Pesquisar"
          placeholderTextColor={'#646464'}
          onChangeText={(text) => setSearch(text)}
        />

        <TouchableOpacity style={styles.searchButton}>
          <Icon name="search" size={20} color="#7CC81C" />
        </TouchableOpacity>
        <Button title='Del' onPress={resetProdutos} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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