import { EventEmitter } from '@angular/core';
import { Emoji } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import * as i0 from "@angular/core";
export declare class SkinComponent {
    /** currently selected skin */
    skin?: Emoji['skin'];
    i18n: any;
    changeSkin: EventEmitter<1 | 2 | 4 | 3 | 5 | 6>;
    opened: boolean;
    skinTones: Emoji['skin'][];
    toggleOpen(): void;
    isSelected(skinTone: Emoji['skin']): boolean;
    isVisible(skinTone: Emoji['skin']): boolean;
    pressed(skinTone: Emoji['skin']): boolean | "";
    tabIndex(skinTone: Emoji['skin']): "" | "0";
    expanded(skinTone: Emoji['skin']): boolean | "";
    handleClick(skin: Emoji['skin']): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<SkinComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<SkinComponent, "emoji-skins", never, { "skin": { "alias": "skin"; "required": false; }; "i18n": { "alias": "i18n"; "required": false; }; }, { "changeSkin": "changeSkin"; }, never, never, true, never>;
}
