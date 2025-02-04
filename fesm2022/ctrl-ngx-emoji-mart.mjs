import * as i2 from '@angular/common';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import * as i0 from '@angular/core';
import { EventEmitter, Component, ChangeDetectionStrategy, Input, Output, PLATFORM_ID, Injectable, Inject, ViewChild, ViewChildren, NgModule } from '@angular/core';
import * as i1 from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { EmojiComponent, categories as categories$1 } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { Subject, fromEvent } from 'rxjs';
import * as i2$1 from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';

class AnchorsComponent {
    categories = [];
    color;
    selected;
    i18n;
    icons = {};
    anchorClick = new EventEmitter();
    trackByFn(idx, cat) {
        return cat.id;
    }
    handleClick($event, index) {
        this.anchorClick.emit({
            category: this.categories[index],
            index,
        });
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.5", ngImport: i0, type: AnchorsComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.5", type: AnchorsComponent, isStandalone: true, selector: "emoji-mart-anchors", inputs: { categories: "categories", color: "color", selected: "selected", i18n: "i18n", icons: "icons" }, outputs: { anchorClick: "anchorClick" }, ngImport: i0, template: `
    <div class="emoji-mart-anchors">
      <ng-template
        ngFor
        let-category
        [ngForOf]="categories"
        let-idx="index"
        [ngForTrackBy]="trackByFn"
      >
        <span
          *ngIf="category.anchor !== false"
          [attr.title]="i18n.categories[category.id]"
          (click)="this.handleClick($event, idx)"
          class="emoji-mart-anchor"
          [class.emoji-mart-anchor-selected]="category.name === selected"
          [style.color]="category.name === selected ? color : null"
        >
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
              <path [attr.d]="icons[category.id]" />
            </svg>
          </div>
          <span class="emoji-mart-anchor-bar" [style.background-color]="color"></span>
        </span>
      </ng-template>
    </div>
  `, isInline: true, dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i2.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.5", ngImport: i0, type: AnchorsComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'emoji-mart-anchors',
                    template: `
    <div class="emoji-mart-anchors">
      <ng-template
        ngFor
        let-category
        [ngForOf]="categories"
        let-idx="index"
        [ngForTrackBy]="trackByFn"
      >
        <span
          *ngIf="category.anchor !== false"
          [attr.title]="i18n.categories[category.id]"
          (click)="this.handleClick($event, idx)"
          class="emoji-mart-anchor"
          [class.emoji-mart-anchor-selected]="category.name === selected"
          [style.color]="category.name === selected ? color : null"
        >
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
              <path [attr.d]="icons[category.id]" />
            </svg>
          </div>
          <span class="emoji-mart-anchor-bar" [style.background-color]="color"></span>
        </span>
      </ng-template>
    </div>
  `,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    preserveWhitespaces: false,
                    standalone: true,
                    imports: [CommonModule],
                }]
        }], propDecorators: { categories: [{
                type: Input
            }], color: [{
                type: Input
            }], selected: [{
                type: Input
            }], i18n: [{
                type: Input
            }], icons: [{
                type: Input
            }], anchorClick: [{
                type: Output
            }] } });

