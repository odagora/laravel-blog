<!-- Style only this component -->
<style scoped>
    .slug-widget {
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }
    .wrapper {
        margin-left: 8px;
    }
    .slug {
        background-color: #fdfd96;
        padding: 3px 5px;
    }
    .input {
        width: auto;
    }
    .url-wrapper {
        display: flex;
        align-items: center;
        height: 28px;
    }
     #slug-editor {
        min-width: 142px;
        max-width: 300px;
    }

</style>

<template>
    <div class="slug-widget">
        <div class="icon-wrapper wrapper">
            <i :class="icon"></i>
        </div>
        <div class="url-wrapper wrapper">
            <span class="root-url">{{urlSanitized}}</span
            ><span class="subdirectory-url">/{{subdirectorySanitized}}/</span
            ><span class="slug" :title="slug" v-show="slug && !isEditing">{{slug}}</span
            ><input type="text" name="slug" id="slug-editor" class="input is-small" v-show="isEditing" v-model="customSlug" @keyup="adjustWidth" @keydown.esc.prevent @keydown.enter.prevent/>
        </div>
        <div class="button-wrapper wrapper">
            <button class="save-slug-button is-small" v-show="!isEditing" @click.prevent="editSlug">{{slug.length < 1 ? 'Create New Slug' : 'Edit'}}</button>
            <b-dropdown hoverable v-show="!isEditing && slug.length > 1">
                <button class="save-slug-button button is-small" slot="trigger">
                <span>Actions</span>
                <b-icon icon="arrow_drop_down"></b-icon>
                </button>
                <b-dropdown-item @click="copyToClipboard(fullUrl)" style="font-size: 0.8em;"><b-icon icon="content_copy" size="is-small"></b-icon> Copy Full Url</b-dropdown-item>
                <b-dropdown-item @click="copyToClipboard(slug)" style="font-size: 0.8em;"><b-icon icon="content_copy" size="is-small"></b-icon> Copy Slug</b-dropdown-item>
                <b-dropdown-item has-link style="font-size: 0.8em;">
                    <a :href="fullUrl" target="_blank">
                        <b-icon icon="link" size="is-small"></b-icon>
                        Visit Url
                    </a>
                </b-dropdown-item>
            </b-dropdown>
            <!-- <button class="save-slug-button button is-small" v-show="!isEditing && slug.length > 1" @click.prevent="copyUrl"><i class="fa fa-copy"></i><span class="m-l-5">Copy</span></button> -->
            <button class="save-slug-button button is-small" v-show="isEditing" @click.prevent="saveSlug">{{customSlug == slug ? 'Cancel' : 'Save'}}</button>
            <button class="save-slug-button button is-small" v-show="isEditing" @click.prevent="resetEditing">Reset</button>
        </div>
    </div>
</template>

<script>
    export default {
        //Define the properties of the component
        props:{
            url: {
                type: String,
                required: true
            },
            subdirectory: {
                type: String,
                required: true
            },
            title: {
                type: String,
                required: true
            },
            icon: {
              type: String,
              default: "fa fa-link"
            }
        },
        //Data passed to the component. It works only one way - from the outside to the inside -. If we need to change data from the component to the rest of the app, we need to trigger some events
        data: function(){
            return {
                slug: this.setSlug(this.title),
                isEditing: false,
                customSlug: '',
                wasEdited: false,
                //Search outside the component for the 'api_token'. Use it only if necessary. The correct way is by component properties
                api_token: this.$root.api_token
            }
        },
        methods: {
            adjustWidth: function(event) {
                const val = event.target.value;
                const key = event.key;
                if (key === "Escape") {
                    event.preventDefault();
                    this.cancelEditing();
                } else if (key === "Enter") {
                    event.preventDefault();
                    this.saveSlug();
                } else {
                    let canvas = document.createElement('canvas');
                    let ctx = canvas.getContext('2d');
                    ctx.font = "14px sans-serif";
                    document.getElementById('slug-editor').style.width = Math.ceil(ctx.measureText(val).width+25)+"px";
                }
            },
            editSlug: function(){
                this.customSlug = this.slug
                this.$emit('edit', this.slug)
                this.isEditing = true
            },
            saveSlug: function(){
                //Prevent from updating slug on typing if it's been edited once
                if (this.customSlug !== this.slug) {
                    this.wasEdited = true
                }
                // run ajax to see if new slug is unique
                this.setSlug(this.customSlug)
                this.$emit('save', this.slug)
                this.isEditing = false    
            },
            resetEditing: function(){
                this.setSlug(this.title)
                this.$emit('reset', this.slug)
                this.wasEdited = false
                this.isEditing = false
            },
            cancelEditing: function() {
              this.$emit('cancel', this.customSlug, this.slug);
              this.isEditing = false;
            },
            setSlug: function(newVal, count = 0){
                //Slugify the newVal
                if (newVal === '') return '';
                let slug = Slug(newVal + (count > 0 ? `-${count}` : ''))
                let vm = this
                //Run the ajax request since there is an api_token to avoid the 401 unauthorized error
                if (this.api_token && slug) {
                        //Test to see if unique
                        axios.get('/api/posts/unique', {
                            params: {
                                api_token: vm.api_token,
                                slug: slug
                            }
                        }).then(function (response){
                            //If unique, then set the slug and emit the event
                            if (response.data) {
                                vm.slug = slug
                                vm.$emit('slug-changed', slug)
                            }
                            else {
                                //If not, customize the slug to make it unique and test again
                                vm.setSlug(newVal, count+1)
                            }
                        }).catch(function(error){
                            console.log(error)
                        })
                }   
            },
            copyToClipboard: function(val) {
              let temp = document.createElement('textarea');
              temp.value = val;
              document.body.appendChild(temp);
              temp.select();
              try {
                let success = document.execCommand('copy');
                let type = (success ? 'success' : 'warning');
                let msg = (success ? `Copied to Clipboard: ${val}` : "Copy failed, your browser may not support this feature");
                this.$emit('copied', type, msg, val);
                console.log("Copied to Clipboard:", val);
              } catch (err) {
                this.$emit('copy-failed', val);
                console.log("Copy failed, your browser may not support this feature.");
                console.log("Attempted to copy:", val);
              }
              document.body.removeChild(temp);
            }
        },
        computed: {
            urlSanitized: function() {
              return this.url.replace(/^\/|\/$/g, '');
            },
            subdirectorySanitized: function() {
              return this.subdirectory.replace(/^\/|\/$/g, '');
            },
            fullUrl: function() {
              return `${this.urlSanitized}/${this.subdirectorySanitized}/${this.slug}`;
            }
        },
        //To update the slug on keydown
        watch: {
            //Use lodash debounce function to avoid sending requests on every key typing. Instead, wait some time and send the request
            title: _.debounce(function(){
                if (this.wasEdited == false) {
                    this.setSlug(this.title)
                    // run ajax to see if slug is unique
                    // if not unique, customize the slug to make it unique
                }
            }, 500)
        }
    }
</script>
