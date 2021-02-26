import * as React from 'react';

export default function useConstant<T>(fn: () => T): T {
  const ref = React.useRef<{ v: T }>();

  if (!ref.current) {
    ref.current = { v: fn() };
  }

  return ref.current.v;
}
