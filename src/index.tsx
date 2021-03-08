import 'react-native-gesture-handler';
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  StatusBar,
  NativeModules,
  Platform,
} from 'react-native';

import Icon from 'react-native-vector-icons/Feather';

import Video from 'react-native-video';

import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import {
  PanGestureHandler,
  TouchableOpacity,
} from 'react-native-gesture-handler';

import video from './assets/videoplayback.mp4';

import {Tab, Tabtext, TitleClose, AutorClose, Content} from './styles';

const HEIGHT_SCREEN = Dimensions.get('window').height;
const WIDTH_SCREEN = Dimensions.get('window').width;

const App: React.FC = () => {
  const playerPosition = useSharedValue(HEIGHT_SCREEN - 150);
  const [paused, setPaused] = useState(false);

  const playerStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: playerPosition.value}],
    };
  });

  const videoStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(
        playerPosition.value,
        [0, 696],
        [250, 78],
        Extrapolate.CLAMP,
      ),
      width: interpolate(
        playerPosition.value,
        [710, HEIGHT_SCREEN - 150],
        [WIDTH_SCREEN, 140],
        Extrapolate.CLAMP,
      ),
    };
  });

  const playerBoxStyle = useAnimatedStyle(() => {
    return {
      flex: interpolate(
        playerPosition.value,
        [0, 670, 680, 696],
        [1, 1, 1, 0],
        Extrapolate.CLAMP,
      ),
      opacity: interpolate(
        playerPosition.value,
        [0, 348, 696],
        [1, 0, 0],
        Extrapolate.CLAMP,
      ),
    };
  });

  const playerTabbarStyle = useAnimatedStyle(() => {
    return {
      marginBottom: interpolate(
        playerPosition.value,
        [0, HEIGHT_SCREEN - 150],
        [-70, 0],
        Extrapolate.CLAMP,
      ),
    };
  });

  const playerInfoClose = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        playerPosition.value,
        [0, HEIGHT_SCREEN - 10],
        [0, 1],
        Extrapolate.CLAMP,
      ),
      width: interpolate(
        playerPosition.value,
        [710, HEIGHT_SCREEN - 150],
        [0, WIDTH_SCREEN - 145],
        Extrapolate.CLAMP,
      ),
    };
  });

  const onGestureEvent = useAnimatedGestureHandler({
    onStart(event: any, ctx: any) {
      ctx.playerPosition = playerPosition.value;
    },
    onActive(event: any, ctx: any) {
      if (
        ctx.playerPosition + event.translationY < 23 ||
        ctx.playerPosition + event.translationY > HEIGHT_SCREEN - 150
      ) {
        return null;
      }
      playerPosition.value = ctx.playerPosition + event.translationY;
    },
    onEnd(event: any, ctx: any) {
      if (ctx.playerPosition + event.translationY > HEIGHT_SCREEN / 2) {
        playerPosition.value = HEIGHT_SCREEN - 150;
      } else {
        playerPosition.value = 0;
      }
    },
  });
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <View style={[styles.box, styles.center]}>
        <Text style={{fontSize: 30}}>Youtube Player</Text>
        <Text style={{fontSize: 20}}>de Siomar Velloso</Text>
      </View>
      <PanGestureHandler onGestureEvent={onGestureEvent}>
        <Animated.View style={[styles.player, playerStyle]}>
          <Animated.View style={[styles.playerVideo, videoStyle]}>
            <Video
              source={video}
              resizeMode={'contain'}
              style={{flex: 1, backgroundColor: '#000'}}
              paused={paused}
              muted={false}
              pictureInPicture={true}
              playInBackground={true}
              poster={'https://baconmockup.com/300/200/'}
            />
          </Animated.View>
          <Animated.View style={[styles.playerInfoClose, playerInfoClose]}>
            <View style={{flex: 1, justifyContent: 'center'}}>
              <TitleClose numberOfLines={1}>
                DVBBS - West Coast feat. Quinn XCII (Official Video)
              </TitleClose>
              <AutorClose numberOfLines={1}>DVBBS</AutorClose>
            </View>
            <TouchableOpacity
              onPress={() => setPaused((item) => !item)}
              style={{
                flex: 1,
                justifyContent: 'center',
                paddingHorizontal: 10,
              }}>
              <Icon name={paused ? 'play' : 'pause'} size={30} color={'#ddd'} />
            </TouchableOpacity>
          </Animated.View>
          <Animated.View style={[styles.playerBox, playerBoxStyle]}>
            <Content>
              <TitleClose style={{fontSize: 18}}>
                DVBBS - West Coast feat. Quinn XCII (Official Video)
              </TitleClose>
              <Text style={{fontSize: 14, color: '#aaa'}}>
                1 Mi visualizações • 11 de nov. de 2020
              </Text>
            </Content>
          </Animated.View>
        </Animated.View>
      </PanGestureHandler>
      <Animated.View style={[styles.tabAnimated, playerTabbarStyle]}>
        <View style={styles.tabbar}>
          <Tab>
            <Icon name="home" size={26} color={'#ddd'} />
            <Tabtext>Início</Tabtext>
          </Tab>
          <Tab>
            <Icon name="compass" size={26} color={'#ddd'} />
            <Tabtext>Explorar</Tabtext>
          </Tab>
          <Tab>
            <Icon name="plus-circle" size={40} color={'#ddd'} />
          </Tab>
          <Tab>
            <Icon name="tv" size={26} color={'#ddd'} />
            <Tabtext>Inscrições</Tabtext>
          </Tab>
          <Tab>
            <Icon name="layers" size={26} color={'#ddd'} />
            <Tabtext>Biblioteca</Tabtext>
          </Tab>
        </View>
      </Animated.View>
    </View>
  );
};

const {StatusBarManager} = NativeModules;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ededed',
  },
  box: {
    flex: 1,
    backgroundColor: 'red',
  },
  player: {
    position: 'absolute',
    backgroundColor: '#303030',
    height: HEIGHT_SCREEN,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
  playerBox: {
    flex: 1,
  },
  playerVideo: {
    width: WIDTH_SCREEN,
    height: 250,
    backgroundColor: 'blue',
  },
  playerInfoClose: {
    position: 'absolute',
    right: 0,
    width: WIDTH_SCREEN - 145,
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 78,
  },
  playerInfoOpen: {},
  tabAnimated: {
    position: 'absolute',
    height: 70,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 12,
  },
  tabbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 70,
    backgroundColor: '#303030',
    borderTopWidth: 0.6,
    borderColor: '#888',
    paddingHorizontal: 15,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
