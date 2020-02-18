import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { AngularComponent, SharedModule } from './../../internal';
import { DrawerComponent, DrawerDraggerComponent } from './components';

const COMPONENTS: AngularComponent[] = [DrawerComponent, DrawerDraggerComponent];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [...COMPONENTS]
})
export class DrawerModule {}
