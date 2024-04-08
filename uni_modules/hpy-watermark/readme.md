
## 图片增加文字水印

> **组件名：hpy-watermark
> 图片增加文字水印，支持拍照和相册选取多张

## API

## Props

<table>
	<tr>
		<th>属性名</th>
		<th>类型</th>
		<th>默认值</th>
		<th>说明</th>
    </tr>
	<tr>
		<td>markAlign</td>
		<td>String</td>
		<td>左下角</td>
		<td>文字文字位置（默认：左下角）可选值：左上角：topLeft、右上角：topRight、左下角：bottomLeft、右下角：bottomRight</td>
	</tr>
	<tr>
		<td>fontSize</td>
		<td>Number</td>
		<td>40</td>
		<td>文字大小，默认：40</td>
	</tr>
	<tr>
		<td>fontColor</td>
		<td>String</td>
		<td>白色</td>
		<td>文字颜色，默认：#FFFFFF</td>
	</tr>
	<tr>
		<td>quality</td>
		<td>Number</td>
		<td>1</td>
		<td>图片的质量，取值范围为 (0, 1]，不在范围内时当作1.0处理</td>
	</tr>
	<tr>
		<td>fileType</td>
		<td>String</td>
		<td>jpg</td>
		<td>目标文件的类型，只支持 'jpg' 或 'png'。默认为 'jpg'</td>
	</tr>
	<tr>
		<td>shadowColor</td>
		<td>String</td>
		<td>黑色</td>
		<td>阴影颜色，默认：rgba(0, 0, 0, 1.0)</td>
	</tr>
	<tr>
		<td>shadowWidth</td>
		<td>Number</td>
		<td>2</td>
		<td>阴影边框大小，默认：2</td>
	</tr>
	<tr>
		<td>textAlign</td>
		<td>String</td>
		<td>start</td>
		<td>设置文本的水平对齐方式，默认：start，文本在指定的位置开始。	start、end、center、left、right</td>
	</tr>
	<tr>
		<td>textBaseline</td>
		<td>String</td>
		<td>alphabetic</td>
		<td>设置文本的垂直对齐方式，默认：alphabetic文本基线是普通的字母基线。top、hanging、middle、ideographic、bottom</td>
	</tr>
</table>


## methods 
<table>
	<tr>
		<th>参数名</th>
		<th>类型</th>
		<th>说明</th>
    </tr>
	<tr>
		<td>addWaterMark</td>
		<td>Object</td>
		<td>{filePaths:['图片地址1', '图片地址2'], fillTexts:['水印文字1', '水印文字2']}</td>
	</tr>
</table>
  
## 使用示例

```html
	<template>
		<view>
			<button @click="chooseImage">选择照片</button>
			<!-- 增加水印 -->
			<hpy-watermark ref="watermark" @waterMark="waterMark"></hpy-watermark>
			<view class="ul">
				<view class="li" v-for="(item, index) in imageList" :key="index">
					<image :src="item" class="img" mode="widthFix"></image>
				</view>
			</view>
		</view>
	</template>
```

```javascript
<script>
	export default {
		data() {
			return {
				imageList:[]
			}
		},
		methods: {
			// 选择图片
			chooseImage() {
				uni.chooseImage({
					count: this.limit,				// 限制的图片数量
					sizeType: ['compressed'],		// original 原图，compressed 压缩图，默认二者都有 
					sourceType: ['album', 'camera'],// album 从相册选图，camera 使用相机，默认二者都有
					success: (res) => {
						var imgPathList = res.tempFilePaths;
						if(imgPathList.length > 0){
							this.addImages(imgPathList);
						}
					},
					fail: (err) => {
						console.log('chooseImage fail', err)
						if("chooseImage:fail cancel" == err.errMsg){
							uni.showToast({
								icon:'none',
								title:'取消了选择'
							});
						}else{
							// #ifdef MP
							uni.getSetting({
								success: (res) => {
									let authStatus = res.authSetting['scope.album'];
									if (!authStatus) {
										uni.showModal({
											title: '授权失败',
											content: '系统上传需要从您的相册获取图片，请在设置界面打开相关权限',
											success: (res) => {
												if (res.confirm) {
													uni.openSetting();
												}
											}
										})
									}
								}
							})
							// #endif
						}
					}
				});
			},
			// 添加图片
			addImages(filePaths){
				if(filePaths.length > 0){
					var fillTexts = ["人员：张三", "地址：广东省珠海市香洲区XXX"];
					fillTexts.push("时间：" + this.getNowTime());
					// 添加水印
					this.$refs.watermark.addWaterMark({
						filePaths,
						fillTexts
					});
				}
			},
			/**
			 * 水印添加回调，在H5平台下，filePath 为 base64
			 */
			waterMark(filePath){
				this.imageList.push(filePath);
			},
			/**
			 * 获取当前时间
			 */
			getNowTime(){
				var date = new Date(),
				year = date.getFullYear(),
				month = date.getMonth() + 1,
				day = date.getDate(),
				hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours(),
				minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes(),
				second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
				month >= 1 && month <= 9 ? (month = "0" + month) : "";
				day >= 0 && day <= 9 ? (day = "0" + day) : "";
				return (year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second);
			}
		}
	}
</script>

```

```style
<style scoped>
	.ul{border: rgb(221, 221, 221) solid 1px; text-align: center; margin-right: 12px; position: relative }
	.ul .li .img{display:block; width: 80px; height: 80px;}
</style>
```