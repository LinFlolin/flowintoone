import React from 'react';
import { Dimensions, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import ShopCartsComponent from '@/components/ShopCartsComponent';
import { shops } from '@/dummydata';
import { Link } from 'expo-router';

const { width } = Dimensions.get('window');

export default function index() {
  return (
    <View className="flex-1 bg-black">
     
      <Carousel
        width={width}   
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
