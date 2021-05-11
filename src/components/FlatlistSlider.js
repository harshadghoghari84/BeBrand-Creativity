import React from "react";
import { View, Text, FlatList } from "react-native";

const FlatlistSlider = ({
  ref,
  data,
  keyExt,
  renderItem,
  onViewableItemsChanged,
  viewabilityConfig,
  getItemLayout,
  initialScrollIndex,
}) => {
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        ref={ref}
        data={data}
        initialScrollIndex={initialScrollIndex}
        horizontal
        getItemLayout={getItemLayout}
        showsHorizontalScrollIndicator={false}
        keyExtractor={keyExt}
        pagingEnabled={true}
        renderItem={renderItem}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />
    </View>
  );
};

export default FlatlistSlider;
