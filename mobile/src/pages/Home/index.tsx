import React, { useState, useEffect } from "react";
import { Feather as Icon } from "@expo/vector-icons";
import {
  View,
  ImageBackground,
  Image,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import Select from "react-native-picker-select";
import axios from "axios";

interface IBGEUFResponse {
  sigla: string;
}

interface IBGECidadeResponse {
  nome: string;
}

const Home = () => {
  const navigation = useNavigation();

  const [uf, setUfs] = useState<string[]>([]);
  const [selectedUf, setSelectedUf] = useState("0");

  const [cidades, setCidades] = useState<string[]>([]);
  const [selectedCidade, setSelectedCidade] = useState("0");

  function handleNavigateToMap() {
    navigation.navigate("Points", {
      uf: selectedUf,
      cidade: selectedCidade,
    });
  }

  useEffect(() => {
    axios
      .get<IBGEUFResponse[]>(
        "https://servicodados.ibge.gov.br/api/v1/localidades/estados"
      )
      .then((response) => {
        const ufSiglas = response.data.map((uf) => uf.sigla);

        setUfs(ufSiglas);
      });
  }, []);

  useEffect(() => {
    if (selectedUf === "0") return;

    axios
      .get<IBGECidadeResponse[]>(
        `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`
      )
      .then((response) => {
        const cidadeNomes = response.data.map((cidade) => cidade.nome);

        setCidades(cidadeNomes);
      });
  }, [selectedUf]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ImageBackground
        source={require("../../assets/home-background.png")}
        style={styles.container}
        imageStyle={{ width: 274, height: 368 }}
      >
        <View style={styles.main}>
          <Image source={require("../../assets/logo.png")} />
          <View>
            <Text style={styles.title}>
              Seu marketplace de coleta de resíduos
            </Text>
            <Text style={styles.description}>
              Ajudamos pessoas a encontrarem pontos de coleta de forma
              eficiente.
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Select
            placeholder={{ label: "Selecione um Estado", value: null }}
            style={{ ...pickerSelectStyles }}
            onValueChange={(value) => setSelectedUf(value)}
            items={uf.map((u) => ({ label: u, value: u }))}
          />
          <Select
            placeholder={{ label: "Selecione uma Cidade", value: null }}
            style={{ ...pickerSelectStyles }}
            onValueChange={(value) => setSelectedCidade(value)}
            items={cidades.map((cidade) => ({ label: cidade, value: cidade }))}
          />
          {/* 
          ['
              { label: "Football", value: "football" },
              { label: "Baseball", value: "baseball" },
              { label: "Hockey", value: "hockey" },
            ]
          <TextInput
            style={styles.input}
            placeholder="Digite a UF"
            value={uf}
            onChangeText={setUf}
            maxLength={2}
            autoCapitalize="characters"
            autoCorrect={false}
          /> */}

          {/* <TextInput
            style={styles.input}
            placeholder="Digite a Cidade"
            value={cidade}
            onChangeText={setCidade}
          /> */}

          <RectButton style={styles.button} onPress={handleNavigateToMap}>
            <View style={styles.buttonIcon}>
              <Text>
                <Icon name="arrow-right" color="#FFF" size={24}></Icon>
              </Text>
            </View>
            <Text style={styles.buttonText}>Entrar</Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: "center",
  },

  title: {
    color: "#322153",
    fontSize: 32,
    fontFamily: "Ubuntu_700Bold",
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: "#6C6C80",
    fontSize: 16,
    marginTop: 16,
    fontFamily: "Roboto_400Regular",
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: "#34CB79",
    height: 60,
    flexDirection: "row",
    borderRadius: 10,
    overflow: "hidden",
    alignItems: "center",
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    flex: 1,
    justifyContent: "center",
    textAlign: "center",
    color: "#FFF",
    fontFamily: "Roboto_500Medium",
    fontSize: 16,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 60,
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },
  inputAndroid: {
    height: 60,
    backgroundColor: "#FFF",
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },
});

export default Home;
