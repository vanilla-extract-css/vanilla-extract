import dedent from 'dedent';

interface Rule {
  selector: string;
  rule: any;
}

type ConditionInfo = {
  condition: string;
  rules: Array<Rule>;
  children: ConditionalRuleset;
};

type Ruleset = Array<ConditionInfo>;

export class ConditionalRuleset {
  ruleset: Ruleset;
  /**
   * Stores information about where condtions must in relation to other conditions
   *
   * e.g. mobile -> tablet, desktop
   */
  orderPriorities: Map<string, Set<String>>;

  constructor() {
    this.ruleset = [];
    this.orderPriorities = new Map();
  }

  getRelevantCondition(conditions: Array<string>) {
    let parentRuleset: ConditionalRuleset = this;
    let currRuleset: ConditionalRuleset = this;
    let targetCondition: ConditionInfo | undefined;

    for (const condition of conditions) {
      targetCondition = currRuleset.ruleset.find(
        (cond) => cond.condition === condition,
      );

      if (!targetCondition) {
        // No target condition so create one
        targetCondition = {
          condition,
          rules: [],
          children: new ConditionalRuleset(),
        };
        currRuleset.ruleset.push(targetCondition);
      }

      parentRuleset = currRuleset;
      currRuleset = targetCondition.children;
    }

    return {
      ruleset: parentRuleset,
      targetCondition,
    };
  }

  addRule(rule: Rule, conditions: Array<string>) {
    const { targetCondition } = this.getRelevantCondition(conditions);

    if (!targetCondition) {
      throw new Error('Failed to add conditional rule');
    }

    targetCondition.rules.push(rule);
  }

  addConditionPriorities(
    parentConditions: Array<string>,
    conditionOrder: Array<string>,
  ) {
    const { ruleset } = this.getRelevantCondition(parentConditions);

    for (let i = 0; i < conditionOrder.length; i++) {
      const condition = conditionOrder[i];

      const conditionPriority =
        ruleset.orderPriorities.get(condition) ?? new Set();

      for (const lowerPriorityCondition of conditionOrder.slice(i + 1)) {
        conditionPriority.add(lowerPriorityCondition);
      }

      ruleset.orderPriorities.set(condition, conditionPriority);
    }
  }

  isCompatible(altRuleset: ConditionalRuleset) {
    // console.log(
    //   'isCompatible\nCurr: ',
    //   this.orderPriorities,
    //   '\nIncoming: ',
    //   altRuleset.orderPriorities,
    // );

    for (const [condition, orderPriority] of this.orderPriorities.entries()) {
      for (const lowerPriorityCondition of orderPriority) {
        if (
          altRuleset.orderPriorities
            .get(lowerPriorityCondition as string)
            ?.has(condition)
        ) {
          // console.log(dedent`Ruleset not compatible:
          // Current ruleset: "${condition}" < "${lowerPriorityCondition}"
          // Incoming ruleset: "${lowerPriorityCondition}" < "${condition}"`);
          return false;
        }
      }
    }

    return true;
  }

  merge(incomingRuleset: ConditionalRuleset) {
    // Merge rulesets into one array
    for (const { condition, rules, children } of incomingRuleset.ruleset) {
      const matchingCondition = this.ruleset.find(
        (cond) => cond.condition === condition,
      );

      if (matchingCondition) {
        matchingCondition.rules.push(...rules);

        matchingCondition.children.merge(children);
      } else {
        this.ruleset.push({ condition, rules, children });
      }
    }

    // Merge order priorities
    for (const [
      condition,
      orderPriority,
    ] of incomingRuleset.orderPriorities.entries()) {
      const orderPrioritySet = this.orderPriorities.get(condition) ?? new Set();

      this.orderPriorities.set(
        condition,
        new Set([...orderPrioritySet, ...orderPriority]),
      );
    }
  }

  sort() {
    this.ruleset.sort((a, b) => {
      const aWeights = this.orderPriorities.get(a.condition);

      if (aWeights?.has(b.condition)) {
        // A is higher priority
        // console.log('Sort - A: ', a.condition, ' < ', 'B: ', b.condition);
        return -1;
      }

      const bWeights = this.orderPriorities.get(b.condition);

      if (bWeights?.has(a.condition)) {
        // B is higher priority
        // console.log('Sort - A: ', a.condition, ' > ', 'B: ', b.condition);
        return 1;
      }

      return 0;
    });
  }

  renderToObj() {
    // Sort rulesets according to required rule order
    this.sort();

    const target: any = {};

    for (const { condition, rules, children } of this.ruleset) {
      target[condition] = {};

      for (const rule of rules) {
        target[condition][rule.selector] = rule.rule;
      }

      Object.assign(target[condition], children.renderToObj());
    }

    return target;
  }
}
