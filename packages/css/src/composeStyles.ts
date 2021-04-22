type ClassNames = string | Array<ClassNames>;

function composeStylesWithSet(
  set: Set<string>,
  ...classnames: Array<ClassNames>
) {
  for (const classname of classnames) {
    if (classname.length === 0) {
      continue;
    }

    if (typeof classname === 'string') {
      if (classname.includes(' ')) {
        composeStylesWithSet(set, ...classname.trim().split(' '));
      } else {
        set.add(classname);
      }
    } else if (Array.isArray(classname)) {
      composeStylesWithSet(set, ...classname);
    }
  }

  return Array.from(set).join(' ');
}

export function composeStyles(...classnames: Array<ClassNames>) {
  return composeStylesWithSet(new Set(), ...classnames);
}
