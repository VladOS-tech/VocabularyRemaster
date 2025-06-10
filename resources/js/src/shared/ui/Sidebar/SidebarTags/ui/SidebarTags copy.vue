<template>
    <div class="popular-tags-block popular-tags-block-light">
        <h3>
            Популярные теги
        </h3>
        <LoadingIcon v-if="isLoading" />
        <div class="tags-block" v-else>
            <div class="tag tag-button tag-highlighted" v-for="tag in unselectedPopularTags" :key="tag.id" @:click="selectTag(tag)"> {{ tag.content }}</div>
        </div>
        <div class="tag-search-input-area">
            <input type="text" class="input-field input-field-regular" v-model="tagSearch" ref="tagSearchInputField" placeholder="Введите желаемый тег:" @input="searchTag" @keyup="closeTagSelector">
            <ul class="tag-selector-list" v-if="showTagSelector && tagSearch.length >= 3">
                <li class="tag-selector-list-element button" v-for="tag in unselectedSearchResultTags" :key="tag.id" @click="selectTag(tag); selectTagViaSearch();">
                    <div class="tag-search-inline">
                    {{ tag.content }}
                    </div>
                    <div class="tag-search-inline">
                        {{ tag.count }}
                    </div>
                </li>
            </ul>
        </div>
        <h4>
            Выбрано:
        </h4>
        <div v-if="searchSelectedTags.length > 0" class="tags-block">
            <div class="tag tag-generic tag-editable" @click.stop v-for="tag in searchSelectedTags" :key="tag.id">
                {{ tag.content }}
                <button class="button remove-tag-button" @click="unselectTag(tag)">
                    x
                </button>
            </div>
            
        </div>
        <div v-else>-   </div>
        <div class="button button-large button-side" @click="GetPhrasesInfo()">
            Применить
        </div>
    </div>    
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import LoadingIcon from '@/shared/ui/LoadingIcon';
import TagObject from '@/shared/types/TagObject';
import { mapGetters, mapActions, mapMutations } from 'vuex';
import { throttle } from '@/shared/lib/throttle';

    export default defineComponent({
        data() {
            return{
                tagSearch: '' as string,
                showTagSelector: false as boolean,
                isLoading: true as boolean,
                popularTags: [] as TagObject[],
                tagSearchResult: [] as TagObject[],
                throttleTagSearch: undefined as undefined | ((...args: any[]) => void)
            }
        },
        components:{
            LoadingIcon
        },
        computed:{
            ...mapGetters(['searchSelectedTags']),
            unselectedPopularTags(): TagObject[]{
                return (this.popularTags || []).filter((tag: TagObject) => !(this.searchSelectedTags || []).some((selectedTag: TagObject) => selectedTag.id === tag.id))
            },
            unselectedSearchResultTags(): TagObject[]{
                return (this.tagSearchResult || []).filter((tag: TagObject) => !(this.searchSelectedTags || []).some((selectedTag: TagObject) => selectedTag.id === tag.id))
            }
        },
        methods:{
            ...mapActions(['GetPhrasesInfo', 'GetSearchRecommendedTags', 'getPopularTags', 'getTagsSearch']),
            ...mapMutations(['setSearchSelectedTags', 'addSearchSelectedTag', 'removeSearchSelectedTag', 'setSearchSelectedTags']),
            selectTag(tag: TagObject){
                this.addSearchSelectedTag(tag)
            },
            selectTagViaSearch(){
                (this.$refs.tagSearchInputField as HTMLInputElement).blur()
                this.tagSearch = ''
                this.showTagSelector = false;
            },
            unselectTag(tag: TagObject){
                this.removeSearchSelectedTag(tag)
            },
            searchTag(){
                if(this.tagSearch.length >= 3){
                    if (this.throttleTagSearch) this.throttleTagSearch()
                }else{
                    this.showTagSelector = false
                }
            },
            closeTagSelector(e: KeyboardEvent){
                if(e.key === 'Enter' || e.key === 'Escape'){
                    if(e.key == 'Enter'){
                    let firstTag = this.unselectedSearchResultTags[0]
                    if (firstTag) {
                        this.selectTag(firstTag)
                    }
                }
                (e.target as HTMLInputElement).blur()
                this.tagSearch = ''
                this.showTagSelector = false
                }
            },
        },
        async beforeMount() {
            this.throttleTagSearch = throttle(async () => {
                        this.tagSearchResult = await this.getTagsSearch({searchQuery: this.tagSearch})
                        if(this.unselectedSearchResultTags.length > 0) this.showTagSelector = true
                    }, 1000)
            this.popularTags = await this.getPopularTags()
            this.isLoading = false
        },
    })
</script>

<style scoped>
    @import url('PopularTags.css');
    @import url('InputTags.css');
</style>