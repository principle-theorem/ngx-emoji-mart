import { EmojiData, EmojiService } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import * as i0 from "@angular/core";
export declare class EmojiSearch {
    private emojiService;
    originalPool: any;
    index: {
        results?: EmojiData[];
        pool?: {
            [key: string]: EmojiData;
        };
        [key: string]: any;
    };
    emojisList: any;
    emoticonsList: {
        [key: string]: string;
    };
    emojiSearch: {
        [key: string]: string;
    };
    constructor(emojiService: EmojiService);
    addCustomToPool(custom: any, pool: any): void;
    search(value: string, emojisToShowFilter?: (x: any) => boolean, maxResults?: number, include?: any[], exclude?: any[], custom?: any[]): EmojiData[] | null;
    buildSearch(shortNames: string[], name: string, id: string, keywords: string[], emoticons: string[]): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<EmojiSearch, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<EmojiSearch>;
}
