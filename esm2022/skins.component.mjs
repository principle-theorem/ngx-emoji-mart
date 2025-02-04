import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
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
  `, isInline: true, dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
}
export { SkinComponent };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2tpbnMuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2xpYi9waWNrZXIvc2tpbnMuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7QUFJaEcsTUErQmEsYUFBYTtJQUN4Qiw4QkFBOEI7SUFDckIsSUFBSSxDQUFpQjtJQUNyQixJQUFJLENBQU07SUFDVCxVQUFVLEdBQUcsSUFBSSxZQUFZLEVBQWlCLENBQUM7SUFDekQsTUFBTSxHQUFHLEtBQUssQ0FBQztJQUNmLFNBQVMsR0FBb0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBRWhELFVBQVU7UUFDUixJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUM3QixDQUFDO0lBRUQsVUFBVSxDQUFDLFFBQXVCO1FBQ2hDLE9BQU8sUUFBUSxLQUFLLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDaEMsQ0FBQztJQUVELFNBQVMsQ0FBQyxRQUF1QjtRQUMvQixPQUFPLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBRUQsT0FBTyxDQUFDLFFBQXVCO1FBQzdCLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUN4RCxDQUFDO0lBRUQsUUFBUSxDQUFDLFFBQXVCO1FBQzlCLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDN0MsQ0FBQztJQUVELFFBQVEsQ0FBQyxRQUF1QjtRQUM5QixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUN0RCxDQUFDO0lBRUQsV0FBVyxDQUFDLElBQW1CO1FBQzdCLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ2hCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1lBQ25CLE9BQU87U0FDUjtRQUNELElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ3BCLElBQUksSUFBSSxLQUFLLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDdEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDNUI7SUFDSCxDQUFDO3VHQXpDVSxhQUFhOzJGQUFiLGFBQWEsc0pBN0JkOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXVCVCwyREFJUyxZQUFZOztTQUVYLGFBQWE7MkZBQWIsYUFBYTtrQkEvQnpCLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLGFBQWE7b0JBQ3ZCLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F1QlQ7b0JBQ0QsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07b0JBQy9DLG1CQUFtQixFQUFFLEtBQUs7b0JBQzFCLFVBQVUsRUFBRSxJQUFJO29CQUNoQixPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUM7aUJBQ3hCOzhCQUdVLElBQUk7c0JBQVosS0FBSztnQkFDRyxJQUFJO3NCQUFaLEtBQUs7Z0JBQ0ksVUFBVTtzQkFBbkIsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIElucHV0LCBPdXRwdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgRW1vamkgfSBmcm9tICdAY3RybC9uZ3gtZW1vamktbWFydC9uZ3gtZW1vamknO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdlbW9qaS1za2lucycsXG4gIHRlbXBsYXRlOiBgXG4gICAgPHNlY3Rpb24gY2xhc3M9XCJlbW9qaS1tYXJ0LXNraW4tc3dhdGNoZXNcIiBbY2xhc3Mub3BlbmVkXT1cIm9wZW5lZFwiPlxuICAgICAgPHNwYW5cbiAgICAgICAgKm5nRm9yPVwibGV0IHNraW5Ub25lIG9mIHNraW5Ub25lc1wiXG4gICAgICAgIGNsYXNzPVwiZW1vamktbWFydC1za2luLXN3YXRjaFwiXG4gICAgICAgIFtjbGFzcy5zZWxlY3RlZF09XCJza2luVG9uZSA9PT0gc2tpblwiXG4gICAgICA+XG4gICAgICAgIDxzcGFuXG4gICAgICAgICAgKGNsaWNrKT1cImhhbmRsZUNsaWNrKHNraW5Ub25lKVwiXG4gICAgICAgICAgKGtleXVwLmVudGVyKT1cImhhbmRsZUNsaWNrKHNraW5Ub25lKVwiXG4gICAgICAgICAgKGtleXVwLnNwYWNlKT1cImhhbmRsZUNsaWNrKHNraW5Ub25lKVwiXG4gICAgICAgICAgY2xhc3M9XCJlbW9qaS1tYXJ0LXNraW4gZW1vamktbWFydC1za2luLXRvbmUte3sgc2tpblRvbmUgfX1cIlxuICAgICAgICAgIHJvbGU9XCJidXR0b25cIlxuICAgICAgICAgIFt0YWJJbmRleF09XCJ0YWJJbmRleChza2luVG9uZSlcIlxuICAgICAgICAgIFthdHRyLmFyaWEtaGlkZGVuXT1cIiFpc1Zpc2libGUoc2tpblRvbmUpXCJcbiAgICAgICAgICBbYXR0ci5hcmlhLXByZXNzZWRdPVwicHJlc3NlZChza2luVG9uZSlcIlxuICAgICAgICAgIFthdHRyLmFyaWEtaGFzcG9wdXBdPVwiISFpc1NlbGVjdGVkKHNraW5Ub25lKVwiXG4gICAgICAgICAgW2F0dHIuYXJpYS1leHBhbmRlZF09XCJleHBhbmRlZChza2luVG9uZSlcIlxuICAgICAgICAgIFthdHRyLmFyaWEtbGFiZWxdPVwiaTE4bi5za2ludG9uZXNbc2tpblRvbmVdXCJcbiAgICAgICAgICBbYXR0ci50aXRsZV09XCJpMThuLnNraW50b25lc1tza2luVG9uZV1cIlxuICAgICAgICA+PC9zcGFuPlxuICAgICAgPC9zcGFuPlxuICAgIDwvc2VjdGlvbj5cbiAgYCxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIHByZXNlcnZlV2hpdGVzcGFjZXM6IGZhbHNlLFxuICBzdGFuZGFsb25lOiB0cnVlLFxuICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlXSxcbn0pXG5leHBvcnQgY2xhc3MgU2tpbkNvbXBvbmVudCB7XG4gIC8qKiBjdXJyZW50bHkgc2VsZWN0ZWQgc2tpbiAqL1xuICBASW5wdXQoKSBza2luPzogRW1vamlbJ3NraW4nXTtcbiAgQElucHV0KCkgaTE4bjogYW55O1xuICBAT3V0cHV0KCkgY2hhbmdlU2tpbiA9IG5ldyBFdmVudEVtaXR0ZXI8RW1vamlbJ3NraW4nXT4oKTtcbiAgb3BlbmVkID0gZmFsc2U7XG4gIHNraW5Ub25lczogRW1vamlbJ3NraW4nXVtdID0gWzEsIDIsIDMsIDQsIDUsIDZdO1xuXG4gIHRvZ2dsZU9wZW4oKSB7XG4gICAgdGhpcy5vcGVuZWQgPSAhdGhpcy5vcGVuZWQ7XG4gIH1cblxuICBpc1NlbGVjdGVkKHNraW5Ub25lOiBFbW9qaVsnc2tpbiddKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHNraW5Ub25lID09PSB0aGlzLnNraW47XG4gIH1cblxuICBpc1Zpc2libGUoc2tpblRvbmU6IEVtb2ppWydza2luJ10pOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5vcGVuZWQgfHwgdGhpcy5pc1NlbGVjdGVkKHNraW5Ub25lKTtcbiAgfVxuXG4gIHByZXNzZWQoc2tpblRvbmU6IEVtb2ppWydza2luJ10pIHtcbiAgICByZXR1cm4gdGhpcy5vcGVuZWQgPyAhIXRoaXMuaXNTZWxlY3RlZChza2luVG9uZSkgOiAnJztcbiAgfVxuXG4gIHRhYkluZGV4KHNraW5Ub25lOiBFbW9qaVsnc2tpbiddKSB7XG4gICAgcmV0dXJuIHRoaXMuaXNWaXNpYmxlKHNraW5Ub25lKSA/ICcwJyA6ICcnO1xuICB9XG5cbiAgZXhwYW5kZWQoc2tpblRvbmU6IEVtb2ppWydza2luJ10pIHtcbiAgICByZXR1cm4gdGhpcy5pc1NlbGVjdGVkKHNraW5Ub25lKSA/IHRoaXMub3BlbmVkIDogJyc7XG4gIH1cblxuICBoYW5kbGVDbGljayhza2luOiBFbW9qaVsnc2tpbiddKSB7XG4gICAgaWYgKCF0aGlzLm9wZW5lZCkge1xuICAgICAgdGhpcy5vcGVuZWQgPSB0cnVlO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLm9wZW5lZCA9IGZhbHNlO1xuICAgIGlmIChza2luICE9PSB0aGlzLnNraW4pIHtcbiAgICAgIHRoaXMuY2hhbmdlU2tpbi5lbWl0KHNraW4pO1xuICAgIH1cbiAgfVxufVxuIl19