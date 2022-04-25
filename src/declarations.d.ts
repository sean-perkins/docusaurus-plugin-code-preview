declare namespace JSX {
  interface IntrinsicElements {
    'device-preview': any;
  }
}

declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}
