export type TODO_CSS_RULES = any;

export interface CSS {
  selector: string;
  rules: TODO_CSS_RULES;
}

export interface Adapter {
  appendCss: (css: CSS, fileScope: string) => void;
}
