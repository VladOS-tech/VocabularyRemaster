<template>
    <div class="input-tags-block">
        <h3>
            Теги:
        </h3>
        <div class="tag-search-input-area">
            <input type="text" class="input-field input-field-regular" v-model="tagSearch" ref="tagSearchInputField" placeholder="Начните вводить тег..." @input="toggleTagSelector" @keyup="closeTagSelector">
            <ul class="form-tag-selector-list" v-if="showTagSelector">
                <li class="tag-selector-list-element button" v-for="tag in unselectedRecommendedTags" :key="tag.id" @click="selectTag(tag); selectTagViaSearch();">
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
                    x
                </button>
            </div>
            
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';
import { mapGetters, mapMutations, mapActions } from 'vuex';
import TagObject from '@/assets/types/TagObject';

    export default defineComponent({
        data(){
            return{
                tagSearch: '' as string,
                showTagSelector: false as boolean
            }
        },
        computed:{
            ...mapGetters('phraseForm', ['inputSelectedTags', 'recommendedTags']),
            unselectedRecommendedTags(): TagObject[]{
                return (this.recommendedTags || []).filter((tag: TagObject) => !(this.inputSelectedTags || []).some((selectedTag: TagObject) => selectedTag.id === tag.id))
            },
            searchRecommendedTags() :TagObject[]{
                return this.recommendedTags.filter((tag: TagObject) => tag.content.toLowerCase().includes(this.tagSearch.trim().toLowerCase()))
            }
        },
        methods:{
            ...mapActions('phraseForm', ['GetRecommendedTags']),
            ...mapMutations('phraseForm', ['setInputSelectedTags', 'addInputSelectedTag', 'removeInputSelectedTag']),
            selectTag(tag: TagObject){
                this.addInputSelectedTag(tag)
            },
            selectTagViaSearch(){
                (this.$refs.tagSearchInputField as HTMLInputElement).blur()
                this.tagSearch = ''
                this.showTagSelector = false;
            },
            unselectTag(tag: TagObject){
                this.removeInputSelectedTag(tag)
            },
            async toggleTagSelector(){
                if(this.tagSearch.length >= 3){
                    await this.GetRecommendedTags(this.tagSearch)
                    if(this.unselectedRecommendedTags.length > 0) this.showTagSelector = true;
                }else{
                    this.showTagSelector = false;
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
                this.showTagSelector = false;
                }
            }
        }
    })

</script>

<style scoped>
    @import url('@/assets/style/forms/form-components/input-tags.css');
</style>