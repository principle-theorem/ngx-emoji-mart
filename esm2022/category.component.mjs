import { EmojiComponent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "@ctrl/ngx-emoji-mart/ngx-emoji";
import * as i2 from "./emoji-frequently.service";
import * as i3 from "@angular/common";
class CategoryComponent {
    ref;
    emojiService;
    frequently;
    emojis = null;
    hasStickyPosition = true;
    name = '';
    perLine = 9;
    totalFrequentLines = 4;
    recent = [];
    custom = [];
    i18n;
    id;
    hideObsolete = true;
    notFoundEmoji;
    virtualize = false;
    virtualizeOffset = 0;
    emojiIsNative;
    emojiSkin;
    emojiSize;
    emojiSet;
    emojiSheetSize;
    emojiForceSize;
    emojiTooltip;
    emojiBackgroundImageFn;
    emojiImageUrlFn;
    emojiUseButton;
    /**
     * Note: the suffix is added explicitly so we know the event is dispatched outside of the Angular zone.
     */
    emojiOverOutsideAngular = new EventEmitter();
    emojiLeaveOutsideAngular = new EventEmitter();
    emojiClickOutsideAngular = new EventEmitter();
    container;
    label;
    containerStyles = {};
    emojisToDisplay = [];
    filteredEmojisSubject = new Subject();
    filteredEmojis$ = this.filteredEmojisSubject.asObservable();
    labelStyles = {};
    labelSpanStyles = {};
    margin = 0;
    minMargin = 0;
    maxMargin = 0;
    top = 0;
    rows = 0;
    constructor(ref, emojiService, frequently) {
        this.ref = ref;
        this.emojiService = emojiService;
        this.frequently = frequently;
    }
    ngOnInit() {
        this.updateRecentEmojis();
        this.emojisToDisplay = this.filterEmojis();
        if (this.noEmojiToDisplay) {
            this.containerStyles = { display: 'none' };
        }
        if (!this.hasStickyPosition) {
            this.labelStyles = { height: 28 };
            // this.labelSpanStyles = { position: 'absolute' };
        }
    }
    ngOnChanges(changes) {
        if (changes.emojis?.currentValue?.length !== changes.emojis?.previousValue?.length) {
            this.emojisToDisplay = this.filterEmojis();
            this.ngAfterViewInit();
        }
    }
    ngAfterViewInit() {
        if (!this.virtualize) {
            return;
        }
        const { width } = this.container.nativeElement.getBoundingClientRect();
        const perRow = Math.floor(width / (this.emojiSize + 12));
        this.rows = Math.ceil(this.emojisToDisplay.length / perRow);
        this.containerStyles = {
            ...this.containerStyles,
            minHeight: `${this.rows * (this.emojiSize + 12) + 28}px`,
        };
        this.ref.detectChanges();
        this.handleScroll(this.container.nativeElement.parentNode.parentNode.scrollTop);
    }
    get noEmojiToDisplay() {
        return this.emojisToDisplay.length === 0;
    }
    memoizeSize() {
        const parent = this.container.nativeElement.parentNode.parentNode;
        const { top, height } = this.container.nativeElement.getBoundingClientRect();
        const parentTop = parent.getBoundingClientRect().top;
        const labelHeight = this.label.nativeElement.getBoundingClientRect().height;
        this.top = top - parentTop + parent.scrollTop;
        if (height === 0) {
            this.maxMargin = 0;
        }
        else {
            this.maxMargin = height - labelHeight;
        }
    }
    handleScroll(scrollTop) {
        let margin = scrollTop - this.top;
        margin = margin < this.minMargin ? this.minMargin : margin;
        margin = margin > this.maxMargin ? this.maxMargin : margin;
        if (this.virtualize) {
            const { top, height } = this.container.nativeElement.getBoundingClientRect();
            const parentHeight = this.container.nativeElement.parentNode.parentNode.clientHeight;
            if (parentHeight + (parentHeight + this.virtualizeOffset) >= top &&
                -height - (parentHeight + this.virtualizeOffset) <= top) {
                this.filteredEmojisSubject.next(this.emojisToDisplay);
            }
            else {
                this.filteredEmojisSubject.next([]);
            }
        }
        if (margin === this.margin) {
            this.ref.detectChanges();
            return false;
        }
        if (!this.hasStickyPosition) {
            this.label.nativeElement.style.top = `${margin}px`;
        }
        this.margin = margin;
        this.ref.detectChanges();
        return true;
    }
    updateRecentEmojis() {
        if (this.name !== 'Recent') {
            return;
        }
        let frequentlyUsed = this.recent || this.frequently.get(this.perLine, this.totalFrequentLines);
        if (!frequentlyUsed || !frequentlyUsed.length) {
            frequentlyUsed = this.frequently.get(this.perLine, this.totalFrequentLines);
        }
        if (!frequentlyUsed.length) {
            return;
        }
        this.emojis = frequentlyUsed
            .map(id => {
            const emoji = this.custom.filter((e) => e.id === id)[0];
            if (emoji) {
                return emoji;
            }
            return id;
        })
            .filter(id => !!this.emojiService.getData(id));
    }
    updateDisplay(display) {
        this.containerStyles.display = display;
        this.updateRecentEmojis();
        this.ref.detectChanges();
    }
    trackById(index, item) {
        return item;
    }
    filterEmojis() {
        const newEmojis = [];
        for (const emoji of this.emojis || []) {
            if (!emoji) {
                continue;
            }
            const data = this.emojiService.getData(emoji);
            if (!data || (data.obsoletedBy && this.hideObsolete) || (!data.unified && !data.custom)) {
                continue;
            }
            newEmojis.push(emoji);
        }
        return newEmojis;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.5", ngImport: i0, type: CategoryComponent, deps: [{ token: i0.ChangeDetectorRef }, { token: i1.EmojiService }, { token: i2.EmojiFrequentlyService }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.5", type: CategoryComponent, isStandalone: true, selector: "emoji-category", inputs: { emojis: "emojis", hasStickyPosition: "hasStickyPosition", name: "name", perLine: "perLine", totalFrequentLines: "totalFrequentLines", recent: "recent", custom: "custom", i18n: "i18n", id: "id", hideObsolete: "hideObsolete", notFoundEmoji: "notFoundEmoji", virtualize: "virtualize", virtualizeOffset: "virtualizeOffset", emojiIsNative: "emojiIsNative", emojiSkin: "emojiSkin", emojiSize: "emojiSize", emojiSet: "emojiSet", emojiSheetSize: "emojiSheetSize", emojiForceSize: "emojiForceSize", emojiTooltip: "emojiTooltip", emojiBackgroundImageFn: "emojiBackgroundImageFn", emojiImageUrlFn: "emojiImageUrlFn", emojiUseButton: "emojiUseButton" }, outputs: { emojiOverOutsideAngular: "emojiOverOutsideAngular", emojiLeaveOutsideAngular: "emojiLeaveOutsideAngular", emojiClickOutsideAngular: "emojiClickOutsideAngular" }, viewQueries: [{ propertyName: "container", first: true, predicate: ["container"], descendants: true, static: true }, { propertyName: "label", first: true, predicate: ["label"], descendants: true, static: true }], usesOnChanges: true, ngImport: i0, template: `
    <section
      #container
      class="emoji-mart-category"
      [attr.aria-label]="i18n.categories[id]"
      [class.emoji-mart-no-results]="noEmojiToDisplay"
      [ngStyle]="containerStyles"
    >
      <div class="emoji-mart-category-label" [ngStyle]="labelStyles" [attr.data-name]="name">
        <!-- already labeled by the section aria-label -->
        <span #label [ngStyle]="labelSpanStyles" aria-hidden="true">
          {{ i18n.categories[id] }}
        </span>
      </div>

      <div *ngIf="virtualize; else normalRenderTemplate">
        <div *ngIf="filteredEmojis$ | async as filteredEmojis">
          <ngx-emoji
            *ngFor="let emoji of filteredEmojis; trackBy: trackById"
            [emoji]="emoji"
            [size]="emojiSize"
            [skin]="emojiSkin"
            [isNative]="emojiIsNative"
            [set]="emojiSet"
            [sheetSize]="emojiSheetSize"
            [forceSize]="emojiForceSize"
            [tooltip]="emojiTooltip"
            [backgroundImageFn]="emojiBackgroundImageFn"
            [imageUrlFn]="emojiImageUrlFn"
            [hideObsolete]="hideObsolete"
            [useButton]="emojiUseButton"
            (emojiOverOutsideAngular)="emojiOverOutsideAngular.emit($event)"
            (emojiLeaveOutsideAngular)="emojiLeaveOutsideAngular.emit($event)"
            (emojiClickOutsideAngular)="emojiClickOutsideAngular.emit($event)"
          ></ngx-emoji>
        </div>
      </div>

      <div *ngIf="noEmojiToDisplay">
        <div>
          <ngx-emoji
            [emoji]="notFoundEmoji"
            [size]="38"
            [skin]="emojiSkin"
            [isNative]="emojiIsNative"
            [set]="emojiSet"
            [sheetSize]="emojiSheetSize"
            [forceSize]="emojiForceSize"
            [tooltip]="emojiTooltip"
            [backgroundImageFn]="emojiBackgroundImageFn"
            [useButton]="emojiUseButton"
          ></ngx-emoji>
        </div>

        <div class="emoji-mart-no-results-label">
          {{ i18n.notfound }}
        </div>
      </div>
    </section>

    <ng-template #normalRenderTemplate>
      <ngx-emoji
        *ngFor="let emoji of emojisToDisplay; trackBy: trackById"
        [emoji]="emoji"
        [size]="emojiSize"
        [skin]="emojiSkin"
        [isNative]="emojiIsNative"
        [set]="emojiSet"
        [sheetSize]="emojiSheetSize"
        [forceSize]="emojiForceSize"
        [tooltip]="emojiTooltip"
        [backgroundImageFn]="emojiBackgroundImageFn"
        [imageUrlFn]="emojiImageUrlFn"
        [hideObsolete]="hideObsolete"
        [useButton]="emojiUseButton"
        (emojiOverOutsideAngular)="emojiOverOutsideAngular.emit($event)"
        (emojiLeaveOutsideAngular)="emojiLeaveOutsideAngular.emit($event)"
        (emojiClickOutsideAngular)="emojiClickOutsideAngular.emit($event)"
      ></ngx-emoji>
    </ng-template>
  `, isInline: true, dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i3.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i3.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i3.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "pipe", type: i3.AsyncPipe, name: "async" }, { kind: "component", type: EmojiComponent, selector: "ngx-emoji", inputs: ["skin", "set", "sheetSize", "isNative", "forceSize", "tooltip", "size", "emoji", "fallback", "hideObsolete", "sheetRows", "sheetColumns", "useButton", "backgroundImageFn", "imageUrlFn"], outputs: ["emojiOver", "emojiOverOutsideAngular", "emojiLeave", "emojiLeaveOutsideAngular", "emojiClick", "emojiClickOutsideAngular"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
}
export { CategoryComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.5", ngImport: i0, type: CategoryComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'emoji-category',
                    template: `
    <section
      #container
      class="emoji-mart-category"
      [attr.aria-label]="i18n.categories[id]"
      [class.emoji-mart-no-results]="noEmojiToDisplay"
      [ngStyle]="containerStyles"
    >
      <div class="emoji-mart-category-label" [ngStyle]="labelStyles" [attr.data-name]="name">
        <!-- already labeled by the section aria-label -->
        <span #label [ngStyle]="labelSpanStyles" aria-hidden="true">
          {{ i18n.categories[id] }}
        </span>
      </div>

      <div *ngIf="virtualize; else normalRenderTemplate">
        <div *ngIf="filteredEmojis$ | async as filteredEmojis">
          <ngx-emoji
            *ngFor="let emoji of filteredEmojis; trackBy: trackById"
            [emoji]="emoji"
            [size]="emojiSize"
            [skin]="emojiSkin"
            [isNative]="emojiIsNative"
            [set]="emojiSet"
            [sheetSize]="emojiSheetSize"
            [forceSize]="emojiForceSize"
            [tooltip]="emojiTooltip"
            [backgroundImageFn]="emojiBackgroundImageFn"
            [imageUrlFn]="emojiImageUrlFn"
            [hideObsolete]="hideObsolete"
            [useButton]="emojiUseButton"
            (emojiOverOutsideAngular)="emojiOverOutsideAngular.emit($event)"
            (emojiLeaveOutsideAngular)="emojiLeaveOutsideAngular.emit($event)"
            (emojiClickOutsideAngular)="emojiClickOutsideAngular.emit($event)"
          ></ngx-emoji>
        </div>
      </div>

      <div *ngIf="noEmojiToDisplay">
        <div>
          <ngx-emoji
            [emoji]="notFoundEmoji"
            [size]="38"
            [skin]="emojiSkin"
            [isNative]="emojiIsNative"
            [set]="emojiSet"
            [sheetSize]="emojiSheetSize"
            [forceSize]="emojiForceSize"
            [tooltip]="emojiTooltip"
            [backgroundImageFn]="emojiBackgroundImageFn"
            [useButton]="emojiUseButton"
          ></ngx-emoji>
        </div>

        <div class="emoji-mart-no-results-label">
          {{ i18n.notfound }}
        </div>
      </div>
    </section>

    <ng-template #normalRenderTemplate>
      <ngx-emoji
        *ngFor="let emoji of emojisToDisplay; trackBy: trackById"
        [emoji]="emoji"
        [size]="emojiSize"
        [skin]="emojiSkin"
        [isNative]="emojiIsNative"
        [set]="emojiSet"
        [sheetSize]="emojiSheetSize"
        [forceSize]="emojiForceSize"
        [tooltip]="emojiTooltip"
        [backgroundImageFn]="emojiBackgroundImageFn"
        [imageUrlFn]="emojiImageUrlFn"
        [hideObsolete]="hideObsolete"
        [useButton]="emojiUseButton"
        (emojiOverOutsideAngular)="emojiOverOutsideAngular.emit($event)"
        (emojiLeaveOutsideAngular)="emojiLeaveOutsideAngular.emit($event)"
        (emojiClickOutsideAngular)="emojiClickOutsideAngular.emit($event)"
      ></ngx-emoji>
    </ng-template>
  `,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    preserveWhitespaces: false,
                    standalone: true,
                    imports: [CommonModule, EmojiComponent],
                }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }, { type: i1.EmojiService }, { type: i2.EmojiFrequentlyService }]; }, propDecorators: { emojis: [{
                type: Input
            }], hasStickyPosition: [{
                type: Input
            }], name: [{
                type: Input
            }], perLine: [{
                type: Input
            }], totalFrequentLines: [{
                type: Input
            }], recent: [{
                type: Input
            }], custom: [{
                type: Input
            }], i18n: [{
                type: Input
            }], id: [{
                type: Input
            }], hideObsolete: [{
                type: Input
            }], notFoundEmoji: [{
                type: Input
            }], virtualize: [{
                type: Input
            }], virtualizeOffset: [{
                type: Input
            }], emojiIsNative: [{
                type: Input
            }], emojiSkin: [{
                type: Input
            }], emojiSize: [{
                type: Input
            }], emojiSet: [{
                type: Input
            }], emojiSheetSize: [{
                type: Input
            }], emojiForceSize: [{
                type: Input
            }], emojiTooltip: [{
                type: Input
            }], emojiBackgroundImageFn: [{
                type: Input
            }], emojiImageUrlFn: [{
                type: Input
            }], emojiUseButton: [{
                type: Input
            }], emojiOverOutsideAngular: [{
                type: Output
            }], emojiLeaveOutsideAngular: [{
                type: Output
            }], emojiClickOutsideAngular: [{
                type: Output
            }], container: [{
                type: ViewChild,
                args: ['container', { static: true }]
            }], label: [{
                type: ViewChild,
                args: ['label', { static: true }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2F0ZWdvcnkuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2xpYi9waWNrZXIvY2F0ZWdvcnkuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBUyxjQUFjLEVBQWdCLE1BQU0sZ0NBQWdDLENBQUM7QUFDckYsT0FBTyxFQUVMLHVCQUF1QixFQUV2QixTQUFTLEVBRVQsWUFBWSxFQUNaLEtBQUssRUFHTCxNQUFNLEVBRU4sU0FBUyxHQUNWLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQWMsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDOzs7OztBQUkzQyxNQXdGYSxpQkFBaUI7SUErQ25CO0lBQ0M7SUFDQTtJQWhERCxNQUFNLEdBQWlCLElBQUksQ0FBQztJQUM1QixpQkFBaUIsR0FBRyxJQUFJLENBQUM7SUFDekIsSUFBSSxHQUFHLEVBQUUsQ0FBQztJQUNWLE9BQU8sR0FBRyxDQUFDLENBQUM7SUFDWixrQkFBa0IsR0FBRyxDQUFDLENBQUM7SUFDdkIsTUFBTSxHQUFhLEVBQUUsQ0FBQztJQUN0QixNQUFNLEdBQVUsRUFBRSxDQUFDO0lBQ25CLElBQUksQ0FBTTtJQUNWLEVBQUUsQ0FBTTtJQUNSLFlBQVksR0FBRyxJQUFJLENBQUM7SUFDcEIsYUFBYSxDQUFVO0lBQ3ZCLFVBQVUsR0FBRyxLQUFLLENBQUM7SUFDbkIsZ0JBQWdCLEdBQUcsQ0FBQyxDQUFDO0lBQ3JCLGFBQWEsQ0FBcUI7SUFDbEMsU0FBUyxDQUFpQjtJQUMxQixTQUFTLENBQWlCO0lBQzFCLFFBQVEsQ0FBZ0I7SUFDeEIsY0FBYyxDQUFzQjtJQUNwQyxjQUFjLENBQXNCO0lBQ3BDLFlBQVksQ0FBb0I7SUFDaEMsc0JBQXNCLENBQThCO0lBQ3BELGVBQWUsQ0FBdUI7SUFDdEMsY0FBYyxDQUFXO0lBRWxDOztPQUVHO0lBQ08s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RyxNQUFNO3NCQUFkLEtBQUs7Z0JBQ0csSUFBSTtzQkFBWixLQUFLO2dCQUNHLEVBQUU7c0JBQVYsS0FBSztnQkFDRyxZQUFZO3NCQUFwQixLQUFLO2dCQUNHLGFBQWE7c0JBQXJCLEtBQUs7Z0JBQ0csVUFBVTtzQkFBbEIsS0FBSztnQkFDRyxnQkFBZ0I7c0JBQXhCLEtBQUs7Z0JBQ0csYUFBYTtzQkFBckIsS0FBSztnQkFDRyxTQUFTO3NCQUFqQixLQUFLO2dCQUNHLFNBQVM7c0JBQWpCLEtBQUs7Z0JBQ0csUUFBUTtzQkFBaEIsS0FBSztnQkFDRyxjQUFjO3NCQUF0QixLQUFLO2dCQUNHLGNBQWM7c0JBQXRCLEtBQUs7Z0JBQ0csWUFBWTtzQkFBcEIsS0FBSztnQkFDRyxzQkFBc0I7c0JBQTlCLEtBQUs7Z0JBQ0csZUFBZTtzQkFBdkIsS0FBSztnQkFDRyxjQUFjO3NCQUF0QixLQUFLO2dCQUtJLHVCQUF1QjtzQkFBaEMsTUFBTTtnQkFDRyx3QkFBd0I7c0JBQWpDLE1BQU07Z0JBQ0csd0JBQXdCO3NCQUFqQyxNQUFNO2dCQUVtQyxTQUFTO3NCQUFsRCxTQUFTO3VCQUFDLFdBQVcsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUU7Z0JBQ0YsS0FBSztzQkFBMUMsU0FBUzt1QkFBQyxPQUFPLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRW1vamksIEVtb2ppQ29tcG9uZW50LCBFbW9qaVNlcnZpY2UgfSBmcm9tICdAY3RybC9uZ3gtZW1vamktbWFydC9uZ3gtZW1vamknO1xuaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIFZpZXdDaGlsZCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBFbW9qaUZyZXF1ZW50bHlTZXJ2aWNlIH0gZnJvbSAnLi9lbW9qaS1mcmVxdWVudGx5LnNlcnZpY2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdlbW9qaS1jYXRlZ29yeScsXG4gIHRlbXBsYXRlOiBgXG4gICAgPHNlY3Rpb25cbiAgICAgICNjb250YWluZXJcbiAgICAgIGNsYXNzPVwiZW1vamktbWFydC1jYXRlZ29yeVwiXG4gICAgICBbYXR0ci5hcmlhLWxhYmVsXT1cImkxOG4uY2F0ZWdvcmllc1tpZF1cIlxuICAgICAgW2NsYXNzLmVtb2ppLW1hcnQtbm8tcmVzdWx0c109XCJub0Vtb2ppVG9EaXNwbGF5XCJcbiAgICAgIFtuZ1N0eWxlXT1cImNvbnRhaW5lclN0eWxlc1wiXG4gICAgPlxuICAgICAgPGRpdiBjbGFzcz1cImVtb2ppLW1hcnQtY2F0ZWdvcnktbGFiZWxcIiBbbmdTdHlsZV09XCJsYWJlbFN0eWxlc1wiIFthdHRyLmRhdGEtbmFtZV09XCJuYW1lXCI+XG4gICAgICAgIDwhLS0gYWxyZWFkeSBsYWJlbGVkIGJ5IHRoZSBzZWN0aW9uIGFyaWEtbGFiZWwgLS0+XG4gICAgICAgIDxzcGFuICNsYWJlbCBbbmdTdHlsZV09XCJsYWJlbFNwYW5TdHlsZXNcIiBhcmlhLWhpZGRlbj1cInRydWVcIj5cbiAgICAgICAgICB7eyBpMThuLmNhdGVnb3JpZXNbaWRdIH19XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgIDwvZGl2PlxuXG4gICAgICA8ZGl2ICpuZ0lmPVwidmlydHVhbGl6ZTsgZWxzZSBub3JtYWxSZW5kZXJUZW1wbGF0ZVwiPlxuICAgICAgICA8ZGl2ICpuZ0lmPVwiZmlsdGVyZWRFbW9qaXMkIHwgYXN5bmMgYXMgZmlsdGVyZWRFbW9qaXNcIj5cbiAgICAgICAgICA8bmd4LWVtb2ppXG4gICAgICAgICAgICAqbmdGb3I9XCJsZXQgZW1vamkgb2YgZmlsdGVyZWRFbW9qaXM7IHRyYWNrQnk6IHRyYWNrQnlJZFwiXG4gICAgICAgICAgICBbZW1vamldPVwiZW1vamlcIlxuICAgICAgICAgICAgW3NpemVdPVwiZW1vamlTaXplXCJcbiAgICAgICAgICAgIFtza2luXT1cImVtb2ppU2tpblwiXG4gICAgICAgICAgICBbaXNOYXRpdmVdPVwiZW1vamlJc05hdGl2ZVwiXG4gICAgICAgICAgICBbc2V0XT1cImVtb2ppU2V0XCJcbiAgICAgICAgICAgIFtzaGVldFNpemVdPVwiZW1vamlTaGVldFNpemVcIlxuICAgICAgICAgICAgW2ZvcmNlU2l6ZV09XCJlbW9qaUZvcmNlU2l6ZVwiXG4gICAgICAgICAgICBbdG9vbHRpcF09XCJlbW9qaVRvb2x0aXBcIlxuICAgICAgICAgICAgW2JhY2tncm91bmRJbWFnZUZuXT1cImVtb2ppQmFja2dyb3VuZEltYWdlRm5cIlxuICAgICAgICAgICAgW2ltYWdlVXJsRm5dPVwiZW1vamlJbWFnZVVybEZuXCJcbiAgICAgICAgICAgIFtoaWRlT2Jzb2xldGVdPVwiaGlkZU9ic29sZXRlXCJcbiAgICAgICAgICAgIFt1c2VCdXR0b25dPVwiZW1vamlVc2VCdXR0b25cIlxuICAgICAgICAgICAgKGVtb2ppT3Zlck91dHNpZGVBbmd1bGFyKT1cImVtb2ppT3Zlck91dHNpZGVBbmd1bGFyLmVtaXQoJGV2ZW50KVwiXG4gICAgICAgICAgICAoZW1vamlMZWF2ZU91dHNpZGVBbmd1bGFyKT1cImVtb2ppTGVhdmVPdXRzaWRlQW5ndWxhci5lbWl0KCRldmVudClcIlxuICAgICAgICAgICAgKGVtb2ppQ2xpY2tPdXRzaWRlQW5ndWxhcik9XCJlbW9qaUNsaWNrT3V0c2lkZUFuZ3VsYXIuZW1pdCgkZXZlbnQpXCJcbiAgICAgICAgICA+PC9uZ3gtZW1vamk+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG5cbiAgICAgIDxkaXYgKm5nSWY9XCJub0Vtb2ppVG9EaXNwbGF5XCI+XG4gICAgICAgIDxkaXY+XG4gICAgICAgICAgPG5neC1lbW9qaVxuICAgICAgICAgICAgW2Vtb2ppXT1cIm5vdEZvdW5kRW1vamlcIlxuICAgICAgICAgICAgW3NpemVdPVwiMzhcIlxuICAgICAgICAgICAgW3NraW5dPVwiZW1vamlTa2luXCJcbiAgICAgICAgICAgIFtpc05hdGl2ZV09XCJlbW9qaUlzTmF0aXZlXCJcbiAgICAgICAgICAgIFtzZXRdPVwiZW1vamlTZXRcIlxuICAgICAgICAgICAgW3NoZWV0U2l6ZV09XCJlbW9qaVNoZWV0U2l6ZVwiXG4gICAgICAgICAgICBbZm9yY2VTaXplXT1cImVtb2ppRm9yY2VTaXplXCJcbiAgICAgICAgICAgIFt0b29sdGlwXT1cImVtb2ppVG9vbHRpcFwiXG4gICAgICAgICAgICBbYmFja2dyb3VuZEltYWdlRm5dPVwiZW1vamlCYWNrZ3JvdW5kSW1hZ2VGblwiXG4gICAgICAgICAgICBbdXNlQnV0dG9uXT1cImVtb2ppVXNlQnV0dG9uXCJcbiAgICAgICAgICA+PC9uZ3gtZW1vamk+XG4gICAgICAgIDwvZGl2PlxuXG4gICAgICAgIDxkaXYgY2xhc3M9XCJlbW9qaS1tYXJ0LW5vLXJlc3VsdHMtbGFiZWxcIj5cbiAgICAgICAgICB7eyBpMThuLm5vdGZvdW5kIH19XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9zZWN0aW9uPlxuXG4gICAgPG5nLXRlbXBsYXRlICNub3JtYWxSZW5kZXJUZW1wbGF0ZT5cbiAgICAgIDxuZ3gtZW1vamlcbiAgICAgICAgKm5nRm9yPVwibGV0IGVtb2ppIG9mIGVtb2ppc1RvRGlzcGxheTsgdHJhY2tCeTogdHJhY2tCeUlkXCJcbiAgICAgICAgW2Vtb2ppXT1cImVtb2ppXCJcbiAgICAgICAgW3NpemVdPVwiZW1vamlTaXplXCJcbiAgICAgICAgW3NraW5dPVwiZW1vamlTa2luXCJcbiAgICAgICAgW2lzTmF0aXZlXT1cImVtb2ppSXNOYXRpdmVcIlxuICAgICAgICBbc2V0XT1cImVtb2ppU2V0XCJcbiAgICAgICAgW3NoZWV0U2l6ZV09XCJlbW9qaVNoZWV0U2l6ZVwiXG4gICAgICAgIFtmb3JjZVNpemVdPVwiZW1vamlGb3JjZVNpemVcIlxuICAgICAgICBbdG9vbHRpcF09XCJlbW9qaVRvb2x0aXBcIlxuICAgICAgICBbYmFja2dyb3VuZEltYWdlRm5dPVwiZW1vamlCYWNrZ3JvdW5kSW1hZ2VGblwiXG4gICAgICAgIFtpbWFnZVVybEZuXT1cImVtb2ppSW1hZ2VVcmxGblwiXG4gICAgICAgIFtoaWRlT2Jzb2xldGVdPVwiaGlkZU9ic29sZXRlXCJcbiAgICAgICAgW3VzZUJ1dHRvbl09XCJlbW9qaVVzZUJ1dHRvblwiXG4gICAgICAgIChlbW9qaU92ZXJPdXRzaWRlQW5ndWxhcik9XCJlbW9qaU92ZXJPdXRzaWRlQW5ndWxhci5lbWl0KCRldmVudClcIlxuICAgICAgICAoZW1vamlMZWF2ZU91dHNpZGVBbmd1bGFyKT1cImVtb2ppTGVhdmVPdXRzaWRlQW5ndWxhci5lbWl0KCRldmVudClcIlxuICAgICAgICAoZW1vamlDbGlja091dHNpZGVBbmd1bGFyKT1cImVtb2ppQ2xpY2tPdXRzaWRlQW5ndWxhci5lbWl0KCRldmVudClcIlxuICAgICAgPjwvbmd4LWVtb2ppPlxuICAgIDwvbmctdGVtcGxhdGU+XG4gIGAsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBwcmVzZXJ2ZVdoaXRlc3BhY2VzOiBmYWxzZSxcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgRW1vamlDb21wb25lbnRdLFxufSlcbmV4cG9ydCBjbGFzcyBDYXRlZ29yeUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uQ2hhbmdlcywgT25Jbml0LCBBZnRlclZpZXdJbml0IHtcbiAgQElucHV0KCkgZW1vamlzOiBhbnlbXSB8IG51bGwgPSBudWxsO1xuICBASW5wdXQoKSBoYXNTdGlja3lQb3NpdGlvbiA9IHRydWU7XG4gIEBJbnB1dCgpIG5hbWUgPSAnJztcbiAgQElucHV0KCkgcGVyTGluZSA9IDk7XG4gIEBJbnB1dCgpIHRvdGFsRnJlcXVlbnRMaW5lcyA9IDQ7XG4gIEBJbnB1dCgpIHJlY2VudDogc3RyaW5nW10gPSBbXTtcbiAgQElucHV0KCkgY3VzdG9tOiBhbnlbXSA9IFtdO1xuICBASW5wdXQoKSBpMThuOiBhbnk7XG4gIEBJbnB1dCgpIGlkOiBhbnk7XG4gIEBJbnB1dCgpIGhpZGVPYnNvbGV0ZSA9IHRydWU7XG4gIEBJbnB1dCgpIG5vdEZvdW5kRW1vamk/OiBzdHJpbmc7XG4gIEBJbnB1dCgpIHZpcnR1YWxpemUgPSBmYWxzZTtcbiAgQElucHV0KCkgdmlydHVhbGl6ZU9mZnNldCA9IDA7XG4gIEBJbnB1dCgpIGVtb2ppSXNOYXRpdmU/OiBFbW9qaVsnaXNOYXRpdmUnXTtcbiAgQElucHV0KCkgZW1vamlTa2luITogRW1vamlbJ3NraW4nXTtcbiAgQElucHV0KCkgZW1vamlTaXplITogRW1vamlbJ3NpemUnXTtcbiAgQElucHV0KCkgZW1vamlTZXQhOiBFbW9qaVsnc2V0J107XG4gIEBJbnB1dCgpIGVtb2ppU2hlZXRTaXplITogRW1vamlbJ3NoZWV0U2l6ZSddO1xuICBASW5wdXQoKSBlbW9qaUZvcmNlU2l6ZSE6IEVtb2ppWydmb3JjZVNpemUnXTtcbiAgQElucHV0KCkgZW1vamlUb29sdGlwITogRW1vamlbJ3Rvb2x0aXAnXTtcbiAgQElucHV0KCkgZW1vamlCYWNrZ3JvdW5kSW1hZ2VGbj86IEVtb2ppWydiYWNrZ3JvdW5kSW1hZ2VGbiddO1xuICBASW5wdXQoKSBlbW9qaUltYWdlVXJsRm4/OiBFbW9qaVsnaW1hZ2VVcmxGbiddO1xuICBASW5wdXQoKSBlbW9qaVVzZUJ1dHRvbj86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIE5vdGU6IHRoZSBzdWZmaXggaXMgYWRkZWQgZXhwbGljaXRseSBzbyB3ZSBrbm93IHRoZSBldmVudCBpcyBkaXNwYXRjaGVkIG91dHNpZGUgb2YgdGhlIEFuZ3VsYXIgem9uZS5cbiAgICovXG4gIEBPdXRwdXQoKSBlbW9qaU92ZXJPdXRzaWRlQW5ndWxhcjogRW1vamlbJ2Vtb2ppT3ZlciddID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgZW1vamlMZWF2ZU91dHNpZGVBbmd1bGFyOiBFbW9qaVsnZW1vamlMZWF2ZSddID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgZW1vamlDbGlja091dHNpZGVBbmd1bGFyOiBFbW9qaVsnZW1vamlDbGljayddID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gIEBWaWV3Q2hpbGQoJ2NvbnRhaW5lcicsIHsgc3RhdGljOiB0cnVlIH0pIGNvbnRhaW5lciE6IEVsZW1lbnRSZWY7XG4gIEBWaWV3Q2hpbGQoJ2xhYmVsJywgeyBzdGF0aWM6IHRydWUgfSkgbGFiZWwhOiBFbGVtZW50UmVmO1xuICBjb250YWluZXJTdHlsZXM6IGFueSA9IHt9O1xuICBlbW9qaXNUb0Rpc3BsYXk6IGFueVtdID0gW107XG4gIHByaXZhdGUgZmlsdGVyZWRFbW9qaXNTdWJqZWN0ID0gbmV3IFN1YmplY3Q8YW55W10gfCBudWxsIHwgdW5kZWZpbmVkPigpO1xuICBmaWx0ZXJlZEVtb2ppcyQ6IE9ic2VydmFibGU8YW55W10gfCBudWxsIHwgdW5kZWZpbmVkPiA9IHRoaXMuZmlsdGVyZWRFbW9qaXNTdWJqZWN0LmFzT2JzZXJ2YWJsZSgpO1xuICBsYWJlbFN0eWxlczogYW55ID0ge307XG4gIGxhYmVsU3BhblN0eWxlczogYW55ID0ge307XG4gIG1hcmdpbiA9IDA7XG4gIG1pbk1hcmdpbiA9IDA7XG4gIG1heE1hcmdpbiA9IDA7XG4gIHRvcCA9IDA7XG4gIHJvd3MgPSAwO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyByZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIHByaXZhdGUgZW1vamlTZXJ2aWNlOiBFbW9qaVNlcnZpY2UsXG4gICAgcHJpdmF0ZSBmcmVxdWVudGx5OiBFbW9qaUZyZXF1ZW50bHlTZXJ2aWNlLFxuICApIHt9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy51cGRhdGVSZWNlbnRFbW9qaXMoKTtcbiAgICB0aGlzLmVtb2ppc1RvRGlzcGxheSA9IHRoaXMuZmlsdGVyRW1vamlzKCk7XG5cbiAgICBpZiAodGhpcy5ub0Vtb2ppVG9EaXNwbGF5KSB7XG4gICAgICB0aGlzLmNvbnRhaW5lclN0eWxlcyA9IHsgZGlzcGxheTogJ25vbmUnIH07XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmhhc1N0aWNreVBvc2l0aW9uKSB7XG4gICAgICB0aGlzLmxhYmVsU3R5bGVzID0geyBoZWlnaHQ6IDI4IH07XG4gICAgICAvLyB0aGlzLmxhYmVsU3BhblN0eWxlcyA9IHsgcG9zaXRpb246ICdhYnNvbHV0ZScgfTtcbiAgICB9XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKSB7XG4gICAgaWYgKGNoYW5nZXMuZW1vamlzPy5jdXJyZW50VmFsdWU/Lmxlbmd0aCAhPT0gY2hhbmdlcy5lbW9qaXM/LnByZXZpb3VzVmFsdWU/Lmxlbmd0aCkge1xuICAgICAgdGhpcy5lbW9qaXNUb0Rpc3BsYXkgPSB0aGlzLmZpbHRlckVtb2ppcygpO1xuICAgICAgdGhpcy5uZ0FmdGVyVmlld0luaXQoKTtcbiAgICB9XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgaWYgKCF0aGlzLnZpcnR1YWxpemUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB7IHdpZHRoIH0gPSB0aGlzLmNvbnRhaW5lci5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgY29uc3QgcGVyUm93ID0gTWF0aC5mbG9vcih3aWR0aCAvICh0aGlzLmVtb2ppU2l6ZSArIDEyKSk7XG4gICAgdGhpcy5yb3dzID0gTWF0aC5jZWlsKHRoaXMuZW1vamlzVG9EaXNwbGF5Lmxlbmd0aCAvIHBlclJvdyk7XG5cbiAgICB0aGlzLmNvbnRhaW5lclN0eWxlcyA9IHtcbiAgICAgIC4uLnRoaXMuY29udGFpbmVyU3R5bGVzLFxuICAgICAgbWluSGVpZ2h0OiBgJHt0aGlzLnJvd3MgKiAodGhpcy5lbW9qaVNpemUgKyAxMikgKyAyOH1weGAsXG4gICAgfTtcblxuICAgIHRoaXMucmVmLmRldGVjdENoYW5nZXMoKTtcblxuICAgIHRoaXMuaGFuZGxlU2Nyb2xsKHRoaXMuY29udGFpbmVyLm5hdGl2ZUVsZW1lbnQucGFyZW50Tm9kZS5wYXJlbnROb2RlLnNjcm9sbFRvcCk7XG4gIH1cblxuICBnZXQgbm9FbW9qaVRvRGlzcGxheSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5lbW9qaXNUb0Rpc3BsYXkubGVuZ3RoID09PSAwO1xuICB9XG5cbiAgbWVtb2l6ZVNpemUoKSB7XG4gICAgY29uc3QgcGFyZW50ID0gdGhpcy5jb250YWluZXIubmF0aXZlRWxlbWVudC5wYXJlbnROb2RlLnBhcmVudE5vZGU7XG4gICAgY29uc3QgeyB0b3AsIGhlaWdodCB9ID0gdGhpcy5jb250YWluZXIubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBwYXJlbnRUb3AgPSBwYXJlbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wO1xuICAgIGNvbnN0IGxhYmVsSGVpZ2h0ID0gdGhpcy5sYWJlbC5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodDtcblxuICAgIHRoaXMudG9wID0gdG9wIC0gcGFyZW50VG9wICsgcGFyZW50LnNjcm9sbFRvcDtcblxuICAgIGlmIChoZWlnaHQgPT09IDApIHtcbiAgICAgIHRoaXMubWF4TWFyZ2luID0gMDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5tYXhNYXJnaW4gPSBoZWlnaHQgLSBsYWJlbEhlaWdodDtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVTY3JvbGwoc2Nyb2xsVG9wOiBudW1iZXIpOiBib29sZWFuIHtcbiAgICBsZXQgbWFyZ2luID0gc2Nyb2xsVG9wIC0gdGhpcy50b3A7XG4gICAgbWFyZ2luID0gbWFyZ2luIDwgdGhpcy5taW5NYXJnaW4gPyB0aGlzLm1pbk1hcmdpbiA6IG1hcmdpbjtcbiAgICBtYXJnaW4gPSBtYXJnaW4gPiB0aGlzLm1heE1hcmdpbiA/IHRoaXMubWF4TWFyZ2luIDogbWFyZ2luO1xuXG4gICAgaWYgKHRoaXMudmlydHVhbGl6ZSkge1xuICAgICAgY29uc3QgeyB0b3AsIGhlaWdodCB9ID0gdGhpcy5jb250YWluZXIubmF0aXZlRWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgIGNvbnN0IHBhcmVudEhlaWdodCA9IHRoaXMuY29udGFpbmVyLm5hdGl2ZUVsZW1lbnQucGFyZW50Tm9kZS5wYXJlbnROb2RlLmNsaWVudEhlaWdodDtcblxuICAgICAgaWYgKFxuICAgICAgICBwYXJlbnRIZWlnaHQgKyAocGFyZW50SGVpZ2h0ICsgdGhpcy52aXJ0dWFsaXplT2Zmc2V0KSA+PSB0b3AgJiZcbiAgICAgICAgLWhlaWdodCAtIChwYXJlbnRIZWlnaHQgKyB0aGlzLnZpcnR1YWxpemVPZmZzZXQpIDw9IHRvcFxuICAgICAgKSB7XG4gICAgICAgIHRoaXMuZmlsdGVyZWRFbW9qaXNTdWJqZWN0Lm5leHQodGhpcy5lbW9qaXNUb0Rpc3BsYXkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5maWx0ZXJlZEVtb2ppc1N1YmplY3QubmV4dChbXSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG1hcmdpbiA9PT0gdGhpcy5tYXJnaW4pIHtcbiAgICAgIHRoaXMucmVmLmRldGVjdENoYW5nZXMoKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuaGFzU3RpY2t5UG9zaXRpb24pIHtcbiAgICAgIHRoaXMubGFiZWwubmF0aXZlRWxlbWVudC5zdHlsZS50b3AgPSBgJHttYXJnaW59cHhgO1xuICAgIH1cblxuICAgIHRoaXMubWFyZ2luID0gbWFyZ2luO1xuICAgIHRoaXMucmVmLmRldGVjdENoYW5nZXMoKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHVwZGF0ZVJlY2VudEVtb2ppcygpIHtcbiAgICBpZiAodGhpcy5uYW1lICE9PSAnUmVjZW50Jykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBmcmVxdWVudGx5VXNlZCA9IHRoaXMucmVjZW50IHx8IHRoaXMuZnJlcXVlbnRseS5nZXQodGhpcy5wZXJMaW5lLCB0aGlzLnRvdGFsRnJlcXVlbnRMaW5lcyk7XG4gICAgaWYgKCFmcmVxdWVudGx5VXNlZCB8fCAhZnJlcXVlbnRseVVzZWQubGVuZ3RoKSB7XG4gICAgICBmcmVxdWVudGx5VXNlZCA9IHRoaXMuZnJlcXVlbnRseS5nZXQodGhpcy5wZXJMaW5lLCB0aGlzLnRvdGFsRnJlcXVlbnRMaW5lcyk7XG4gICAgfVxuICAgIGlmICghZnJlcXVlbnRseVVzZWQubGVuZ3RoKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuZW1vamlzID0gZnJlcXVlbnRseVVzZWRcbiAgICAgIC5tYXAoaWQgPT4ge1xuICAgICAgICBjb25zdCBlbW9qaSA9IHRoaXMuY3VzdG9tLmZpbHRlcigoZTogYW55KSA9PiBlLmlkID09PSBpZClbMF07XG4gICAgICAgIGlmIChlbW9qaSkge1xuICAgICAgICAgIHJldHVybiBlbW9qaTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBpZDtcbiAgICAgIH0pXG4gICAgICAuZmlsdGVyKGlkID0+ICEhdGhpcy5lbW9qaVNlcnZpY2UuZ2V0RGF0YShpZCkpO1xuICB9XG5cbiAgdXBkYXRlRGlzcGxheShkaXNwbGF5OiAnbm9uZScgfCAnYmxvY2snKSB7XG4gICAgdGhpcy5jb250YWluZXJTdHlsZXMuZGlzcGxheSA9IGRpc3BsYXk7XG4gICAgdGhpcy51cGRhdGVSZWNlbnRFbW9qaXMoKTtcbiAgICB0aGlzLnJlZi5kZXRlY3RDaGFuZ2VzKCk7XG4gIH1cblxuICB0cmFja0J5SWQoaW5kZXg6IG51bWJlciwgaXRlbTogYW55KSB7XG4gICAgcmV0dXJuIGl0ZW07XG4gIH1cblxuICBwcml2YXRlIGZpbHRlckVtb2ppcygpOiBhbnlbXSB7XG4gICAgY29uc3QgbmV3RW1vamlzID0gW107XG4gICAgZm9yIChjb25zdCBlbW9qaSBvZiB0aGlzLmVtb2ppcyB8fCBbXSkge1xuICAgICAgaWYgKCFlbW9qaSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLmVtb2ppU2VydmljZS5nZXREYXRhKGVtb2ppKTtcbiAgICAgIGlmICghZGF0YSB8fCAoZGF0YS5vYnNvbGV0ZWRCeSAmJiB0aGlzLmhpZGVPYnNvbGV0ZSkgfHwgKCFkYXRhLnVuaWZpZWQgJiYgIWRhdGEuY3VzdG9tKSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIG5ld0Vtb2ppcy5wdXNoKGVtb2ppKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ld0Vtb2ppcztcbiAgfVxufVxuIl19