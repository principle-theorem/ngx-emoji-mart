import { EmojiComponent } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkinComponent } from './skins.component';
import * as i0 from "@angular/core";
import * as i1 from "@ctrl/ngx-emoji-mart/ngx-emoji";
import * as i2 from "@angular/common";
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
export { PreviewComponent };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJldmlldy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbGliL3BpY2tlci9wcmV2aWV3LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQVMsY0FBYyxFQUEyQixNQUFNLGdDQUFnQyxDQUFDO0FBQ2hHLE9BQU8sRUFDTCx1QkFBdUIsRUFFdkIsU0FBUyxFQUNULFlBQVksRUFDWixLQUFLLEVBRUwsTUFBTSxHQUNQLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUUvQyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7Ozs7QUFFbEQsTUFvRWEsZ0JBQWdCO0lBZ0JSO0lBQWdDO0lBZjFDLEtBQUssQ0FBVTtJQUNmLEtBQUssQ0FBTTtJQUNYLFNBQVMsQ0FBTTtJQUNmLElBQUksQ0FBTTtJQUNWLGFBQWEsQ0FBcUI7SUFDbEMsU0FBUyxDQUFpQjtJQUMxQixTQUFTLENBQWlCO0lBQzFCLFFBQVEsQ0FBZ0I7SUFDeEIsY0FBYyxDQUFzQjtJQUNwQyxzQkFBc0IsQ0FBOEI7SUFDcEQsZUFBZSxDQUF1QjtJQUNyQyxVQUFVLEdBQUcsSUFBSSxZQUFZLEVBQWlCLENBQUM7SUFDekQsU0FBUyxHQUF1QixFQUFFLENBQUM7SUFDbkMsZUFBZSxDQUFZO0lBRTNCLFlBQW1CLEdBQXNCLEVBQVUsWUFBMEI7UUFBMUQsUUFBRyxHQUFILEdBQUcsQ0FBbUI7UUFBVSxpQkFBWSxHQUFaLFlBQVksQ0FBYztJQUFHLENBQUM7SUFFakYsV0FBVztRQUNULElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ2YsT0FBTztTQUNSO1FBQ0QsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FDeEMsSUFBSSxDQUFDLEtBQUssRUFDVixJQUFJLENBQUMsU0FBUyxFQUNkLElBQUksQ0FBQyxRQUFRLENBQ0QsQ0FBQztRQUNmLE1BQU0sY0FBYyxHQUFhLEVBQUUsQ0FBQztRQUNwQyxNQUFNLGVBQWUsR0FBYSxFQUFFLENBQUM7UUFDckMsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLElBQUksRUFBRSxDQUFDO1FBQ2pELFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFnQixFQUFFLEVBQUU7WUFDckMsSUFBSSxjQUFjLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDdkQsT0FBTzthQUNSO1lBQ0QsY0FBYyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztZQUM1QyxlQUFlLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2pDLENBQUMsQ0FBQyxDQUFDO1FBQ0gsSUFBSSxDQUFDLGVBQWUsR0FBRyxlQUFlLENBQUM7UUFDdkMsSUFBSSxDQUFDLEdBQUcsRUFBRSxhQUFhLEVBQUUsQ0FBQztJQUM1QixDQUFDO3VHQXZDVSxnQkFBZ0I7MkZBQWhCLGdCQUFnQixxYkFsRWpCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0E0RFQsMkRBSVMsWUFBWSxnUUFBRSxjQUFjLGlZQUFFLGFBQWE7O1NBRTFDLGdCQUFnQjsyRkFBaEIsZ0JBQWdCO2tCQXBFNUIsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsZUFBZTtvQkFDekIsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0E0RFQ7b0JBQ0QsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07b0JBQy9DLG1CQUFtQixFQUFFLEtBQUs7b0JBQzFCLFVBQVUsRUFBRSxJQUFJO29CQUNoQixPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUsY0FBYyxFQUFFLGFBQWEsQ0FBQztpQkFDdkQ7bUlBRVUsS0FBSztzQkFBYixLQUFLO2dCQUNHLEtBQUs7c0JBQWIsS0FBSztnQkFDRyxTQUFTO3NCQUFqQixLQUFLO2dCQUNHLElBQUk7c0JBQVosS0FBSztnQkFDRyxhQUFhO3NCQUFyQixLQUFLO2dCQUNHLFNBQVM7c0JBQWpCLEtBQUs7Z0JBQ0csU0FBUztzQkFBakIsS0FBSztnQkFDRyxRQUFRO3NCQUFoQixLQUFLO2dCQUNHLGNBQWM7c0JBQXRCLEtBQUs7Z0JBQ0csc0JBQXNCO3NCQUE5QixLQUFLO2dCQUNHLGVBQWU7c0JBQXZCLEtBQUs7Z0JBQ0ksVUFBVTtzQkFBbkIsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEVtb2ppLCBFbW9qaUNvbXBvbmVudCwgRW1vamlEYXRhLCBFbW9qaVNlcnZpY2UgfSBmcm9tICdAY3RybC9uZ3gtZW1vamktbWFydC9uZ3gtZW1vamknO1xuaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgT3V0cHV0LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbmltcG9ydCB7IFNraW5Db21wb25lbnQgfSBmcm9tICcuL3NraW5zLmNvbXBvbmVudCc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2Vtb2ppLXByZXZpZXcnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXYgY2xhc3M9XCJlbW9qaS1tYXJ0LXByZXZpZXdcIiAqbmdJZj1cImVtb2ppICYmIGVtb2ppRGF0YVwiPlxuICAgICAgPGRpdiBjbGFzcz1cImVtb2ppLW1hcnQtcHJldmlldy1lbW9qaVwiPlxuICAgICAgICA8bmd4LWVtb2ppXG4gICAgICAgICAgW2Vtb2ppXT1cImVtb2ppXCJcbiAgICAgICAgICBbc2l6ZV09XCIzOFwiXG4gICAgICAgICAgW2lzTmF0aXZlXT1cImVtb2ppSXNOYXRpdmVcIlxuICAgICAgICAgIFtza2luXT1cImVtb2ppU2tpblwiXG4gICAgICAgICAgW3NpemVdPVwiZW1vamlTaXplXCJcbiAgICAgICAgICBbc2V0XT1cImVtb2ppU2V0XCJcbiAgICAgICAgICBbc2hlZXRTaXplXT1cImVtb2ppU2hlZXRTaXplXCJcbiAgICAgICAgICBbYmFja2dyb3VuZEltYWdlRm5dPVwiZW1vamlCYWNrZ3JvdW5kSW1hZ2VGblwiXG4gICAgICAgICAgW2ltYWdlVXJsRm5dPVwiZW1vamlJbWFnZVVybEZuXCJcbiAgICAgICAgPjwvbmd4LWVtb2ppPlxuICAgICAgPC9kaXY+XG5cbiAgICAgIDxkaXYgY2xhc3M9XCJlbW9qaS1tYXJ0LXByZXZpZXctZGF0YVwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiZW1vamktbWFydC1wcmV2aWV3LW5hbWVcIj57eyBlbW9qaURhdGEubmFtZSB9fTwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwiZW1vamktbWFydC1wcmV2aWV3LXNob3J0bmFtZVwiPlxuICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICBjbGFzcz1cImVtb2ppLW1hcnQtcHJldmlldy1zaG9ydG5hbWVcIlxuICAgICAgICAgICAgKm5nRm9yPVwibGV0IHNob3J0X25hbWUgb2YgZW1vamlEYXRhLnNob3J0TmFtZXNcIlxuICAgICAgICAgID5cbiAgICAgICAgICAgIDp7eyBzaG9ydF9uYW1lIH19OlxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJlbW9qaS1tYXJ0LXByZXZpZXctZW1vdGljb25zXCI+XG4gICAgICAgICAgPHNwYW4gY2xhc3M9XCJlbW9qaS1tYXJ0LXByZXZpZXctZW1vdGljb25cIiAqbmdGb3I9XCJsZXQgZW1vdGljb24gb2YgbGlzdGVkRW1vdGljb25zXCI+XG4gICAgICAgICAgICB7eyBlbW90aWNvbiB9fVxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cblxuICAgIDxkaXYgY2xhc3M9XCJlbW9qaS1tYXJ0LXByZXZpZXdcIiBbaGlkZGVuXT1cImVtb2ppXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwiZW1vamktbWFydC1wcmV2aWV3LWVtb2ppXCI+XG4gICAgICAgIDxuZ3gtZW1vamlcbiAgICAgICAgICAqbmdJZj1cImlkbGVFbW9qaSAmJiBpZGxlRW1vamkubGVuZ3RoXCJcbiAgICAgICAgICBbaXNOYXRpdmVdPVwiZW1vamlJc05hdGl2ZVwiXG4gICAgICAgICAgW3NraW5dPVwiZW1vamlTa2luXCJcbiAgICAgICAgICBbc2V0XT1cImVtb2ppU2V0XCJcbiAgICAgICAgICBbZW1vamldPVwiaWRsZUVtb2ppXCJcbiAgICAgICAgICBbYmFja2dyb3VuZEltYWdlRm5dPVwiZW1vamlCYWNrZ3JvdW5kSW1hZ2VGblwiXG4gICAgICAgICAgW3NpemVdPVwiMzhcIlxuICAgICAgICAgIFtpbWFnZVVybEZuXT1cImVtb2ppSW1hZ2VVcmxGblwiXG4gICAgICAgID48L25neC1lbW9qaT5cbiAgICAgIDwvZGl2PlxuXG4gICAgICA8ZGl2IGNsYXNzPVwiZW1vamktbWFydC1wcmV2aWV3LWRhdGFcIj5cbiAgICAgICAgPHNwYW4gY2xhc3M9XCJlbW9qaS1tYXJ0LXRpdGxlLWxhYmVsXCI+e3sgdGl0bGUgfX08L3NwYW4+XG4gICAgICA8L2Rpdj5cblxuICAgICAgPGRpdiBjbGFzcz1cImVtb2ppLW1hcnQtcHJldmlldy1za2luc1wiPlxuICAgICAgICA8ZW1vamktc2tpbnNcbiAgICAgICAgICBbc2tpbl09XCJlbW9qaVNraW5cIlxuICAgICAgICAgIChjaGFuZ2VTa2luKT1cInNraW5DaGFuZ2UuZW1pdCgkZXZlbnQpXCJcbiAgICAgICAgICBbaTE4bl09XCJpMThuXCJcbiAgICAgICAgPjwvZW1vamktc2tpbnM+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgYCxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIHByZXNlcnZlV2hpdGVzcGFjZXM6IGZhbHNlLFxuICBzdGFuZGFsb25lOiB0cnVlLFxuICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBFbW9qaUNvbXBvbmVudCwgU2tpbkNvbXBvbmVudF0sXG59KVxuZXhwb3J0IGNsYXNzIFByZXZpZXdDb21wb25lbnQgaW1wbGVtZW50cyBPbkNoYW5nZXMge1xuICBASW5wdXQoKSB0aXRsZT86IHN0cmluZztcbiAgQElucHV0KCkgZW1vamk6IGFueTtcbiAgQElucHV0KCkgaWRsZUVtb2ppOiBhbnk7XG4gIEBJbnB1dCgpIGkxOG46IGFueTtcbiAgQElucHV0KCkgZW1vamlJc05hdGl2ZT86IEVtb2ppWydpc05hdGl2ZSddO1xuICBASW5wdXQoKSBlbW9qaVNraW4/OiBFbW9qaVsnc2tpbiddO1xuICBASW5wdXQoKSBlbW9qaVNpemU/OiBFbW9qaVsnc2l6ZSddO1xuICBASW5wdXQoKSBlbW9qaVNldD86IEVtb2ppWydzZXQnXTtcbiAgQElucHV0KCkgZW1vamlTaGVldFNpemU/OiBFbW9qaVsnc2hlZXRTaXplJ107XG4gIEBJbnB1dCgpIGVtb2ppQmFja2dyb3VuZEltYWdlRm4/OiBFbW9qaVsnYmFja2dyb3VuZEltYWdlRm4nXTtcbiAgQElucHV0KCkgZW1vamlJbWFnZVVybEZuPzogRW1vamlbJ2ltYWdlVXJsRm4nXTtcbiAgQE91dHB1dCgpIHNraW5DaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPEVtb2ppWydza2luJ10+KCk7XG4gIGVtb2ppRGF0YTogUGFydGlhbDxFbW9qaURhdGE+ID0ge307XG4gIGxpc3RlZEVtb3RpY29ucz86IHN0cmluZ1tdO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyByZWY6IENoYW5nZURldGVjdG9yUmVmLCBwcml2YXRlIGVtb2ppU2VydmljZTogRW1vamlTZXJ2aWNlKSB7fVxuXG4gIG5nT25DaGFuZ2VzKCkge1xuICAgIGlmICghdGhpcy5lbW9qaSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmVtb2ppRGF0YSA9IHRoaXMuZW1vamlTZXJ2aWNlLmdldERhdGEoXG4gICAgICB0aGlzLmVtb2ppLFxuICAgICAgdGhpcy5lbW9qaVNraW4sXG4gICAgICB0aGlzLmVtb2ppU2V0LFxuICAgICkgYXMgRW1vamlEYXRhO1xuICAgIGNvbnN0IGtub3duRW1vdGljb25zOiBzdHJpbmdbXSA9IFtdO1xuICAgIGNvbnN0IGxpc3RlZEVtb3RpY29uczogc3RyaW5nW10gPSBbXTtcbiAgICBjb25zdCBlbW9pdGNvbnMgPSB0aGlzLmVtb2ppRGF0YS5lbW90aWNvbnMgfHwgW107XG4gICAgZW1vaXRjb25zLmZvckVhY2goKGVtb3RpY29uOiBzdHJpbmcpID0+IHtcbiAgICAgIGlmIChrbm93bkVtb3RpY29ucy5pbmRleE9mKGVtb3RpY29uLnRvTG93ZXJDYXNlKCkpID49IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAga25vd25FbW90aWNvbnMucHVzaChlbW90aWNvbi50b0xvd2VyQ2FzZSgpKTtcbiAgICAgIGxpc3RlZEVtb3RpY29ucy5wdXNoKGVtb3RpY29uKTtcbiAgICB9KTtcbiAgICB0aGlzLmxpc3RlZEVtb3RpY29ucyA9IGxpc3RlZEVtb3RpY29ucztcbiAgICB0aGlzLnJlZj8uZGV0ZWN0Q2hhbmdlcygpO1xuICB9XG59XG4iXX0=