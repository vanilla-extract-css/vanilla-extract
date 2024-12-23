import { useRef, useEffect, ReactNode } from 'react';
import * as styles from './ErrorHighlighter.css';

export interface ErrorHighlighterProps {
  children: ReactNode;
  tokens: Array<string>;
}

export const ErrorHighlighter = ({
  tokens,
  children,
}: ErrorHighlighterProps) => {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (rootRef.current === null || tokens.length === 0) {
      return;
    }

    const spans = rootRef.current.querySelectorAll('code span');

    if (!spans) {
      return;
    }

    const errorNodes: Array<Element> = [];
    for (const span of Array.from(spans)) {
      if (span.innerHTML && tokens.includes(span.innerHTML.trim())) {
        span.classList.add(styles.errorUnderline);
        errorNodes.push(span);
      }
    }

    return () => {
      errorNodes.forEach((errorNode) => {
        errorNode.classList.remove(styles.errorUnderline);
      });
    };
  }, [rootRef.current, tokens]);

  return <div ref={rootRef}>{children}</div>;
};
