import { useEffect, useState } from 'react';

/** The last heading above the middle of the viewport, or the one linked to */
export const useActiveHeading = (headings: { slug: string }[]) => {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  useEffect(() => {
    setActiveSlug(decodeURIComponent(window.location.hash.slice(1)) || null);

    const slugs = headings.map(({ slug }) => slug);
    const slugsAboveMiddle = new Set<string>();
    let scrolledToBottom = false;

    const update = () => {
      const slug = scrolledToBottom
        ? slugs.at(-1)
        : slugs.findLast((slug) => slugsAboveMiddle.has(slug));

      if (slug) {
        setActiveSlug(slug);
      }
    };

    // The top margin extends the observed area far above the viewport, so
    // headings stay intersecting once scrolled past, even when jumped over
    const headingObserver = new IntersectionObserver(
      (entries) => {
        for (const { target, isIntersecting } of entries) {
          if (isIntersecting) {
            slugsAboveMiddle.add(target.id);
          } else {
            slugsAboveMiddle.delete(target.id);
          }
        }
        update();
      },
      { rootMargin: '100000px 0px -50% 0px' },
    );

    for (const slug of slugs) {
      const heading = document.getElementById(slug);
      if (heading) headingObserver.observe(heading);
    }

    const endOfPage = document.createElement('div');
    document.body.append(endOfPage);

    const endOfPageObserver = new IntersectionObserver(([entry]) => {
      scrolledToBottom = entry.isIntersecting;
      update();
    });
    endOfPageObserver.observe(endOfPage);

    return () => {
      headingObserver.disconnect();
      endOfPageObserver.disconnect();
      endOfPage.remove();
    };
  }, [headings]);

  return [activeSlug, setActiveSlug] as const;
};
