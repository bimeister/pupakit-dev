import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { AngularComponent, SharedModule } from './../../internal';
import { TextareaComponent } from './components';

const COMPONENTS: AngularComponent[] = [TextareaComponent];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [...COMPONENTS]
})
export class TextareaModule {}
