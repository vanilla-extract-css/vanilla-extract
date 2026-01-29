/** e.g. @media screen and (min-width: 500px) */
type Query = string;

interface Rule {
  selector: string;
  rule: any;
}

type Condition = {
  query: Query;
  rules: Array<Rule>;
  children: ConditionalRuleset;
};

type RenderedConditionalRule = Record<string, Record<string, any>>;

export class ConditionalRuleset {
  ruleset: Map<Query, Condition>;

  /**
   * Stores information about where conditions must be in relation to other conditions
   *
   * e.g. mobile -> tablet, desktop
   */
  precedenceLookup: Map<Query, Set<string>>;

  constructor() {
    this.ruleset = new Map();
    this.precedenceLookup = new Map();
  }

  findOrCreateCondition(conditionQuery: Query): Condition {
    let targetCondition = this.ruleset.get(conditionQuery);

    if (!targetCondition) {
      // No target condition so create one
      targetCondition = {
        query: conditionQuery,
        rules: [],
        children: new ConditionalRuleset(),
      };
      this.ruleset.set(conditionQuery, targetCondition);
    }

    return targetCondition;
  }

  getConditionalRulesetByPath(conditionPath: Array<Query>): ConditionalRuleset {
    let currRuleset: ConditionalRuleset = this;

    for (const query of conditionPath) {
      const condition = currRuleset.findOrCreateCondition(query);

      currRuleset = condition.children;
    }

    return currRuleset;
  }

  addRule(
    rule: Rule,
    conditionQuery: Query,
    conditionPath: Array<Query>,
  ): void {
    const ruleset = this.getConditionalRulesetByPath(conditionPath);
    const targetCondition = ruleset.findOrCreateCondition(conditionQuery);

    if (!targetCondition) {
      throw new Error('Failed to add conditional rule');
    }

    targetCondition.rules.push(rule);
  }

  addConditionPrecedence(
    conditionPath: Array<Query>,
    conditionOrder: Array<Query>,
  ): void {
    const ruleset = this.getConditionalRulesetByPath(conditionPath);

    for (let i = 0; i < conditionOrder.length; i++) {
      const query = conditionOrder[i];

      const conditionPrecedence =
        ruleset.precedenceLookup.get(query) ?? new Set();

      for (const lowerPrecedenceCondition of conditionOrder.slice(i + 1)) {
        conditionPrecedence.add(lowerPrecedenceCondition);
      }

      ruleset.precedenceLookup.set(query, conditionPrecedence);
    }
  }

  isCompatible(incomingRuleset: ConditionalRuleset): boolean {
    for (const [
      condition,
      orderPrecedence,
    ] of this.precedenceLookup.entries()) {
      for (const lowerPrecedenceCondition of orderPrecedence) {
        if (
          incomingRuleset.precedenceLookup
            .get(lowerPrecedenceCondition as string)
            ?.has(condition)
        ) {
          return false;
        }
      }
    }

    // Check that children are compatible
    for (const { query, children } of incomingRuleset.ruleset.values()) {
      const matchingCondition = this.ruleset.get(query);

      if (
        matchingCondition &&
        !matchingCondition.children.isCompatible(children)
      ) {
        return false;
      }
    }

    return true;
  }

  merge(incomingRuleset: ConditionalRuleset): void {
    // Merge rulesets into one array
    for (const { query, rules, children } of incomingRuleset.ruleset.values()) {
      const matchingCondition = this.ruleset.get(query);

      if (matchingCondition) {
        matchingCondition.rules.push(...rules);

        matchingCondition.children.merge(children);
      } else {
        this.ruleset.set(query, { query, rules, children });
      }
    }

    // Merge order precedences
    for (const [
      condition,
      incomingOrderPrecedence,
    ] of incomingRuleset.precedenceLookup.entries()) {
      const orderPrecedence = this.precedenceLookup.get(condition) ?? new Set();

      this.precedenceLookup.set(
        condition,
        new Set([...orderPrecedence, ...incomingOrderPrecedence]),
      );
    }
  }

  /**
   * Merge another ConditionalRuleset into this one if they are compatible
   *
   * @returns true if successful, false if the ruleset is incompatible
   */
  mergeIfCompatible(incomingRuleset: ConditionalRuleset): boolean {
    if (!this.isCompatible(incomingRuleset)) {
      return false;
    }

    this.merge(incomingRuleset);

    return true;
  }

  getSortedRuleset(): Condition[] {
    const sortedRuleset: Array<Condition> = [];

    // Loop through all queries and add them to the sorted ruleset
    for (const [query, dependents] of this.precedenceLookup.entries()) {
      const conditionForQuery = this.ruleset.get(query);

      if (!conditionForQuery) {
        throw new Error(`Can't find condition for ${query}`);
      }

      // Find the location of the first dependent condition in the sortedRuleset
      // A dependent condition is a condition that must be placed *after* the current one
      const firstMatchingDependent = sortedRuleset.findIndex((condition) =>
        dependents.has(condition.query),
      );

      if (firstMatchingDependent > -1) {
        // Insert the condition before the dependent one
        sortedRuleset.splice(firstMatchingDependent, 0, conditionForQuery);
      } else {
        // No match, just insert at the end
        sortedRuleset.push(conditionForQuery);
      }
    }

    return sortedRuleset;
  }

  renderToArray(): RenderedConditionalRule[] {
    const arr: RenderedConditionalRule[] = [];

    for (const { query, rules, children } of this.getSortedRuleset()) {
      const selectors: Record<string, any> = {};

      for (const rule of rules) {
        selectors[rule.selector] = {
          // Preserve existing declarations if a rule with the same selector has already been added
          ...selectors[rule.selector],
          ...rule.rule,
        };
      }

      Object.assign(selectors, ...children.renderToArray());

      arr.push({ [query]: selectors });
    }

    return arr;
  }
}
