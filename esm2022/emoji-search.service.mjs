import { Injectable } from '@angular/core';
import { categories } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { intersect } from './utils';
import * as i0 from "@angular/core";
import * as i1 from "@ctrl/ngx-emoji-mart/ngx-emoji";
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
                for (const category of categories || []) {
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
export { EmojiSearch };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "16.0.5", ngImport: i0, type: EmojiSearch, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i1.EmojiService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1vamktc2VhcmNoLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvbGliL3BpY2tlci9lbW9qaS1zZWFyY2guc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTNDLE9BQU8sRUFBRSxVQUFVLEVBQTJCLE1BQU0sZ0NBQWdDLENBQUM7QUFDckYsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLFNBQVMsQ0FBQzs7O0FBRXBDLE1BQ2EsV0FBVztJQVdGO0lBVnBCLFlBQVksR0FBUSxFQUFFLENBQUM7SUFDdkIsS0FBSyxHQUlELEVBQUUsQ0FBQztJQUNQLFVBQVUsR0FBUSxFQUFFLENBQUM7SUFDckIsYUFBYSxHQUE4QixFQUFFLENBQUM7SUFDOUMsV0FBVyxHQUE4QixFQUFFLENBQUM7SUFFNUMsWUFBb0IsWUFBMEI7UUFBMUIsaUJBQVksR0FBWixZQUFZLENBQWM7UUFDNUMsS0FBSyxNQUFNLFNBQVMsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRTtZQUNoRCxNQUFNLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxHQUFHLFNBQVMsQ0FBQztZQUM1QyxNQUFNLEVBQUUsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFekIsS0FBSyxNQUFNLFFBQVEsSUFBSSxTQUFTLEVBQUU7Z0JBQ2hDLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsRUFBRTtvQkFDaEMsU0FBUztpQkFDVjtnQkFFRCxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQzthQUNuQztZQUVELElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUM3RCxJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUUsQ0FB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QUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUN4QixXQUFXLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3RCLFdBQVcsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDNUIsV0FBVyxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUU5QixPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDMUIsQ0FBQzt1R0EvTlUsV0FBVzsyR0FBWCxXQUFXLGNBREUsTUFBTTs7U0FDbkIsV0FBVzsyRkFBWCxXQUFXO2tCQUR2QixVQUFVO21CQUFDLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgY2F0ZWdvcmllcywgRW1vamlEYXRhLCBFbW9qaVNlcnZpY2UgfSBmcm9tICdAY3RybC9uZ3gtZW1vamktbWFydC9uZ3gtZW1vamknO1xuaW1wb3J0IHsgaW50ZXJzZWN0IH0gZnJvbSAnLi91dGlscyc7XG5cbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogJ3Jvb3QnIH0pXG5leHBvcnQgY2xhc3MgRW1vamlTZWFyY2gge1xuICBvcmlnaW5hbFBvb2w6IGFueSA9IHt9O1xuICBpbmRleDoge1xuICAgIHJlc3VsdHM/OiBFbW9qaURhdGFbXTtcbiAgICBwb29sPzogeyBba2V5OiBzdHJpbmddOiBFbW9qaURhdGEgfTtcbiAgICBba2V5OiBzdHJpbmddOiBhbnk7XG4gIH0gPSB7fTtcbiAgZW1vamlzTGlzdDogYW55ID0ge307XG4gIGVtb3RpY29uc0xpc3Q6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0gPSB7fTtcbiAgZW1vamlTZWFyY2g6IHsgW2tleTogc3RyaW5nXTogc3RyaW5nIH0gPSB7fTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVtb2ppU2VydmljZTogRW1vamlTZXJ2aWNlKSB7XG4gICAgZm9yIChjb25zdCBlbW9qaURhdGEgb2YgdGhpcy5lbW9qaVNlcnZpY2UuZW1vamlzKSB7XG4gICAgICBjb25zdCB7IHNob3J0TmFtZXMsIGVtb3RpY29ucyB9ID0gZW1vamlEYXRhO1xuICAgICAgY29uc3QgaWQgPSBzaG9ydE5hbWVzWzBdO1xuXG4gICAgICBmb3IgKGNvbnN0IGVtb3RpY29uIG9mIGVtb3RpY29ucykge1xuICAgICAgICBpZiAodGhpcy5lbW90aWNvbnNMaXN0W2Vtb3RpY29uXSkge1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5lbW90aWNvbnNMaXN0W2Vtb3RpY29uXSA9IGlkO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmVtb2ppc0xpc3RbaWRdID0gdGhpcy5lbW9qaVNlcnZpY2UuZ2V0U2FuaXRpemVkRGF0YShpZCk7XG4gICAgICB0aGlzLm9yaWdpbmFsUG9vbFtpZF0gPSBlbW9qaURhdGE7XG4gICAgfVxuICB9XG5cbiAgYWRkQ3VzdG9tVG9Qb29sKGN1c3RvbTogYW55LCBwb29sOiBhbnkpIHtcbiAgICBmb3IgKGNvbnN0IGVtb2ppIG9mIGN1c3RvbSkge1xuICAgICAgY29uc3QgZW1vamlJZCA9IGVtb2ppLmlkIHx8IGVtb2ppLnNob3J0TmFtZXNbMF07XG5cbiAgICAgIGlmIChlbW9qaUlkICYmICFwb29sW2Vtb2ppSWRdKSB7XG4gICAgICAgIHBvb2xbZW1vamlJZF0gPSB0aGlzLmVtb2ppU2VydmljZS5nZXREYXRhKGVtb2ppKTtcbiAgICAgICAgdGhpcy5lbW9qaXNMaXN0W2Vtb2ppSWRdID0gdGhpcy5lbW9qaVNlcnZpY2UuZ2V0U2FuaXRpemVkRGF0YShlbW9qaSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc2VhcmNoKFxuICAgIHZhbHVlOiBzdHJpbmcsXG4gICAgZW1vamlzVG9TaG93RmlsdGVyPzogKHg6IGFueSkgPT4gYm9vbGVhbixcbiAgICBtYXhSZXN1bHRzID0gNzUsXG4gICAgaW5jbHVkZTogYW55W10gPSBbXSxcbiAgICBleGNsdWRlOiBhbnlbXSA9IFtdLFxuICAgIGN1c3RvbTogYW55W10gPSBbXSxcbiAgKTogRW1vamlEYXRhW10gfCBudWxsIHtcbiAgICB0aGlzLmFkZEN1c3RvbVRvUG9vbChjdXN0b20sIHRoaXMub3JpZ2luYWxQb29sKTtcblxuICAgIGxldCByZXN1bHRzOiBFbW9qaURhdGFbXSB8IHVuZGVmaW5lZDtcbiAgICBsZXQgcG9vbCA9IHRoaXMub3JpZ2luYWxQb29sO1xuXG4gICAgaWYgKHZhbHVlLmxlbmd0aCkge1xuICAgICAgaWYgKHZhbHVlID09PSAnLScgfHwgdmFsdWUgPT09ICctMScpIHtcbiAgICAgICAgcmV0dXJuIFt0aGlzLmVtb2ppc0xpc3RbJy0xJ11dO1xuICAgICAgfVxuICAgICAgaWYgKHZhbHVlID09PSAnKycgfHwgdmFsdWUgPT09ICcrMScpIHtcbiAgICAgICAgcmV0dXJuIFt0aGlzLmVtb2ppc0xpc3RbJysxJ11dO1xuICAgICAgfVxuXG4gICAgICBsZXQgdmFsdWVzID0gdmFsdWUudG9Mb3dlckNhc2UoKS5zcGxpdCgvW1xcc3wsfFxcLXxfXSsvKTtcbiAgICAgIGxldCBhbGxSZXN1bHRzID0gW107XG5cbiAgICAgIGlmICh2YWx1ZXMubGVuZ3RoID4gMikge1xuICAgICAgICB2YWx1ZXMgPSBbdmFsdWVzWzBdLCB2YWx1ZXNbMV1dO1xuICAgICAgfVxuXG4gICAgICBpZiAoaW5jbHVkZS5sZW5ndGggfHwgZXhjbHVkZS5sZW5ndGgpIHtcbiAgICAgICAgcG9vbCA9IHt9O1xuXG4gICAgICAgIGZvciAoY29uc3QgY2F0ZWdvcnkgb2YgY2F0ZWdvcmllcyB8fCBbXSkge1xuICAgICAgICAgIGNvbnN0IGlzSW5jbHVkZWQgPSBpbmNsdWRlICYmIGluY2x1ZGUubGVuZ3RoID8gaW5jbHVkZS5pbmRleE9mKGNhdGVnb3J5LmlkKSA+IC0xIDogdHJ1ZTtcbiAgICAgICAgICBjb25zdCBpc0V4Y2x1ZGVkID0gZXhjbHVkZSAmJiBleGNsdWRlLmxlbmd0aCA/IGV4Y2x1ZGUuaW5kZXhPZihjYXRlZ29yeS5pZCkgPiAtMSA6IGZhbHNlO1xuXG4gICAgICAgICAgaWYgKCFpc0luY2x1ZGVkIHx8IGlzRXhjbHVkZWQpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGZvciAoY29uc3QgZW1vamlJZCBvZiBjYXRlZ29yeS5lbW9qaXMgfHwgW10pIHtcbiAgICAgICAgICAgIC8vIE5lZWQgdG8gbWFrZSBzdXJlIHRoYXQgcG9vbCBnZXRzIGtleWVkXG4gICAgICAgICAgICAvLyB3aXRoIHRoZSBjb3JyZWN0IGlkLCB3aGljaCBpcyB3aHkgd2UgY2FsbCBlbW9qaVNlcnZpY2UuZ2V0RGF0YSBiZWxvd1xuICAgICAgICAgICAgY29uc3QgZW1vamkgPSB0aGlzLmVtb2ppU2VydmljZS5nZXREYXRhKGVtb2ppSWQpO1xuICAgICAgICAgICAgcG9vbFtlbW9qaT8uaWQgPz8gJyddID0gZW1vamk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGN1c3RvbS5sZW5ndGgpIHtcbiAgICAgICAgICBjb25zdCBjdXN0b21Jc0luY2x1ZGVkID1cbiAgICAgICAgICAgIGluY2x1ZGUgJiYgaW5jbHVkZS5sZW5ndGggPyBpbmNsdWRlLmluZGV4T2YoJ2N1c3RvbScpID4gLTEgOiB0cnVlO1xuICAgICAgICAgIGNvbnN0IGN1c3RvbUlzRXhjbHVkZWQgPVxuICAgICAgICAgICAgZXhjbHVkZSAmJiBleGNsdWRlLmxlbmd0aCA/IGV4Y2x1ZGUuaW5kZXhPZignY3VzdG9tJykgPiAtMSA6IGZhbHNlO1xuICAgICAgICAgIGlmIChjdXN0b21Jc0luY2x1ZGVkICYmICFjdXN0b21Jc0V4Y2x1ZGVkKSB7XG4gICAgICAgICAgICB0aGlzLmFkZEN1c3RvbVRvUG9vbChjdXN0b20sIHBvb2wpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBhbGxSZXN1bHRzID0gdmFsdWVzXG4gICAgICAgIC5tYXAodiA9PiB7XG4gICAgICAgICAgbGV0IGFQb29sID0gcG9vbDtcbiAgICAgICAgICBsZXQgYUluZGV4ID0gdGhpcy5pbmRleDtcbiAgICAgICAgICBsZXQgbGVuZ3RoID0gMDtcblxuICAgICAgICAgIGZvciAobGV0IGNoYXJJbmRleCA9IDA7IGNoYXJJbmRleCA8IHYubGVuZ3RoOyBjaGFySW5kZXgrKykge1xuICAgICAgICAgICAgY29uc3QgY2hhciA9IHZbY2hhckluZGV4XTtcbiAgICAgICAgICAgIGxlbmd0aCsrO1xuICAgICAgICAgICAgaWYgKCFhSW5kZXhbY2hhcl0pIHtcbiAgICAgICAgICAgICAgYUluZGV4W2NoYXJdID0ge307XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBhSW5kZXggPSBhSW5kZXhbY2hhcl07XG5cbiAgICAgICAgICAgIGlmICghYUluZGV4LnJlc3VsdHMpIHtcbiAgICAgICAgICAgICAgY29uc3Qgc2NvcmVzOiB7IFtrZXk6IHN0cmluZ106IG51bWJlciB9ID0ge307XG5cbiAgICAgICAgICAgICAgYUluZGV4LnJlc3VsdHMgPSBbXTtcbiAgICAgICAgICAgICAgYUluZGV4LnBvb2wgPSB7fTtcblxuICAgICAgICAgICAgICBmb3IgKGNvbnN0IGlkIG9mIE9iamVjdC5rZXlzKGFQb29sKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGVtb2ppID0gYVBvb2xbaWRdO1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5lbW9qaVNlYXJjaFtpZF0pIHtcbiAgICAgICAgICAgICAgICAgIHRoaXMuZW1vamlTZWFyY2hbaWRdID0gdGhpcy5idWlsZFNlYXJjaChcbiAgICAgICAgICAgICAgICAgICAgZW1vamkuc2hvcnRfbmFtZXMsXG4gICAgICAgICAgICAgICAgICAgIGVtb2ppLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgIGVtb2ppLmlkLFxuICAgICAgICAgICAgICAgICAgICBlbW9qaS5rZXl3b3JkcyxcbiAgICAgICAgICAgICAgICAgICAgZW1vamkuZW1vdGljb25zLFxuICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc3QgcXVlcnkgPSB0aGlzLmVtb2ppU2VhcmNoW2lkXTtcbiAgICAgICAgICAgICAgICBjb25zdCBzdWIgPSB2LnN1YnN0cigwLCBsZW5ndGgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHN1YkluZGV4ID0gcXVlcnkuaW5kZXhPZihzdWIpO1xuXG4gICAgICAgICAgICAgICAgaWYgKHN1YkluZGV4ICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgbGV0IHNjb3JlID0gc3ViSW5kZXggKyAxO1xuICAgICAgICAgICAgICAgICAgaWYgKHN1YiA9PT0gaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgc2NvcmUgPSAwO1xuICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICBhSW5kZXgucmVzdWx0cy5wdXNoKHRoaXMuZW1vamlzTGlzdFtpZF0pO1xuICAgICAgICAgICAgICAgICAgYUluZGV4LnBvb2xbaWRdID0gZW1vamk7XG5cbiAgICAgICAgICAgICAgICAgIHNjb3Jlc1tpZF0gPSBzY29yZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBhSW5kZXgucmVzdWx0cy5zb3J0KChhLCBiKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgYVNjb3JlID0gc2NvcmVzW2EuaWRdO1xuICAgICAgICAgICAgICAgIGNvbnN0IGJTY29yZSA9IHNjb3Jlc1tiLmlkXTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBhU2NvcmUgLSBiU2NvcmU7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBhUG9vbCA9IGFJbmRleC5wb29sO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBhSW5kZXgucmVzdWx0cztcbiAgICAgICAgfSlcbiAgICAgICAgLmZpbHRlcihhID0+IGEpO1xuXG4gICAgICBpZiAoYWxsUmVzdWx0cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIHJlc3VsdHMgPSBpbnRlcnNlY3QuYXBwbHkobnVsbCwgYWxsUmVzdWx0cyBhcyBhbnkpO1xuICAgICAgfSBlbHNlIGlmIChhbGxSZXN1bHRzLmxlbmd0aCkge1xuICAgICAgICByZXN1bHRzID0gYWxsUmVzdWx0c1swXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdHMgPSBbXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocmVzdWx0cykge1xuICAgICAgaWYgKGVtb2ppc1RvU2hvd0ZpbHRlcikge1xuICAgICAgICByZXN1bHRzID0gcmVzdWx0cy5maWx0ZXIoKHJlc3VsdDogRW1vamlEYXRhKSA9PiB7XG4gICAgICAgICAgaWYgKHJlc3VsdCAmJiByZXN1bHQuaWQpIHtcbiAgICAgICAgICAgIHJldHVybiBlbW9qaXNUb1Nob3dGaWx0ZXIodGhpcy5lbW9qaVNlcnZpY2UubmFtZXNbcmVzdWx0LmlkXSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZXN1bHRzICYmIHJlc3VsdHMubGVuZ3RoID4gbWF4UmVzdWx0cykge1xuICAgICAgICByZXN1bHRzID0gcmVzdWx0cy5zbGljZSgwLCBtYXhSZXN1bHRzKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdHMgfHwgbnVsbDtcbiAgfVxuXG4gIGJ1aWxkU2VhcmNoKFxuICAgIHNob3J0TmFtZXM6IHN0cmluZ1tdLFxuICAgIG5hbWU6IHN0cmluZyxcbiAgICBpZDogc3RyaW5nLFxuICAgIGtleXdvcmRzOiBzdHJpbmdbXSxcbiAgICBlbW90aWNvbnM6IHN0cmluZ1tdLFxuICApIHtcbiAgICBjb25zdCBzZWFyY2g6IHN0cmluZ1tdID0gW107XG5cbiAgICBjb25zdCBhZGRUb1NlYXJjaCA9IChzdHJpbmdzOiBzdHJpbmcgfCBzdHJpbmdbXSwgc3BsaXQ6IGJvb2xlYW4pID0+IHtcbiAgICAgIGlmICghc3RyaW5ncykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGFyciA9IEFycmF5LmlzQXJyYXkoc3RyaW5ncykgPyBzdHJpbmdzIDogW3N0cmluZ3NdO1xuXG4gICAgICBmb3IgKGNvbnN0IHN0ciBvZiBhcnIpIHtcbiAgICAgICAgY29uc3Qgc3Vic3RyaW5ncyA9IHNwbGl0ID8gc3RyLnNwbGl0KC9bLXxffFxcc10rLykgOiBbc3RyXTtcblxuICAgICAgICBmb3IgKGxldCBzIG9mIHN1YnN0cmluZ3MpIHtcbiAgICAgICAgICBzID0gcy50b0xvd2VyQ2FzZSgpO1xuXG4gICAgICAgICAgaWYgKCFzZWFyY2guaW5jbHVkZXMocykpIHtcbiAgICAgICAgICAgIHNlYXJjaC5wdXNoKHMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG5cbiAgICBhZGRUb1NlYXJjaChzaG9ydE5hbWVzLCB0cnVlKTtcbiAgICBhZGRUb1NlYXJjaChuYW1lLCB0cnVlKTtcbiAgICBhZGRUb1NlYXJjaChpZCwgdHJ1ZSk7XG4gICAgYWRkVG9TZWFyY2goa2V5d29yZHMsIHRydWUpO1xuICAgIGFkZFRvU2VhcmNoKGVtb3RpY29ucywgZmFsc2UpO1xuXG4gICAgcmV0dXJuIHNlYXJjaC5qb2luKCcsJyk7XG4gIH1cbn1cbiJdfQ==