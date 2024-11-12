import React from 'react';
import { StyleSheet, View } from 'react-native';
import { VIEW_STYLE } from '@/constants';
import theme from '@/theme/defaultTheme';

type MainViewStyle = (typeof VIEW_STYLE)[keyof typeof VIEW_STYLE];

interface IMainView {
  style?: MainViewStyle;
  TopContainer?: React.ReactNode;
  CenterContainer?: React.ReactNode;
  BottomContainer?: React.ReactNode;
  centerTopContent?: boolean;
}

const MainView = ({
  style = VIEW_STYLE.DEFAULT,
  TopContainer,
  CenterContainer,
  BottomContainer,
}: IMainView) => {
  return (
    <View style={[styles.container, styles[style]]}>
      <View style={styles.topContainer}>{TopContainer}</View>
      <View style={styles.centerContainer}>{CenterContainer}</View>
      <View style={styles.bottomContainer}>{BottomContainer}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 320,
    height: 360,
    marginTop: 160,
    borderWidth: 1,
    borderRadius: 32,
  },
  default: {
    ...theme.palette.primary,
  },
  warning: {
    ...theme.palette.warning,
  },
  topContainer: {
    flex: 1,
    alignItems: 'center',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MainView;
