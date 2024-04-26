<template>

    <view class="content">
             
        <!-- 图片选择 -->
        <scroll-view scroll-y 
        :style="{height:nowMapIndex?fortyPercentScreenHeight : seventyPercentScreenHeight}">
            <view class="choose-img">             
                <view class="image-wrap">                 
                    <block v-for="(itemImg ,index) in imageListForPreview">   
                        <view class="item">                         
                            <image 
                            class="q-image" 
                            :src="itemImg" 
                            mode="scaleToFill" 
                            @click="previewImage(index)">
                                
                            </image>           
                                         
                            <!-- 移除图片的按钮  -->                         
                            <view class="q-image-remover">
                                <uni-icons type="clear" size="28" color="red" class="deldete" @click="btnDeleteImg(index)"                                 mode="widthFix">
                                </uni-icons>
                                <!--                             <image class="deldete" src="../../static/img_exit.png" @click="btnDeleteImg(index)"
                                                        mode="widthFix"></image> -->                         
                            </view>                     
                        </view>                 
                    </block>                 
                    <!-- 添加图片图标 -->                 
                    <view 
                    class="item" 
                    @click="btnAddImgs"
					>
                        <uni-icons 
                        type="plusempty" 
                        size="150" 
                        class="q-image"                                 
                        mode="scaleToFill">
                            
                        </uni-icons>                   
                        <!--  <image class="q-image" src="../../static/add_image.jpeg" mode="scaleToFill">
                                            </image> -->                 
                    </view>
                    <!-- 增加水印 -->
                    <hpy-watermark 
					ref="watermark" 
					@waterMark="waterMark"
					>
                        
                    </hpy-watermark>             
                </view>         
            </view>
        </scroll-view>
    </view>
</template>

<script type="text/javascript">

import Vue from 'vue';

import customTabCheckChooseimage from '../../../components/custom-tab-check/custom-tab-check-chooseimage.vue';

export default {
    
    name:"OutdoorDataCollectionPanel",

    props:{

    },

    components:{},

    mixins:[customTabCheckChooseimage],

    // data(){

    //     var props = this.$props
        
    //     return {

    //     }
    // },

    computed:{

    },

    created(){

    },

    methods:{

    },

    // render(h){

    //     var retVn = h("div")
    //     return retVn
    // },

    mounted(){

    },

    beforeDestroy(){

    }

};

</script>

<style>
/* 
    your CSS

    or use '@import "/path/package/you.css"'
    import the third library css files
*/
</style>