<template>
    <div class="edit-tags-block">
        <h3>
            Теги:
        </h3>
        <div class="tag-search-input-area">
            <input type="text" class="input-field input-field-regular" v-model="tagSearch" ref="tagSearchInputField"
                placeholder="Начните вводить тег..." @input="searchTags" @keyup="closeTagSelector">
            <ul class="moderator-form-tag-selector-list" v-if="showTagSelector && tagSearch.length >= 3">
                <li class="moderator-tag-selector-list-element button" v-for="tag in unselectedSearchResultTags" :key="tag.id"
                    @click="selectTag(tag); selectTagViaSearch();">
                    <div class="tag-search-inline">
                        {{ tag.content }}
                    </div>
                    <div class="tag-search-inline">
                        {{ tag.timesUsed }}
                    </div>
                </li>
            </ul>
        </div>
        <div v-if="inputSelectedTags.length > 0" class="tags-block">
            <div class="tag tag-generic tag-editable" @click.stop v-for="tag in inputSelectedTags" :key="tag.id">
                {{ tag.content }}
                <button class="button remove-tag-button" @click="unselectTag(tag)">
                    <img src="@/shared/assets/images/cross-icon.svg" alt="remove-tag">
                </button>
            </div>

        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapGetters, mapMutations, mapActions } from 'vuex';
import TagObject from '@/shared/types/TagObject';
import { throttle } from '@/shared/lib/throttle';

export default defineComponent({
    data() {
        return {
            tagSearch: '' as string,
            showTagSelector: false as boolean,
            tagSearchResult: [] as TagObject[],
            throttleTagSearch: undefined as undefined | ((...args: any[]) => void)
        }
    },
    computed: {
        ...mapGetters('reviewForm', ['inputSelectedTags']),
        unselectedSearchResultTags(): TagObject[] {
            return (this.tagSearchResult || []).filter((tag: TagObject) => !(this.inputSelectedTags || []).some((selectedTag: TagObject) => selectedTag.id === tag.id))
        }
    },
    methods: {
        ...mapActions('reviewForm', ['GetRecommendedTags']),
        ...mapActions(['getTagsSearch']),
        ...mapMutations('reviewForm', ['setInputSelectedTags', 'addInputSelectedTag', 'removeInputSelectedTag']),
        selectTag(tag: TagObject) {
            this.addInputSelectedTag(tag)
        },
        selectTagViaSearch() {
            (this.$refs.tagSearchInputField as HTMLInputElement).blur()
            this.tagSearch = ''
            this.showTagSelector = false;
        },
        unselectTag(tag: TagObject) {
            this.removeInputSelectedTag(tag)
        },
        async searchTags() {
            if (this.tagSearch.length >= 3) {
                if (this.throttleTagSearch) this.throttleTagSearch()
                if (this.unselectedSearchResultTags.length > 0) this.showTagSelector = true;
            } else {
                this.showTagSelector = false;
            }
        },
        closeTagSelector(e: KeyboardEvent) {
            if (e.key === 'Enter' || e.key === 'Escape') {
                if (e.key == 'Enter') {
                    let firstTag = this.unselectedSearchResultTags[0]
                    if (firstTag) {
                        this.selectTag(firstTag)
                    }
                }
                (e.target as HTMLInputElement).blur()
                this.tagSearch = ''
                this.showTagSelector = false;
            }
        }
    },
    async beforeMount() {
        this.throttleTagSearch = throttle(async () => {
            // window.alert('debounced')
            this.tagSearchResult = await this.getTagsSearch({ searchQuery: this.tagSearch })
            if (this.unselectedSearchResultTags.length > 0) this.showTagSelector = true
        }, 1000)
    }
})

</script>

<style scoped>
@import url('EditTags.css');
</style>