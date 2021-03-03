import { types as t, NodePath, template } from '@babel/core';
import { Options } from './types';

type Context = { filename: string; hasTreatImports: boolean };

export default function () {
  return {
    pre(this: Context, state: any) {
      this.filename = state.opts.filename;
      this.hasTreatImports = false;
    },
    visitor: {
      ImportDeclaration(
        this: Context,
        path: NodePath<t.ImportDeclaration>,
        { opts }: { opts: Options },
      ) {
        const treatImportIdentifier = opts.alias || '@treat/core';

        if (path.node.source.value === treatImportIdentifier) {
          this.hasTreatImports = true;
        }
      },
      Program: {
        exit(
          this: Context,
          path: NodePath<t.Program>,
          { opts }: { opts: Options },
        ) {
          if (this.hasTreatImports) {
            const treatPackageName = opts.alias || '@treat/core';
            // TODO ensure filename is escaped
            const setFileScope = template(
              `
                import { setFileScope } from "${treatPackageName}";
                setFileScope('${this.filename}');
              `,
              { sourceType: 'module' },
            );

            path.get('body')[0].insertBefore(setFileScope());
          }
        },
      },
    },
  };
}
