import React from 'react';
import { Dimensions, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import ShopCartsComponent from '@/components/ShopCartsComponent';
import { shops } from '@/dummydata';

const { width } = Dimensions.get('window');

export default function Homepage() {
  return (
    <View className="flex-1 bg-black">
      <Carousel
        width={width}        // each card slightly narrower than the screen
        data={shops}
        loop
        autoPlay
        autoPlayInterval={3000}
        mode="parallax"             
        scrollAnimationDuration={1000}
        style={{ alignSelf: 'center' }}
        renderItem={({ item }) => (
          <ShopCartsComponent shop={item} />
        )}
      />
    </View>
  );
}
