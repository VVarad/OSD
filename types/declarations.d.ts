declare module "react" {
  export function useState<T>(initialState: T | (() => T)): [T, (newState: T | ((prevState: T) => T)) => void];
  export function useState<T = undefined>(): [T | undefined, (newState: T | undefined | ((prevState: T | undefined) => T | undefined)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: readonly any[]): void;
  export function useRef<T>(initialValue: T): { current: T };
  export function useRef<T = undefined>(): { current: T | undefined };
  const React: any;
  export default React;
}

declare module "react/jsx-runtime" {
  export const jsx: any;
  export const jsxs: any;
  export const Fragment: any;
}

declare module "framer-motion" {
  export const motion: any;
  export const AnimatePresence: any;
}

declare module "@/components/*" {
  const component: any;
  export default component;
}

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
