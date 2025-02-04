import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
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
  `, isInline: true, dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
}
export { AnchorsComponent };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5jaG9ycy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbGliL3BpY2tlci9hbmNob3JzLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLHVCQUF1QixFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQzs7O0FBSWhHLE1Ba0NhLGdCQUFnQjtJQUNsQixVQUFVLEdBQW9CLEVBQUUsQ0FBQztJQUNqQyxLQUFLLENBQVU7SUFDZixRQUFRLENBQVU7SUFDbEIsSUFBSSxDQUFNO0lBQ1YsS0FBSyxHQUE4QixFQUFFLENBQUM7SUFDckMsV0FBVyxHQUFHLElBQUksWUFBWSxFQUE4QyxDQUFDO0lBRXZGLFNBQVMsQ0FBQyxHQUFXLEVBQUUsR0FBa0I7UUFDdkMsT0FBTyxHQUFHLENBQUMsRUFBRSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxXQUFXLENBQUMsTUFBYSxFQUFFLEtBQWE7UUFDdEMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUM7WUFDcEIsUUFBUSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDO1lBQ2hDLEtBQUs7U0FDTixDQUFDLENBQUM7SUFDTCxDQUFDO3VHQWpCVSxnQkFBZ0I7MkZBQWhCLGdCQUFnQixpT0FoQ2pCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTBCVCwyREFJUyxZQUFZOztTQUVYLGdCQUFnQjsyRkFBaEIsZ0JBQWdCO2tCQWxDNUIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsb0JBQW9CO29CQUM5QixRQUFRLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBMEJUO29CQUNELGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO29CQUMvQyxtQkFBbUIsRUFBRSxLQUFLO29CQUMxQixVQUFVLEVBQUUsSUFBSTtvQkFDaEIsT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDO2lCQUN4Qjs4QkFFVSxVQUFVO3NCQUFsQixLQUFLO2dCQUNHLEtBQUs7c0JBQWIsS0FBSztnQkFDRyxRQUFRO3NCQUFoQixLQUFLO2dCQUNHLElBQUk7c0JBQVosS0FBSztnQkFDRyxLQUFLO3NCQUFiLEtBQUs7Z0JBQ0ksV0FBVztzQkFBcEIsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ29tcG9uZW50LCBFdmVudEVtaXR0ZXIsIElucHV0LCBPdXRwdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgRW1vamlDYXRlZ29yeSB9IGZyb20gJ0BjdHJsL25neC1lbW9qaS1tYXJ0L25neC1lbW9qaSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2Vtb2ppLW1hcnQtYW5jaG9ycycsXG4gIHRlbXBsYXRlOiBgXG4gICAgPGRpdiBjbGFzcz1cImVtb2ppLW1hcnQtYW5jaG9yc1wiPlxuICAgICAgPG5nLXRlbXBsYXRlXG4gICAgICAgIG5nRm9yXG4gICAgICAgIGxldC1jYXRlZ29yeVxuICAgICAgICBbbmdGb3JPZl09XCJjYXRlZ29yaWVzXCJcbiAgICAgICAgbGV0LWlkeD1cImluZGV4XCJcbiAgICAgICAgW25nRm9yVHJhY2tCeV09XCJ0cmFja0J5Rm5cIlxuICAgICAgPlxuICAgICAgICA8c3BhblxuICAgICAgICAgICpuZ0lmPVwiY2F0ZWdvcnkuYW5jaG9yICE9PSBmYWxzZVwiXG4gICAgICAgICAgW2F0dHIudGl0bGVdPVwiaTE4bi5jYXRlZ29yaWVzW2NhdGVnb3J5LmlkXVwiXG4gICAgICAgICAgKGNsaWNrKT1cInRoaXMuaGFuZGxlQ2xpY2soJGV2ZW50LCBpZHgpXCJcbiAgICAgICAgICBjbGFzcz1cImVtb2ppLW1hcnQtYW5jaG9yXCJcbiAgICAgICAgICBbY2xhc3MuZW1vamktbWFydC1hbmNob3Itc2VsZWN0ZWRdPVwiY2F0ZWdvcnkubmFtZSA9PT0gc2VsZWN0ZWRcIlxuICAgICAgICAgIFtzdHlsZS5jb2xvcl09XCJjYXRlZ29yeS5uYW1lID09PSBzZWxlY3RlZCA/IGNvbG9yIDogbnVsbFwiXG4gICAgICAgID5cbiAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgPHN2ZyB4bWxucz1cImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIgdmlld0JveD1cIjAgMCAyNCAyNFwiIHdpZHRoPVwiMjRcIiBoZWlnaHQ9XCIyNFwiPlxuICAgICAgICAgICAgICA8cGF0aCBbYXR0ci5kXT1cImljb25zW2NhdGVnb3J5LmlkXVwiIC8+XG4gICAgICAgICAgICA8L3N2Zz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8c3BhbiBjbGFzcz1cImVtb2ppLW1hcnQtYW5jaG9yLWJhclwiIFtzdHlsZS5iYWNrZ3JvdW5kLWNvbG9yXT1cImNvbG9yXCI+PC9zcGFuPlxuICAgICAgICA8L3NwYW4+XG4gICAgICA8L25nLXRlbXBsYXRlPlxuICAgIDwvZGl2PlxuICBgLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgcHJlc2VydmVXaGl0ZXNwYWNlczogZmFsc2UsXG4gIHN0YW5kYWxvbmU6IHRydWUsXG4gIGltcG9ydHM6IFtDb21tb25Nb2R1bGVdLFxufSlcbmV4cG9ydCBjbGFzcyBBbmNob3JzQ29tcG9uZW50IHtcbiAgQElucHV0KCkgY2F0ZWdvcmllczogRW1vamlDYXRlZ29yeVtdID0gW107XG4gIEBJbnB1dCgpIGNvbG9yPzogc3RyaW5nO1xuICBASW5wdXQoKSBzZWxlY3RlZD86IHN0cmluZztcbiAgQElucHV0KCkgaTE4bjogYW55O1xuICBASW5wdXQoKSBpY29uczogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSA9IHt9O1xuICBAT3V0cHV0KCkgYW5jaG9yQ2xpY2sgPSBuZXcgRXZlbnRFbWl0dGVyPHsgY2F0ZWdvcnk6IEVtb2ppQ2F0ZWdvcnk7IGluZGV4OiBudW1iZXIgfT4oKTtcblxuICB0cmFja0J5Rm4oaWR4OiBudW1iZXIsIGNhdDogRW1vamlDYXRlZ29yeSkge1xuICAgIHJldHVybiBjYXQuaWQ7XG4gIH1cblxuICBoYW5kbGVDbGljaygkZXZlbnQ6IEV2ZW50LCBpbmRleDogbnVtYmVyKSB7XG4gICAgdGhpcy5hbmNob3JDbGljay5lbWl0KHtcbiAgICAgIGNhdGVnb3J5OiB0aGlzLmNhdGVnb3JpZXNbaW5kZXhdLFxuICAgICAgaW5kZXgsXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==