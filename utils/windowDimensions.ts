import { Dimensions } from 'react-native';

/** Snapshot of window size at module load. Prefer useWindowDimensions() for layout. */
export const windowWidth = Dimensions.get('window').width;
export const windowHeight = Dimensions.get('window').height;
