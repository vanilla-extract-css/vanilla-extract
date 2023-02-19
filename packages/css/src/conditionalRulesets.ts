/** e.g. @media screen and (min-width: 500px) */
type Query = string;

interface StandardRule {
  selector: string;
  rule: any;
}

export const DECLARATION = '__DECLARATION';
type DeclarationRule = typeof DECLARATION;

type Rule = StandardRule | DeclarationRule;

type Condition = {
  query: Query;
  rules: Array<Rule>;
  children: ConditionalRuleset;
};

export class ConditionalRuleset {
  ruleset: Map<Query, Condition>;
  includesLayer: boolean;

  /**
   * Stores information about where conditions must be in relation to other conditions
   *
   * e.g. mobile -> tablet, desktop
   */
  precedenceLookup: Map<Query, Set<String>>;

  constructor() {
    this.ruleset = new Map();
    this.precedenceLookup = new Map();
    this.includesLayer = false;
  }

  findOrCreateCondition(conditionQuery: Query) {
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

  getConditionalRulesetByPath(conditionPath: Array<Query>) {
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
    { isLayer }: { isLayer?: boolean } = {},
  ) {
    const ruleset = this.getConditionalRulesetByPath(conditionPath);
    const targetCondition = ruleset.findOrCreateCondition(conditionQuery);

    if (!targetCondition) {
      throw new Error('Failed to add conditional rule');
    }

    if (isLayer) {
      ruleset.includesLayer = true;
    }

    targetCondition.rules.push(rule);
  }

  addLayerDeclaration(conditionQuery: Query, conditionPath: Array<Query>) {
    this.includesLayer = true;
    this.addRule(DECLARATION, conditionQuery, conditionPath);
  }

  addConditionPrecedence(
    conditionPath: Array<Query>,
    conditionOrder: Array<Query>,
  ) {
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

  isCompatible(incomingRuleset: ConditionalRuleset) {
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
        (matchingCondition.children.includesLayer ||
          children.includesLayer ||
          !matchingCondition.children.isCompatible(children))
      ) {
        return false;
      }
    }

    return true;
  }

  merge(incomingRuleset: ConditionalRuleset) {
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

    this.includesLayer = this.includesLayer || incomingRuleset.includesLayer;
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

  getSortedRuleset() {
    const sortedRuleset: Array<Condition> = [];

    // Loop through all queries and add them to the sorted ruleset
    for (const [query, dependents] of this.precedenceLookup.entries()) {
      let conditionForQuery = this.ruleset.get(query);

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

  renderToArray() {
    const arr: any = [];

    for (const { query, rules, children } of this.getSortedRuleset()) {
      const selectors: any = {};
      let hasDeclaration = false;

      for (const rule of rules) {
        if (rule !== DECLARATION) {
          selectors[rule.selector] = rule.rule;
        } else {
          hasDeclaration = true;
        }
      }

      Object.assign(selectors, ...children.renderToArray());

      if (hasDeclaration && Object.keys(selectors).length === 0) {
        arr.push({ [query]: DECLARATION });
      } else {
        arr.push({ [query]: selectors });
      }
    }

    return arr;
  }
}
