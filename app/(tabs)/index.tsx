import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Platform,
  View,
  Dimensions,
  ImageBackground,
} from "react-native";
import {
  GestureHandlerRootView,
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const { height, width } = Dimensions.get("screen");
type backDrop = {
  title: { poster: ImageSourcePropType };
  index: number;
  color: any;
};
const BackDropImage: React.FC<backDrop> = ({ index, title, color }) => {
  const styleZ = useAnimatedStyle(() => {
    const opacity = interpolate(
      color.value,
      [index - 1, index, index + 1],
      [0, 0.5, 0]
    );
    return {
      opacity,
    };
  });
  return (
    <Animated.Image
      source={title.poster}
      key={index.toString()}
      style={[
        StyleSheet.absoluteFillObject,
        { width, height, resizeMode: "cover" },
        styleZ,
      ]}
    />
  );
};
export default function HomeScreen() {
  type PosterType = {
    poster: ImageSourcePropType;
  };

  const hollywoodMoviePosters: PosterType[] = [
    {
      poster: require("../../assets/images/titanic.jpg"),
    },
    {
      poster: require("../../assets/images/marvel.jpg"),
    },
    {
      poster: require("../../assets/images/batman.jpg"),
    },
    {
      poster: require("../../assets/images/spiderman.jpg"),
    },
  ];

  const translate_X = useSharedValue(0);
  const scrollEvent = useAnimatedScrollHandler((event) => {
    translate_X.value = event.contentOffset.x;
  });

  const color = useDerivedValue(() => {
    console.log(translate_X.value);

    if (translate_X.value >= 180 && translate_X.value < 380) {
      return withTiming(1);
    } else if (translate_X.value >= 380 && translate_X.value < 580) {
      return withTiming(2);
    } else if (translate_X.value >= 580) {
      return withTiming(3);
    }
    return withTiming(0);
  }, [translate_X.value]);

  return (
    <Animated.View style={[{ flex: 1 }]}>
      <View style={[StyleSheet.absoluteFillObject]}>
        {hollywoodMoviePosters.map((title: any, index) => {
          return <BackDropImage index={index} title={title} color={color} />;
        })}
      </View>
      <Animated.ScrollView
        horizontal
        scrollEnabled={true}
        onScroll={scrollEvent}
        scrollEventThrottle={16}
        contentContainerStyle={styles.container}
      >
        {hollywoodMoviePosters.map((title: any, index) => {
          return <Card title={title} index={index} translate_X={translate_X} />;
        })}
      </Animated.ScrollView>
    </Animated.View>
  );
}
import { ImageSourcePropType } from "react-native";

type CardProps = {
  title: { poster: ImageSourcePropType };
  index: number;
  translate_X: Animated.SharedValue<number>;
};

const Card: React.FC<CardProps> = ({ index, title, translate_X }) => {
  const input = [(index - 1) * 200, index * 200, (index + 1) * 200];
  const cardStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      translate_X.value,
      input,
      [-40, 1, 40],
      Extrapolation.CLAMP
    );
    return {
      transform: [{ rotateY: `${scale}deg` }],
    };
  });
  return (
    <View
      key={index.toString()}
      style={{ marginLeft: width * 0.001, marginRight: width * 0.1 }}
    >
      <Animated.View style={[styles.card, cardStyle]}>
        <Image source={title.poster} style={styles.image} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    height: 300,
    width: 200,

    margin: 8,
    marginRight: 0,
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowRadius: 10,
    shadowOpacity: 0.1,
    elevation: 8,
  },
  image: {
    height: 300,
    width: 200,
    resizeMode: "contain",
  },
});
