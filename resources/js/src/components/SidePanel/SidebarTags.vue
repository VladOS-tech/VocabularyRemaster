<template>
    <div class="popular-tags-block popular-tags-block-light">
        <h3>
            Популярные теги
        </h3>
        <!-- make togglable tags(and dispatch event) + hide this menu on mobile and load popular tags via action -->
        <loadingIcon v-if="isLoading.tags" />
        <div class="tags-block" v-else>
            <div class="tag tag-button tag-highlighted" v-for="tag in unselectedPopularTags" :key="tag.id" @:click="selectTag(tag)"> {{ tag.name }}</div>
        </div>
        <div class="tag-search-input-area">
            <input type="text" class="input-field input-field-regular" v-model="tagSearch" ref="tagSearchInputField" placeholder="Введите желаемый тег:" @input="toggleTagSelector" @keyup="closeTagSelector">
            <ul class="tag-selector-list" v-if="showTagSelector">
                <li class="tag-selector-list-element button" v-for="tag in unselectedRecommendedTags" :key="tag.id" @click="selectTag(tag); selectTagViaSearch();">
                    <div class="tag-search-inline">
                    {{ tag.name }}
                    </div>
                    <div class="tag-search-inline">
                        {{ tag.timesUsed }}
                    </div>
                </li>
            </ul>
        </div>
        <h4>
            Выбрано:
        </h4>
        <div v-if="searchSelectedTags.length > 0" class="tags-block">
            <div class="tag tag-generic tag-editable" @click.stop v-for="tag in searchSelectedTags" :key="tag.id">
                {{ tag.name }}
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
import { defineComponent, PropType } from 'vue';
import loadingIcon from '../Misc/LoadingIcon.vue';
import TagObject from '@/assets/interfaces/TagObject';
import { mapGetters, mapActions, mapMutations } from 'vuex';

    export default defineComponent({
        data() {
            return{
                tagSearch: '' as string,
                showTagSelector: false as boolean
            }
        },
        components:{
            loadingIcon
        },
        computed:{
            ...mapGetters(['isLoading', 'popularTags', 'availableTags', 'searchSelectedTags']),
            unselectedPopularTags(): TagObject[]{
                return (this.popularTags || []).filter((tag: TagObject) => !(this.searchSelectedTags || []).some((selectedTag: TagObject) => selectedTag.id === tag.id))
            },
            unselectedRecommendedTags(): TagObject[]{
                return (this.searchRecommendedTags || []).filter((tag: TagObject) => !(this.searchSelectedTags || []).some((selectedTag: TagObject) => selectedTag.id === tag.id))
            },
            searchRecommendedTags() :TagObject[]{
                return this.availableTags.filter((tag: TagObject) => tag.name.includes(this.tagSearch.trim()))
            }
        },
        methods:{
            ...mapActions(['GetPhrasesInfo', 'GetSearchRecommendedTags']),
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
            toggleTagSelector(){
                if(this.tagSearch.length >= 3){
                    if(this.unselectedRecommendedTags.length > 0) this.showTagSelector = true
                }else{
                    this.showTagSelector = false
                }
            },
            closeTagSelector(e: KeyboardEvent){
                if(e.key === 'Enter' || e.key === 'Escape'){
                    if(e.key == 'Enter'){
                    let firstTag = this.unselectedRecommendedTags[0]
                    if (firstTag) {
                        this.selectTag(firstTag)
                    }
                }
                (e.target as HTMLInputElement).blur()
                this.tagSearch = ''
                this.showTagSelector = false
                }
            }
        }
    })
</script>

<style scoped>
    @import url('@/assets/style/elements/popular-tags.css');
    @import url('@/assets/style/forms/form-components/input-tags.css');
</style>