import {
  CompositeBarItemController,
  ICompositeBarItemController
} from "../CompositeBar/CompositeBarItemController";
import ViewerMode from "../../Models/ViewerMode";
import { action } from "mobx";

export interface IMapNavigationItemController
  extends ICompositeBarItemController {
  width?: number;
  height?: number;
}

export default abstract class MapNavigationItemController extends CompositeBarItemController {
  /**
   * Set this item to active state. If used it's recommended to override this method and a proper logic
   * for activating this item, so it's easier to programmatically control the item from other places.
   */
  @action
  activate() {
    this._active = true;
  }

  /**
   * Set this item to inactive state. If used it's recommended to override this method and a proper logic
   * for deactivating this item, so it's easier to programmatically control the item from other places.
   */
  @action
  deactivate() {
    this._active = false;
  }

  get width(): number | undefined {
    if (
      this.itemRef &&
      this.itemRef.current &&
      this.itemRef.current.offsetWidth > 0
    ) {
      return this.itemRef.current.offsetWidth;
    }
    return undefined;
  }

  get height(): number | undefined {
    if (
      this.itemRef &&
      this.itemRef.current &&
      this.itemRef.current.offsetHeight > 0
    ) {
      return this.itemRef.current.offsetHeight;
    }
    return undefined;
  }
}

interface IOptions {
  viewerMode?: ViewerMode;
  handleClick?: () => void;
  activate?: () => void;
  deactivate?: () => void;
  icon: { id: string };
}

// Basically used with custom renderer element, just to control basic properties of elements
export class GenericMapNavigationItemController extends MapNavigationItemController {
  constructor(private options: IOptions) {
    super();
  }

  get glyph(): { id: string } {
    return this.options.icon;
  }

  get viewerMode(): ViewerMode | undefined {
    return this.options?.viewerMode;
  }

  activate() {
    if (this.options?.activate) {
      this.options.activate();
    }
    super.activate();
  }

  deactivate() {
    if (this.options?.deactivate) {
      this.options.deactivate();
    }
    super.deactivate();
  }

  handleClick(): void {
    if (this.options?.handleClick) {
      this.options.handleClick();
    }
  }
}
