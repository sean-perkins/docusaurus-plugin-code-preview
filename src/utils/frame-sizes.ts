
export type FrameSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export const FRAME_SIZES: {
  [key in FrameSize]: string
} = {
  xs: '100px',
  sm: '200px',
  md: '400px',
  lg: '600px',
  xl: '800px',
};