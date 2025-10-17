/**
 * Starfield Background Component
 * Animated starfield effect for the Onboarding screen hero
 * 
 * Features:
 * - Multiple layers of stars with varying sizes and opacity
 * - Subtle twinkling animation
 * - Performance optimized for mobile
 */

import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, Animated, Dimensions} from 'react-native';
import {colors} from '@/theme/tokens';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

// Generate random star positions
const generateStars = (count: number) => {
  return Array.from({length: count}, (_, i) => ({
    id: i,
    x: Math.random() * SCREEN_WIDTH,
    y: Math.random() * SCREEN_HEIGHT,
    size: Math.random() * 2 + 1,
    opacity: Math.random() * 0.5 + 0.3,
  }));
};

const STAR_LAYERS = [
  {count: 50, color: colors.lavender[400], twinkleSpeed: 2000},
  {count: 30, color: colors.gold[400], twinkleSpeed: 3000},
  {count: 20, color: colors.lavender[300], twinkleSpeed: 2500},
];

export function StarfieldBackground() {
  return (
    <View style={styles.container} testID="starfield-background">
      {STAR_LAYERS.map((layer, layerIndex) => (
        <StarLayer
          key={layerIndex}
          count={layer.count}
          color={layer.color}
          twinkleSpeed={layer.twinkleSpeed}
        />
      ))}
    </View>
  );
}

interface StarLayerProps {
  count: number;
  color: string;
  twinkleSpeed: number;
}

function StarLayer({count, color, twinkleSpeed}: StarLayerProps) {
  const stars = useRef(generateStars(count)).current;
  const opacityAnims = useRef(
    stars.map(() => new Animated.Value(Math.random())),
  ).current;

  useEffect(() => {
    // Create staggered twinkling animations for each star
    const animations = opacityAnims.map((anim, index) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: twinkleSpeed,
            delay: index * 100,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0.3,
            duration: twinkleSpeed,
            useNativeDriver: true,
          }),
        ]),
      );
    });

    animations.forEach(anim => anim.start());

    return () => {
      animations.forEach(anim => anim.stop());
    };
  }, [opacityAnims, twinkleSpeed]);

  return (
    <View style={StyleSheet.absoluteFill}>
      {stars.map((star, index) => (
        <Animated.View
          key={star.id}
          style={[
            styles.star,
            {
              left: star.x,
              top: star.y,
              width: star.size,
              height: star.size,
              backgroundColor: color,
              opacity: opacityAnims[index],
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.canvas.dark,
  },
  star: {
    position: 'absolute',
    borderRadius: 1,
  },
});
