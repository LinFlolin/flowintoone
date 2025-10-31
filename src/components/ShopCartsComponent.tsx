import { Shop } from '@/type';
import React from 'react';
import { Image, Text, View } from 'react-native';

const fallbackShopImage = require('../../assets/icon.png');

export default function ShopCartsComponent({ shop }: { shop: Shop }) {
  const hasRemoteImage = typeof shop.image === 'string' && shop.image.trim().length > 0;
  const imageSource = hasRemoteImage ? { uri: shop.image } : fallbackShopImage;
  const categoryLabel = shop.category.replace(/_/g, ' ').toUpperCase();

  return (
    <View className="px-4 py-2">
      <View className="overflow-hidden rounded-3xl border border-white/20 bg-white/10 shadow-xl shadow-black/40">
        <View className="relative h-48 bg-white/5">
          <Image source={imageSource} resizeMode="cover" className="h-full w-full" />
          <View className="absolute inset-0 bg-black/35" />
          <View className="absolute bottom-4 left-4 right-4">
            <Text className="text-xl font-semibold text-white">{shop.name}</Text>
            <Text className="mt-1 text-xs tracking-[3px] text-white/70">{categoryLabel}</Text>
          </View>
        </View>

        <View className="gap-3 bg-black/35 px-4 py-5">
          <Text className="text-base leading-6 text-white/80">
            {shop.description || 'Questo spazio è pronto per raccontare la storia del negozio.'}
          </Text>

          <View className="flex-row items-center justify-between">
            <Text className="text-xs font-medium tracking-[3px] text-white/60">
              Since {new Date(shop.createdAt).getFullYear()}
            </Text>
            <Text className="text-right text-xs text-white/50">{shop.address}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
