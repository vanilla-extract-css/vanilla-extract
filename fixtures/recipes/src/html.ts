import { button, stack } from './styles.css';

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
  </div>`;
