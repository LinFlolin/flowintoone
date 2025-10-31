import ShopCartsComponent from '@/components/ShopCartsComponent';
import { shops } from '@/dummydata';
import {  FlatList, Text, View } from 'react-native';

export default function Homepage() {
  return (
    <FlatList
      data={shops}
      renderItem={({item}) => <ShopCartsComponent shop={item} />}
    />
  );
}
