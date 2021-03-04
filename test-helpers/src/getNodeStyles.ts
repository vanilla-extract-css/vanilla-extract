import type { Page } from 'puppeteer';

export async function getNodeStyles(page: Page, selector: string) {
  const session = await page.target().createCDPSession();
  await session.send('DOM.enable');
  await session.send('CSS.enable');

  const doc = await session.send('DOM.getDocument');
  const { nodeId } = await session.send('DOM.querySelector', {
    nodeId: doc.root.nodeId,
    selector,
  });

  const styleForSingleNode = await session.send('CSS.getMatchedStylesForNode', {
    nodeId,
  });

  const { computedStyle } = await session.send('CSS.getComputedStyleForNode', {
    nodeId,
  });

  const computedStyleMap = new Map();
  const nodeStyles = new Map();

  for (const { name, value } of computedStyle) {
    computedStyleMap.set(name, value);
  }

  for (const { rule } of styleForSingleNode.matchedCSSRules) {
    // Only calculate styles from regular sources, this reduces noise in the output
    if (rule.origin === 'regular') {
      for (const { name, value } of rule.style.cssProperties) {
        nodeStyles.set(name, computedStyleMap.get(name) ?? value);
      }
    }
  }

  return nodeStyles;
}
