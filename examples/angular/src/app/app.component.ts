import { Attribute, Component, HostBinding } from '@angular/core';
import { style } from '@vanilla-extract/css';
import { sprinkles } from '../sprinkles.css';
// Import the classes from the generated CSS file
import * as styles from './app.css';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  // Assign the classNames to a class property so it can be used in the template
  styles = styles;

  // We can also use the HostBinding decorator to bind the 'app' class to the host class attribute
  @HostBinding('class') get classAttribute(): string {
    return styles.app + ' ' + this.classNames;
  }

  constructor(@Attribute('class') public classNames: string) {}
}
