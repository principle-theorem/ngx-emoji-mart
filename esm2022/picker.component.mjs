import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, Output, PLATFORM_ID, ViewChild, ViewChildren, } from '@angular/core';
import { categories, } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { CategoryComponent } from './category.component';
import { PreviewComponent } from './preview.component';
import { SearchComponent } from './search.component';
import * as icons from './svgs';
import { measureScrollbar } from './utils';
import { AnchorsComponent } from './anchors.component';
import * as i0 from "@angular/core";
import * as i1 from "./emoji-frequently.service";
import * as i2 from "@angular/common";
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
    categoriesIcons = icons.categories;
    searchIcons = icons.search;
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
        const allCategories = [...categories];
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
            this.categoriesIcons = { ...icons.categories, ...this.categoriesIcons };
            this.searchIcons = { ...icons.search, ...this.searchIcons };
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
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.5", ngImport: i0, type: PickerComponent, deps: [{ token: i0.NgZone }, { token: i0.Renderer2 }, { token: i0.ChangeDetectorRef }, { token: i1.EmojiFrequentlyService }, { token: PLATFORM_ID }], target: i0.ɵɵFactoryTarget.Component });
    static ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "16.0.5", type: PickerComponent, isStandalone: true, selector: "emoji-mart", inputs: { perLine: "perLine", totalFrequentLines: "totalFrequentLines", i18n: "i18n", style: "style", title: "title", emoji: "emoji", darkMode: "darkMode", color: "color", hideObsolete: "hideObsolete", categories: "categories", activeCategories: "activeCategories", set: "set", skin: "skin", isNative: "isNative", emojiSize: "emojiSize", sheetSize: "sheetSize", emojisToShowFilter: "emojisToShowFilter", showPreview: "showPreview", emojiTooltip: "emojiTooltip", autoFocus: "autoFocus", custom: "custom", hideRecent: "hideRecent", imageUrlFn: "imageUrlFn", include: "include", exclude: "exclude", notFoundEmoji: "notFoundEmoji", categoriesIcons: "categoriesIcons", searchIcons: "searchIcons", useButton: "useButton", enableFrequentEmojiSort: "enableFrequentEmojiSort", enableSearch: "enableSearch", showSingleCategory: "showSingleCategory", virtualize: "virtualize", virtualizeOffset: "virtualizeOffset", recent: "recent", backgroundImageFn: "backgroundImageFn" }, outputs: { emojiClick: "emojiClick", emojiSelect: "emojiSelect", skinChange: "skinChange" }, viewQueries: [{ propertyName: "scrollRef", first: true, predicate: ["scrollRef"], descendants: true, static: true }, { propertyName: "previewRef", first: true, predicate: PreviewComponent, descendants: true }, { propertyName: "searchRef", first: true, predicate: SearchComponent, descendants: true }, { propertyName: "categoryRefs", predicate: CategoryComponent, descendants: true }], ngImport: i0, template: "<section\n  class=\"emoji-mart {{ darkMode ? 'emoji-mart-dark' : '' }}\"\n  [style.width]=\"getWidth()\"\n  [ngStyle]=\"style\"\n>\n  <div class=\"emoji-mart-bar\">\n    <emoji-mart-anchors\n      [categories]=\"categories\"\n      (anchorClick)=\"handleAnchorClick($event)\"\n      [color]=\"color\"\n      [selected]=\"selected\"\n      [i18n]=\"i18n\"\n      [icons]=\"categoriesIcons\"\n    ></emoji-mart-anchors>\n  </div>\n  <emoji-search\n    *ngIf=\"enableSearch\"\n    [i18n]=\"i18n\"\n    (searchResults)=\"handleSearch($event)\"\n    (enterKeyOutsideAngular)=\"handleEnterKey($event)\"\n    [include]=\"include\"\n    [exclude]=\"exclude\"\n    [custom]=\"custom\"\n    [autoFocus]=\"autoFocus\"\n    [icons]=\"searchIcons\"\n    [emojisToShowFilter]=\"emojisToShowFilter\"\n  ></emoji-search>\n  <section #scrollRef class=\"emoji-mart-scroll\" [attr.aria-label]=\"i18n.emojilist\">\n    <emoji-category\n      *ngFor=\"let category of activeCategories; let idx = index; trackBy: categoryTrack\"\n      [id]=\"category.id\"\n      [name]=\"category.name\"\n      [emojis]=\"category.emojis\"\n      [perLine]=\"perLine\"\n      [totalFrequentLines]=\"totalFrequentLines\"\n      [hasStickyPosition]=\"isNative\"\n      [i18n]=\"i18n\"\n      [hideObsolete]=\"hideObsolete\"\n      [notFoundEmoji]=\"notFoundEmoji\"\n      [custom]=\"category.id === RECENT_CATEGORY.id ? CUSTOM_CATEGORY.emojis : undefined\"\n      [recent]=\"category.id === RECENT_CATEGORY.id ? recent : undefined\"\n      [virtualize]=\"virtualize\"\n      [virtualizeOffset]=\"virtualizeOffset\"\n      [emojiIsNative]=\"isNative\"\n      [emojiSkin]=\"skin\"\n      [emojiSize]=\"emojiSize\"\n      [emojiSet]=\"set\"\n      [emojiSheetSize]=\"sheetSize\"\n      [emojiForceSize]=\"isNative\"\n      [emojiTooltip]=\"emojiTooltip\"\n      [emojiBackgroundImageFn]=\"backgroundImageFn\"\n      [emojiImageUrlFn]=\"imageUrlFn\"\n      [emojiUseButton]=\"useButton\"\n      (emojiOverOutsideAngular)=\"handleEmojiOver($event)\"\n      (emojiLeaveOutsideAngular)=\"handleEmojiLeave()\"\n      (emojiClickOutsideAngular)=\"handleEmojiClick($event)\"\n    ></emoji-category>\n  </section>\n  <div class=\"emoji-mart-bar\" *ngIf=\"showPreview\">\n    <emoji-preview\n      [attr.title]=\"title\"\n      [emoji]=\"previewEmoji\"\n      [idleEmoji]=\"emoji\"\n      [emojiIsNative]=\"isNative\"\n      [emojiSize]=\"38\"\n      [emojiSkin]=\"skin\"\n      [emojiSet]=\"set\"\n      [i18n]=\"i18n\"\n      [emojiSheetSize]=\"sheetSize\"\n      [emojiBackgroundImageFn]=\"backgroundImageFn\"\n      [emojiImageUrlFn]=\"imageUrlFn\"\n      (skinChange)=\"handleSkinChange($event)\"\n    ></emoji-preview>\n  </div>\n</section>\n", dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i2.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i2.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "component", type: AnchorsComponent, selector: "emoji-mart-anchors", inputs: ["categories", "color", "selected", "i18n", "icons"], outputs: ["anchorClick"] }, { kind: "component", type: SearchComponent, selector: "emoji-search", inputs: ["maxResults", "autoFocus", "i18n", "include", "exclude", "custom", "icons", "emojisToShowFilter"], outputs: ["searchResults", "enterKeyOutsideAngular"] }, { kind: "component", type: PreviewComponent, selector: "emoji-preview", inputs: ["title", "emoji", "idleEmoji", "i18n", "emojiIsNative", "emojiSkin", "emojiSize", "emojiSet", "emojiSheetSize", "emojiBackgroundImageFn", "emojiImageUrlFn"], outputs: ["skinChange"] }, { kind: "component", type: CategoryComponent, selector: "emoji-category", inputs: ["emojis", "hasStickyPosition", "name", "perLine", "totalFrequentLines", "recent", "custom", "i18n", "id", "hideObsolete", "notFoundEmoji", "virtualize", "virtualizeOffset", "emojiIsNative", "emojiSkin", "emojiSize", "emojiSet", "emojiSheetSize", "emojiForceSize", "emojiTooltip", "emojiBackgroundImageFn", "emojiImageUrlFn", "emojiUseButton"], outputs: ["emojiOverOutsideAngular", "emojiLeaveOutsideAngular", "emojiClickOutsideAngular"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
}
export { PickerComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.5", ngImport: i0, type: PickerComponent, decorators: [{
            type: Component,
            args: [{ selector: 'emoji-mart', changeDetection: ChangeDetectionStrategy.OnPush, preserveWhitespaces: false, standalone: true, imports: [CommonModule, AnchorsComponent, SearchComponent, PreviewComponent, CategoryComponent], template: "<section\n  class=\"emoji-mart {{ darkMode ? 'emoji-mart-dark' : '' }}\"\n  [style.width]=\"getWidth()\"\n  [ngStyle]=\"style\"\n>\n  <div class=\"emoji-mart-bar\">\n    <emoji-mart-anchors\n      [categories]=\"categories\"\n      (anchorClick)=\"handleAnchorClick($event)\"\n      [color]=\"color\"\n      [selected]=\"selected\"\n      [i18n]=\"i18n\"\n      [icons]=\"categoriesIcons\"\n    ></emoji-mart-anchors>\n  </div>\n  <emoji-search\n    *ngIf=\"enableSearch\"\n    [i18n]=\"i18n\"\n    (searchResults)=\"handleSearch($event)\"\n    (enterKeyOutsideAngular)=\"handleEnterKey($event)\"\n    [include]=\"include\"\n    [exclude]=\"exclude\"\n    [custom]=\"custom\"\n    [autoFocus]=\"autoFocus\"\n    [icons]=\"searchIcons\"\n    [emojisToShowFilter]=\"emojisToShowFilter\"\n  ></emoji-search>\n  <section #scrollRef class=\"emoji-mart-scroll\" [attr.aria-label]=\"i18n.emojilist\">\n    <emoji-category\n      *ngFor=\"let category of activeCategories; let idx = index; trackBy: categoryTrack\"\n      [id]=\"category.id\"\n      [name]=\"category.name\"\n      [emojis]=\"category.emojis\"\n      [perLine]=\"perLine\"\n      [totalFrequentLines]=\"totalFrequentLines\"\n      [hasStickyPosition]=\"isNative\"\n      [i18n]=\"i18n\"\n      [hideObsolete]=\"hideObsolete\"\n      [notFoundEmoji]=\"notFoundEmoji\"\n      [custom]=\"category.id === RECENT_CATEGORY.id ? CUSTOM_CATEGORY.emojis : undefined\"\n      [recent]=\"category.id === RECENT_CATEGORY.id ? recent : undefined\"\n      [virtualize]=\"virtualize\"\n      [virtualizeOffset]=\"virtualizeOffset\"\n      [emojiIsNative]=\"isNative\"\n      [emojiSkin]=\"skin\"\n      [emojiSize]=\"emojiSize\"\n      [emojiSet]=\"set\"\n      [emojiSheetSize]=\"sheetSize\"\n      [emojiForceSize]=\"isNative\"\n      [emojiTooltip]=\"emojiTooltip\"\n      [emojiBackgroundImageFn]=\"backgroundImageFn\"\n      [emojiImageUrlFn]=\"imageUrlFn\"\n      [emojiUseButton]=\"useButton\"\n      (emojiOverOutsideAngular)=\"handleEmojiOver($event)\"\n      (emojiLeaveOutsideAngular)=\"handleEmojiLeave()\"\n      (emojiClickOutsideAngular)=\"handleEmojiClick($event)\"\n    ></emoji-category>\n  </section>\n  <div class=\"emoji-mart-bar\" *ngIf=\"showPreview\">\n    <emoji-preview\n      [attr.title]=\"title\"\n      [emoji]=\"previewEmoji\"\n      [idleEmoji]=\"emoji\"\n      [emojiIsNative]=\"isNative\"\n      [emojiSize]=\"38\"\n      [emojiSkin]=\"skin\"\n      [emojiSet]=\"set\"\n      [i18n]=\"i18n\"\n      [emojiSheetSize]=\"sheetSize\"\n      [emojiBackgroundImageFn]=\"backgroundImageFn\"\n      [emojiImageUrlFn]=\"imageUrlFn\"\n      (skinChange)=\"handleSkinChange($event)\"\n    ></emoji-preview>\n  </div>\n</section>\n" }]
        }], ctorParameters: function () { return [{ type: i0.NgZone }, { type: i0.Renderer2 }, { type: i0.ChangeDetectorRef }, { type: i1.EmojiFrequentlyService }, { type: undefined, decorators: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGlja2VyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvcGlja2VyL3BpY2tlci5jb21wb25lbnQudHMiLCIuLi8uLi9zcmMvbGliL3BpY2tlci9waWNrZXIuY29tcG9uZW50Lmh0bWwiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ2xFLE9BQU8sRUFDTCx1QkFBdUIsRUFFdkIsU0FBUyxFQUVULFlBQVksRUFDWixNQUFNLEVBQ04sS0FBSyxFQUlMLE1BQU0sRUFDTixXQUFXLEVBR1gsU0FBUyxFQUNULFlBQVksR0FDYixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQ0wsVUFBVSxHQUtYLE1BQU0sZ0NBQWdDLENBQUM7QUFDeEMsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFFekQsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDdkQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ3JELE9BQU8sS0FBSyxLQUFLLE1BQU0sUUFBUSxDQUFDO0FBQ2hDLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUUzQyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQzs7OztBQUV2RCxNQUFNLElBQUksR0FBUTtJQUNoQixNQUFNLEVBQUUsUUFBUTtJQUNoQixTQUFTLEVBQUUsZUFBZTtJQUMxQixRQUFRLEVBQUUsZ0JBQWdCO0lBQzFCLEtBQUssRUFBRSxPQUFPO0lBQ2QsVUFBVSxFQUFFO1FBQ1YsTUFBTSxFQUFFLGdCQUFnQjtRQUN4QixNQUFNLEVBQUUsaUJBQWlCO1FBQ3pCLE1BQU0sRUFBRSxrQkFBa0I7UUFDMUIsTUFBTSxFQUFFLGtCQUFrQjtRQUMxQixLQUFLLEVBQUUsY0FBYztRQUNy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c0JBQTVDLFlBQVk7dUJBQUMsaUJBQWlCO2dCQStCL0IsaUJBQWlCO3NCQURoQixLQUFLOztBQXlXUjs7R0FFRztBQUNILFNBQVMsa0NBQWtDLENBQ3pDLE9BQXdCLEVBQ3hCLE1BQWMsRUFDZCxLQUFRO0lBRVIsSUFBSSxPQUFPLENBQUMsUUFBUSxFQUFFO1FBQ3BCLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0tBQ3ZDO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbW1vbk1vZHVsZSwgaXNQbGF0Zm9ybUJyb3dzZXIgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3V0cHV0LFxuICBQTEFURk9STV9JRCxcbiAgUXVlcnlMaXN0LFxuICBSZW5kZXJlcjIsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0NoaWxkcmVuLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtcbiAgY2F0ZWdvcmllcyxcbiAgRW1vamksXG4gIEVtb2ppQ2F0ZWdvcnksXG4gIEVtb2ppRGF0YSxcbiAgRW1vamlFdmVudCxcbn0gZnJvbSAnQGN0cmwvbmd4LWVtb2ppLW1hcnQvbmd4LWVtb2ppJztcbmltcG9ydCB7IENhdGVnb3J5Q29tcG9uZW50IH0gZnJvbSAnLi9jYXRlZ29yeS5jb21wb25lbnQnO1xuaW1wb3J0IHsgRW1vamlGcmVxdWVudGx5U2VydmljZSB9IGZyb20gJy4vZW1vamktZnJlcXVlbnRseS5zZXJ2aWNlJztcbmltcG9ydCB7IFByZXZpZXdDb21wb25lbnQgfSBmcm9tICcuL3ByZXZpZXcuY29tcG9uZW50JztcbmltcG9ydCB7IFNlYXJjaENvbXBvbmVudCB9IGZyb20gJy4vc2VhcmNoLmNvbXBvbmVudCc7XG5pbXBvcnQgKiBhcyBpY29ucyBmcm9tICcuL3N2Z3MnO1xuaW1wb3J0IHsgbWVhc3VyZVNjcm9sbGJhciB9IGZyb20gJy4vdXRpbHMnO1xuXG5pbXBvcnQgeyBBbmNob3JzQ29tcG9uZW50IH0gZnJvbSAnLi9hbmNob3JzLmNvbXBvbmVudCc7XG5cbmNvbnN0IEkxOE46IGFueSA9IHtcbiAgc2VhcmNoOiAnU2VhcmNoJyxcbiAgZW1vamlsaXN0OiAnTGlzdCBvZiBlbW9qaScsXG4gIG5vdGZvdW5kOiAnTm8gRW1vamkgRm91bmQnLFxuICBjbGVhcjogJ0NsZWFyJyxcbiAgY2F0ZWdvcmllczoge1xuICAgIHNlYXJjaDogJ1NlYXJjaCBSZXN1bHRzJyxcbiAgICByZWNlbnQ6ICdGcmVxdWVudGx5IFVzZWQnLFxuICAgIHBlb3BsZTogJ1NtaWxleXMgJiBQZW9wbGUnLFxuICAgIG5hdHVyZTogJ0FuaW1hbHMgJiBOYXR1cmUnLFxuICAgIGZvb2RzOiAnRm9vZCAmIERyaW5rJyxcbiAgICBhY3Rpdml0eTogJ0FjdGl2aXR5JyxcbiAgICBwbGFjZXM6ICdUcmF2ZWwgJiBQbGFjZXMnLFxuICAgIG9iamVjdHM6ICdPYmplY3RzJyxcbiAgICBzeW1ib2xzOiAnU3ltYm9scycsXG4gICAgZmxhZ3M6ICdGbGFncycsXG4gICAgY3VzdG9tOiAnQ3VzdG9tJyxcbiAgfSxcbiAgc2tpbnRvbmVzOiB7XG4gICAgMTogJ0RlZmF1bHQgU2tpbiBUb25lJyxcbiAgICAyOiAnTGlnaHQgU2tpbiBUb25lJyxcbiAgICAzOiAnTWVkaXVtLUxpZ2h0IFNraW4gVG9uZScsXG4gICAgNDogJ01lZGl1bSBTa2luIFRvbmUnLFxuICAgIDU6ICdNZWRpdW0tRGFyayBTa2luIFRvbmUnLFxuICAgIDY6ICdEYXJrIFNraW4gVG9uZScsXG4gIH0sXG59O1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdlbW9qaS1tYXJ0JyxcbiAgdGVtcGxhdGVVcmw6ICcuL3BpY2tlci5jb21wb25lbnQuaHRtbCcsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBwcmVzZXJ2ZVdoaXRlc3BhY2VzOiBmYWxzZSxcbiAgc3RhbmRhbG9uZTogdHJ1ZSxcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgQW5jaG9yc0NvbXBvbmVudCwgU2VhcmNoQ29tcG9uZW50LCBQcmV2aWV3Q29tcG9uZW50LCBDYXRlZ29yeUNvbXBvbmVudF0sXG59KVxuZXhwb3J0IGNsYXNzIFBpY2tlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgQElucHV0KCkgcGVyTGluZSA9IDk7XG4gIEBJbnB1dCgpIHRvdGFsRnJlcXVlbnRMaW5lcyA9IDQ7XG4gIEBJbnB1dCgpIGkxOG46IGFueSA9IHt9O1xuICBASW5wdXQoKSBzdHlsZTogYW55ID0ge307XG4gIEBJbnB1dCgpIHRpdGxlID0gJ0Vtb2ppIE1hcnTihKInO1xuICBASW5wdXQoKSBlbW9qaSA9ICdkZXBhcnRtZW50X3N0b3JlJztcbiAgQElucHV0KCkgZGFya01vZGUgPSAhIShcbiAgICB0eXBlb2YgbWF0Y2hNZWRpYSA9PT0gJ2Z1bmN0aW9uJyAmJiBtYXRjaE1lZGlhKCcocHJlZmVycy1jb2xvci1zY2hlbWU6IGRhcmspJykubWF0Y2hlc1xuICApO1xuICBASW5wdXQoKSBjb2xvciA9ICcjYWU2NWM1JztcbiAgQElucHV0KCkgaGlkZU9ic29sZXRlID0gdHJ1ZTtcbiAgLyoqIGFsbCBjYXRlZ29yaWVzIHNob3duICovXG4gIEBJbnB1dCgpIGNhdGVnb3JpZXM6IEVtb2ppQ2F0ZWdvcnlbXSA9IFtdO1xuICAvKiogdXNlZCB0byB0ZW1wb3JhcmlseSBkcmF3IGNhdGVnb3JpZXMgKi9cbiAgQElucHV0KCkgYWN0aXZlQ2F0ZWdvcmllczogRW1vamlDYXRlZ29yeVtdID0gW107XG4gIEBJbnB1dCgpIHNldDogRW1vamlbJ3NldCddID0gJ2FwcGxlJztcbiAgQElucHV0KCkgc2tpbjogRW1vamlbJ3NraW4nXSA9IDE7XG4gIC8qKiBSZW5kZXJzIHRoZSBuYXRpdmUgdW5pY29kZSBlbW9qaSAqL1xuICBASW5wdXQoKSBpc05hdGl2ZTogRW1vamlbJ2lzTmF0aXZlJ10gPSBmYWxzZTtcbiAgQElucHV0KCkgZW1vamlTaXplOiBFbW9qaVsnc2l6ZSddID0gMjQ7XG4gIEBJbnB1dCgpIHNoZWV0U2l6ZTogRW1vamlbJ3NoZWV0U2l6ZSddID0gNjQ7XG4gIEBJbnB1dCgpIGVtb2ppc1RvU2hvd0ZpbHRlcj86ICh4OiBzdHJpbmcpID0+IGJvb2xlYW47XG4gIEBJbnB1dCgpIHNob3dQcmV2aWV3ID0gdHJ1ZTtcbiAgQElucHV0KCkgZW1vamlUb29sdGlwID0gZmFsc2U7XG4gIEBJbnB1dCgpIGF1dG9Gb2N1cyA9IGZhbHNlO1xuICBASW5wdXQoKSBjdXN0b206IGFueVtdID0gW107XG4gIEBJbnB1dCgpIGhpZGVSZWNlbnQgPSB0cnVlO1xuICBASW5wdXQoKSBpbWFnZVVybEZuOiBFbW9qaVsnaW1hZ2VVcmxGbiddO1xuICBASW5wdXQoKSBpbmNsdWRlPzogc3RyaW5nW107XG4gIEBJbnB1dCgpIGV4Y2x1ZGU/OiBzdHJpbmdbXTtcbiAgQElucHV0KCkgbm90Rm91bmRFbW9qaSA9ICdzbGV1dGhfb3Jfc3B5JztcbiAgQElucHV0KCkgY2F0ZWdvcmllc0ljb25zID0gaWNvbnMuY2F0ZWdvcmllcztcbiAgQElucHV0KCkgc2VhcmNoSWNvbnMgPSBpY29ucy5zZWFyY2g7XG4gIEBJbnB1dCgpIHVzZUJ1dHRvbiA9IGZhbHNlO1xuICBASW5wdXQoKSBlbmFibGVGcmVxdWVudEVtb2ppU29ydCA9IGZhbHNlO1xuICBASW5wdXQoKSBlbmFibGVTZWFyY2ggPSB0cnVlO1xuICBASW5wdXQoKSBzaG93U2luZ2xlQ2F0ZWdvcnkgPSBmYWxzZTtcbiAgQElucHV0KCkgdmlydHVhbGl6ZSA9IGZhbHNlO1xuICBASW5wdXQoKSB2aXJ0dWFsaXplT2Zmc2V0ID0gMDtcbiAgQElucHV0KCkgcmVjZW50Pzogc3RyaW5nW107XG4gIEBPdXRwdXQoKSBlbW9qaUNsaWNrID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoKSBlbW9qaVNlbGVjdCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCkgc2tpbkNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8RW1vamlbJ3NraW4nXT4oKTtcbiAgQFZpZXdDaGlsZCgnc2Nyb2xsUmVmJywgeyBzdGF0aWM6IHRydWUgfSkgcHJpdmF0ZSBzY3JvbGxSZWYhOiBFbGVtZW50UmVmO1xuICBAVmlld0NoaWxkKFByZXZpZXdDb21wb25lbnQsIHsgc3RhdGljOiBmYWxzZSB9KSBwcmV2aWV3UmVmPzogUHJldmlld0NvbXBvbmVudDtcbiAgQFZpZXdDaGlsZChTZWFyY2hDb21wb25lbnQsIHsgc3RhdGljOiBmYWxzZSB9KSBzZWFyY2hSZWY/OiBTZWFyY2hDb21wb25lbnQ7XG4gIEBWaWV3Q2hpbGRyZW4oQ2F0ZWdvcnlDb21wb25lbnQpIGNhdGVnb3J5UmVmcyE6IFF1ZXJ5TGlzdDxDYXRlZ29yeUNvbXBvbmVudD47XG4gIHNjcm9sbEhlaWdodCA9IDA7XG4gIGNsaWVudEhlaWdodCA9IDA7XG4gIGNsaWVudFdpZHRoID0gMDtcbiAgc2VsZWN0ZWQ/OiBzdHJpbmc7XG4gIG5leHRTY3JvbGw/OiBzdHJpbmc7XG4gIHNjcm9sbFRvcD86IG51bWJlcjtcbiAgZmlyc3RSZW5kZXIgPSB0cnVlO1xuICBwcmV2aWV3RW1vamk6IEVtb2ppRGF0YSB8IG51bGwgPSBudWxsO1xuICBhbmltYXRpb25GcmFtZVJlcXVlc3RJZDogbnVtYmVyIHwgbnVsbCA9IG51bGw7XG4gIE5BTUVTUEFDRSA9ICdlbW9qaS1tYXJ0JztcbiAgbWVhc3VyZVNjcm9sbGJhciA9IDA7XG4gIFJFQ0VOVF9DQVRFR09SWTogRW1vamlDYXRlZ29yeSA9IHtcbiAgICBpZDogJ3JlY2VudCcsXG4gICAgbmFtZTogJ1JlY2VudCcsXG4gICAgZW1vamlzOiBudWxsLFxuICB9O1xuICBTRUFSQ0hfQ0FURUdPUlk6IEVtb2ppQ2F0ZWdvcnkgPSB7XG4gICAgaWQ6ICdzZWFyY2gnLFxuICAgIG5hbWU6ICdTZWFyY2gnLFxuICAgIGVtb2ppczogbnVsbCxcbiAgICBhbmNob3I6IGZhbHNlLFxuICB9O1xuICBDVVNUT01fQ0FURUdPUlk6IEVtb2ppQ2F0ZWdvcnkgPSB7XG4gICAgaWQ6ICdjdXN0b20nLFxuICAgIG5hbWU6ICdDdXN0b20nLFxuICAgIGVtb2ppczogW10sXG4gIH07XG4gIHByaXZhdGUgc2Nyb2xsTGlzdGVuZXIhOiAoKSA9PiB2b2lkO1xuXG4gIEBJbnB1dCgpXG4gIGJhY2tncm91bmRJbWFnZUZuOiBFbW9qaVsnYmFja2dyb3VuZEltYWdlRm4nXSA9IChzZXQ6IHN0cmluZywgc2hlZXRTaXplOiBudW1iZXIpID0+XG4gICAgYGh0dHBzOi8vY2RuLmpzZGVsaXZyLm5ldC9ucG0vZW1vamktZGF0YXNvdXJjZS0ke3NldH1AMTQuMC4wL2ltZy8ke3NldH0vc2hlZXRzLTI1Ni8ke3NoZWV0U2l6ZX0ucG5nYDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIG5nWm9uZTogTmdab25lLFxuICAgIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICBwcml2YXRlIHJlZjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgcHJpdmF0ZSBmcmVxdWVudGx5OiBFbW9qaUZyZXF1ZW50bHlTZXJ2aWNlLFxuICAgIEBJbmplY3QoUExBVEZPUk1fSUQpIHByaXZhdGUgcGxhdGZvcm1JZDogc3RyaW5nLFxuICApIHt9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgLy8gbWVhc3VyZSBzY3JvbGxcbiAgICB0aGlzLm1lYXN1cmVTY3JvbGxiYXIgPSBtZWFzdXJlU2Nyb2xsYmFyKCk7XG5cbiAgICB0aGlzLmkxOG4gPSB7IC4uLkkxOE4sIC4uLnRoaXMuaTE4biB9O1xuICAgIHRoaXMuaTE4bi5jYXRlZ29yaWVzID0geyAuLi5JMThOLmNhdGVnb3JpZXMsIC4uLnRoaXMuaTE4bi5jYXRlZ29yaWVzIH07XG4gICAgdGhpcy5za2luID1cbiAgICAgIEpTT04ucGFyc2UoXG4gICAgICAgIChpc1BsYXRmb3JtQnJvd3Nlcih0aGlzLnBsYXRmb3JtSWQpICYmIGxvY2FsU3RvcmFnZS5nZXRJdGVtKGAke3RoaXMuTkFNRVNQQUNFfS5za2luYCkpIHx8XG4gICAgICAgICAgJ251bGwnLFxuICAgICAgKSB8fCB0aGlzLnNraW47XG5cbiAgICBjb25zdCBhbGxDYXRlZ29yaWVzID0gWy4uLmNhdGVnb3JpZXNdO1xuXG4gICAgaWYgKHRoaXMuY3VzdG9tLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMuQ1VTVE9NX0NBVEVHT1JZLmVtb2ppcyA9IHRoaXMuY3VzdG9tLm1hcChlbW9qaSA9PiB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgLi4uZW1vamksXG4gICAgICAgICAgLy8gYDxDYXRlZ29yeSAvPmAgZXhwZWN0cyBlbW9qaSB0byBoYXZlIGFuIGBpZGAuXG4gICAgICAgICAgaWQ6IGVtb2ppLnNob3J0TmFtZXNbMF0sXG4gICAgICAgICAgY3VzdG9tOiB0cnVlLFxuICAgICAgICB9O1xuICAgICAgfSk7XG5cbiAgICAgIGFsbENhdGVnb3JpZXMucHVzaCh0aGlzLkNVU1RPTV9DQVRFR09SWSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaW5jbHVkZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBhbGxDYXRlZ29yaWVzLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgICAgaWYgKHRoaXMuaW5jbHVkZSEuaW5kZXhPZihhLmlkKSA+IHRoaXMuaW5jbHVkZSEuaW5kZXhPZihiLmlkKSkge1xuICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAtMTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGZvciAoY29uc3QgY2F0ZWdvcnkgb2YgYWxsQ2F0ZWdvcmllcykge1xuICAgICAgY29uc3QgaXNJbmNsdWRlZCA9XG4gICAgICAgIHRoaXMuaW5jbHVkZSAmJiB0aGlzLmluY2x1ZGUubGVuZ3RoID8gdGhpcy5pbmNsdWRlLmluZGV4T2YoY2F0ZWdvcnkuaWQpID4gLTEgOiB0cnVlO1xuICAgICAgY29uc3QgaXNFeGNsdWRlZCA9XG4gICAgICAgIHRoaXMuZXhjbHVkZSAmJiB0aGlzLmV4Y2x1ZGUubGVuZ3RoID8gdGhpcy5leGNsdWRlLmluZGV4T2YoY2F0ZWdvcnkuaWQpID4gLTEgOiBmYWxzZTtcbiAgICAgIGlmICghaXNJbmNsdWRlZCB8fCBpc0V4Y2x1ZGVkKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAodGhpcy5lbW9qaXNUb1Nob3dGaWx0ZXIpIHtcbiAgICAgICAgY29uc3QgbmV3RW1vamlzID0gW107XG5cbiAgICAgICAgY29uc3QgeyBlbW9qaXMgfSA9IGNhdGVnb3J5O1xuICAgICAgICBmb3IgKGxldCBlbW9qaUluZGV4ID0gMDsgZW1vamlJbmRleCA8IGVtb2ppcyEubGVuZ3RoOyBlbW9qaUluZGV4KyspIHtcbiAgICAgICAgICBjb25zdCBlbW9qaSA9IGVtb2ppcyFbZW1vamlJbmRleF07XG4gICAgICAgICAgaWYgKHRoaXMuZW1vamlzVG9TaG93RmlsdGVyKGVtb2ppKSkge1xuICAgICAgICAgICAgbmV3RW1vamlzLnB1c2goZW1vamkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChuZXdFbW9qaXMubGVuZ3RoKSB7XG4gICAgICAgICAgY29uc3QgbmV3Q2F0ZWdvcnkgPSB7XG4gICAgICAgICAgICBlbW9qaXM6IG5ld0Vtb2ppcyxcbiAgICAgICAgICAgIG5hbWU6IGNhdGVnb3J5Lm5hbWUsXG4gICAgICAgICAgICBpZDogY2F0ZWdvcnkuaWQsXG4gICAgICAgICAgfTtcblxuICAgICAgICAgIHRoaXMuY2F0ZWdvcmllcy5wdXNoKG5ld0NhdGVnb3J5KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5jYXRlZ29yaWVzLnB1c2goY2F0ZWdvcnkpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmNhdGVnb3JpZXNJY29ucyA9IHsgLi4uaWNvbnMuY2F0ZWdvcmllcywgLi4udGhpcy5jYXRlZ29yaWVzSWNvbnMgfTtcbiAgICAgIHRoaXMuc2VhcmNoSWNvbnMgPSB7IC4uLmljb25zLnNlYXJjaCwgLi4udGhpcy5zZWFyY2hJY29ucyB9O1xuICAgIH1cblxuICAgIGNvbnN0IGluY2x1ZGVSZWNlbnQgPVxuICAgICAgdGhpcy5pbmNsdWRlICYmIHRoaXMuaW5jbHVkZS5sZW5ndGhcbiAgICAgICAgPyB0aGlzLmluY2x1ZGUuaW5kZXhPZih0aGlzLlJFQ0VOVF9DQVRFR09SWS5pZCkgPiAtMVxuICAgICAgICA6IHRydWU7XG4gICAgY29uc3QgZXhjbHVkZVJlY2VudCA9XG4gICAgICB0aGlzLmV4Y2x1ZGUgJiYgdGhpcy5leGNsdWRlLmxlbmd0aFxuICAgICAgICA/IHRoaXMuZXhjbHVkZS5pbmRleE9mKHRoaXMuUkVDRU5UX0NBVEVHT1JZLmlkKSA+IC0xXG4gICAgICAgIDogZmFsc2U7XG4gICAgaWYgKGluY2x1ZGVSZWNlbnQgJiYgIWV4Y2x1ZGVSZWNlbnQpIHtcbiAgICAgIHRoaXMuaGlkZVJlY2VudCA9IGZhbHNlO1xuICAgICAgdGhpcy5jYXRlZ29yaWVzLnVuc2hpZnQodGhpcy5SRUNFTlRfQ0FURUdPUlkpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmNhdGVnb3JpZXNbMF0pIHtcbiAgICAgIHRoaXMuY2F0ZWdvcmllc1swXS5maXJzdCA9IHRydWU7XG4gICAgfVxuXG4gICAgdGhpcy5jYXRlZ29yaWVzLnVuc2hpZnQodGhpcy5TRUFSQ0hfQ0FURUdPUlkpO1xuICAgIHRoaXMuc2VsZWN0ZWQgPSB0aGlzLmNhdGVnb3JpZXMuZmlsdGVyKGNhdGVnb3J5ID0+IGNhdGVnb3J5LmZpcnN0KVswXS5uYW1lO1xuXG4gICAgLy8gTmVlZCB0byBiZSBjYXJlZnVsIGlmIHNtYWxsIG51bWJlciBvZiBjYXRlZ29yaWVzXG4gICAgY29uc3QgY2F0ZWdvcmllc1RvTG9hZEZpcnN0ID0gTWF0aC5taW4odGhpcy5jYXRlZ29yaWVzLmxlbmd0aCwgMyk7XG4gICAgdGhpcy5zZXRBY3RpdmVDYXRlZ29yaWVzKFxuICAgICAgKHRoaXMuYWN0aXZlQ2F0ZWdvcmllcyA9IHRoaXMuY2F0ZWdvcmllcy5zbGljZSgwLCBjYXRlZ29yaWVzVG9Mb2FkRmlyc3QpKSxcbiAgICApO1xuXG4gICAgLy8gVHJpbSBsYXN0IGFjdGl2ZSBjYXRlZ29yeVxuICAgIGNvbnN0IGxhc3RBY3RpdmVDYXRlZ29yeUVtb2ppcyA9IHRoaXMuY2F0ZWdvcmllc1tjYXRlZ29yaWVzVG9Mb2FkRmlyc3QgLSAxXS5lbW9qaXMhLnNsaWNlKCk7XG4gICAgdGhpcy5jYXRlZ29yaWVzW2NhdGVnb3JpZXNUb0xvYWRGaXJzdCAtIDFdLmVtb2ppcyA9IGxhc3RBY3RpdmVDYXRlZ29yeUVtb2ppcy5zbGljZSgwLCA2MCk7XG5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIC8vIFJlc3RvcmUgbGFzdCBjYXRlZ29yeVxuICAgICAgdGhpcy5jYXRlZ29yaWVzW2NhdGVnb3JpZXNUb0xvYWRGaXJzdCAtIDFdLmVtb2ppcyA9IGxhc3RBY3RpdmVDYXRlZ29yeUVtb2ppcztcbiAgICAgIHRoaXMuc2V0QWN0aXZlQ2F0ZWdvcmllcyh0aGlzLmNhdGVnb3JpZXMpO1xuICAgICAgLy8gVGhlIGBzZXRUaW1lb3V0YCB3aWxsIHRyaWdnZXIgdGhlIGNoYW5nZSBkZXRlY3Rpb24sIGJ1dCBzaW5jZSB3ZSdyZSBpbnNpZGVcbiAgICAgIC8vIHRoZSBPblB1c2ggY29tcG9uZW50IHdlIGNhbiBydW4gY2hhbmdlIGRldGVjdGlvbiBsb2NhbGx5IHN0YXJ0aW5nIGZyb20gdGhpc1xuICAgICAgLy8gY29tcG9uZW50IGFuZCBnb2luZyBkb3duIHRvIHRoZSBjaGlsZHJlbi5cbiAgICAgIHRoaXMucmVmLmRldGVjdENoYW5nZXMoKTtcblxuICAgICAgaXNQbGF0Zm9ybUJyb3dzZXIodGhpcy5wbGF0Zm9ybUlkKSAmJlxuICAgICAgICB0aGlzLm5nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgICAgLy8gVGhlIGB1cGRhdGVDYXRlZ29yaWVzU2l6ZWAgZG9lc24ndCBjaGFuZ2UgcHJvcGVydGllcyB0aGF0IGFyZSB1c2VkXG4gICAgICAgICAgLy8gaW4gdGVtcGxhdGVzLCB0aHVzIHRoaXMgaXMgcnVuIGluIHRoZSBjb250ZXh0IG9mIHRoZSByb290IHpvbmUgdG8gYXZvaWRcbiAgICAgICAgICAvLyBydW5uaW5nIGNoYW5nZSBkZXRlY3Rpb24uXG4gICAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlQ2F0ZWdvcmllc1NpemUoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLm5nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAvLyBET00gZXZlbnRzIHRoYXQgYXJlIGxpc3RlbmVkIGJ5IEFuZ3VsYXIgaW5zaWRlIHRoZSB0ZW1wbGF0ZSB0cmlnZ2VyIGNoYW5nZSBkZXRlY3Rpb25cbiAgICAgIC8vIGFuZCBhbHNvIHdyYXBwZWQgaW50byBhZGRpdGlvbmFsIGZ1bmN0aW9ucyB0aGF0IGNhbGwgYG1hcmtGb3JDaGVjaygpYC4gV2UgbGlzdGVuIGBzY3JvbGxgXG4gICAgICAvLyBpbiB0aGUgY29udGV4dCBvZiB0aGUgcm9vdCB6b25lIHNpbmNlIGl0IHdpbGwgbm90IHRyaWdnZXIgY2hhbmdlIGRldGVjdGlvbiBlYWNoIHRpbWVcbiAgICAgIC8vIHRoZSBgc2Nyb2xsYCBldmVudCBpcyBkaXNwYXRjaGVkLlxuICAgICAgdGhpcy5zY3JvbGxMaXN0ZW5lciA9IHRoaXMucmVuZGVyZXIubGlzdGVuKHRoaXMuc2Nyb2xsUmVmLm5hdGl2ZUVsZW1lbnQsICdzY3JvbGwnLCAoKSA9PiB7XG4gICAgICAgIHRoaXMuaGFuZGxlU2Nyb2xsKCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuc2Nyb2xsTGlzdGVuZXI/LigpO1xuICAgIC8vIFRoaXMgaXMgY2FsbGVkIGhlcmUgYmVjYXVzZSB0aGUgY29tcG9uZW50IG1pZ2h0IGJlIGRlc3Ryb3llZFxuICAgIC8vIGJ1dCB0aGVyZSB3aWxsIHN0aWxsIGJlIGEgYHJlcXVlc3RBbmltYXRpb25GcmFtZWAgY2FsbGJhY2sgaW4gdGhlIHF1ZXVlXG4gICAgLy8gdGhhdCBjYWxscyBgZGV0ZWN0Q2hhbmdlcygpYCBvbiB0aGUgYFZpZXdSZWZgLiBUaGlzIHdpbGwgbGVhZCB0byBhIHJ1bnRpbWVcbiAgICAvLyBleGNlcHRpb24gaWYgdGhlIGBkZXRlY3RDaGFuZ2VzKClgIGlzIGNhbGxlZCBhZnRlciB0aGUgYFZpZXdSZWZgIGlzIGRlc3Ryb3llZC5cbiAgICB0aGlzLmNhbmNlbEFuaW1hdGlvbkZyYW1lKCk7XG4gIH1cblxuICBzZXRBY3RpdmVDYXRlZ29yaWVzKGNhdGVnb3JpZXNUb01ha2VBY3RpdmU6IEFycmF5PEVtb2ppQ2F0ZWdvcnk+KSB7XG4gICAgaWYgKHRoaXMuc2hvd1NpbmdsZUNhdGVnb3J5KSB7XG4gICAgICB0aGlzLmFjdGl2ZUNhdGVnb3JpZXMgPSBjYXRlZ29yaWVzVG9NYWtlQWN0aXZlLmZpbHRlcihcbiAgICAgICAgeCA9PiB4Lm5hbWUgPT09IHRoaXMuc2VsZWN0ZWQgfHwgeCA9PT0gdGhpcy5TRUFSQ0hfQ0FURUdPUlksXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmFjdGl2ZUNhdGVnb3JpZXMgPSBjYXRlZ29yaWVzVG9NYWtlQWN0aXZlO1xuICAgIH1cbiAgfVxuICB1cGRhdGVDYXRlZ29yaWVzU2l6ZSgpIHtcbiAgICB0aGlzLmNhdGVnb3J5UmVmcy5mb3JFYWNoKGNvbXBvbmVudCA9PiBjb21wb25lbnQubWVtb2l6ZVNpemUoKSk7XG5cbiAgICBpZiAodGhpcy5zY3JvbGxSZWYpIHtcbiAgICAgIGNvbnN0IHRhcmdldCA9IHRoaXMuc2Nyb2xsUmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgICB0aGlzLnNjcm9sbEhlaWdodCA9IHRhcmdldC5zY3JvbGxIZWlnaHQ7XG4gICAgICB0aGlzLmNsaWVudEhlaWdodCA9IHRhcmdldC5jbGllbnRIZWlnaHQ7XG4gICAgICB0aGlzLmNsaWVudFdpZHRoID0gdGFyZ2V0LmNsaWVudFdpZHRoO1xuICAgIH1cbiAgfVxuICBoYW5kbGVBbmNob3JDbGljaygkZXZlbnQ6IHsgY2F0ZWdvcnk6IEVtb2ppQ2F0ZWdvcnk7IGluZGV4OiBudW1iZXIgfSkge1xuICAgIHRoaXMudXBkYXRlQ2F0ZWdvcmllc1NpemUoKTtcbiAgICB0aGlzLnNlbGVjdGVkID0gJGV2ZW50LmNhdGVnb3J5Lm5hbWU7XG4gICAgdGhpcy5zZXRBY3RpdmVDYXRlZ29yaWVzKHRoaXMuY2F0ZWdvcmllcyk7XG5cbiAgICBpZiAodGhpcy5TRUFSQ0hfQ0FURUdPUlkuZW1vamlzKSB7XG4gICAgICB0aGlzLmhhbmRsZVNlYXJjaChudWxsKTtcbiAgICAgIHRoaXMuc2VhcmNoUmVmPy5jbGVhcigpO1xuICAgICAgdGhpcy5oYW5kbGVBbmNob3JDbGljaygkZXZlbnQpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGNvbXBvbmVudCA9IHRoaXMuY2F0ZWdvcnlSZWZzLmZpbmQobiA9PiBuLmlkID09PSAkZXZlbnQuY2F0ZWdvcnkuaWQpO1xuICAgIGlmIChjb21wb25lbnQpIHtcbiAgICAgIGxldCB7IHRvcCB9ID0gY29tcG9uZW50O1xuXG4gICAgICBpZiAoJGV2ZW50LmNhdGVnb3J5LmZpcnN0KSB7XG4gICAgICAgIHRvcCA9IDA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0b3AgKz0gMTtcbiAgICAgIH1cbiAgICAgIHRoaXMuc2Nyb2xsUmVmLm5hdGl2ZUVsZW1lbnQuc2Nyb2xsVG9wID0gdG9wO1xuICAgIH1cbiAgICB0aGlzLm5leHRTY3JvbGwgPSAkZXZlbnQuY2F0ZWdvcnkubmFtZTtcblxuICAgIC8vIGhhbmRsZSBjb21wb25lbnQgc2Nyb2xsaW5nIHRvIGxvYWQgZW1vamlzXG4gICAgZm9yIChjb25zdCBjYXRlZ29yeSBvZiB0aGlzLmNhdGVnb3JpZXMpIHtcbiAgICAgIGNvbnN0IGNvbXBvbmVudFRvU2Nyb2xsID0gdGhpcy5jYXRlZ29yeVJlZnMuZmluZCgoeyBpZCB9KSA9PiBpZCA9PT0gY2F0ZWdvcnkuaWQpO1xuICAgICAgY29tcG9uZW50VG9TY3JvbGw/LmhhbmRsZVNjcm9sbCh0aGlzLnNjcm9sbFJlZi5uYXRpdmVFbGVtZW50LnNjcm9sbFRvcCk7XG4gICAgfVxuICB9XG4gIGNhdGVnb3J5VHJhY2soaW5kZXg6IG51bWJlciwgaXRlbTogYW55KSB7XG4gICAgcmV0dXJuIGl0ZW0uaWQ7XG4gIH1cbiAgaGFuZGxlU2Nyb2xsKG5vU2VsZWN0aW9uQ2hhbmdlID0gZmFsc2UpIHtcbiAgICBpZiAodGhpcy5uZXh0U2Nyb2xsKSB7XG4gICAgICB0aGlzLnNlbGVjdGVkID0gdGhpcy5uZXh0U2Nyb2xsO1xuICAgICAgdGhpcy5uZXh0U2Nyb2xsID0gdW5kZWZpbmVkO1xuICAgICAgdGhpcy5yZWYuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuc2Nyb2xsUmVmKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0aGlzLnNob3dTaW5nbGVDYXRlZ29yeSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBhY3RpdmVDYXRlZ29yeTogRW1vamlDYXRlZ29yeSB8IHVuZGVmaW5lZDtcbiAgICBpZiAodGhpcy5TRUFSQ0hfQ0FURUdPUlkuZW1vamlzKSB7XG4gICAgICBhY3RpdmVDYXRlZ29yeSA9IHRoaXMuU0VBUkNIX0NBVEVHT1JZO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCB0YXJnZXQgPSB0aGlzLnNjcm9sbFJlZi5uYXRpdmVFbGVtZW50O1xuICAgICAgLy8gY2hlY2sgc2Nyb2xsIGlzIG5vdCBhdCBib3R0b21cbiAgICAgIGlmICh0YXJnZXQuc2Nyb2xsVG9wID09PSAwKSB7XG4gICAgICAgIC8vIGhpdCB0aGUgVE9QXG4gICAgICAgIGFjdGl2ZUNhdGVnb3J5ID0gdGhpcy5jYXRlZ29yaWVzLmZpbmQobiA9PiBuLmZpcnN0ID09PSB0cnVlKTtcbiAgICAgIH0gZWxzZSBpZiAodGFyZ2V0LnNjcm9sbEhlaWdodCAtIHRhcmdldC5zY3JvbGxUb3AgPT09IHRoaXMuY2xpZW50SGVpZ2h0KSB7XG4gICAgICAgIC8vIHNjcm9sbGVkIHRvIGJvdHRvbSBhY3RpdmF0ZSBsYXN0IGNhdGVnb3J5XG4gICAgICAgIGFjdGl2ZUNhdGVnb3J5ID0gdGhpcy5jYXRlZ29yaWVzW3RoaXMuY2F0ZWdvcmllcy5sZW5ndGggLSAxXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHNjcm9sbGluZ1xuICAgICAgICBmb3IgKGNvbnN0IGNhdGVnb3J5IG9mIHRoaXMuY2F0ZWdvcmllcykge1xuICAgICAgICAgIGNvbnN0IGNvbXBvbmVudCA9IHRoaXMuY2F0ZWdvcnlSZWZzLmZpbmQoKHsgaWQgfSkgPT4gaWQgPT09IGNhdGVnb3J5LmlkKTtcbiAgICAgICAgICBjb25zdCBhY3RpdmU6IGJvb2xlYW4gfCB1bmRlZmluZWQgPSBjb21wb25lbnQ/LmhhbmRsZVNjcm9sbCh0YXJnZXQuc2Nyb2xsVG9wKTtcbiAgICAgICAgICBpZiAoYWN0aXZlKSB7XG4gICAgICAgICAgICBhY3RpdmVDYXRlZ29yeSA9IGNhdGVnb3J5O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLnNjcm9sbFRvcCA9IHRhcmdldC5zY3JvbGxUb3A7XG4gICAgfVxuICAgIC8vIFRoaXMgd2lsbCBhbGxvdyB1cyB0byBydW4gdGhlIGNoYW5nZSBkZXRlY3Rpb24gb25seSB3aGVuIHRoZSBjYXRlZ29yeSBjaGFuZ2VzLlxuICAgIGlmICghbm9TZWxlY3Rpb25DaGFuZ2UgJiYgYWN0aXZlQ2F0ZWdvcnkgJiYgYWN0aXZlQ2F0ZWdvcnkubmFtZSAhPT0gdGhpcy5zZWxlY3RlZCkge1xuICAgICAgdGhpcy5zZWxlY3RlZCA9IGFjdGl2ZUNhdGVnb3J5Lm5hbWU7XG4gICAgICB0aGlzLnJlZi5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgfSBlbHNlIGlmIChub1NlbGVjdGlvbkNoYW5nZSkge1xuICAgICAgdGhpcy5yZWYuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZVNlYXJjaCgkZW1vamlzOiBhbnlbXSB8IG51bGwpIHtcbiAgICB0aGlzLlNFQVJDSF9DQVRFR09SWS5lbW9qaXMgPSAkZW1vamlzO1xuICAgIGZvciAoY29uc3QgY29tcG9uZW50IG9mIHRoaXMuY2F0ZWdvcnlSZWZzLnRvQXJyYXkoKSkge1xuICAgICAgaWYgKGNvbXBvbmVudC5uYW1lID09PSAnU2VhcmNoJykge1xuICAgICAgICBjb21wb25lbnQuZW1vamlzID0gJGVtb2ppcztcbiAgICAgICAgY29tcG9uZW50LnVwZGF0ZURpc3BsYXkoJGVtb2ppcyA/ICdibG9jaycgOiAnbm9uZScpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29tcG9uZW50LnVwZGF0ZURpc3BsYXkoJGVtb2ppcyA/ICdub25lJyA6ICdibG9jaycpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuc2Nyb2xsUmVmLm5hdGl2ZUVsZW1lbnQuc2Nyb2xsVG9wID0gMDtcbiAgICB0aGlzLmhhbmRsZVNjcm9sbCgpO1xuICB9XG5cbiAgaGFuZGxlRW50ZXJLZXkoJGV2ZW50OiBFdmVudCwgZW1vamk/OiBFbW9qaURhdGEpOiB2b2lkIHtcbiAgICAvLyBOb3RlOiB0aGUgYGhhbmRsZUVudGVyS2V5YCBpcyBpbnZva2VkIHdoZW4gdGhlIHNlYXJjaCBjb21wb25lbnQgZGlzcGF0Y2hlcyB0aGVcbiAgICAvLyAgICAgICBgZW50ZXJLZXlPdXRzaWRlQW5ndWxhcmAgZXZlbnQgb3Igd2hlbiBhbnkgZW1vamkgaXMgY2xpY2tlZCB0aHVzIGBlbW9qaUNsaWNrT3V0c2lkZUFuZ3VsYXJgXG4gICAgLy8gICAgICAgZXZlbnQgaXMgZGlzcGF0Y2hlZC4gQm90aCBldmVudHMgYXJlIGRpc3BhdGNoZWQgb3V0c2lkZSBvZiB0aGUgQW5ndWxhciB6b25lIHRvIHByZXZlbnRcbiAgICAvLyAgICAgICBuby1vcCB0aWNrcywgYmFzaWNhbGx5IHdoZW4gdXNlcnMgb3V0c2lkZSBvZiB0aGUgcGlja2VyIGNvbXBvbmVudCBhcmUgbm90IGxpc3RlbmluZ1xuICAgIC8vICAgICAgIHRvIGFueSBvZiB0aGVzZSBldmVudHMuXG5cbiAgICBpZiAoIWVtb2ppKSB7XG4gICAgICBpZiAodGhpcy5TRUFSQ0hfQ0FURUdPUlkuZW1vamlzICE9PSBudWxsICYmIHRoaXMuU0VBUkNIX0NBVEVHT1JZLmVtb2ppcy5sZW5ndGgpIHtcbiAgICAgICAgZW1vamkgPSB0aGlzLlNFQVJDSF9DQVRFR09SWS5lbW9qaXNbMF07XG4gICAgICAgIGlmIChlbW9qaSkge1xuICAgICAgICAgIGRpc3BhdGNoSW5Bbmd1bGFyQ29udGV4dElmT2JzZXJ2ZWQodGhpcy5lbW9qaVNlbGVjdCwgdGhpcy5uZ1pvbmUsIHsgJGV2ZW50LCBlbW9qaSB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuaGlkZVJlY2VudCAmJiAhdGhpcy5yZWNlbnQgJiYgZW1vamkpIHtcbiAgICAgIHRoaXMuZnJlcXVlbnRseS5hZGQoZW1vamkpO1xuICAgIH1cblxuICAgIGNvbnN0IGNvbXBvbmVudCA9IHRoaXMuY2F0ZWdvcnlSZWZzLnRvQXJyYXkoKVsxXTtcbiAgICBpZiAoY29tcG9uZW50ICYmIHRoaXMuZW5hYmxlRnJlcXVlbnRFbW9qaVNvcnQpIHtcbiAgICAgIHRoaXMubmdab25lLnJ1bigoKSA9PiB7XG4gICAgICAgIGNvbXBvbmVudC51cGRhdGVSZWNlbnRFbW9qaXMoKTtcbiAgICAgICAgY29tcG9uZW50LnJlZi5tYXJrRm9yQ2hlY2soKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICBoYW5kbGVFbW9qaU92ZXIoJGV2ZW50OiBFbW9qaUV2ZW50KSB7XG4gICAgaWYgKCF0aGlzLnNob3dQcmV2aWV3IHx8ICF0aGlzLnByZXZpZXdSZWYpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBlbW9qaURhdGEgPSB0aGlzLkNVU1RPTV9DQVRFR09SWS5lbW9qaXMhLmZpbmQoXG4gICAgICAoY3VzdG9tRW1vamk6IGFueSkgPT4gY3VzdG9tRW1vamkuaWQgPT09ICRldmVudC5lbW9qaS5pZCxcbiAgICApO1xuICAgIGlmIChlbW9qaURhdGEpIHtcbiAgICAgICRldmVudC5lbW9qaSA9IHsgLi4uZW1vamlEYXRhIH07XG4gICAgfVxuXG4gICAgdGhpcy5wcmV2aWV3RW1vamkgPSAkZXZlbnQuZW1vamk7XG4gICAgdGhpcy5jYW5jZWxBbmltYXRpb25GcmFtZSgpO1xuICAgIHRoaXMucmVmLmRldGVjdENoYW5nZXMoKTtcbiAgfVxuXG4gIGhhbmRsZUVtb2ppTGVhdmUoKSB7XG4gICAgaWYgKCF0aGlzLnNob3dQcmV2aWV3IHx8ICF0aGlzLnByZXZpZXdSZWYpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gTm90ZTogYGhhbmRsZUVtb2ppTGVhdmVgIHdpbGwgYmUgaW52b2tlZCBvdXRzaWRlIG9mIHRoZSBBbmd1bGFyIHpvbmUgYmVjYXVzZSBvZiB0aGUgYG1vdXNlbGVhdmVgXG4gICAgLy8gICAgICAgZXZlbnQgc2V0IHVwIG91dHNpZGUgb2YgdGhlIEFuZ3VsYXIgem9uZSBpbiBgbmd4LWVtb2ppYC4gU2VlIGBzZXR1cE1vdXNlTGVhdmVMaXN0ZW5lcmAuXG4gICAgLy8gICAgICAgVGhpcyBpcyBkb25lIGV4cGxpY2l0bHkgYmVjYXVzZSB3ZSBkb24ndCBoYXZlIHRvIHJ1biByZWR1bmRhbnQgY2hhbmdlIGRldGVjdGlvbiBzaW5jZSB3ZVxuICAgIC8vICAgICAgIHdvdWxkIHN0aWxsIHdhbnQgdG8gbGVhdmUgdGhlIEFuZ3VsYXIgem9uZSBoZXJlIHdoZW4gc2NoZWR1bGluZyBhbmltYXRpb24gZnJhbWUuXG4gICAgdGhpcy5hbmltYXRpb25GcmFtZVJlcXVlc3RJZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICB0aGlzLnByZXZpZXdFbW9qaSA9IG51bGw7XG4gICAgICB0aGlzLnJlZi5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgfSk7XG4gIH1cblxuICBoYW5kbGVFbW9qaUNsaWNrKCRldmVudDogRW1vamlFdmVudCkge1xuICAgIC8vIE5vdGU6IHdlJ3JlIGdldHRpbmcgYmFjayBpbnRvIHRoZSBBbmd1bGFyIHpvbmUgYmVjYXVzZSBjbGljayBldmVudHMgb24gZW1vamlzIGFyZSBoYW5kbGVkXG4gICAgLy8gICAgICAgb3V0c2lkZSBvZiB0aGUgQW5ndWxhciB6b25lLlxuICAgIGRpc3BhdGNoSW5Bbmd1bGFyQ29udGV4dElmT2JzZXJ2ZWQodGhpcy5lbW9qaUNsaWNrLCB0aGlzLm5nWm9uZSwgJGV2ZW50KTtcbiAgICBkaXNwYXRjaEluQW5ndWxhckNvbnRleHRJZk9ic2VydmVkKHRoaXMuZW1vamlTZWxlY3QsIHRoaXMubmdab25lLCAkZXZlbnQpO1xuICAgIHRoaXMuaGFuZGxlRW50ZXJLZXkoJGV2ZW50LiRldmVudCwgJGV2ZW50LmVtb2ppKTtcbiAgfVxuXG4gIGhhbmRsZVNraW5DaGFuZ2Uoc2tpbjogRW1vamlbJ3NraW4nXSkge1xuICAgIHRoaXMuc2tpbiA9IHNraW47XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oYCR7dGhpcy5OQU1FU1BBQ0V9LnNraW5gLCBTdHJpbmcoc2tpbikpO1xuICAgIHRoaXMuc2tpbkNoYW5nZS5lbWl0KHNraW4pO1xuICB9XG5cbiAgZ2V0V2lkdGgoKTogc3RyaW5nIHtcbiAgICBpZiAodGhpcy5zdHlsZSAmJiB0aGlzLnN0eWxlLndpZHRoKSB7XG4gICAgICByZXR1cm4gdGhpcy5zdHlsZS53aWR0aDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMucGVyTGluZSAqICh0aGlzLmVtb2ppU2l6ZSArIDEyKSArIDEyICsgMiArIHRoaXMubWVhc3VyZVNjcm9sbGJhciArICdweCc7XG4gIH1cblxuICBwcml2YXRlIGNhbmNlbEFuaW1hdGlvbkZyYW1lKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmFuaW1hdGlvbkZyYW1lUmVxdWVzdElkICE9PSBudWxsKSB7XG4gICAgICBjYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLmFuaW1hdGlvbkZyYW1lUmVxdWVzdElkKTtcbiAgICAgIHRoaXMuYW5pbWF0aW9uRnJhbWVSZXF1ZXN0SWQgPSBudWxsO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFRoaXMgaXMgb25seSBhIGhlbHBlciBmdW5jdGlvbiBiZWNhdXNlIHRoZSBzYW1lIGNvZGUgaXMgYmVpbmcgcmUtdXNlZCBtYW55IHRpbWVzLlxuICovXG5mdW5jdGlvbiBkaXNwYXRjaEluQW5ndWxhckNvbnRleHRJZk9ic2VydmVkPFQ+KFxuICBlbWl0dGVyOiBFdmVudEVtaXR0ZXI8VD4sXG4gIG5nWm9uZTogTmdab25lLFxuICB2YWx1ZTogVCxcbik6IHZvaWQge1xuICBpZiAoZW1pdHRlci5vYnNlcnZlZCkge1xuICAgIG5nWm9uZS5ydW4oKCkgPT4gZW1pdHRlci5lbWl0KHZhbHVlKSk7XG4gIH1cbn1cbiIsIjxzZWN0aW9uXG4gIGNsYXNzPVwiZW1vamktbWFydCB7eyBkYXJrTW9kZSA/ICdlbW9qaS1tYXJ0LWRhcmsnIDogJycgfX1cIlxuICBbc3R5bGUud2lkdGhdPVwiZ2V0V2lkdGgoKVwiXG4gIFtuZ1N0eWxlXT1cInN0eWxlXCJcbj5cbiAgPGRpdiBjbGFzcz1cImVtb2ppLW1hcnQtYmFyXCI+XG4gICAgPGVtb2ppLW1hcnQtYW5jaG9yc1xuICAgICAgW2NhdGVnb3JpZXNdPVwiY2F0ZWdvcmllc1wiXG4gICAgICAoYW5jaG9yQ2xpY2spPVwiaGFuZGxlQW5jaG9yQ2xpY2soJGV2ZW50KVwiXG4gICAgICBbY29sb3JdPVwiY29sb3JcIlxuICAgICAgW3NlbGVjdGVkXT1cInNlbGVjdGVkXCJcbiAgICAgIFtpMThuXT1cImkxOG5cIlxuICAgICAgW2ljb25zXT1cImNhdGVnb3JpZXNJY29uc1wiXG4gICAgPjwvZW1vamktbWFydC1hbmNob3JzPlxuICA8L2Rpdj5cbiAgPGVtb2ppLXNlYXJjaFxuICAgICpuZ0lmPVwiZW5hYmxlU2VhcmNoXCJcbiAgICBbaTE4bl09XCJpMThuXCJcbiAgICAoc2VhcmNoUmVzdWx0cyk9XCJoYW5kbGVTZWFyY2goJGV2ZW50KVwiXG4gICAgKGVudGVyS2V5T3V0c2lkZUFuZ3VsYXIpPVwiaGFuZGxlRW50ZXJLZXkoJGV2ZW50KVwiXG4gICAgW2luY2x1ZGVdPVwiaW5jbHVkZVwiXG4gICAgW2V4Y2x1ZGVdPVwiZXhjbHVkZVwiXG4gICAgW2N1c3RvbV09XCJjdXN0b21cIlxuICAgIFthdXRvRm9jdXNdPVwiYXV0b0ZvY3VzXCJcbiAgICBbaWNvbnNdPVwic2VhcmNoSWNvbnNcIlxuICAgIFtlbW9qaXNUb1Nob3dGaWx0ZXJdPVwiZW1vamlzVG9TaG93RmlsdGVyXCJcbiAgPjwvZW1vamktc2VhcmNoPlxuICA8c2VjdGlvbiAjc2Nyb2xsUmVmIGNsYXNzPVwiZW1vamktbWFydC1zY3JvbGxcIiBbYXR0ci5hcmlhLWxhYmVsXT1cImkxOG4uZW1vamlsaXN0XCI+XG4gICAgPGVtb2ppLWNhdGVnb3J5XG4gICAgICAqbmdGb3I9XCJsZXQgY2F0ZWdvcnkgb2YgYWN0aXZlQ2F0ZWdvcmllczsgbGV0IGlkeCA9IGluZGV4OyB0cmFja0J5OiBjYXRlZ29yeVRyYWNrXCJcbiAgICAgIFtpZF09XCJjYXRlZ29yeS5pZFwiXG4gICAgICBbbmFtZV09XCJjYXRlZ29yeS5uYW1lXCJcbiAgICAgIFtlbW9qaXNdPVwiY2F0ZWdvcnkuZW1vamlzXCJcbiAgICAgIFtwZXJMaW5lXT1cInBlckxpbmVcIlxuICAgICAgW3RvdGFsRnJlcXVlbnRMaW5lc109XCJ0b3RhbEZyZXF1ZW50TGluZXNcIlxuICAgICAgW2hhc1N0aWNreVBvc2l0aW9uXT1cImlzTmF0aXZlXCJcbiAgICAgIFtpMThuXT1cImkxOG5cIlxuICAgICAgW2hpZGVPYnNvbGV0ZV09XCJoaWRlT2Jzb2xldGVcIlxuICAgICAgW25vdEZvdW5kRW1vamldPVwibm90Rm91bmRFbW9qaVwiXG4gICAgICBbY3VzdG9tXT1cImNhdGVnb3J5LmlkID09PSBSRUNFTlRfQ0FURUdPUlkuaWQgPyBDVVNUT01fQ0FURUdPUlkuZW1vamlzIDogdW5kZWZpbmVkXCJcbiAgICAgIFtyZWNlbnRdPVwiY2F0ZWdvcnkuaWQgPT09IFJFQ0VOVF9DQVRFR09SWS5pZCA/IHJlY2VudCA6IHVuZGVmaW5lZFwiXG4gICAgICBbdmlydHVhbGl6ZV09XCJ2aXJ0dWFsaXplXCJcbiAgICAgIFt2aXJ0dWFsaXplT2Zmc2V0XT1cInZpcnR1YWxpemVPZmZzZXRcIlxuICAgICAgW2Vtb2ppSXNOYXRpdmVdPVwiaXNOYXRpdmVcIlxuICAgICAgW2Vtb2ppU2tpbl09XCJza2luXCJcbiAgICAgIFtlbW9qaVNpemVdPVwiZW1vamlTaXplXCJcbiAgICAgIFtlbW9qaVNldF09XCJzZXRcIlxuICAgICAgW2Vtb2ppU2hlZXRTaXplXT1cInNoZWV0U2l6ZVwiXG4gICAgICBbZW1vamlGb3JjZVNpemVdPVwiaXNOYXRpdmVcIlxuICAgICAgW2Vtb2ppVG9vbHRpcF09XCJlbW9qaVRvb2x0aXBcIlxuICAgICAgW2Vtb2ppQmFja2dyb3VuZEltYWdlRm5dPVwiYmFja2dyb3VuZEltYWdlRm5cIlxuICAgICAgW2Vtb2ppSW1hZ2VVcmxGbl09XCJpbWFnZVVybEZuXCJcbiAgICAgIFtlbW9qaVVzZUJ1dHRvbl09XCJ1c2VCdXR0b25cIlxuICAgICAgKGVtb2ppT3Zlck91dHNpZGVBbmd1bGFyKT1cImhhbmRsZUVtb2ppT3ZlcigkZXZlbnQpXCJcbiAgICAgIChlbW9qaUxlYXZlT3V0c2lkZUFuZ3VsYXIpPVwiaGFuZGxlRW1vamlMZWF2ZSgpXCJcbiAgICAgIChlbW9qaUNsaWNrT3V0c2lkZUFuZ3VsYXIpPVwiaGFuZGxlRW1vamlDbGljaygkZXZlbnQpXCJcbiAgICA+PC9lbW9qaS1jYXRlZ29yeT5cbiAgPC9zZWN0aW9uPlxuICA8ZGl2IGNsYXNzPVwiZW1vamktbWFydC1iYXJcIiAqbmdJZj1cInNob3dQcmV2aWV3XCI+XG4gICAgPGVtb2ppLXByZXZpZXdcbiAgICAgIFthdHRyLnRpdGxlXT1cInRpdGxlXCJcbiAgICAgIFtlbW9qaV09XCJwcmV2aWV3RW1vamlcIlxuICAgICAgW2lkbGVFbW9qaV09XCJlbW9qaVwiXG4gICAgICBbZW1vamlJc05hdGl2ZV09XCJpc05hdGl2ZVwiXG4gICAgICBbZW1vamlTaXplXT1cIjM4XCJcbiAgICAgIFtlbW9qaVNraW5dPVwic2tpblwiXG4gICAgICBbZW1vamlTZXRdPVwic2V0XCJcbiAgICAgIFtpMThuXT1cImkxOG5cIlxuICAgICAgW2Vtb2ppU2hlZXRTaXplXT1cInNoZWV0U2l6ZVwiXG4gICAgICBbZW1vamlCYWNrZ3JvdW5kSW1hZ2VGbl09XCJiYWNrZ3JvdW5kSW1hZ2VGblwiXG4gICAgICBbZW1vamlJbWFnZVVybEZuXT1cImltYWdlVXJsRm5cIlxuICAgICAgKHNraW5DaGFuZ2UpPVwiaGFuZGxlU2tpbkNoYW5nZSgkZXZlbnQpXCJcbiAgICA+PC9lbW9qaS1wcmV2aWV3PlxuICA8L2Rpdj5cbjwvc2VjdGlvbj5cbiJdfQ==