import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLazyQuery } from "@apollo/client";
import { inject, observer } from "mobx-react";
import { toJS } from "mobx";

import GraphqlQuery from "../utils/GraphqlQuery";
import ItemDesign from "./common/ItemDesign";
import Common from "../utils/Common";
import Constant from "../utils/Constant";
import ProgressDialog from "./common/ProgressDialog";
import LangKey from "../utils/LangKey";

const UserDesign = ({ navigation, designStore, userStore }) => {
  const [hasPro, sethasPro] = useState(false);
  const designPackages = toJS(designStore.designPackages);

  const isMountedRef = Common.useIsMountedRef();

  const [perchasedDesigns, { loading, data, error }] = useLazyQuery(
    GraphqlQuery.perchasedDesigns,
    {
      fetchPolicy: "no-cache",
      errorPolicy: "all",
    }
  );

  useEffect(() => {
    isMountedRef.current && perchasedDesigns({ variables: { start: 0 } });
  }, []);

  useEffect(() => {
    isMountedRef.current && sethasPro(userStore.hasPro);
  }, [userStore.hasPro]);

  // key extractors
  const keyExtractor = useCallback((item) => item.id.toString(), []);

  const onDesignClick = (packageType, design) => {
    if (packageType === Constant.typeDesignPackagePro && hasPro === false) {
      // show popup to user for pro
    } else {
      const designs = data?.perchasedDesigns.map((item) => {
        return item.design;
      });
      navigation.navigate(Constant.navDesign, {
        designs: designs,
        curDesign: design,
      });
    }
  };
  useEffect(() => {
    console.log("data?.perchasedDesigns", data?.perchasedDesigns);
  }, [data?.perchasedDesigns]);

  return (
    <View style={styles.container}>
      <ProgressDialog
        visible={loading}
        dismissable={false}
        message={Common.getTranslation(LangKey.labLoading)}
      />
      <FlatList
        style={styles.listDesign}
        numColumns={2}
        data={data?.perchasedDesigns ? data.perchasedDesigns : []}
        keyExtractor={keyExtractor}
        renderItem={({ item, index }) => {
          const designPackage = designPackages.find(
            (pkg) => pkg.id === item.design.package
          );
          return (
            <ItemDesign
              design={item.design}
              packageType={designPackage.type}
              onDesignClick={onDesignClick}
              designDate={Common.convertIsoToDate(item.purchaseDate)}
            />
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    marginTop: 10,
  },
  listDesign: {
    marginTop: 10,
  },
});

export default inject("designStore", "userStore")(observer(UserDesign));
