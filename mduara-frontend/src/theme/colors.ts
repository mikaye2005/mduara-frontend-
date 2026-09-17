export const colors = {
  // Core brand palette — approved M-Duara prototype tokens.
  navy: '#101629',
  navyRaised: '#151C33',
  navySoft: '#202844',
  secondary: '#101629',
  primary: '#6338D4',
  primaryBright: '#7754E8',
  primaryHover: '#4D29B4',
  primaryDark: '#4D29B4',
  primaryLight: '#F0EBFF',
  primaryLine: '#DCD1FF',
  brandCanvas: '#FAF8FF',

  background: '#F7F8FB',
  surface: '#FFFFFF',
  surfaceMuted: '#F2F4F8',
  border: '#E7EAF0',
  text: '#171A27',
  textMuted: '#747A8A',
  textSubtle: '#9AA0AE',

  success: '#15935D',
  successSoft: '#EAF8F1',
  successLight: '#EAF8F1',
  warning: '#B66B00',
  warningSoft: '#FFF4DE',
  warningLight: '#FFF4DE',
  danger: '#D14848',
  dangerSoft: '#FFF0F0',
  dangerLight: '#FFF0F0',
  info: '#3A70B8',
  infoSoft: '#EDF5FF',
  infoLight: '#EDF5FF',

  white: '#FFFFFF',
  black: '#000000',
  brandInversePurple: '#A68CF2',
  transparent: 'transparent',
} as const;

export type ColorToken = keyof typeof colors;
