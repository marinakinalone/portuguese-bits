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
    width: '90%',
    maxWidth: 320,
    maxHeight: '100%',
    flexShrink: 1,
    borderWidth: 1,
    borderRadius: 32,
    alignSelf: 'center',
    paddingTop: 12,
    paddingBottom: 16,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  default: {
    ...theme.palette.primary,
  },
  warning: {
    ...theme.palette.warning,
  },
  topContainer: {
    width: '100%',
    alignItems: 'center',
  },
  centerContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'stretch',
    flexShrink: 1,
  },
  bottomContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
});

export default MainView;