class EmojiFrequentlyService {
    platformId;
    NAMESPACE = 'emoji-mart';
    frequently = null;
    defaults = {};
    initialized = false;
    DEFAULTS = [
        '+1',
        'grinning',
        'kissing_heart',
        'heart_eyes',
        'laughing',
        'stuck_out_tongue_winking_eye',
        'sweat_smile',
        'joy',
        'scream',
        'disappointed',
        'unamused',
        'weary',
        'sob',
        'sunglasses',
        'heart',
        'poop',
    ];
    constructor(platformId) {
        this.platformId = platformId;
    }
    init() {
        this.frequently = JSON.parse((isPlatformBrowser(this.platformId) &&
            localStorage.getItem(`${this.NAMESPACE}.frequently`)) ||
            'null');
        this.initialized = true;
    }
    add(emoji) {
        if (!this.initialized) {
            this.init();
        }
        if (!this.frequently) {
            this.frequently = this.defaults;
        }
        if (!this.frequently[emoji.id]) {
            this.frequently[emoji.id] = 0;
        }
        this.frequently[emoji.id] += 1;
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem(`${this.NAMESPACE}.last`, emoji.id);
            localStorage.setItem(`${this.NAMESPACE}.frequently`, JSON.stringify(this.frequently));
        }
    }
    get(perLine, totalLines) {
        if (!this.initialized) {
            this.init();
        }
        if (this.frequently === null) {
            this.defaults = {};
            const result = [];
            for (let i = 0; i < perLine; i++) {
                this.defaults[this.DEFAULTS[i]] = perLine - i;
                result.push(this.DEFAULTS[i]);
            }
            return result;
        }
        const quantity = perLine * totalLines;
        const frequentlyKeys = Object.keys(this.frequently);
        const sorted = frequentlyKeys
            .sort((a, b) => this.frequently[a] - this.frequently[b])
            .reverse();
        const sliced = sorted.slice(0, quantity);
        const last = isPlatformBrowser(this.platformId) && localStorage.getItem(`${this.NAMESPACE}.last`);
        if (last && !sliced.includes(last)) {
            sliced.pop();
            sliced.push(last);
        }
        return sliced;
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.5", ngImport: i0, type: EmojiFrequentlyService, deps: [{ token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.0.5", ngImport: i0, type: EmojiFrequentlyService, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.5", ngImport: i0, type: EmojiFrequentlyService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }]; } });

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
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.5", ngImport: i0, type: CategoryComponent, deps: [{ token: i0.ChangeDetectorRef }, { token: i1.EmojiService }, { token: EmojiFrequentlyService }], target: i0.ɵɵFactoryTarget.Component });
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
  `, isInline: true, dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i2.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i2.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "pipe", type: i2.AsyncPipe, name: "async" }, { kind: "component", type: EmojiComponent, selector: "ngx-emoji", inputs: ["skin", "set", "sheetSize", "isNative", "forceSize", "tooltip", "size", "emoji", "fallback", "hideObsolete", "sheetRows", "sheetColumns", "useButton", "backgroundImageFn", "imageUrlFn"], outputs: ["emojiOver", "emojiOverOutsideAngular", "emojiLeave", "emojiLeaveOutsideAngular", "emojiClick", "emojiClickOutsideAngular"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
}
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
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }, { type: i1.EmojiService }, { type: EmojiFrequentlyService }]; }, propDecorators: { emojis: [{
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

function uniq(arr) {
    return arr.reduce((acc, item) => {
        if (!acc.includes(item)) {
            acc.push(item);
        }
        return acc;
    }, []);
}
function intersect(a, b) {
    const uniqA = uniq(a);
    const uniqB = uniq(b);
    return uniqA.filter((item) => uniqB.indexOf(item) >= 0);
}
// https://github.com/sonicdoe/measure-scrollbar
function measureScrollbar() {
    if (typeof document === 'undefined') {
        return 0;
    }
    const div = document.createElement('div');
    div.style.width = '100px';
    div.style.height = '100px';
    div.style.overflow = 'scroll';
    div.style.position = 'absolute';
    div.style.top = '-9999px';
    document.body.appendChild(div);
    const scrollbarWidth = div.offsetWidth - div.clientWidth;
    document.body.removeChild(div);
    return scrollbarWidth;
}

class EmojiSearch {
    emojiService;
    originalPool = {};
    index = {};
    emojisList = {};
    emoticonsList = {};
    emojiSearch = {};
    constructor(emojiService) {
        this.emojiService = emojiService;
        for (const emojiData of this.emojiService.emojis) {
            const { shortNames, emoticons } = emojiData;
            const id = shortNames[0];
            for (const emoticon of emoticons) {
                if (this.emoticonsList[emoticon]) {
                    continue;
                }
                this.emoticonsList[emoticon] = id;
            }
            this.emojisList[id] = this.emojiService.getSanitizedData(id);
            this.originalPool[id] = emojiData;
        }
    }
    addCustomToPool(custom, pool) {
        for (const emoji of custom) {
            const emojiId = emoji.id || emoji.shortNames[0];
            if (emojiId && !pool[emojiId]) {
                pool[emojiId] = this.emojiService.getData(emoji);
                this.emojisList[emojiId] = this.emojiService.getSanitizedData(emoji);
            }
        }
    }
    search(value, emojisToShowFilter, maxResults = 75, include = [], exclude = [], custom = []) {
        this.addCustomToPool(custom, this.originalPool);
        let results;
        let pool = this.originalPool;
        if (value.length) {
            if (value === '-' || value === '-1') {
                return [this.emojisList['-1']];
            }
            if (value === '+' || value === '+1') {
                return [this.emojisList['+1']];
            }
            let values = value.toLowerCase().split(/[\s|,|\-|_]+/);
            let allResults = [];
            if (values.length > 2) {
                values = [values[0], values[1]];
            }
            if (include.length || exclude.length) {
                pool = {};
                for (const category of categories$1 || []) {
                    const isIncluded = include && include.length ? include.indexOf(category.id) > -1 : true;
                    const isExcluded = exclude && exclude.length ? exclude.indexOf(category.id) > -1 : false;
                    if (!isIncluded || isExcluded) {
                        continue;
                    }
                    for (const emojiId of category.emojis || []) {
                        // Need to make sure that pool gets keyed
                        // with the correct id, which is why we call emojiService.getData below
                        const emoji = this.emojiService.getData(emojiId);
                        pool[emoji?.id ?? ''] = emoji;
                    }
                }
                if (custom.length) {
                    const customIsIncluded = include && include.length ? include.indexOf('custom') > -1 : true;
                    const customIsExcluded = exclude && exclude.length ? exclude.indexOf('custom') > -1 : false;
                    if (customIsIncluded && !customIsExcluded) {
                        this.addCustomToPool(custom, pool);
                    }
                }
            }
            allResults = values
                .map(v => {
                let aPool = pool;
                let aIndex = this.index;
                let length = 0;
                for (let charIndex = 0; charIndex < v.length; charIndex++) {
                    const char = v[charIndex];
                    length++;
                    if (!aIndex[char]) {
                        aIndex[char] = {};
                    }
                    aIndex = aIndex[char];
                    if (!aIndex.results) {
                        const scores = {};
                        aIndex.results = [];
                        aIndex.pool = {};
                        for (const id of Object.keys(aPool)) {
                            const emoji = aPool[id];
                            if (!this.emojiSearch[id]) {
                                this.emojiSearch[id] = this.buildSearch(emoji.short_names, emoji.name, emoji.id, emoji.keywords, emoji.emoticons);
                            }
                            const query = this.emojiSearch[id];
                            const sub = v.substr(0, length);
                            const subIndex = query.indexOf(sub);
                            if (subIndex !== -1) {
                                let score = subIndex + 1;
                                if (sub === id) {
                                    score = 0;
                                }
                                aIndex.results.push(this.emojisList[id]);
                                aIndex.pool[id] = emoji;
                                scores[id] = score;
                            }
                        }
                        aIndex.results.sort((a, b) => {
                            const aScore = scores[a.id];
                            const bScore = scores[b.id];
                            return aScore - bScore;
                        });
                    }
                    aPool = aIndex.pool;
                }
                return aIndex.results;
            })
                .filter(a => a);
            if (allResults.length > 1) {
                results = intersect.apply(null, allResults);
            }
            else if (allResults.length) {
                results = allResults[0];
            }
            else {
                results = [];
            }
        }
        if (results) {
            if (emojisToShowFilter) {
                results = results.filter((result) => {
                    if (result && result.id) {
                        return emojisToShowFilter(this.emojiService.names[result.id]);
                    }
                    return false;
                });
            }
            if (results && results.length > maxResults) {
                results = results.slice(0, maxResults);
            }
        }
        return results || null;
    }
    buildSearch(shortNames, name, id, keywords, emoticons) {
        const search = [];
        const addToSearch = (strings, split) => {
            if (!strings) {
                return;
            }
            const arr = Array.isArray(strings) ? strings : [strings];
            for (const str of arr) {
                const substrings = split ? str.split(/[-|_|\s]+/) : [str];
                for (let s of substrings) {
                    s = s.toLowerCase();
                    if (!search.includes(s)) {
                        search.push(s);
                    }
                }
            }
        };
        addToSearch(shortNames, true);
        addToSearch(name, true);
        addToSearch(id, true);
        addToSearch(keywords, true);
        addToSearch(emoticons, false);
        return search.join(',');
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.5", ngImport: i0, type: EmojiSearch, deps: [{ token: i1.EmojiService }], target: i0.ɵɵFactoryTarget.Injectable });
    static ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "16.0.5", ngImport: i0, type: EmojiSearch, providedIn: 'root' });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.5", ngImport: i0, type: EmojiSearch, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i1.EmojiService }]; } });

class SkinComponent {
    /** currently selected skin */
    skin;
    i18n;
    changeSkin = new EventEmitter();
    opened = false;
    skinTones = [1, 2, 3, 4, 5, 6];
    toggleOpen() {
        this.opened = !this.opened;
    }
    isSelected(skinTone) {
        return skinTone === this.skin;
    }
    isVisible(skinTone) {
        return this.opened || this.isSelected(skinTone);
    }
    pressed(skinTone) {
        return this.opened ? !!this.isSelected(skinTone) : '';
    }
    tabIndex(skinTone) {
        return this.isVisible(skinTone) ? '0' : '';
    }
    expanded(skinTone) {
        return this.isSelected(skinTone) ? this.opened : '';
    }
    handleClick(skin) {
        if (!this.opened) {
            this.opened = true;
            return;
        }
        this.opened = false;
        if (skin !== this.skin) {
            this.changeSkin.emit(skin);
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.5", ngImport: i0, type: SkinComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.5", type: SkinComponent, isStandalone: true, selector: "emoji-skins", inputs: { skin: "skin", i18n: "i18n" }, outputs: { changeSkin: "changeSkin" }, ngImport: i0, template: `
    <section class="emoji-mart-skin-swatches" [class.opened]="opened">
      <span
        *ngFor="let skinTone of skinTones"
        class="emoji-mart-skin-swatch"
        [class.selected]="skinTone === skin"
      >
        <span
          (click)="handleClick(skinTone)"
          (keyup.enter)="handleClick(skinTone)"
          (keyup.space)="handleClick(skinTone)"
          class="emoji-mart-skin emoji-mart-skin-tone-{{ skinTone }}"
          role="button"
          [tabIndex]="tabIndex(skinTone)"
          [attr.aria-hidden]="!isVisible(skinTone)"
          [attr.aria-pressed]="pressed(skinTone)"
          [attr.aria-haspopup]="!!isSelected(skinTone)"
          [attr.aria-expanded]="expanded(skinTone)"
          [attr.aria-label]="i18n.skintones[skinTone]"
          [attr.title]="i18n.skintones[skinTone]"
        ></span>
      </span>
    </section>
  `, isInline: true, dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i2.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.5", ngImport: i0, type: SkinComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'emoji-skins',
                    template: `
    <section class="emoji-mart-skin-swatches" [class.opened]="opened">
      <span
        *ngFor="let skinTone of skinTones"
        class="emoji-mart-skin-swatch"
        [class.selected]="skinTone === skin"
      >
        <span
          (click)="handleClick(skinTone)"
          (keyup.enter)="handleClick(skinTone)"
          (keyup.space)="handleClick(skinTone)"
          class="emoji-mart-skin emoji-mart-skin-tone-{{ skinTone }}"
          role="button"
          [tabIndex]="tabIndex(skinTone)"
          [attr.aria-hidden]="!isVisible(skinTone)"
          [attr.aria-pressed]="pressed(skinTone)"
          [attr.aria-haspopup]="!!isSelected(skinTone)"
          [attr.aria-expanded]="expanded(skinTone)"
          [attr.aria-label]="i18n.skintones[skinTone]"
          [attr.title]="i18n.skintones[skinTone]"
        ></span>
      </span>
    </section>
  `,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    preserveWhitespaces: false,
                    standalone: true,
                    imports: [CommonModule],
                }]
        }], propDecorators: { skin: [{
                type: Input
            }], i18n: [{
                type: Input
            }], changeSkin: [{
                type: Output
            }] } });

class PreviewComponent {
    ref;
    emojiService;
    title;
    emoji;
    idleEmoji;
    i18n;
    emojiIsNative;
    emojiSkin;
    emojiSize;
    emojiSet;
    emojiSheetSize;
    emojiBackgroundImageFn;
    emojiImageUrlFn;
    skinChange = new EventEmitter();
    emojiData = {};
    listedEmoticons;
    constructor(ref, emojiService) {
        this.ref = ref;
        this.emojiService = emojiService;
    }
    ngOnChanges() {
        if (!this.emoji) {
            return;
        }
        this.emojiData = this.emojiService.getData(this.emoji, this.emojiSkin, this.emojiSet);
        const knownEmoticons = [];
        const listedEmoticons = [];
        const emoitcons = this.emojiData.emoticons || [];
        emoitcons.forEach((emoticon) => {
            if (knownEmoticons.indexOf(emoticon.toLowerCase()) >= 0) {
                return;
            }
            knownEmoticons.push(emoticon.toLowerCase());
            listedEmoticons.push(emoticon);
        });
        this.listedEmoticons = listedEmoticons;
        this.ref?.detectChanges();
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.5", ngImport: i0, type: PreviewComponent, deps: [{ token: i0.ChangeDetectorRef }, { token: i1.EmojiService }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.5", type: PreviewComponent, isStandalone: true, selector: "emoji-preview", inputs: { title: "title", emoji: "emoji", idleEmoji: "idleEmoji", i18n: "i18n", emojiIsNative: "emojiIsNative", emojiSkin: "emojiSkin", emojiSize: "emojiSize", emojiSet: "emojiSet", emojiSheetSize: "emojiSheetSize", emojiBackgroundImageFn: "emojiBackgroundImageFn", emojiImageUrlFn: "emojiImageUrlFn" }, outputs: { skinChange: "skinChange" }, usesOnChanges: true, ngImport: i0, template: `
    <div class="emoji-mart-preview" *ngIf="emoji && emojiData">
      <div class="emoji-mart-preview-emoji">
        <ngx-emoji
          [emoji]="emoji"
          [size]="38"
          [isNative]="emojiIsNative"
          [skin]="emojiSkin"
          [size]="emojiSize"
          [set]="emojiSet"
          [sheetSize]="emojiSheetSize"
          [backgroundImageFn]="emojiBackgroundImageFn"
          [imageUrlFn]="emojiImageUrlFn"
        ></ngx-emoji>
      </div>

      <div class="emoji-mart-preview-data">
        <div class="emoji-mart-preview-name">{{ emojiData.name }}</div>
        <div class="emoji-mart-preview-shortname">
          <span
            class="emoji-mart-preview-shortname"
            *ngFor="let short_name of emojiData.shortNames"
          >
            :{{ short_name }}:
          </span>
        </div>
        <div class="emoji-mart-preview-emoticons">
          <span class="emoji-mart-preview-emoticon" *ngFor="let emoticon of listedEmoticons">
            {{ emoticon }}
          </span>
        </div>
      </div>
    </div>

    <div class="emoji-mart-preview" [hidden]="emoji">
      <div class="emoji-mart-preview-emoji">
        <ngx-emoji
          *ngIf="idleEmoji && idleEmoji.length"
          [isNative]="emojiIsNative"
          [skin]="emojiSkin"
          [set]="emojiSet"
          [emoji]="idleEmoji"
          [backgroundImageFn]="emojiBackgroundImageFn"
          [size]="38"
          [imageUrlFn]="emojiImageUrlFn"
        ></ngx-emoji>
      </div>

      <div class="emoji-mart-preview-data">
        <span class="emoji-mart-title-label">{{ title }}</span>
      </div>

      <div class="emoji-mart-preview-skins">
        <emoji-skins
          [skin]="emojiSkin"
          (changeSkin)="skinChange.emit($event)"
          [i18n]="i18n"
        ></emoji-skins>
      </div>
    </div>
  `, isInline: true, dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i2.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "component", type: EmojiComponent, selector: "ngx-emoji", inputs: ["skin", "set", "sheetSize", "isNative", "forceSize", "tooltip", "size", "emoji", "fallback", "hideObsolete", "sheetRows", "sheetColumns", "useButton", "backgroundImageFn", "imageUrlFn"], outputs: ["emojiOver", "emojiOverOutsideAngular", "emojiLeave", "emojiLeaveOutsideAngular", "emojiClick", "emojiClickOutsideAngular"] }, { kind: "component", type: SkinComponent, selector: "emoji-skins", inputs: ["skin", "i18n"], outputs: ["changeSkin"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.5", ngImport: i0, type: PreviewComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'emoji-preview',
                    template: `
    <div class="emoji-mart-preview" *ngIf="emoji && emojiData">
      <div class="emoji-mart-preview-emoji">
        <ngx-emoji
          [emoji]="emoji"
          [size]="38"
          [isNative]="emojiIsNative"
          [skin]="emojiSkin"
          [size]="emojiSize"
          [set]="emojiSet"
          [sheetSize]="emojiSheetSize"
          [backgroundImageFn]="emojiBackgroundImageFn"
          [imageUrlFn]="emojiImageUrlFn"
        ></ngx-emoji>
      </div>

      <div class="emoji-mart-preview-data">
        <div class="emoji-mart-preview-name">{{ emojiData.name }}</div>
        <div class="emoji-mart-preview-shortname">
          <span
            class="emoji-mart-preview-shortname"
            *ngFor="let short_name of emojiData.shortNames"
          >
            :{{ short_name }}:
          </span>
        </div>
        <div class="emoji-mart-preview-emoticons">
          <span class="emoji-mart-preview-emoticon" *ngFor="let emoticon of listedEmoticons">
            {{ emoticon }}
          </span>
        </div>
      </div>
    </div>

    <div class="emoji-mart-preview" [hidden]="emoji">
      <div class="emoji-mart-preview-emoji">
        <ngx-emoji
          *ngIf="idleEmoji && idleEmoji.length"
          [isNative]="emojiIsNative"
          [skin]="emojiSkin"
          [set]="emojiSet"
          [emoji]="idleEmoji"
          [backgroundImageFn]="emojiBackgroundImageFn"
          [size]="38"
          [imageUrlFn]="emojiImageUrlFn"
        ></ngx-emoji>
      </div>

      <div class="emoji-mart-preview-data">
        <span class="emoji-mart-title-label">{{ title }}</span>
      </div>

      <div class="emoji-mart-preview-skins">
        <emoji-skins
          [skin]="emojiSkin"
          (changeSkin)="skinChange.emit($event)"
          [i18n]="i18n"
        ></emoji-skins>
      </div>
    </div>
  `,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    preserveWhitespaces: false,
                    standalone: true,
                    imports: [CommonModule, EmojiComponent, SkinComponent],
                }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }, { type: i1.EmojiService }]; }, propDecorators: { title: [{
                type: Input
            }], emoji: [{
                type: Input
            }], idleEmoji: [{
                type: Input
            }], i18n: [{
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
            }], emojiBackgroundImageFn: [{
                type: Input
            }], emojiImageUrlFn: [{
                type: Input
            }], skinChange: [{
                type: Output
            }] } });

let id = 0;
class SearchComponent {
    ngZone;
    emojiSearch;
    maxResults = 75;
    autoFocus = false;
    i18n;
    include = [];
    exclude = [];
    custom = [];
    icons;
    emojisToShowFilter;
    searchResults = new EventEmitter();
    enterKeyOutsideAngular = new EventEmitter();
    inputRef;
    isSearching = false;
    icon;
    query = '';
    inputId = `emoji-mart-search-${++id}`;
    destroy$ = new Subject();
    constructor(ngZone, emojiSearch) {
        this.ngZone = ngZone;
        this.emojiSearch = emojiSearch;
    }
    ngOnInit() {
        this.icon = this.icons.search;
        this.setupKeyupListener();
    }
    ngAfterViewInit() {
        if (this.autoFocus) {
            this.inputRef.nativeElement.focus();
        }
    }
    ngOnDestroy() {
        this.destroy$.next();
    }
    clear() {
        this.query = '';
        this.handleSearch('');
        this.inputRef.nativeElement.focus();
    }
    handleSearch(value) {
        if (value === '') {
            this.icon = this.icons.search;
            this.isSearching = false;
        }
        else {
            this.icon = this.icons.delete;
            this.isSearching = true;
        }
        const emojis = this.emojiSearch.search(this.query, this.emojisToShowFilter, this.maxResults, this.include, this.exclude, this.custom);
        this.searchResults.emit(emojis);
    }
    handleChange() {
        this.handleSearch(this.query);
    }
    setupKeyupListener() {
        this.ngZone.runOutsideAngular(() => fromEvent(this.inputRef.nativeElement, 'keyup')
            .pipe(takeUntil(this.destroy$))
            .subscribe($event => {
            if (!this.query || $event.key !== 'Enter') {
                return;
            }
            this.enterKeyOutsideAngular.emit($event);
            $event.preventDefault();
        }));
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.5", ngImport: i0, type: SearchComponent, deps: [{ token: i0.NgZone }, { token: EmojiSearch }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.5", type: SearchComponent, isStandalone: true, selector: "emoji-search", inputs: { maxResults: "maxResults", autoFocus: "autoFocus", i18n: "i18n", include: "include", exclude: "exclude", custom: "custom", icons: "icons", emojisToShowFilter: "emojisToShowFilter" }, outputs: { searchResults: "searchResults", enterKeyOutsideAngular: "enterKeyOutsideAngular" }, viewQueries: [{ propertyName: "inputRef", first: true, predicate: ["inputRef"], descendants: true, static: true }], ngImport: i0, template: `
    <div class="emoji-mart-search">
      <input
        [id]="inputId"
        #inputRef
        type="search"
        [placeholder]="i18n.search"
        [autofocus]="autoFocus"
        [(ngModel)]="query"
        (ngModelChange)="handleChange()"
      />
      <!--
      Use a <label> in addition to the placeholder for accessibility, but place it off-screen
      http://www.maxability.co.in/2016/01/placeholder-attribute-and-why-it-is-not-accessible/
      -->
      <label class="emoji-mart-sr-only" [htmlFor]="inputId">
        {{ i18n.search }}
      </label>
      <button
        type="button"
        class="emoji-mart-search-icon"
        (click)="clear()"
        (keyup.enter)="clear()"
        [disabled]="!isSearching"
        [attr.aria-label]="i18n.clear"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          width="13"
          height="13"
          opacity="0.5"
        >
          <path [attr.d]="icon" />
        </svg>
      </button>
    </div>
  `, isInline: true, dependencies: [{ kind: "ngmodule", type: FormsModule }, { kind: "directive", type: i2$1.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i2$1.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i2$1.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.5", ngImport: i0, type: SearchComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'emoji-search',
                    template: `
    <div class="emoji-mart-search">
      <input
        [id]="inputId"
        #inputRef
        type="search"
        [placeholder]="i18n.search"
        [autofocus]="autoFocus"
        [(ngModel)]="query"
        (ngModelChange)="handleChange()"
      />
      <!--
      Use a <label> in addition to the placeholder for accessibility, but place it off-screen
      http://www.maxability.co.in/2016/01/placeholder-attribute-and-why-it-is-not-accessible/
      -->
      <label class="emoji-mart-sr-only" [htmlFor]="inputId">
        {{ i18n.search }}
      </label>
      <button
        type="button"
        class="emoji-mart-search-icon"
        (click)="clear()"
        (keyup.enter)="clear()"
        [disabled]="!isSearching"
        [attr.aria-label]="i18n.clear"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          width="13"
          height="13"
          opacity="0.5"
        >
          <path [attr.d]="icon" />
        </svg>
      </button>
    </div>
  `,
                    preserveWhitespaces: false,
                    standalone: true,
                    imports: [FormsModule],
                }]
        }], ctorParameters: function () { return [{ type: i0.NgZone }, { type: EmojiSearch }]; }, propDecorators: { maxResults: [{
                type: Input
            }], autoFocus: [{
                type: Input
            }], i18n: [{
                type: Input
            }], include: [{
                type: Input
            }], exclude: [{
                type: Input
            }], custom: [{
                type: Input
            }], icons: [{
                type: Input
            }], emojisToShowFilter: [{
                type: Input
            }], searchResults: [{
                type: Output
            }], enterKeyOutsideAngular: [{
                type: Output
            }], inputRef: [{
                type: ViewChild,
                args: ['inputRef', { static: true }]
            }] } });

/* eslint-disable  max-len */
const categories = {
    activity: `M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24m10 11h-5c.3-2.5 1.3-4.8 2-6.1a10 10 0 0 1 3 6.1m-9 0V2a10 10 0 0 1 4.4 1.6A18 18 0 0 0 15 11h-2zm-2 0H9a18 18 0 0 0-2.4-7.4A10 10 0 0 1 11 2.1V11zm0 2v9a10 10 0 0 1-4.4-1.6A18 18 0 0 0 9 13h2zm4 0a18 18 0 0 0 2.4 7.4 10 10 0 0 1-4.4 1.5V13h2zM5 4.9c.7 1.3 1.7 3.6 2 6.1H2a10 10 0 0 1 3-6.1M2 13h5c-.3 2.5-1.3 4.8-2 6.1A10 10 0 0 1 2 13m17 6.1c-.7-1.3-1.7-3.6-2-6.1h5a10 10 0 0 1-3 6.1`,
    custom: `M10 1h3v21h-3zm10.186 4l1.5 2.598L3.5 18.098 2 15.5zM2 7.598L3.5 5l18.186 10.5-1.5 2.598z`,
    flags: `M0 0l6 24h2L2 0zm21 5h-4l-1-4H4l3 12h3l1 4h13L21 5zM6.6 3h7.8l2 8H8.6l-2-8zm8.8 10l-2.9 1.9-.4-1.9h3.3zm3.6 0l-1.5-6h2l2 8H16l3-2z`,
    foods: `M17 5c-1.8 0-2.9.4-3.7 1 .5-1.3 1.8-3 4.7-3a1 1 0 0 0 0-2c-3 0-4.6 1.3-5.5 2.5l-.2.2c-.6-1.9-1.5-3.7-3-3.7C8.5 0 7.7.3 7 1c-2 1.5-1.7 2.9-.5 4C3.6 5.2 0 7.4 0 13c0 4.6 5 11 9 11 2 0 2.4-.5 3-1 .6.5 1 1 3 1 4 0 9-6.4 9-11 0-6-4-8-7-8M8.2 2.5c.7-.5 1-.5 1-.5.4.2 1 1.4 1.4 3-1.6-.6-2.8-1.3-3-1.8l.6-.7M15 22c-1 0-1.2-.1-1.6-.4l-.1-.2a2 2 0 0 0-2.6 0l-.1.2c-.4.3-.5.4-1.6.4-2.8 0-7-5.4-7-9 0-6 4.5-6 5-6 2 0 2.5.4 3.4 1.2l.3.3a2 2 0 0 0 2.6 0l.3-.3c1-.8 1.5-1.2 3.4-1.2.5 0 5 .1 5 6 0 3.6-4.2 9-7 9`,
    nature: `M15.5 8a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m-7 0a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m10.43-8h-.02c-.97 0-2.14.79-3.02 1.5A13.88 13.88 0 0 0 12 .99c-1.28 0-2.62.13-3.87.51C7.24.8 6.07 0 5.09 0h-.02C3.35 0 .07 2.67 0 7.03c-.04 2.47.28 4.23 1.04 5 .26.27.88.69 1.3.9.19 3.17.92 5.23 2.53 6.37.9.64 2.19.95 3.2 1.1-.03.2-.07.4-.07.6 0 1.77 2.35 3 4 3s4-1.23 4-3c0-.2-.04-.4-.07-.59 2.57-.38 5.43-1.87 5.92-7.58.4-.22.89-.57 1.1-.8.77-.76 1.09-2.52 1.05-5C23.93 2.67 20.65 0 18.93 0M3.23 9.13c-.24.29-.84 1.16-.9 1.24A9.67 9.67 0 0 1 2 7.08c.05-3.28 2.48-4.97 3.1-5.03.25.02.72.27 1.26.65A7.95 7.95 0 0 0 4 7.82c-.14.55-.4.86-.79 1.31M12 22c-.9 0-1.95-.7-2-1 0-.65.47-1.24 1-1.6v.6a1 1 0 1 0 2 0v-.6c.52.36 1 .95 1 1.6-.05.3-1.1 1-2 1m3-3.48v.02a4.75 4.75 0 0 0-1.26-1.02c1.09-.52 2.24-1.33 2.24-2.22 0-1.84-1.78-2.2-3.98-2.2s-3.98.36-3.98 2.2c0 .89 1.15 1.7 2.24 2.22A4.8 4.8 0 0 0 9 18.54v-.03a6.1 6.1 0 0 1-2.97-.84c-1.3-.92-1.84-3.04-1.86-6.48l.03-.04c.5-.82 1.49-1.45 1.8-3.1C6 6 7.36 4.42 8.36 3.53c1.01-.35 2.2-.53 3.59-.53 1.45 0 2.68.2 3.73.57 1 .9 2.32 2.46 2.32 4.48.31 1.65 1.3 2.27 1.8 3.1l.1.18c-.06 5.97-1.95 7.01-4.9 7.19m6.63-8.2l-.11-.2a7.59 7.59 0 0 0-.74-.98 3.02 3.02 0 0 1-.79-1.32 7.93 7.93 0 0 0-2.35-5.12c.53-.38 1-.63 1.26-.65.64.07 3.05 1.77 3.1 5.03.02 1.81-.35 3.22-.37 3.24`,
    objects: `M12 0a9 9 0 0 0-5 16.5V21s2 3 5 3 5-3 5-3v-4.5A9 9 0 0 0 12 0zm0 2a7 7 0 1 1 0 14 7 7 0 0 1 0-14zM9 17.5a9 9 0 0 0 6 0v.8a7 7 0 0 1-3 .7 7 7 0 0 1-3-.7v-.8zm.2 3a8.9 8.9 0 0 0 2.8.5c1 0 1.9-.2 2.8-.5-.6.7-1.6 1.5-2.8 1.5-1.1 0-2.1-.8-2.8-1.5zm5.5-8.1c-.8 0-1.1-.8-1.5-1.8-.5-1-.7-1.5-1.2-1.5s-.8.5-1.3 1.5c-.4 1-.8 1.8-1.6 1.8h-.3c-.5-.2-.8-.7-1.3-1.8l-.2-1A3 3 0 0 0 7 9a1 1 0 0 1 0-2c1.7 0 2 1.4 2.2 2.1.5-1 1.3-2 2.8-2 1.5 0 2.3 1.1 2.7 2.1.2-.8.6-2.2 2.3-2.2a1 1 0 1 1 0 2c-.2 0-.3.5-.3.7a6.5 6.5 0 0 1-.3 1c-.5 1-.8 1.7-1.7 1.7`,
    people: `M12 0a12 12 0 1 0 0 24 12 12 0 0 0 0-24m0 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20M8 7a2 2 0 1 0 0 4 2 2 0 0 0 0-4m8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-.8 8c-.7 1.2-1.8 2-3.3 2-1.5 0-2.7-.8-3.4-2H15m3-2H6a6 6 0 1 0 12 0`,
    places: `M6.5 12a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5m0 3c-.3 0-.5-.2-.5-.5s.2-.5.5-.5.5.2.5.5-.2.5-.5.5m11-3a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5m0 3c-.3 0-.5-.2-.5-.5s.2-.5.5-.5.5.2.5.5-.2.5-.5.5m5-5.5l-1-.4-.1-.1h.6c.6 0 1-.4 1-1 0-1-.9-2-2-2h-.6l-.8-1.7A3 3 0 0 0 16.8 2H7.2a3 3 0 0 0-2.8 2.3L3.6 6H3a2 2 0 0 0-2 2c0 .6.4 1 1 1h.6v.1l-1 .4a2 2 0 0 0-1.4 2l.7 7.6a1 1 0 0 0 1 .9H3v1c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2v-1h6v1c0 1.1.9 2 2 2h2a2 2 0 0 0 2-2v-1h1.1a1 1 0 0 0 1-.9l.7-7.5a2 2 0 0 0-1.3-2.1M6.3 4.9c.1-.5.5-.9 1-.9h9.5c.4 0 .8.4 1 .9L19.2 9H4.7l1.6-4.1zM7 21H5v-1h2v1zm12 0h-2v-1h2v1zm2.2-3H2.8l-.7-6.6.9-.4h18l.9.4-.7 6.6z`,
    recent: `M13 4h-2v7H9v2h2v2h2v-2h4v-2h-4zm-1-4a12 12 0 1 0 0 24 12 12 0 0 0 0-24m0 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20`,
    symbols: `M0 0h11v2H0zm4 11h3V6h4V4H0v2h4zm11.5 6a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5m0-2.99a.5.5 0 0 1 0 .99c-.28 0-.5-.22-.5-.5s.22-.49.5-.49m6 5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5m0 2.99a.5.5 0 0 1-.5-.5.5.5 0 0 1 1 .01.5.5 0 0 1-.5.49m.5-9l-9 9 1.51 1.5 9-9zm-5-2c2.2 0 4-1.12 4-2.5V2s.98-.16 1.5.95C23 4.05 23 6 23 6s1-1.12 1-3.13C24-.02 21 0 21 0h-2v6.35A5.85 5.85 0 0 0 17 6c-2.2 0-4 1.12-4 2.5s1.8 2.5 4 2.5m-6.7 9.48L8.82 18.9a47.54 47.54 0 0 1-1.44 1.13c-.3-.3-.99-1.02-2.04-2.19.9-.83 1.47-1.46 1.72-1.89s.38-.87.38-1.33c0-.6-.27-1.18-.82-1.76-.54-.58-1.33-.87-2.35-.87-1 0-1.79.29-2.34.87-.56.6-.83 1.18-.83 1.79 0 .81.42 1.75 1.25 2.8a6.57 6.57 0 0 0-1.8 1.79 3.46 3.46 0 0 0-.51 1.83c0 .86.3 1.56.92 2.1a3.5 3.5 0 0 0 2.42.83c1.17 0 2.44-.38 3.81-1.14L8.23 24h2.82l-2.09-2.38 1.34-1.14zM3.56 14.1a1.02 1.02 0 0 1 .73-.28c.31 0 .56.08.75.25a.85.85 0 0 1 .28.66c0 .52-.42 1.11-1.26 1.78-.53-.65-.8-1.23-.8-1.74a.9.9 0 0 1 .3-.67m.18 7.9c-.43 0-.78-.12-1.06-.35-.28-.23-.41-.49-.41-.76 0-.6.5-1.3 1.52-2.09a31.23 31.23 0 0 0 2.25 2.44c-.92.5-1.69.76-2.3.76`,
};
const search = {
    search: `M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z`,
    delete: `M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z`,
};

const I18N = {
    search: 'Search',
    emojilist: 'List of emoji',
    notfound: 'No Emoji Found',
    clear: 'Clear',
    categories: {
        search: 'Search Results',
        recent: 'Frequently Used',
        people: 'Smileys & People',
        nature: 'Animals & Nature',
        foods: 'Food & Drink',
        activity: 'Activity',
        places: 'Travel & Places',
        objects: 'Objects',
        symbols: 'Symbols',
        flags: 'Flags',
        custom: 'Custom',
    },
    skintones: {
        1: 'Default Skin Tone',
        2: 'Light Skin Tone',
        3: 'Medium-Light Skin Tone',
        4: 'Medium Skin Tone',
        5: 'Medium-Dark Skin Tone',
        6: 'Dark Skin Tone',
    },
};
class PickerComponent {
    ngZone;
    renderer;
    ref;
    frequently;
    platformId;
    perLine = 9;
    totalFrequentLines = 4;
    i18n = {};
    style = {};
    title = 'Emoji Mart™';
    emoji = 'department_store';
    darkMode = !!(typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: dark)').matches);
    color = '#ae65c5';
    hideObsolete = true;
    /** all categories shown */
    categories = [];
    /** used to temporarily draw categories */
    activeCategories = [];
    set = 'apple';
    skin = 1;
    /** Renders the native unicode emoji */
    isNative = false;
    emojiSize = 24;
    sheetSize = 64;
    emojisToShowFilter;
    showPreview = true;
    emojiTooltip = false;
    autoFocus = false;
    custom = [];
    hideRecent = true;
    imageUrlFn;
    include;
    exclude;
    notFoundEmoji = 'sleuth_or_spy';
    categoriesIcons = categories;
    searchIcons = search;
    useButton = false;
    enableFrequentEmojiSort = false;
    enableSearch = true;
    showSingleCategory = false;
    virtualize = false;
    virtualizeOffset = 0;
    recent;
    emojiClick = new EventEmitter();
    emojiSelect = new EventEmitter();
    skinChange = new EventEmitter();
    scrollRef;
    previewRef;
    searchRef;
    categoryRefs;
    scrollHeight = 0;
    clientHeight = 0;
    clientWidth = 0;
    selected;
    nextScroll;
    scrollTop;
    firstRender = true;
    previewEmoji = null;
    animationFrameRequestId = null;
    NAMESPACE = 'emoji-mart';
    measureScrollbar = 0;
    RECENT_CATEGORY = {
        id: 'recent',
        name: 'Recent',
        emojis: null,
    };
    SEARCH_CATEGORY = {
        id: 'search',
        name: 'Search',
        emojis: null,
        anchor: false,
    };
    CUSTOM_CATEGORY = {
        id: 'custom',
        name: 'Custom',
        emojis: [],
    };
    scrollListener;
    backgroundImageFn = (set, sheetSize) => `https://cdn.jsdelivr.net/npm/emoji-datasource-${set}@14.0.0/img/${set}/sheets-256/${sheetSize}.png`;
    constructor(ngZone, renderer, ref, frequently, platformId) {
        this.ngZone = ngZone;
        this.renderer = renderer;
        this.ref = ref;
        this.frequently = frequently;
        this.platformId = platformId;
    }
    ngOnInit() {
        // measure scroll
        this.measureScrollbar = measureScrollbar();
        this.i18n = { ...I18N, ...this.i18n };
        this.i18n.categories = { ...I18N.categories, ...this.i18n.categories };
        this.skin =
            JSON.parse((isPlatformBrowser(this.platformId) && localStorage.getItem(`${this.NAMESPACE}.skin`)) ||
                'null') || this.skin;
        const allCategories = [...categories$1];
        if (this.custom.length > 0) {
            this.CUSTOM_CATEGORY.emojis = this.custom.map(emoji => {
                return {
                    ...emoji,
                    // `<Category />` expects emoji to have an `id`.
                    id: emoji.shortNames[0],
                    custom: true,
                };
            });
            allCategories.push(this.CUSTOM_CATEGORY);
        }
        if (this.include !== undefined) {
            allCategories.sort((a, b) => {
                if (this.include.indexOf(a.id) > this.include.indexOf(b.id)) {
                    return 1;
                }
                return -1;
            });
        }
        for (const category of allCategories) {
            const isIncluded = this.include && this.include.length ? this.include.indexOf(category.id) > -1 : true;
            const isExcluded = this.exclude && this.exclude.length ? this.exclude.indexOf(category.id) > -1 : false;
            if (!isIncluded || isExcluded) {
                continue;
            }
            if (this.emojisToShowFilter) {
                const newEmojis = [];
                const { emojis } = category;
                for (let emojiIndex = 0; emojiIndex < emojis.length; emojiIndex++) {
                    const emoji = emojis[emojiIndex];
                    if (this.emojisToShowFilter(emoji)) {
                        newEmojis.push(emoji);
                    }
                }
                if (newEmojis.length) {
                    const newCategory = {
                        emojis: newEmojis,
                        name: category.name,
                        id: category.id,
                    };
                    this.categories.push(newCategory);
                }
            }
            else {
                this.categories.push(category);
            }
            this.categoriesIcons = { ...categories, ...this.categoriesIcons };
            this.searchIcons = { ...search, ...this.searchIcons };
        }
        const includeRecent = this.include && this.include.length
            ? this.include.indexOf(this.RECENT_CATEGORY.id) > -1
            : true;
        const excludeRecent = this.exclude && this.exclude.length
            ? this.exclude.indexOf(this.RECENT_CATEGORY.id) > -1
            : false;
        if (includeRecent && !excludeRecent) {
            this.hideRecent = false;
            this.categories.unshift(this.RECENT_CATEGORY);
        }
        if (this.categories[0]) {
            this.categories[0].first = true;
        }
        this.categories.unshift(this.SEARCH_CATEGORY);
        this.selected = this.categories.filter(category => category.first)[0].name;
        // Need to be careful if small number of categories
        const categoriesToLoadFirst = Math.min(this.categories.length, 3);
        this.setActiveCategories((this.activeCategories = this.categories.slice(0, categoriesToLoadFirst)));
        // Trim last active category
        const lastActiveCategoryEmojis = this.categories[categoriesToLoadFirst - 1].emojis.slice();
        this.categories[categoriesToLoadFirst - 1].emojis = lastActiveCategoryEmojis.slice(0, 60);
        setTimeout(() => {
            // Restore last category
            this.categories[categoriesToLoadFirst - 1].emojis = lastActiveCategoryEmojis;
            this.setActiveCategories(this.categories);
            // The `setTimeout` will trigger the change detection, but since we're inside
            // the OnPush component we can run change detection locally starting from this
            // component and going down to the children.
            this.ref.detectChanges();
            isPlatformBrowser(this.platformId) &&
                this.ngZone.runOutsideAngular(() => {
                    // The `updateCategoriesSize` doesn't change properties that are used
                    // in templates, thus this is run in the context of the root zone to avoid
                    // running change detection.
                    requestAnimationFrame(() => {
                        this.updateCategoriesSize();
                    });
                });
        });
        this.ngZone.runOutsideAngular(() => {
            // DOM events that are listened by Angular inside the template trigger change detection
            // and also wrapped into additional functions that call `markForCheck()`. We listen `scroll`
            // in the context of the root zone since it will not trigger change detection each time
            // the `scroll` event is dispatched.
            this.scrollListener = this.renderer.listen(this.scrollRef.nativeElement, 'scroll', () => {
                this.handleScroll();
            });
        });
    }
    ngOnDestroy() {
        this.scrollListener?.();
        // This is called here because the component might be destroyed
        // but there will still be a `requestAnimationFrame` callback in the queue
        // that calls `detectChanges()` on the `ViewRef`. This will lead to a runtime
        // exception if the `detectChanges()` is called after the `ViewRef` is destroyed.
        this.cancelAnimationFrame();
    }
    setActiveCategories(categoriesToMakeActive) {
        if (this.showSingleCategory) {
            this.activeCategories = categoriesToMakeActive.filter(x => x.name === this.selected || x === this.SEARCH_CATEGORY);
        }
        else {
            this.activeCategories = categoriesToMakeActive;
        }
    }
    updateCategoriesSize() {
        this.categoryRefs.forEach(component => component.memoizeSize());
        if (this.scrollRef) {
            const target = this.scrollRef.nativeElement;
            this.scrollHeight = target.scrollHeight;
            this.clientHeight = target.clientHeight;
            this.clientWidth = target.clientWidth;
        }
    }
    handleAnchorClick($event) {
        this.updateCategoriesSize();
        this.selected = $event.category.name;
        this.setActiveCategories(this.categories);
        if (this.SEARCH_CATEGORY.emojis) {
            this.handleSearch(null);
            this.searchRef?.clear();
            this.handleAnchorClick($event);
            return;
        }
        const component = this.categoryRefs.find(n => n.id === $event.category.id);
        if (component) {
            let { top } = component;
            if ($event.category.first) {
                top = 0;
            }
            else {
                top += 1;
            }
            this.scrollRef.nativeElement.scrollTop = top;
        }
        this.nextScroll = $event.category.name;
        // handle component scrolling to load emojis
        for (const category of this.categories) {
            const componentToScroll = this.categoryRefs.find(({ id }) => id === category.id);
            componentToScroll?.handleScroll(this.scrollRef.nativeElement.scrollTop);
        }
    }
    categoryTrack(index, item) {
        return item.id;
    }
    handleScroll(noSelectionChange = false) {
        if (this.nextScroll) {
            this.selected = this.nextScroll;
            this.nextScroll = undefined;
            this.ref.detectChanges();
            return;
        }
        if (!this.scrollRef) {
            return;
        }
        if (this.showSingleCategory) {
            return;
        }
        let activeCategory;
        if (this.SEARCH_CATEGORY.emojis) {
            activeCategory = this.SEARCH_CATEGORY;
        }
        else {
            const target = this.scrollRef.nativeElement;
            // check scroll is not at bottom
            if (target.scrollTop === 0) {
                // hit the TOP
                activeCategory = this.categories.find(n => n.first === true);
            }
            else if (target.scrollHeight - target.scrollTop === this.clientHeight) {
                // scrolled to bottom activate last category
                activeCategory = this.categories[this.categories.length - 1];
            }
            else {
                // scrolling
                for (const category of this.categories) {
                    const component = this.categoryRefs.find(({ id }) => id === category.id);
                    const active = component?.handleScroll(target.scrollTop);
                    if (active) {
                        activeCategory = category;
                    }
                }
            }
            this.scrollTop = target.scrollTop;
        }
        // This will allow us to run the change detection only when the category changes.
        if (!noSelectionChange && activeCategory && activeCategory.name !== this.selected) {
            this.selected = activeCategory.name;
            this.ref.detectChanges();
        }
        else if (noSelectionChange) {
            this.ref.detectChanges();
        }
    }
    handleSearch($emojis) {
        this.SEARCH_CATEGORY.emojis = $emojis;
        for (const component of this.categoryRefs.toArray()) {
            if (component.name === 'Search') {
                component.emojis = $emojis;
                component.updateDisplay($emojis ? 'block' : 'none');
            }
            else {
                component.updateDisplay($emojis ? 'none' : 'block');
            }
        }
        this.scrollRef.nativeElement.scrollTop = 0;
        this.handleScroll();
    }
    handleEnterKey($event, emoji) {
        // Note: the `handleEnterKey` is invoked when the search component dispatches the
        //       `enterKeyOutsideAngular` event or when any emoji is clicked thus `emojiClickOutsideAngular`
        //       event is dispatched. Both events are dispatched outside of the Angular zone to prevent
        //       no-op ticks, basically when users outside of the picker component are not listening
        //       to any of these events.
        if (!emoji) {
            if (this.SEARCH_CATEGORY.emojis !== null && this.SEARCH_CATEGORY.emojis.length) {
                emoji = this.SEARCH_CATEGORY.emojis[0];
                if (emoji) {
                    dispatchInAngularContextIfObserved(this.emojiSelect, this.ngZone, { $event, emoji });
                }
                else {
                    return;
                }
            }
        }
        if (!this.hideRecent && !this.recent && emoji) {
            this.frequently.add(emoji);
        }
        const component = this.categoryRefs.toArray()[1];
        if (component && this.enableFrequentEmojiSort) {
            this.ngZone.run(() => {
                component.updateRecentEmojis();
                component.ref.markForCheck();
            });
        }
    }
    handleEmojiOver($event) {
        if (!this.showPreview || !this.previewRef) {
            return;
        }
        const emojiData = this.CUSTOM_CATEGORY.emojis.find((customEmoji) => customEmoji.id === $event.emoji.id);
        if (emojiData) {
            $event.emoji = { ...emojiData };
        }
        this.previewEmoji = $event.emoji;
        this.cancelAnimationFrame();
        this.ref.detectChanges();
    }
    handleEmojiLeave() {
        if (!this.showPreview || !this.previewRef) {
            return;
        }
        // Note: `handleEmojiLeave` will be invoked outside of the Angular zone because of the `mouseleave`
        //       event set up outside of the Angular zone in `ngx-emoji`. See `setupMouseLeaveListener`.
        //       This is done explicitly because we don't have to run redundant change detection since we
        //       would still want to leave the Angular zone here when scheduling animation frame.
        this.animationFrameRequestId = requestAnimationFrame(() => {
            this.previewEmoji = null;
            this.ref.detectChanges();
        });
    }
    handleEmojiClick($event) {
        // Note: we're getting back into the Angular zone because click events on emojis are handled
        //       outside of the Angular zone.
        dispatchInAngularContextIfObserved(this.emojiClick, this.ngZone, $event);
        dispatchInAngularContextIfObserved(this.emojiSelect, this.ngZone, $event);
        this.handleEnterKey($event.$event, $event.emoji);
    }
    handleSkinChange(skin) {
        this.skin = skin;
        localStorage.setItem(`${this.NAMESPACE}.skin`, String(skin));
        this.skinChange.emit(skin);
    }
    getWidth() {
        if (this.style && this.style.width) {
            return this.style.width;
        }
        return this.perLine * (this.emojiSize + 12) + 12 + 2 + this.measureScrollbar + 'px';
    }
    cancelAnimationFrame() {
        if (this.animationFrameRequestId !== null) {
            cancelAnimationFrame(this.animationFrameRequestId);
            this.animationFrameRequestId = null;
        }
    }
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.5", ngImport: i0, type: PickerComponent, deps: [{ token: i0.NgZone }, { token: i0.Renderer2 }, { token: i0.ChangeDetectorRef }, { token: EmojiFrequentlyService }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.5", type: PickerComponent, isStandalone: true, selector: "emoji-mart", inputs: { perLine: "perLine", totalFrequentLines: "totalFrequentLines", i18n: "i18n", style: "style", title: "title", emoji: "emoji", darkMode: "darkMode", color: "color", hideObsolete: "hideObsolete", categories: "categories", activeCategories: "activeCategories", set: "set", skin: "skin", isNative: "isNative", emojiSize: "emojiSize", sheetSize: "sheetSize", emojisToShowFilter: "emojisToShowFilter", showPreview: "showPreview", emojiTooltip: "emojiTooltip", autoFocus: "autoFocus", custom: "custom", hideRecent: "hideRecent", imageUrlFn: "imageUrlFn", include: "include", exclude: "exclude", notFoundEmoji: "notFoundEmoji", categoriesIcons: "categoriesIcons", searchIcons: "searchIcons", useButton: "useButton", enableFrequentEmojiSort: "enableFrequentEmojiSort", enableSearch: "enableSearch", showSingleCategory: "showSingleCategory", virtualize: "virtualize", virtualizeOffset: "virtualizeOffset", recent: "recent", backgroundImageFn: "backgroundImageFn" }, outputs: { emojiClick: "emojiClick", emojiSelect: "emojiSelect", skinChange: "skinChange" }, viewQueries: [{ propertyName: "scrollRef", first: true, predicate: ["scrollRef"], descendants: true, static: true }, { propertyName: "previewRef", first: true, predicate: PreviewComponent, descendants: true }, { propertyName: "searchRef", first: true, predicate: SearchComponent, descendants: true }, { propertyName: "categoryRefs", predicate: CategoryComponent, descendants: true }], ngImport: i0, template: "<section\n  class=\"emoji-mart {{ darkMode ? 'emoji-mart-dark' : '' }}\"\n  [style.width]=\"getWidth()\"\n  [ngStyle]=\"style\"\n>\n  <div class=\"emoji-mart-bar\">\n    <emoji-mart-anchors\n      [categories]=\"categories\"\n      (anchorClick)=\"handleAnchorClick($event)\"\n      [color]=\"color\"\n      [selected]=\"selected\"\n      [i18n]=\"i18n\"\n      [icons]=\"categoriesIcons\"\n    ></emoji-mart-anchors>\n  </div>\n  <emoji-search\n    *ngIf=\"enableSearch\"\n    [i18n]=\"i18n\"\n    (searchResults)=\"handleSearch($event)\"\n    (enterKeyOutsideAngular)=\"handleEnterKey($event)\"\n    [include]=\"include\"\n    [exclude]=\"exclude\"\n    [custom]=\"custom\"\n    [autoFocus]=\"autoFocus\"\n    [icons]=\"searchIcons\"\n    [emojisToShowFilter]=\"emojisToShowFilter\"\n  ></emoji-search>\n  <section #scrollRef class=\"emoji-mart-scroll\" [attr.aria-label]=\"i18n.emojilist\">\n    <emoji-category\n      *ngFor=\"let category of activeCategories; let idx = index; trackBy: categoryTrack\"\n      [id]=\"category.id\"\n      [name]=\"category.name\"\n      [emojis]=\"category.emojis\"\n      [perLine]=\"perLine\"\n      [totalFrequentLines]=\"totalFrequentLines\"\n      [hasStickyPosition]=\"isNative\"\n      [i18n]=\"i18n\"\n      [hideObsolete]=\"hideObsolete\"\n      [notFoundEmoji]=\"notFoundEmoji\"\n      [custom]=\"category.id === RECENT_CATEGORY.id ? CUSTOM_CATEGORY.emojis : undefined\"\n      [recent]=\"category.id === RECENT_CATEGORY.id ? recent : undefined\"\n      [virtualize]=\"virtualize\"\n      [virtualizeOffset]=\"virtualizeOffset\"\n      [emojiIsNative]=\"isNative\"\n      [emojiSkin]=\"skin\"\n      [emojiSize]=\"emojiSize\"\n      [emojiSet]=\"set\"\n      [emojiSheetSize]=\"sheetSize\"\n      [emojiForceSize]=\"isNative\"\n      [emojiTooltip]=\"emojiTooltip\"\n      [emojiBackgroundImageFn]=\"backgroundImageFn\"\n      [emojiImageUrlFn]=\"imageUrlFn\"\n      [emojiUseButton]=\"useButton\"\n      (emojiOverOutsideAngular)=\"handleEmojiOver($event)\"\n      (emojiLeaveOutsideAngular)=\"handleEmojiLeave()\"\n      (emojiClickOutsideAngular)=\"handleEmojiClick($event)\"\n    ></emoji-category>\n  </section>\n  <div class=\"emoji-mart-bar\" *ngIf=\"showPreview\">\n    <emoji-preview\n      [attr.title]=\"title\"\n      [emoji]=\"previewEmoji\"\n      [idleEmoji]=\"emoji\"\n      [emojiIsNative]=\"isNative\"\n      [emojiSize]=\"38\"\n      [emojiSkin]=\"skin\"\n      [emojiSet]=\"set\"\n      [i18n]=\"i18n\"\n      [emojiSheetSize]=\"sheetSize\"\n      [emojiBackgroundImageFn]=\"backgroundImageFn\"\n      [emojiImageUrlFn]=\"imageUrlFn\"\n      (skinChange)=\"handleSkinChange($event)\"\n    ></emoji-preview>\n  </div>\n</section>\n", dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i2.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i2.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "component", type: AnchorsComponent, selector: "emoji-mart-anchors", inputs: ["categories", "color", "selected", "i18n", "icons"], outputs: ["anchorClick"] }, { kind: "component", type: SearchComponent, selector: "emoji-search", inputs: ["maxResults", "autoFocus", "i18n", "include", "exclude", "custom", "icons", "emojisToShowFilter"], outputs: ["searchResults", "enterKeyOutsideAngular"] }, { kind: "component", type: PreviewComponent, selector: "emoji-preview", inputs: ["title", "emoji", "idleEmoji", "i18n", "emojiIsNative", "emojiSkin", "emojiSize", "emojiSet", "emojiSheetSize", "emojiBackgroundImageFn", "emojiImageUrlFn"], outputs: ["skinChange"] }, { kind: "component", type: CategoryComponent, selector: "emoji-category", inputs: ["emojis", "hasStickyPosition", "name", "perLine", "totalFrequentLines", "recent", "custom", "i18n", "id", "hideObsolete", "notFoundEmoji", "virtualize", "virtualizeOffset", "emojiIsNative", "emojiSkin", "emojiSize", "emojiSet", "emojiSheetSize", "emojiForceSize", "emojiTooltip", "emojiBackgroundImageFn", "emojiImageUrlFn", "emojiUseButton"], outputs: ["emojiOverOutsideAngular", "emojiLeaveOutsideAngular", "emojiClickOutsideAngular"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.5", ngImport: i0, type: PickerComponent, decorators: [{
            type: Component,
            args: [{ selector: 'emoji-mart', changeDetection: ChangeDetectionStrategy.OnPush, preserveWhitespaces: false, standalone: true, imports: [CommonModule, AnchorsComponent, SearchComponent, PreviewComponent, CategoryComponent], template: "<section\n  class=\"emoji-mart {{ darkMode ? 'emoji-mart-dark' : '' }}\"\n  [style.width]=\"getWidth()\"\n  [ngStyle]=\"style\"\n>\n  <div class=\"emoji-mart-bar\">\n    <emoji-mart-anchors\n      [categories]=\"categories\"\n      (anchorClick)=\"handleAnchorClick($event)\"\n      [color]=\"color\"\n      [selected]=\"selected\"\n      [i18n]=\"i18n\"\n      [icons]=\"categoriesIcons\"\n    ></emoji-mart-anchors>\n  </div>\n  <emoji-search\n    *ngIf=\"enableSearch\"\n    [i18n]=\"i18n\"\n    (searchResults)=\"handleSearch($event)\"\n    (enterKeyOutsideAngular)=\"handleEnterKey($event)\"\n    [include]=\"include\"\n    [exclude]=\"exclude\"\n    [custom]=\"custom\"\n    [autoFocus]=\"autoFocus\"\n    [icons]=\"searchIcons\"\n    [emojisToShowFilter]=\"emojisToShowFilter\"\n  ></emoji-search>\n  <section #scrollRef class=\"emoji-mart-scroll\" [attr.aria-label]=\"i18n.emojilist\">\n    <emoji-category\n      *ngFor=\"let category of activeCategories; let idx = index; trackBy: categoryTrack\"\n      [id]=\"category.id\"\n      [name]=\"category.name\"\n      [emojis]=\"category.emojis\"\n      [perLine]=\"perLine\"\n      [totalFrequentLines]=\"totalFrequentLines\"\n      [hasStickyPosition]=\"isNative\"\n      [i18n]=\"i18n\"\n      [hideObsolete]=\"hideObsolete\"\n      [notFoundEmoji]=\"notFoundEmoji\"\n      [custom]=\"category.id === RECENT_CATEGORY.id ? CUSTOM_CATEGORY.emojis : undefined\"\n      [recent]=\"category.id === RECENT_CATEGORY.id ? recent : undefined\"\n      [virtualize]=\"virtualize\"\n      [virtualizeOffset]=\"virtualizeOffset\"\n      [emojiIsNative]=\"isNative\"\n      [emojiSkin]=\"skin\"\n      [emojiSize]=\"emojiSize\"\n      [emojiSet]=\"set\"\n      [emojiSheetSize]=\"sheetSize\"\n      [emojiForceSize]=\"isNative\"\n      [emojiTooltip]=\"emojiTooltip\"\n      [emojiBackgroundImageFn]=\"backgroundImageFn\"\n      [emojiImageUrlFn]=\"imageUrlFn\"\n      [emojiUseButton]=\"useButton\"\n      (emojiOverOutsideAngular)=\"handleEmojiOver($event)\"\n      (emojiLeaveOutsideAngular)=\"handleEmojiLeave()\"\n      (emojiClickOutsideAngular)=\"handleEmojiClick($event)\"\n    ></emoji-category>\n  </section>\n  <div class=\"emoji-mart-bar\" *ngIf=\"showPreview\">\n    <emoji-preview\n      [attr.title]=\"title\"\n      [emoji]=\"previewEmoji\"\n      [idleEmoji]=\"emoji\"\n      [emojiIsNative]=\"isNative\"\n      [emojiSize]=\"38\"\n      [emojiSkin]=\"skin\"\n      [emojiSet]=\"set\"\n      [i18n]=\"i18n\"\n      [emojiSheetSize]=\"sheetSize\"\n      [emojiBackgroundImageFn]=\"backgroundImageFn\"\n      [emojiImageUrlFn]=\"imageUrlFn\"\n      (skinChange)=\"handleSkinChange($event)\"\n    ></emoji-preview>\n  </div>\n</section>\n" }]
        }], ctorParameters: function () { return [{ type: i0.NgZone }, { type: i0.Renderer2 }, { type: i0.ChangeDetectorRef }, { type: EmojiFrequentlyService }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }]; }, propDecorators: { perLine: [{
                type: Input
            }], totalFrequentLines: [{
                type: Input
            }], i18n: [{
                type: Input
            }], style: [{
                type: Input
            }], title: [{
                type: Input
            }], emoji: [{
                type: Input
            }], darkMode: [{
                type: Input
            }], color: [{
                type: Input
            }], hideObsolete: [{
                type: Input
            }], categories: [{
                type: Input
            }], activeCategories: [{
                type: Input
            }], set: [{
                type: Input
            }], skin: [{
                type: Input
            }], isNative: [{
                type: Input
            }], emojiSize: [{
                type: Input
            }], sheetSize: [{
                type: Input
            }], emojisToShowFilter: [{
                type: Input
            }], showPreview: [{
                type: Input
            }], emojiTooltip: [{
                type: Input
            }], autoFocus: [{
                type: Input
            }], custom: [{
                type: Input
            }], hideRecent: [{
                type: Input
            }], imageUrlFn: [{
                type: Input
            }], include: [{
                type: Input
            }], exclude: [{
                type: Input
            }], notFoundEmoji: [{
                type: Input
            }], categoriesIcons: [{
                type: Input
            }], searchIcons: [{
                type: Input
            }], useButton: [{
                type: Input
            }], enableFrequentEmojiSort: [{
                type: Input
            }], enableSearch: [{
                type: Input
            }], showSingleCategory: [{
                type: Input
            }], virtualize: [{
                type: Input
            }], virtualizeOffset: [{
                type: Input
            }], recent: [{
                type: Input
            }], emojiClick: [{
                type: Output
            }], emojiSelect: [{
                type: Output
            }], skinChange: [{
                type: Output
            }], scrollRef: [{
                type: ViewChild,
                args: ['scrollRef', { static: true }]
            }], previewRef: [{
                type: ViewChild,
                args: [PreviewComponent, { static: false }]
            }], searchRef: [{
                type: ViewChild,
                args: [SearchComponent, { static: false }]
            }], categoryRefs: [{
                type: ViewChildren,
                args: [CategoryComponent]
            }], backgroundImageFn: [{
                type: Input
            }] } });
