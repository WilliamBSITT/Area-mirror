import React, { useEffect, useState } from 'react';
import { View, LayoutChangeEvent } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import TabBarButton from './TabBarButton';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, Easing } from 'react-native-reanimated';
import { useTheme } from '../providers/ThemeProvider';

export function MyTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const [dimensions, setDimensions] = useState({ width: 320, height: 56 });
  const tabPositionX = useSharedValue(0);
  const { theme } = useTheme();

  console.log("theme : ", theme);

  const onTabBarLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setDimensions({ width, height });
  };

  const buttonCount = Math.max(1, state.routes.length);
  const buttonWidth = dimensions.width / buttonCount;
  const indicatorPadding = 25;
  const indicatorWidth = Math.max(10, buttonWidth - indicatorPadding);
  const indicatorHeight = Math.max(30, dimensions.height - 15);

  // Use withTiming instead of withSpring for smooth linear movement
  useEffect(() => {
    if (!dimensions.width) return;
    const centerOffset = (buttonWidth - indicatorWidth) / 2;
    const targetX = buttonWidth * state.index + centerOffset;

    tabPositionX.value = withTiming(targetX, {
      duration: 250, // Animation duration in milliseconds
      easing: Easing.out(Easing.cubic), // Smooth easing curve
    });
  }, [dimensions.width, state.index]);

  const animatedStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    left: 0,
    width: indicatorWidth,
    height: indicatorHeight,
    transform: [{ translateX: tabPositionX.value }],
  }));

  return (
    <View
      onLayout={onTabBarLayout}
      style={{
        position: 'absolute',
        bottom: 12,
        alignSelf: 'center',
        width: '75%',
        flexDirection: 'row',
        //backgroundColor: 'white',
        borderRadius: 999,
        padding: 12,
        paddingLeft: 20,
        paddingRight: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
      className='bg-secondary'
    >
      <Animated.View
        style={[
          animatedStyle,
          { bottom: 8, borderRadius: 999 },
        ]}
        className={"bg-primary"}
      />

      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = typeof options.tabBarLabel === 'string' ? options.tabBarLabel : options.title ?? route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const centerOffset = (buttonWidth - indicatorWidth) / 2;
          const targetX = buttonWidth * index + centerOffset;

          // Use the same smooth timing animation in onPress
          tabPositionX.value = withTiming(targetX, {
            duration: 250,
            easing: Easing.out(Easing.cubic),
          });

          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TabBarButton
            key={route.key}
            onPress={onPress}
            onLongPress={() => navigation.emit({ type: 'tabLongPress', target: route.key })}
            isFocused={isFocused}
            routeName={route.name}
            color= {theme == 'dark' ? '#FFF' : '#222'}
            label={label}
          />
        );
      })}
    </View>
  );
}
