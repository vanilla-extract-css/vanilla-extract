type ClassNames = string | Array<string> | Array<ClassNames>;

function composeWithSet(set: Set<string>, ...classnames: Array<ClassNames>) {
  for (const classname of classnames) {
    if (classname.length === 0) {
      continue;
    }

    if (typeof classname === 'string') {
      if (classname.includes(' ')) {
        composeWithSet(set, ...classname.trim().split(' '));
      } else {
        set.add(classname);
      }
    } else if (Array.isArray(classname)) {
      composeWithSet(set, ...classname);
    }
  }

  return Array.from(set).join(' ');
}

export function compose(...args: Array<ClassNames>) {
  return composeWithSet(new Set(), ...args);
}
