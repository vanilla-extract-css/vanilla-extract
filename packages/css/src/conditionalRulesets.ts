interface Rule {
  selector: string;
  rule: any;
}

type Condition = {
  query: string;
  rules: Array<Rule>;
  children: ConditionalRuleset;
};

export class ConditionalRuleset {
  ruleset: Array<Condition>;
  /**
   * Stores information about where conditions must in relation to other conditions
   *
   * e.g. mobile -> tablet, desktop
   */
  precedenceLookup: Map<string, Set<String>>;

  constructor() {
    this.ruleset = [];
    this.precedenceLookup = new Map();
  }

  findOrCreateCondition(conditionQuery: string) {
    let targetCondition = this.ruleset.find(
      (cond) => cond.query === conditionQuery,
    );

    if (!targetCondition) {
      // No target condition so create one
      targetCondition = {
        query: conditionQuery,
        rules: [],
        children: new ConditionalRuleset(),
      };
      this.ruleset.push(targetCondition);
    }

    return targetCondition;
  }

  getConditionalRulesetByPath(conditionPath: Array<string>) {
    let currRuleset: ConditionalRuleset = this;

    for (const query of conditionPath) {
      const condition = currRuleset.findOrCreateCondition(query);

      currRuleset = condition.children;
    }

    return currRuleset;
  }

  addRule(rule: Rule, conditionQuery: string, conditionPath: Array<string>) {
    const ruleset = this.getConditionalRulesetByPath(conditionPath);
    const targetCondition = ruleset.findOrCreateCondition(conditionQuery);

    if (!targetCondition) {
      throw new Error('Failed to add conditional rule');
    }

    targetCondition.rules.push(rule);
  }

  addConditionPrecedence(
    conditionPath: Array<string>,
    conditionOrder: Array<string>,
  ) {
    const ruleset = this.getConditionalRulesetByPath(conditionPath);

    for (let i = 0; i < conditionOrder.length; i++) {
      const condition = conditionOrder[i];

      const conditionPriority =
        ruleset.precedenceLookup.get(condition) ?? new Set();

      for (const lowerPriorityCondition of conditionOrder.slice(i + 1)) {
        conditionPriority.add(lowerPriorityCondition);
      }

      ruleset.precedenceLookup.set(condition, conditionPriority);
    }
  }

  isCompatible(incomingRuleset: ConditionalRuleset) {
    for (const [condition, orderPriority] of this.precedenceLookup.entries()) {
      for (const lowerPriorityCondition of orderPriority) {
        if (
          incomingRuleset.precedenceLookup
            .get(lowerPriorityCondition as string)
            ?.has(condition)
        ) {
          return false;
        }
      }
    }

    // Check that children are compatible
    for (const { query, children } of incomingRuleset.ruleset) {
      const matchingCondition = this.ruleset.find(
        (cond) => cond.query === query,
      );

      if (
        matchingCondition &&
        !matchingCondition.children.isCompatible(children)
      ) {
        return false;
      }
    }

    return true;
  }

  merge(incomingRuleset: ConditionalRuleset) {
    // Merge rulesets into one array
    for (const { query, rules, children } of incomingRuleset.ruleset) {
      const matchingCondition = this.ruleset.find(
        (cond) => cond.query === query,
      );

      if (matchingCondition) {
        matchingCondition.rules.push(...rules);

        matchingCondition.children.merge(children);
      } else {
        this.ruleset.push({ query, rules, children });
      }
    }

    // Merge order priorities
    for (const [
      condition,
      incomingOrderPriority,
    ] of incomingRuleset.precedenceLookup.entries()) {
      const orderPrecendence =
        this.precedenceLookup.get(condition) ?? new Set();

      this.precedenceLookup.set(
        condition,
        new Set([...orderPrecendence, ...incomingOrderPriority]),
      );
    }
  }

  /**
   * Merge another ConditionalRuleset into this one if they are compatible
   *
   * @returns true if successful, false if the ruleset is incompatible
   */
  mergeIfCompatible(incomingRuleset: ConditionalRuleset) {
    if (!this.isCompatible(incomingRuleset)) {
      return false;
    }

    this.merge(incomingRuleset);

    return true;
  }

  sort() {
    this.ruleset.sort((a, b) => {
      const aWeights = this.precedenceLookup.get(a.query);

      if (aWeights?.has(b.query)) {
        // A is higher priority
        return -1;
      }

      const bWeights = this.precedenceLookup.get(b.query);

      if (bWeights?.has(a.query)) {
        // B is higher priority
        return 1;
      }

      return 0;
    });
  }

  renderToObj() {
    // Sort rulesets according to required rule order
    this.sort();

    const target: any = {};

    for (const { query, rules, children } of this.ruleset) {
      target[query] = {};

      for (const rule of rules) {
        target[query][rule.selector] = rule.rule;
      }

      Object.assign(target[query], children.renderToObj());
    }

    return target;
  }
}