/**
 * This is only a helper function because the same code is being re-used many times.
 */
function dispatchInAngularContextIfObserved(emitter, ngZone, value) {
    if (emitter.observed) {
        ngZone.run(() => emitter.emit(value));
    }
}

const components = [
    PickerComponent,
    AnchorsComponent,
    CategoryComponent,
    SearchComponent,
    PreviewComponent,
    SkinComponent,
];
class PickerModule {
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.5", ngImport: i0, type: PickerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
    static ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "16.0.5", ngImport: i0, type: PickerModule, imports: [PickerComponent,
            AnchorsComponent,
            CategoryComponent,
            SearchComponent,
            PreviewComponent,
            SkinComponent], exports: [PickerComponent,
            AnchorsComponent,
            CategoryComponent,
            SearchComponent,
            PreviewComponent,
            SkinComponent] });
    static ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "16.0.5", ngImport: i0, type: PickerModule, imports: [components] });
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.5", ngImport: i0, type: PickerModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: components,
                    exports: components,
                }]
        }] });

/**
 * Generated bundle index. Do not edit.
 */

export { AnchorsComponent, CategoryComponent, EmojiFrequentlyService, EmojiSearch, PickerComponent, PickerModule, PreviewComponent, SearchComponent, SkinComponent };
//# sourceMappingURL=ctrl-ngx-emoji-mart.mjs.map
