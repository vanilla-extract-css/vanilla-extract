import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import throttle from 'lodash/throttle';

let activeHash: string | null = null;
const listeners = new Set<(activeHash: string | null) => void>();

const updateActiveRoute = (hash: string) => {
  if (hash != activeHash) {
    activeHash = hash;

    listeners.forEach((listener) => {
      listener(activeHash);
    });
  }
};

export const useActiveHash = () => {
  const [hash, setHash] = useState(activeHash);

  useEffect(() => {
    listeners.add(setHash);

    setHash(activeHash);

    return () => {
      listeners.delete(setHash);
    };
  }, []);

  return hash;
};

export const useHeadingRouteUpdates = (headingHashes: Array<string>) => {
  const location = useLocation();

  updateActiveRoute(location.hash.substring(1));

  useEffect(() => {
    const onScroll = throttle(
      () => {
        const offset = window.scrollY + window.innerHeight;
        const height = document.documentElement.offsetHeight;

        if (offset >= height) {
          return updateActiveRoute(headingHashes[headingHashes.length - 1]);
        }

        const results = headingHashes
          .map((hash) => {
            if (hash) {
              const headingElement = document.querySelector(`#${hash}`);

              if (headingElement) {
                return {
                  pos:
                    headingElement.getBoundingClientRect().top -
                    window.innerHeight / 2,
                  hash,
                };
              }
            }

            return {
              pos: 1,
              hash,
            };
          })
          .filter(({ pos }) => pos < 0)
          .sort(({ pos: posA }, { pos: posB }) => posB - posA);

        if (results[0]) {
          updateActiveRoute(results[0].hash);
        }
      },
      50,
      { leading: false },
    );

    window.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, headingHashes);
};
