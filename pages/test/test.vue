<template>
    <view class="content">
        <!-- 图片选择 -->
        <view class="choose-img">
            <view class="image-wrap">
                <block v-for="(itemImg ,index) in imageList">
                    <view class="item">
                        <image class="q-image" :src="itemImg" mode="scaleToFill" @click="previewImage(index)"></image>
                        <!-- 移除图片的按钮  -->
                        <view class="q-image-remover">
							<uni-icons type="contact" size="30" class="deldete" @click="btnDeleteImg(index)"
                                mode="widthFix"></uni-icons>
<!--                             <image class="deldete" src="../../static/img_exit.png" @click="btnDeleteImg(index)"
                                mode="widthFix"></image> -->
                        </view>
                    </view>
                </block>
                <!-- 添加图片图标 -->
                <view class="item" @click="btnAddImgs">
                    <image class="q-image" src="../../static/add_image.jpeg" mode="scaleToFill">
                    </image>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                imageList: [],
                tempImgList: []
            }
        },
        methods: {
            // 选择图片
            btnAddImgs: function() {
                var _this = this
                uni.chooseImage({
                    count: 9, //默认9
                    sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
                    sourceType: ['album', "camera"], //从相册选择 、使用相机
                    success(res) {
                        console.log("++res++ " + JSON.stringify(res.tempFilePaths))
                        _this.tempImgList = res.tempFilePaths
                        _this.imageList = _this.imageList.concat(_this.tempImgList)
                    }
                })
            },
            // 删除图片
            btnDeleteImg: function(index) {
                var _this = this
                uni.showModal({
                    title: "删除",
                    content: "是否删除该选中的图片！",
                    confirmText: "删除",
                    success(res) {
                        if (res.confirm) { //删除
                            _this.imageList.splice(index, 1)
                        }
                    }
                })
            },
            // 图片预览
            previewImage:function(index){
                var _this = this
                uni.previewImage({
                    current:index,
                    urls:_this.imageList,
                    indicator:"number"
                })
            }
        }
    }
</script>

<style>
/*      图片选择 start */
.deldete {
	width: 28rpx;
	position: absolute;
	top: -56rpx;
	right: 4rpx;
}
.q-image-remover {
	width: 0;
	height: 0;
	border-top: 66rpx solid #bfde85;
	border-left: 66rpx solid transparent;
	position: absolute;
	top: 0;
	right: 0;
}
.q-image {
	height: 220rpx;
	width: 100%;
}
.item {
	position: relative;
	height: 220rpx;
	width: 30%;
	margin-left: 2.5%;
	margin-top: 20rpx;
}
.image-wrap {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	width: 100%;
}

/*      图片选择 end */
.content {
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
	background-color: white;
}
</style>