import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import * as i0 from "@angular/core";
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
export { EmojiFrequentlyService };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.5", ngImport: i0, type: EmojiFrequentlyService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1vamktZnJlcXVlbnRseS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2xpYi9waWNrZXIvZW1vamktZnJlcXVlbnRseS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQ3BELE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7QUFJaEUsTUFDYSxzQkFBc0I7SUF1QlE7SUF0QnpDLFNBQVMsR0FBRyxZQUFZLENBQUM7SUFDekIsVUFBVSxHQUFxQyxJQUFJLENBQUM7SUFDcEQsUUFBUSxHQUE4QixFQUFFLENBQUM7SUFDekMsV0FBVyxHQUFHLEtBQUssQ0FBQztJQUNwQixRQUFRLEdBQUc7UUFDVCxJQUFJO1FBQ0osVUFBVTtRQUNWLGVBQWU7UUFDZixZQUFZO1FBQ1osVUFBVTtRQUNWLDhCQUE4QjtRQUM5QixhQUFhO1FBQ2IsS0FBSztRQUNMLFFBQVE7UUFDUixjQUFjO1FBQ2QsVUFBVTtRQUNWLE9BQU87UUFDUCxLQUFLO1FBQ0wsWUFBWTtRQUNaLE9BQU87UUFDUCxNQUFNO0tBQ1AsQ0FBQztJQUNGLFlBQXlDLFVBQWtCO1FBQWxCLGVBQVUsR0FBVixVQUFVLENBQVE7SUFBRyxDQUFDO0lBQy9ELElBQUk7UUFDRixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQzFCLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztZQUNqQyxZQUFZLENBQUMsT0FBTyxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsYUFBYSxDQUFDLENBQUM7WUFDckQsTUFBTSxDQUNULENBQUM7UUFDRixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztJQUMxQixDQUFDO0lBQ0QsR0FBRyxDQUFDLEtBQWdCO1FBQ2xCLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ3JCLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUNiO1FBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDcEIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1NBQ2pDO1FBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxFQUFFO1lBQzlCLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUMvQjtRQUNELElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUUvQixJQUFJLGlCQUFpQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRTtZQUN0QyxZQUFZLENBQUMsT0FBTyxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsT0FBTyxFQUFFLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUN6RCxZQUFZLENBQUMsT0FBTyxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsYUFBYSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7U0FDdkY7SUFDSCxDQUFDO0lBQ0QsR0FBRyxDQUFDLE9BQWUsRUFBRSxVQUFrQjtRQUNyQyxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRTtZQUNyQixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDYjtRQUNELElBQUksSUFBSSxDQUFDLFVBQVUsS0FBSyxJQUFJLEVBQUU7WUFDNUIsSUFBSSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7WUFDbkIsTUFBTSxNQUFNLEdBQUcsRUFBRSxDQUFDO1lBRWxCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ2hDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sR0FBRyxDQUFDLENBQUM7Z0JBQzlDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQy9CO1lBQ0QsT0FBTyxNQUFNLENBQUM7U0FDZjtRQUVELE1BQU0sUUFBUSxHQUFHLE9BQU8sR0FBRyxVQUFVLENBQUM7UUFDdEMsTUFBTSxjQUFjLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7UUFFcEQsTUFBTSxNQUFNLEdBQUcsY0FBYzthQUMxQixJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDekQsT0FBTyxFQUFFLENBQUM7UUFDYixNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUV6QyxNQUFNLElBQUksR0FDUixpQkFBaUIsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksWUFBWSxDQUFDLE9BQU8sQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLE9BQU8sQ0FBQyxDQUFDO1FBRXZGLElBQUksSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNsQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDYixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ25CO1FBQ0QsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQzt1R0FoRlUsc0JBQXNCLGtCQXVCYixXQUFXOzJHQXZCcEIsc0JBQXNCLGNBRFQsTUFBTTs7U0FDbkIsc0JBQXNCOzJGQUF0QixzQkFBc0I7a0JBRGxDLFVBQVU7bUJBQUMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFOzswQkF3Qm5CLE1BQU07MkJBQUMsV0FBVyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGlzUGxhdGZvcm1Ccm93c2VyIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IEluamVjdCwgSW5qZWN0YWJsZSwgUExBVEZPUk1fSUQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgRW1vamlEYXRhIH0gZnJvbSAnQGN0cmwvbmd4LWVtb2ppLW1hcnQvbmd4LWVtb2ppJztcblxuQEluamVjdGFibGUoeyBwcm92aWRlZEluOiAncm9vdCcgfSlcbmV4cG9ydCBjbGFzcyBFbW9qaUZyZXF1ZW50bHlTZXJ2aWNlIHtcbiAgTkFNRVNQQUNFID0gJ2Vtb2ppLW1hcnQnO1xuICBmcmVxdWVudGx5OiB7IFtrZXk6IHN0cmluZ106IG51bWJlciB9IHwgbnVsbCA9IG51bGw7XG4gIGRlZmF1bHRzOiB7IFtrZXk6IHN0cmluZ106IG51bWJlciB9ID0ge307XG4gIGluaXRpYWxpemVkID0gZmFsc2U7XG4gIERFRkFVTFRTID0gW1xuICAgICcrMScsXG4gICAgJ2dyaW5uaW5nJyxcbiAgICAna2lzc2luZ19oZWFydCcsXG4gICAgJ2hlYXJ0X2V5ZXMnLFxuICAgICdsYXVnaGluZycsXG4gICAgJ3N0dWNrX291dF90b25ndWVfd2lua2luZ19leWUnLFxuICAgICdzd2VhdF9zbWlsZScsXG4gICAgJ2pveScsXG4gICAgJ3NjcmVhbScsXG4gICAgJ2Rpc2FwcG9pbnRlZCcsXG4gICAgJ3VuYW11c2VkJyxcbiAgICAnd2VhcnknLFxuICAgICdzb2InLFxuICAgICdzdW5nbGFzc2VzJyxcbiAgICAnaGVhcnQnLFxuICAgICdwb29wJyxcbiAgXTtcbiAgY29uc3RydWN0b3IoQEluamVjdChQTEFURk9STV9JRCkgcHJpdmF0ZSBwbGF0Zm9ybUlkOiBzdHJpbmcpIHt9XG4gIGluaXQoKSB7XG4gICAgdGhpcy5mcmVxdWVudGx5ID0gSlNPTi5wYXJzZShcbiAgICAgIChpc1BsYXRmb3JtQnJvd3Nlcih0aGlzLnBsYXRmb3JtSWQpICYmXG4gICAgICAgIGxvY2FsU3RvcmFnZS5nZXRJdGVtKGAke3RoaXMuTkFNRVNQQUNFfS5mcmVxdWVudGx5YCkpIHx8XG4gICAgICAgICdudWxsJyxcbiAgICApO1xuICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xuICB9XG4gIGFkZChlbW9qaTogRW1vamlEYXRhKSB7XG4gICAgaWYgKCF0aGlzLmluaXRpYWxpemVkKSB7XG4gICAgICB0aGlzLmluaXQoKTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLmZyZXF1ZW50bHkpIHtcbiAgICAgIHRoaXMuZnJlcXVlbnRseSA9IHRoaXMuZGVmYXVsdHM7XG4gICAgfVxuICAgIGlmICghdGhpcy5mcmVxdWVudGx5W2Vtb2ppLmlkXSkge1xuICAgICAgdGhpcy5mcmVxdWVudGx5W2Vtb2ppLmlkXSA9IDA7XG4gICAgfVxuICAgIHRoaXMuZnJlcXVlbnRseVtlbW9qaS5pZF0gKz0gMTtcblxuICAgIGlmIChpc1BsYXRmb3JtQnJvd3Nlcih0aGlzLnBsYXRmb3JtSWQpKSB7XG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShgJHt0aGlzLk5BTUVTUEFDRX0ubGFzdGAsIGVtb2ppLmlkKTtcbiAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGAke3RoaXMuTkFNRVNQQUNFfS5mcmVxdWVudGx5YCwgSlNPTi5zdHJpbmdpZnkodGhpcy5mcmVxdWVudGx5KSk7XG4gICAgfVxuICB9XG4gIGdldChwZXJMaW5lOiBudW1iZXIsIHRvdGFsTGluZXM6IG51bWJlcikge1xuICAgIGlmICghdGhpcy5pbml0aWFsaXplZCkge1xuICAgICAgdGhpcy5pbml0KCk7XG4gICAgfVxuICAgIGlmICh0aGlzLmZyZXF1ZW50bHkgPT09IG51bGwpIHtcbiAgICAgIHRoaXMuZGVmYXVsdHMgPSB7fTtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IFtdO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBlckxpbmU7IGkrKykge1xuICAgICAgICB0aGlzLmRlZmF1bHRzW3RoaXMuREVGQVVMVFNbaV1dID0gcGVyTGluZSAtIGk7XG4gICAgICAgIHJlc3VsdC5wdXNoKHRoaXMuREVGQVVMVFNbaV0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBjb25zdCBxdWFudGl0eSA9IHBlckxpbmUgKiB0b3RhbExpbmVzO1xuICAgIGNvbnN0IGZyZXF1ZW50bHlLZXlzID0gT2JqZWN0LmtleXModGhpcy5mcmVxdWVudGx5KTtcblxuICAgIGNvbnN0IHNvcnRlZCA9IGZyZXF1ZW50bHlLZXlzXG4gICAgICAuc29ydCgoYSwgYikgPT4gdGhpcy5mcmVxdWVudGx5IVthXSAtIHRoaXMuZnJlcXVlbnRseSFbYl0pXG4gICAgICAucmV2ZXJzZSgpO1xuICAgIGNvbnN0IHNsaWNlZCA9IHNvcnRlZC5zbGljZSgwLCBxdWFudGl0eSk7XG5cbiAgICBjb25zdCBsYXN0ID1cbiAgICAgIGlzUGxhdGZvcm1Ccm93c2VyKHRoaXMucGxhdGZvcm1JZCkgJiYgbG9jYWxTdG9yYWdlLmdldEl0ZW0oYCR7dGhpcy5OQU1FU1BBQ0V9Lmxhc3RgKTtcblxuICAgIGlmIChsYXN0ICYmICFzbGljZWQuaW5jbHVkZXMobGFzdCkpIHtcbiAgICAgIHNsaWNlZC5wb3AoKTtcbiAgICAgIHNsaWNlZC5wdXNoKGxhc3QpO1xuICAgIH1cbiAgICByZXR1cm4gc2xpY2VkO1xuICB9XG59XG4iXX0=