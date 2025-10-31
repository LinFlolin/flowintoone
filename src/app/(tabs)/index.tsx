import React from 'react';
import { Dimensions, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import ShopCartsComponent from '@/components/ShopCartsComponent';
import { shops } from '@/dummydata';
import LoginScreen from '../(auth)/login';
import { Link } from 'expo-router';

const { width } = Dimensions.get('window');

export default function index() {
  return (
    <View className="flex-1 bg-black">
      <Link href="/login"  className=' text-white'>Login</Link>
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
