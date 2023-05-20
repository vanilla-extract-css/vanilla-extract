export class DependencyGraph {
  graph: Map<string, Set<string>>;

  public constructor() {
    this.graph = new Map();
  }

  /**
   * Creates a "depends on" relationship between `key` and `dependency`
   */
  public addDependency(key: string, dependency: string) {
    const dependencies = this.graph.get(key);

    if (dependencies) {
      dependencies.add(dependency);
    } else {
      this.graph.set(key, new Set([dependency]));
    }
  }

  public getDependencies(key: string): Set<string> {
    const deps = this.graph.get(key);

    if (!deps) {
      return new Set();
    }

    return deps;
  }

  /**
   * Whether or not `key` depends on `dependency`
   */
  public dependsOn(key: string, dependency: string): boolean {
    const dependencies = this.graph.get(key);

    if (dependencies) {
      if (dependencies?.has(dependency)) {
        return true;
      }

      for (const dep of dependencies.values()) {
        if (this.dependsOn(dep, dependency)) {
          return true;
        }
      }
    }

    return false;
  }

  public dependsOnSome(
    keys: Iterable<string>,
    dependencies: Iterable<string>,
  ): boolean {
    for (const key of keys) {
      for (const dep of dependencies) {
        if (this.dependsOn(key, dep)) {
          return true;
        }
      }
    }

    return false;
  }
}
