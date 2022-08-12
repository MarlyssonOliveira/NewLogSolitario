import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Input, Text, FAB, Avatar } from "react-native-elements";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Login({ navigation }) {
  const pressCadastrar = () => {
    navigation.navigate("Cadastro");
  };

  const pressLogar = () => {
    Login();
  };

  const firebaseConfig = {
    apiKey: "AIzaSyD6DuE49jwQLldV2riqNTDPsFCcJKwHzw8",
    authDomain: "logsolidario.firebaseapp.com",
    projectId: "logsolidario",
    storageBucket: "logsolidario.appspot.com",
    messagingSenderId: "793662551051",
    appId: "1:793662551051:web:1564fe2ec432e9e219c30e",
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  const [getSenha, setSenha] = useState();
  const [getEmail, setEmail] = useState();

  function Login() {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, getEmail, getSenha)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;

        // buscar usuario por email e salvar id do usuario em sessão
        CriaSessaoUsuarioEmail();
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }

  const setSessao = async (value) => {
    try {
      await AsyncStorage.setItem('@session_key', value)
    } catch (e) {
      // tratamento de erro
    }
  }
 


  const getSessao = async () => {
    try {
      const value = await AsyncStorage.getItem('@session_key')
      if(value !== null) {
        console.log("O valor da sessao é: " + value)
      }
    } catch(e) {
      // error reading value
    }
  }

  function CriaSessaoUsuarioEmail(){
      axios.get('http://192.168.0.115:8080/usuario/buscaPorEmail', { params: { email: getEmail } })
        .then(function (response) {
          console.log(response.data);
          console.log('Usuario Logado com sucesso.')
          
          setSessao(response.data.id)
          getSessao()
          navigation.navigate("Home");
        })
        .catch(function (error) {
          console.log(error);
          console.log('Falha ao realizar a busca de usuario para registro em sessão')
        });     
      
  }


  return (
    <View style={styles.content}>
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "30%",
        }}
      >
        <Avatar
          size={120}
          rounded
          icon={{ name: "user", type: "font-awesome", color: "#000" }}
          iconStyle={styles.icon}
        />
        <Text>Faça login para continuar</Text>
      </View>
      <View style={styles.inputs}>
        <Input placeholder="Email" label={"Email"} onChangeText={(text) => setEmail(text)}/>
        <Input placeholder="Senha" label={"Senha"} secureTextEntry={true} onChangeText={(text) => setSenha(text)}/>
      </View>
      <View style={styles.buttons}>
        <Button title="Login" onPress={pressLogar} />
      </View>
      <View>
        <Text>Não possui uma conta?</Text>
        <Button
          title="Cadastre-se"
          onPress={pressCadastrar}
          buttonStyle={{ backgroundColor: "#cecece" }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-evenly",
    paddingTop: 40,
  },
  icon: {
    backgroundColor: "#cecece",
    padding: 10,
    borderRadius: 50,
    width: 150,
    height: 150,
    alignItems: "center",
    justifyContent: "center",
  },
  inputs: {
    width: "90%",
    height: "30%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  buttons: {
    width: "70%",
    alignSelf: "center",
  },
});
