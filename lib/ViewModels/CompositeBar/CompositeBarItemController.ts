import { computed, observable } from "mobx";
import ViewerMode from "../../Models/ViewerMode";
import React from "react";

export interface ICompositeBarItemController {
  readonly id: string;
  active: boolean;
  disabled: boolean;
  collapsed: boolean;
  pinned: boolean;
  visible: boolean;
  readonly glyph: any;
  readonly viewerMode: ViewerMode | undefined;
  itemRef: React.RefObject<HTMLDivElement>;
}

export abstract class CompositeBarItemController
  implements ICompositeBarItemController {
  static id: string;
  itemRef: React.RefObject<HTMLDivElement> = React.createRef();

  get id() {
    return CompositeBarItemController.id;
  }

  /**
   * Whether this item is disabled
   * @private
   */
  @observable
  private _disabled: boolean = false;

  @computed
  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(value: boolean) {
    this._disabled = value;
  }

  /**
   * Whether this item is collapsed
   * @private
   */
  @observable
  private _collapsed: boolean = false;

  @computed
  get collapsed(): boolean {
    return this._collapsed;
  }

  set collapsed(value: boolean) {
    this._collapsed = value;
  }

  /**
   * Whether this item is active
   * @protected
   */
  @observable
  protected _active: boolean = false;

  @computed
  get active(): boolean {
    return !this.disabled && this._active;
  }

  /**
   * Whether this item is pinned, if item is pinned it will be always visible on screen.
   * @private
   */
  @observable
  private _pinned: boolean = false;

  @computed
  get pinned() {
    return this._pinned;
  }

  set pinned(value: boolean) {
    this._pinned = value;
  }

  /**
   * Whether this item is visible on the screen.
   * @private
   */
  @observable
  private _visible: boolean = true;

  @computed
  get visible(): boolean {
    return this._visible;
  }

  set visible(value: boolean) {
    this._visible = value;
  }

  /**
   * Glyph to be shown with this item.
   */
  abstract get glyph(): { id: string };

  /**
   * Get viewer on which this item should be visible. If undefined item will be visible in both viewers.
   */
  abstract get viewerMode(): ViewerMode | undefined;

  /**
   * What should happen after clicking on this item.
   */
  abstract handleClick(): void;
}
