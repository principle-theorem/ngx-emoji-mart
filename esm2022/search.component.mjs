import { Component, EventEmitter, Input, Output, ViewChild, } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "./emoji-search.service";
import * as i2 from "@angular/forms";
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
    static ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "16.0.5", ngImport: i0, type: SearchComponent, deps: [{ token: i0.NgZone }, { token: i1.EmojiSearch }], target: i0.ɵɵFactoryTarget.Component });
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
  `, isInline: true, dependencies: [{ kind: "ngmodule", type: FormsModule }, { kind: "directive", type: i2.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i2.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i2.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }] });
}
export { SearchComponent };
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
        }], ctorParameters: function () { return [{ type: i0.NgZone }, { type: i1.EmojiSearch }]; }, propDecorators: { maxResults: [{
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VhcmNoLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9saWIvcGlja2VyL3NlYXJjaC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUVMLFNBQVMsRUFFVCxZQUFZLEVBQ1osS0FBSyxFQUlMLE1BQU0sRUFDTixTQUFTLEdBQ1YsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRzdDLE9BQU8sRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQzFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7OztBQUUzQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFFWCxNQTRDYSxlQUFlO0lBbUJOO0lBQXdCO0lBbEJuQyxVQUFVLEdBQUcsRUFBRSxDQUFDO0lBQ2hCLFNBQVMsR0FBRyxLQUFLLENBQUM7SUFDbEIsSUFBSSxDQUFNO0lBQ1YsT0FBTyxHQUFhLEVBQUUsQ0FBQztJQUN2QixPQUFPLEdBQWEsRUFBRSxDQUFDO0lBQ3ZCLE1BQU0sR0FBVSxFQUFFLENBQUM7SUFDbkIsS0FBSyxDQUE2QjtJQUNsQyxrQkFBa0IsQ0FBdUI7SUFDeEMsYUFBYSxHQUFHLElBQUksWUFBWSxFQUFTLENBQUM7SUFDMUMsc0JBQXNCLEdBQUcsSUFBSSxZQUFZLEVBQWlCLENBQUM7SUFDcEIsUUFBUSxDQUFnQztJQUN6RixXQUFXLEdBQUcsS0FBSyxDQUFDO0lBQ3BCLElBQUksQ0FBVTtJQUNkLEtBQUssR0FBRyxFQUFFLENBQUM7SUFDWCxPQUFPLEdBQUcscUJBQXFCLEVBQUUsRUFBRSxFQUFFLENBQUM7SUFFOUIsUUFBUSxHQUFHLElBQUksT0FBTyxFQUFRLENBQUM7SUFFdkMsWUFBb0IsTUFBYyxFQUFVLFdBQXdCO1FBQWhELFdBQU0sR0FBTixNQUFNLENBQVE7UUFBVSxnQkFBVyxH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QU87c0JBQWYsS0FBSztnQkFDRyxNQUFNO3NCQUFkLEtBQUs7Z0JBQ0csS0FBSztzQkFBYixLQUFLO2dCQUNHLGtCQUFrQjtzQkFBMUIsS0FBSztnQkFDSSxhQUFhO3NCQUF0QixNQUFNO2dCQUNHLHNCQUFzQjtzQkFBL0IsTUFBTTtnQkFDMEMsUUFBUTtzQkFBeEQsU0FBUzt1QkFBQyxVQUFVLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIFZpZXdDaGlsZCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBGb3Jtc01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuaW1wb3J0IHsgRW1vamlTZWFyY2ggfSBmcm9tICcuL2Vtb2ppLXNlYXJjaC5zZXJ2aWNlJztcbmltcG9ydCB7IFN1YmplY3QsIGZyb21FdmVudCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgdGFrZVVudGlsIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5sZXQgaWQgPSAwO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdlbW9qaS1zZWFyY2gnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXYgY2xhc3M9XCJlbW9qaS1tYXJ0LXNlYXJjaFwiPlxuICAgICAgPGlucHV0XG4gICAgICAgIFtpZF09XCJpbnB1dElkXCJcbiAgICAgICAgI2lucHV0UmVmXG4gICAgICAgIHR5cGU9XCJzZWFyY2hcIlxuICAgICAgICBbcGxhY2Vob2xkZXJdPVwiaTE4bi5zZWFyY2hcIlxuICAgICAgICBbYXV0b2ZvY3VzXT1cImF1dG9Gb2N1c1wiXG4gICAgICAgIFsobmdNb2RlbCldPVwicXVlcnlcIlxuICAgICAgICAobmdNb2RlbENoYW5nZSk9XCJoYW5kbGVDaGFuZ2UoKVwiXG4gICAgICAvPlxuICAgICAgPCEtLVxuICAgICAgVXNlIGEgPGxhYmVsPiBpbiBhZGRpdGlvbiB0byB0aGUgcGxhY2Vob2xkZXIgZm9yIGFjY2Vzc2liaWxpdHksIGJ1dCBwbGFjZSBpdCBvZmYtc2NyZWVuXG4gICAgICBodHRwOi8vd3d3Lm1heGFiaWxpdHkuY28uaW4vMjAxNi8wMS9wbGFjZWhvbGRlci1hdHRyaWJ1dGUtYW5kLXdoeS1pdC1pcy1ub3QtYWNjZXNzaWJsZS9cbiAgICAgIC0tPlxuICAgICAgPGxhYmVsIGNsYXNzPVwiZW1vamktbWFydC1zci1vbmx5XCIgW2h0bWxGb3JdPVwiaW5wdXRJZFwiPlxuICAgICAgICB7eyBpMThuLnNlYXJjaCB9fVxuICAgICAgPC9sYWJlbD5cbiAgICAgIDxidXR0b25cbiAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgIGNsYXNzPVwiZW1vamktbWFydC1zZWFyY2gtaWNvblwiXG4gICAgICAgIChjbGljayk9XCJjbGVhcigpXCJcbiAgICAgICAgKGtleXVwLmVudGVyKT1cImNsZWFyKClcIlxuICAgICAgICBbZGlzYWJsZWRdPVwiIWlzU2VhcmNoaW5nXCJcbiAgICAgICAgW2F0dHIuYXJpYS1sYWJlbF09XCJpMThuLmNsZWFyXCJcbiAgICAgID5cbiAgICAgICAgPHN2Z1xuICAgICAgICAgIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIlxuICAgICAgICAgIHZpZXdCb3g9XCIwIDAgMjAgMjBcIlxuICAgICAgICAgIHdpZHRoPVwiMTNcIlxuICAgICAgICAgIGhlaWdodD1cIjEzXCJcbiAgICAgICAgICBvcGFjaXR5PVwiMC41XCJcbiAgICAgICAgPlxuICAgICAgICAgIDxwYXRoIFthdHRyLmRdPVwiaWNvblwiIC8+XG4gICAgICAgIDwvc3ZnPlxuICAgICAgPC9idXR0b24+XG4gICAgPC9kaXY+XG4gIGAsXG4gIHByZXNlcnZlV2hpdGVzcGFjZXM6IGZhbHNlLFxuICBzdGFuZGFsb25lOiB0cnVlLFxuICBpbXBvcnRzOiBbRm9ybXNNb2R1bGVdLFxufSlcbmV4cG9ydCBjbGFzcyBTZWFyY2hDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBPbkluaXQsIE9uRGVzdHJveSB7XG4gIEBJbnB1dCgpIG1heFJlc3VsdHMgPSA3NTtcbiAgQElucHV0KCkgYXV0b0ZvY3VzID0gZmFsc2U7XG4gIEBJbnB1dCgpIGkxOG46IGFueTtcbiAgQElucHV0KCkgaW5jbHVkZTogc3RyaW5nW10gPSBbXTtcbiAgQElucHV0KCkgZXhjbHVkZTogc3RyaW5nW10gPSBbXTtcbiAgQElucHV0KCkgY3VzdG9tOiBhbnlbXSA9IFtdO1xuICBASW5wdXQoKSBpY29ucyE6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH07XG4gIEBJbnB1dCgpIGVtb2ppc1RvU2hvd0ZpbHRlcj86ICh4OiBhbnkpID0+IGJvb2xlYW47XG4gIEBPdXRwdXQoKSBzZWFyY2hSZXN1bHRzID0gbmV3IEV2ZW50RW1pdHRlcjxhbnlbXT4oKTtcbiAgQE91dHB1dCgpIGVudGVyS2V5T3V0c2lkZUFuZ3VsYXIgPSBuZXcgRXZlbnRFbWl0dGVyPEtleWJvYXJkRXZlbnQ+KCk7XG4gIEBWaWV3Q2hpbGQoJ2lucHV0UmVmJywgeyBzdGF0aWM6IHRydWUgfSkgcHJpdmF0ZSBpbnB1dFJlZiE6IEVsZW1lbnRSZWY8SFRNTElucHV0RWxlbWVudD47XG4gIGlzU2VhcmNoaW5nID0gZmFsc2U7XG4gIGljb24/OiBzdHJpbmc7XG4gIHF1ZXJ5ID0gJyc7XG4gIGlucHV0SWQgPSBgZW1vamktbWFydC1zZWFyY2gtJHsrK2lkfWA7XG5cbiAgcHJpdmF0ZSBkZXN0cm95JCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBuZ1pvbmU6IE5nWm9uZSwgcHJpdmF0ZSBlbW9qaVNlYXJjaDogRW1vamlTZWFyY2gpIHt9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5pY29uID0gdGhpcy5pY29ucy5zZWFyY2g7XG4gICAgdGhpcy5zZXR1cEtleXVwTGlzdGVuZXIoKTtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICBpZiAodGhpcy5hdXRvRm9jdXMpIHtcbiAgICAgIHRoaXMuaW5wdXRSZWYubmF0aXZlRWxlbWVudC5mb2N1cygpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuZGVzdHJveSQubmV4dCgpO1xuICB9XG5cbiAgY2xlYXIoKSB7XG4gICAgdGhpcy5xdWVyeSA9ICcnO1xuICAgIHRoaXMuaGFuZGxlU2VhcmNoKCcnKTtcbiAgICB0aGlzLmlucHV0UmVmLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgfVxuXG4gIGhhbmRsZVNlYXJjaCh2YWx1ZTogc3RyaW5nKSB7XG4gICAgaWYgKHZhbHVlID09PSAnJykge1xuICAgICAgdGhpcy5pY29uID0gdGhpcy5pY29ucy5zZWFyY2g7XG4gICAgICB0aGlzLmlzU2VhcmNoaW5nID0gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaWNvbiA9IHRoaXMuaWNvbnMuZGVsZXRlO1xuICAgICAgdGhpcy5pc1NlYXJjaGluZyA9IHRydWU7XG4gICAgfVxuICAgIGNvbnN0IGVtb2ppcyA9IHRoaXMuZW1vamlTZWFyY2guc2VhcmNoKFxuICAgICAgdGhpcy5xdWVyeSxcbiAgICAgIHRoaXMuZW1vamlzVG9TaG93RmlsdGVyLFxuICAgICAgdGhpcy5tYXhSZXN1bHRzLFxuICAgICAgdGhpcy5pbmNsdWRlLFxuICAgICAgdGhpcy5leGNsdWRlLFxuICAgICAgdGhpcy5jdXN0b20sXG4gICAgKSBhcyBhbnlbXTtcbiAgICB0aGlzLnNlYXJjaFJlc3VsdHMuZW1pdChlbW9qaXMpO1xuICB9XG5cbiAgaGFuZGxlQ2hhbmdlKCkge1xuICAgIHRoaXMuaGFuZGxlU2VhcmNoKHRoaXMucXVlcnkpO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXR1cEtleXVwTGlzdGVuZXIoKTogdm9pZCB7XG4gICAgdGhpcy5uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT5cbiAgICAgIGZyb21FdmVudDxLZXlib2FyZEV2ZW50Pih0aGlzLmlucHV0UmVmLm5hdGl2ZUVsZW1lbnQsICdrZXl1cCcpXG4gICAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLmRlc3Ryb3kkKSlcbiAgICAgICAgLnN1YnNjcmliZSgkZXZlbnQgPT4ge1xuICAgICAgICAgIGlmICghdGhpcy5xdWVyeSB8fCAkZXZlbnQua2V5ICE9PSAnRW50ZXInKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuZW50ZXJLZXlPdXRzaWRlQW5ndWxhci5lbWl0KCRldmVudCk7XG4gICAgICAgICAgJGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH0pLFxuICAgICk7XG4gIH1cbn1cbiJdfQ==