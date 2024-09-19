// src/utils/roamStyler.js
import getPageUidByPageTitle from "roamjs-components/queries/getPageUidByPageTitle";

export const applyStylesToTag = async (tagName, styles) => {
  const pageUid = await getPageUidByPageTitle(`#${tagName}`);
  if (!pageUid) return;

  const cssString = Object.entries(styles)
    .map(([property, value]) => `${property}: ${value};`)
    .join(' ');

  const rule = `${cssString} [[${tagName}]] { ${cssString} }`;

  window.roamAlphaAPI.updatePage({
    page: { uid: pageUid },
    block: { string: `{{[[roam/css]]}}${rule}` }
  });
};