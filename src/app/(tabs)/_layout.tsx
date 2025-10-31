import { Tabs } from 'expo-router'
import React from 'react'
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#eb992e' , tabBarInactiveTintColor :'#9a74b9ff' }} >
        <Tabs.Screen name='index' options={{title: 'Home' , tabBarIcon:({size,color}) => (<Entypo name="home" size={size} color={color} /> )}}/>
        <Tabs.Screen name='like' options={{title: 'Fevorite' , tabBarIcon:({size,color}) => (<AntDesign name="heart"  size={size} color={color} /> )}}/>
        <Tabs.Screen name='profile' options={{title: 'Profile' , tabBarIcon:({size,color}) => (<Entypo name="home" size={size} color={color} /> )}}/>
    </Tabs>
  )
   
}
