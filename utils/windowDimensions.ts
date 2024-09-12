import { Dimensions } from 'react-native';

export const windowWidth = Dimensions.get('window').width;
export const windowHeight = Dimensions.get('window').height;
export const bottomValue =
  (windowWidth > 500 && windowHeight < 1000) || windowWidth < 500
    ? 0
    : undefined;
