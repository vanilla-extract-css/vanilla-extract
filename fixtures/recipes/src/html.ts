import { button, child, parentRecipe, stack } from './styles.css';

export default `<div class="${stack()}">
    <button class="${button()}"> 
      Standard calm button
    </button>
    <button class="${button({ size: 'small' })}"> 
      Small calm button
    </button>
    <button class="${button({ tone: 'angry' })}"> 
      Standard angry button
    </button>
    <button class="${button({
      size: 'small',
      tone: 'angry',
      bold: true,
    })}"> 
      Small angry button
    </button>
    <div class="${parentRecipe({ size: 'empty' })}">
      parent recipe consumer (black)
      <div class="${child}">
        child composed with parent recipe classname (blue)
      </div>
    </div>
    <div class="${child}">
      sibling composed with parent recipe classname (red)
    </div>
  </div>`;
