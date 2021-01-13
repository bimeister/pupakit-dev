import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  Inject,
  Input,
  OnChanges,
  Renderer2,
  ViewEncapsulation
} from '@angular/core';
import { getUuid, isNil } from '@bimeister/utilities/common';
import { BehaviorSubject } from 'rxjs';
import { PositionController } from '../../../../../internal/declarations/classes/abstract/position-controller.abstract';
import { ComponentChange } from '../../../../../internal/declarations/interfaces/component-change.interface';
import { ComponentChanges } from '../../../../../internal/declarations/interfaces/component-changes.interface';
import { ExpanderBehavior } from '../../../../../internal/declarations/types/expander-behavior.type';
import { Uuid } from '../../../../../internal/declarations/types/uuid.type';

const CURSOR_BY_BEHAVIOR_NAME: Map<ExpanderBehavior, string> = new Map<ExpanderBehavior, string>([
  ['top', 'n-resize'],
  ['right', 'e-resize'],
  ['bottom', 's-resize'],
  ['left', 'w-resize'],
  ['right-top', 'ne-resize'],
  ['right-bottom', 'se-resize'],
  ['left-bottom', 'sw-resize'],
  ['left-top', 'nw-resize'],
  ['vertical', 'ns-resize'],
  ['horizontal', 'ew-resize']
]);

/** @dynamic */
@Component({
  selector: 'pupa-expander',
  templateUrl: './expander.component.html',
  styleUrls: ['./expander.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpanderComponent extends PositionController implements OnChanges {
  @Input() public behavior: ExpanderBehavior;

  @HostBinding('style.cursor') public cursorName: string;

  public readonly behavior$: BehaviorSubject<ExpanderBehavior> = new BehaviorSubject<ExpanderBehavior>(null);

  public readonly id: Uuid = getUuid();

  constructor(
    protected readonly renderer: Renderer2,
    protected readonly elementRef: ElementRef<HTMLElement>,
    @Inject(DOCUMENT) protected readonly document: Document
  ) {
    super(renderer, elementRef, document);
  }

  public ngOnChanges(changes: ComponentChanges<this>): void {
    if (isNil(changes)) {
      return;
    }
    this.processBehaviorChanges(changes?.behavior);
  }

  private processBehaviorChanges(change: ComponentChange<this, ExpanderBehavior>): void {
    if (isNil(change)) {
      return;
    }
    const behavior: ExpanderBehavior = change?.currentValue;
    const targetCursorName: string = CURSOR_BY_BEHAVIOR_NAME.get(behavior);
    if (isNil(targetCursorName)) {
      return;
    }
    this.behavior$.next(behavior);
    this.cursorName = targetCursorName;
  }
}
