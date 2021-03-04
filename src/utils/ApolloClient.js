import { ApolloClient, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createUploadLink } from "apollo-upload-client";

import Constant from "./Constant";

const httpLink = createUploadLink({
  uri: Constant.ServerUrl,
});

const authLink = setContext(async (_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = await AsyncStorage.getItem(Constant.prfUserToken);
  const langCode = await AsyncStorage.getItem(Constant.prfLangCode);
  const lCode =
    langCode && langCode !== null && langCode !== ""
      ? langCode
      : Constant.defLangCode;

  // console.log("token: ", token);
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
      langcode: lCode,
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
