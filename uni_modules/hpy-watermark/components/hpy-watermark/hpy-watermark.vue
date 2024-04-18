<template>
	<view class="watermark-content">
		<canvas canvas-id="watermarkCanvas" :style="{width:canvasWidth+'px',height:canvasHeight+'px'}"></canvas>
	</view>
</template>

<script>
	export default {
		name:'hpy-watermark',
		props:{
			/**
			 * 文字文字位置（默认：左下角）可选值：左上角：topLeft、右上角：topRight、左下角：bottomLeft、右下角：bottomRight
			 */
			markAlign:{
				type:String,
				default:function(){
					return 'bottomLeft'
				}
			},
			/**
			 * 设置文本的水平对齐方式，默认：start，文本在指定的位置开始。
			 * end	文本在指定的位置结束。
			 * center 文本的中心被放置在指定的位置。
			 * left	文本左对齐。
			 * right	文本右对齐。
			 */
			textAlign:{
				type:String,
				default:function(){
					return 'start';
				}
			},
			/**
			 * 设置文本的垂直对齐方式，默认：alphabetic文本基线是普通的字母基线。
			 * top	文本基线是 em 方框的顶端。
			 * hanging	文本基线是悬挂基线。
			 * middle	文本基线是 em 方框的正中。
			 * ideographic	文本基线是表意基线。
			 * bottom	文本基线是 em 方框的底端。
			 */
			textBaseline:{
				type:String,
				default:function(){
					return 'alphabetic';
				}
			},
			/**
			 * 文字大小
			 */
			fontSize:{
				type:[Number, String],
				default:40
			},
			/**
			 * 文字颜色
			 */
			fontColor:{
				type:String,
				default:function(){
					return '#FFFFFF'
				}
			},
			/**
			 * 阴影颜色
			 */
			shadowColor:{
				type:String,
				default:function(){
					return 'rgba(0, 0, 0, 1.0)';
				}
			},
			/**
			 * 阴影边框大小
			 */
			shadowWidth:{
				type:[Number, String],
				default:2
			},
			/**
			 * 图片的质量，取值范围为 (0, 1]，不在范围内时当作1.0处理
			 */
			quality:{
				type:[Number, String],
				default:1
			},
			/**
			 * 目标文件的类型，只支持 'jpg' 或 'png'。默认为 'jpg'
			 */
			fileType:{
				type:String,
				default:function(){
					return 'jpg'
				}
			}
		},
		data() {
			return {
				canvasWidth:1980,
				canvasHeight:2340
			};
		},
		mounted() {
			this.ctx = uni.createCanvasContext('watermarkCanvas', this);
		},
		methods: {
			/**
			 * 增加水印
			 * @param {Object} options = {filePaths:['图片地址1', '图片地址2'], fillTexts:['水印1', '水印2']}
			 */
			async addWaterMark(options) {
				if(options.filePaths){
					var filePaths = options.filePaths, fillTexts = (options.fillTexts || []).reverse();
					for (var i = 0; i < filePaths.length; i++) {
						await this.drawImage(filePaths[i], fillTexts);
					}
				}
			},
			/**
			 * 绘制单个图片
			 */
			drawImage(filePath, fillTexts){
				return new Promise((resolve, reject) =>{
					uni.showLoading({title:'图片处理中···'});
					const ctx = (this.ctx || uni.createCanvasContext('watermarkCanvas', this));
					uni.getImageInfo({
						src: filePath,
						success: (image) => {
							this.canvasWidth = image.width;
							this.canvasHeight = image.height;
							ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
							ctx.drawImage(image.path, 0, 0, image.width, image.height);
							ctx.setFontSize(this.fontSize);
							ctx.setFillStyle(this.fontColor);
							// 设置阴影
							let shadowWidth = Number(this.shadowWidth + "");
							if(shadowWidth > 0){
								ctx.shadowColor = this.shadowColor;
								ctx.shadowOffsetX = shadowWidth;
								ctx.shadowOffsetY = shadowWidth;
							}
							// 设置水平对齐方式
							ctx.textAlign = this.textAlign;
							// 设置垂直对齐方式
							ctx.textBaseline = this.textBaseline;
							const maxText = fillTexts.reduce((text, val) => {
								return text.length >= val.length ? text : val;
							});
							fillTexts.forEach((mark, index) => {
								if(this.markAlign == "bottomRight"){
									ctx.fillText(mark, image.width - (ctx.measureText(maxText).width+60), image.height - (index*60+60));
								}else if(this.markAlign == "topLeft"){
									ctx.fillText(mark, 20, (index*60+60));
								}else if(this.markAlign == "topRight"){
									ctx.fillText(mark, image.width - (ctx.measureText(maxText).width+60), (index*60+60));
								}else{
									ctx.fillText(mark, 20, image.height - (index*60+60));
								}
							});
							ctx.draw(false, (() => {
								setTimeout(()=>{
									uni.canvasToTempFilePath({
										x: 0,
										y: 0,
										width: image.width,
										height: image.height,
										destWidth: image.width,
										destHeight: image.height,
										canvasId: 'watermarkCanvas',
										fileType:this.fileType,
										quality:Number(this.quality + "" || "1"),
										success: (res) => {
											this.$emit('waterMark', res.tempFilePath);
										},
										fail:(err) => {
											console.log(err)
										},
										complete: () => {
											resolve();
											uni.hideLoading();
										}
									}, this);
								}, 1500);
							})());
						},
						fail: (e) => {
							resolve();
							uni.hideLoading();
						}
					});
				});
			}
		}
	}
</script>

<style scoped>
	.watermark-content{width: 0;height: 0;overflow: hidden;}
</style>
