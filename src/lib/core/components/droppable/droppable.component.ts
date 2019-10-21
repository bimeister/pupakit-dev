import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  Renderer2,
  ViewChild
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { isNullOrUndefined } from '../../../helpers/is-null-or-undefined.helper';

export type DroppableHorizontalPosition = 'left' | 'right';

@Component({
  selector: 'pupa-droppable',
  templateUrl: './droppable.component.html',
  styleUrls: ['./droppable.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DroppableComponent implements AfterViewInit, OnDestroy {
  private readonly sub: Subscription = new Subscription();
  @ViewChild('dropdown', { static: false }) public dropdownRef: ElementRef<HTMLDivElement>;
  public get dropdown(): HTMLDivElement | null {
    return this.dropdownRef && this.dropdownRef.nativeElement ? this.dropdownRef.nativeElement : null;
  }
  @Input() public anchor: HTMLElement;
  @Input() public positionChange$: Observable<void>;
  @Input() public horizontalPosition: DroppableHorizontalPosition = 'left';
  @Input() public maxWidth: number = null;
  private _open: boolean = false;
  public shown: boolean = false;
  @Input() public set open(value: boolean) {
    this._open = value;
    requestAnimationFrame(() => {
      this.shown = value;
      this.checkPosition();
      this.cDRef.markForCheck();
    });
  }
  public get open(): boolean {
    return this._open;
  }

  public topPx: number = 0;
  public leftPx: number = 0;
  private readonly offsetTopPx: number = 4;

  constructor(protected readonly cDRef: ChangeDetectorRef, protected readonly renderer: Renderer2) {}

  public ngAfterViewInit(): void {
    if (!this.anchor) {
      return;
    }
    this.anchor.addEventListener('click', this.onClick);
    if (this.positionChange$) {
      this.sub.add(this.positionChange$.subscribe(this.checkPosition));
    }
    this.checkPosition();
  }

  public ngOnDestroy(): void {
    if (!this.anchor) {
      return;
    }
    this.anchor.removeEventListener('click', this.onClick);
    this.sub.unsubscribe();
  }

  public onClick: () => void = () => this.toggle(true);

  public toggle: (value?: boolean) => void = (value?: boolean): void => {
    this.open = isNullOrUndefined(value) ? !this.open : value;
    this.cDRef.markForCheck();
    this.checkPosition();
  };

  @HostListener('window:mousemove')
  public onMouseMove(): void {
    if (!this.open) {
      return;
    }
    this.checkPosition();
  }

  @HostListener('window:resize')
  @HostListener('window:scroll')
  public readonly checkPosition: () => void = (): void => {
    if (!this.anchor || !this.dropdown) {
      return;
    }
    const box: ClientRect = this.anchor.getBoundingClientRect();
    const dropDownBottom: number = box.top + box.height + this.offsetTopPx + this.dropdown.clientHeight;
    const ddWidth: number = this.dropdown.clientWidth;
    this.topPx =
      dropDownBottom < window.innerHeight
        ? (this.topPx = box.top + box.height + this.offsetTopPx)
        : (this.topPx = box.top + box.height - this.dropdown.clientHeight);

    switch (this.horizontalPosition) {
      case 'right':
        this.leftPx = box.left + box.width - ddWidth;
        break;
      case 'left':
      default:
        this.leftPx = box.left;
    }
    if (this.maxWidth) {
      this.renderer.setStyle(this.dropdown, 'maxWidth', `${this.maxWidth}px`);
    } else {
      this.renderer.setStyle(this.dropdown, 'width', `${box.width}px`);
    }
    this.cDRef.markForCheck();
  };

  @HostListener('document:click', ['$event'])
  public clickOutsideCheck(event: MouseEvent): void {
    if (!this.anchor || !this.dropdownRef || !this.dropdownRef.nativeElement) {
      return;
    }
    const clickedInside: boolean =
      this.anchor.contains(event.target as Node) || this.dropdownRef.nativeElement.contains(event.target as Node);
    if (!clickedInside) {
      this.toggle(false);
    }
  }
}
