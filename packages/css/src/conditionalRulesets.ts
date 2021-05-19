function getRelevantRulesets(a: Ruleset, b: Ruleset) {
  const aConditions = a.map(({ condition }) => condition);
  const bConditions = b.map(({ condition }) => condition);

  const aRelevantConditions = a.filter(({ condition }) =>
    bConditions.includes(condition),
  );
  const bRelevantConditions = b.filter(({ condition }) =>
    aConditions.includes(condition),
  );

  return [aRelevantConditions, bRelevantConditions];
}

export function renderRulesetToObj(ruleset: Ruleset, target: any = {}) {
  for (const { condition, rules, children } of ruleset) {
    target[condition] = {};

    for (const rule of rules) {
      target[condition][rule.selector] = rule.rule;
    }

    renderRulesetToObj(children.ruleset, target[condition]);
  }

  return target;
}

type ConditionInfo<Rule> = {
  condition: string;
  rules: Array<Rule>;
  children: ConditionalRuleset<Rule>;
};

export type Ruleset<Rule = any> = Array<ConditionInfo<Rule>>;

export class ConditionalRuleset<Rule> {
  ruleset: Ruleset<Rule>;

  constructor() {
    this.ruleset = [];
  }

  addRule(rule: Rule, conditions: Array<string>) {
    let currRuleset = this.ruleset;
    let targetCondition: ConditionInfo<Rule> | undefined;

    for (const condition of conditions) {
      targetCondition = currRuleset.find(
        (cond) => cond.condition === condition,
      );

      if (!targetCondition) {
        // No target condition so create one
        targetCondition = {
          condition,
          rules: [],
          children: new ConditionalRuleset(),
        };
        currRuleset.push(targetCondition);
      }

      currRuleset = targetCondition.children.ruleset;
    }

    if (!targetCondition) {
      throw new Error('Failed to add conditional rule');
    }

    targetCondition.rules.push(rule);
  }

  isCompatible(altRuleset: ConditionalRuleset<Rule>) {
    const [aRelevantConditions, bRelevantConditions] = getRelevantRulesets(
      this.ruleset,
      altRuleset.ruleset,
    );

    for (let i = 0; i < aRelevantConditions.length; i++) {
      const aCondition = aRelevantConditions[i];
      const bCondition = bRelevantConditions[i];

      if (aCondition.condition !== bCondition.condition) {
        return false;
      }

      if (!aCondition.children.isCompatible(bCondition.children)) {
        return false;
      }
    }

    return true;
  }

  populateWeightMap(rs: Ruleset<Rule>, weightMap: Map<string, Set<String>>) {
    const conditions = rs.map(({ condition }) => condition);

    for (let i = 0; i < conditions.length; i++) {
      const weights = weightMap.get(conditions[i]) || new Set<string>();

      for (const condition of conditions.splice(i + 1, conditions.length)) {
        weights.add(condition);
      }

      weightMap.set(conditions[i], weights);
    }
  }

  merge(incomingRuleset: ConditionalRuleset<Rule>) {
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

    // Sort rulesets according to required rule order
    // We assume incoming rulesets are compatible/mergeable
    const weightMap = new Map<string, Set<String>>();

    this.populateWeightMap(this.ruleset, weightMap);
    this.populateWeightMap(incomingRuleset.ruleset, weightMap);

    this.ruleset.sort((a, b) => {
      const aWeights = weightMap.get(a.condition);

      if (aWeights?.has(b.condition)) {
        // A is higher priority
        return -1;
      }

      const bWeights = weightMap.get(b.condition);

      if (bWeights?.has(a.condition)) {
        // B is higher priority
        return 1;
      }

      return 0;
    });
  }
}
