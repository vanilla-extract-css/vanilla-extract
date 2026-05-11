import { style } from '@vanilla-extract/css';
import { reExportedStyle } from './reExporter';

export const container = style([reExportedStyle, {}]);
