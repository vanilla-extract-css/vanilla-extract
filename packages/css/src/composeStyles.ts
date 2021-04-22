type ClassNames = string | Array<ClassNames>;

function composeStylesIntoSet(
  set: Set<string>,
  ...classnames: Array<ClassNames>
) {
  for (const classname of classnames) {
    if (classname.length === 0) {
      continue;
    }

    if (typeof classname === 'string') {
      if (classname.includes(' ')) {
        composeStylesIntoSet(set, ...classname.trim().split(' '));
      } else {
        set.add(classname);
      }
    } else if (Array.isArray(classname)) {
      composeStylesIntoSet(set, ...classname);
    }
  }
}

export function composeStyles(...classnames: Array<ClassNames>) {
  const set: Set<string> = new Set();

  composeStylesIntoSet(set, ...classnames);

  return Array.from(set).join(' ');
}
