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
<script>
	// import {
	// 	pathToBase64,
	// 	base64ToPath
	// } from '../../js_sdk/mmmm-image-tools/index.js'
	import {
		pathToBase64,
		base64ToPath
	} from '@/js_sdk/mmmm-image-tools/index.js'
	import setting from '@/setting.js';
	import gcoord from 'gcoord';
	export default {
		name:"OutdoorPhotoPanel",
		props: ['get_map_data', 'set_graphphone_status', 'tbbh', 'investigationStatus'],
		data() {
			return {
				nowMapIndex: true,
				imageList: [],
				imageListForPreview: [],
				cachesimage: [],
				image_info: {
					image_data: null,
					image_time: null,
					longitudes: 0,
					latitude: 0,
					compassangel: 0
				},
				direction: null, //方向角度
				image_longtudes: null, //经度信息
				image_latitude: null, //纬度信息
				image_gyroscope: null, //陀螺仪角度
				deviceOrientation:'y',//设备方向
				image_order: null, //图片的序号
				image_error: [], //不规范的图片编号集合
				phoneHeight: '',
				phoneWidth: ''
			}
		},
		// props: {
		// 	compassangel: {
		// 	    // type: String,
		// 	    default: 'hello'
		// 	}
		// },
		created() {
			var _this = this
			//图片列表，用于展示在APP上
			uni.getStorage({
				key: _this.tbbh + 'imagelist',
				success: function(res) {
					_this.imageListForPreview = res.data
				},
				fail(res) {
					
				}
			});
			//照片数据，用于出去后，进来能够继续修改照片相关数据
			uni.getStorage({
				key: _this.tbbh,
				success: function(res) {
					_this.imageList = res.data
				},
				fail(res) {
					
				}
			});
			//错误的照片数据，用于出去后，进来能够实时同步
			uni.getStorage({
				key: _this.tbbh + 'imageerror',
				success: function(res) {
					_this.image_error = res.data
					_this.image_order = _this.imageListForPreview.length
					console.log("_this.image_order:", _this.image_order)
				},
				fail(res) {
					_this.image_order = 0
					console.log("chooseimage init fail :", res)
				}
			});
			// 计算屏幕高度 ，宽度

			uni.getSystemInfo({
				success(res) {
					_this.phoneHeight = res.windowHeight;
					_this.phoneWidth = res.windowWidth
				},
				fail(e) {
					console.log("高度获取失败：", e)
				}
			});
		},
		computed: {
			fortyPercentScreenHeight() { //百分之40的高

				if (this.phoneHeight !== '' && this.phoneWidth !== '') {
					return 750 / (this.phoneWidth) * (this.phoneHeight) * 0.48 + 'rpx'
				} else {

					return '600rpx'
				}
			},
			seventyPercentScreenHeight() { //百分之七十的屏幕高
				if (this.phoneHeight !== '' && this.phoneWidth !== '') {
					return 750 / (this.phoneWidth) * (this.phoneHeight) * 0.7 + 'rpx'
				} else {
					return '1000rpx'
				}
			},
		},
		methods: {
			// 选择图片
			btnAddImgs: function() {
				var that = this
				//map_data存放的都是线段信息
				var map_data = this.get_map_data.split('||')
				// this.image_longtudes = map_data[0] -0
				// this.image_latitude = map_data[1] - 0,
				this.image_gyroscope = map_data[2] - 0
				if (this.set_graphphone_status.distance_status.status == true && this.set_graphphone_status
					.angle_status.status == true) {
					var _this = this
					//加速度监听
					const acceleroListener = function (accelerometerValue) { 
						console.log("加速度")
						// 根据加速度数据来判断设备方向
						const {x,y} = accelerometerValue;
						if (Math.abs(x) > Math.abs(y)) {
							_this.deviceOrientation = "x"
						} else { 
							_this.deviceOrientation = "y"
						}
					}
					//罗盘监听
					const callback = function(res) {
						console.log("罗盘：")
						if(_this.deviceOrientation=='x'){
							_this.direction = res.direction+90
						}else{
							_this.direction = res.direction
						}
					}
					uni.onAccelerometerChange(acceleroListener);
					uni.onCompassChange(callback);
					if (this.image_gyroscope != "undefined" && this.image_gyroscope != null &&
						this.set_graphphone_status.distance_status.value != -2) {

						uni.chooseImage({
							count: 9, //默认9A
							sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
							sourceType: ['camera'], //使用相机
							success(res) {
								uni.offCompassChange(callback);
								// plus.geolocation.clearWatch(_this.wid);
								// _this.wid = null;
								uni.showLoading({
									title: '正在形成照片，请不要移动'
								});
								uni.getLocation({
									type: 'wgs84',
									geocode: true,
									success: function(sres) {
										_this.image_longtudes = sres.longitude; // 经度
										_this.image_latitude = sres.latitude; // 纬度
									},
									complete: function(cres) {
										uni.hideLoading();
										_this.addImages(res.tempFilePaths);
									}
								});

								// _this.$emit("sendimagestauts",_this.image_error)
							}
						})
					} else {
						var _this = this
						uni.chooseImage({
							count: 9, //默认9A
							sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
							sourceType: ['camera'], //使用相机
							success(res) {
								uni.offCompassChange(callback);
								uni.offAccelerometerChange(acceleroListener) // 需传入与监听时同一个的函数对象
								uni.showLoading({
									title: '正在生成照片，请勿移动位置'
								});
								uni.getLocation({
									type: 'wgs84',
									geocode: true,
									success: function(lres) {
										_this.image_longtudes = lres.longitude; // 经度
										_this.image_latitude = lres.latitude; // 纬度

									},
									complete: function(cres) {
										uni.hideLoading();
										res.tempFilePaths.forEach((item, index) => { //js遍历数组
											uni.saveImageToPhotosAlbum({
												filePath: item,
												success: function(re) {
													pathToBase64(item).then(
														base64 => {
															var base64str =JSON.stringify(base64)
															_this.image_info = {
																	image_data: base64,
																	image_time: Date.parse(new Date()),
																	longitudes: _this.image_longtudes,
																	latitude: _this.image_latitude,
																	gyroscope: _this.direction,
																}
															_this.imageList.push(_this.image_info)
															uni.setStorage({
																key: _this.tbbh,
																data: _this.imageList,
																success: function(res) {
																	console.log("chooseimage:uni.getstorage:",res.data);
																},
																fail(res) {
																	console.log("fail",res)
																}
															});
														}).catch(error => {
														console.error(error)
													})
													_this.imageListForPreview.push(re.path)
													uni.setStorage({
														key: _this.tbbh +'imagelist',
														data: _this.imageListForPreview,
														success: function(res) {
															console.log("chooseimage:uni.getstorage:",res.data);
														},
														fail(res) {
															console.log("fail",res)
														}
													});
												}
											})
										})
									}
								});


								// _this.$emit("sendimagestauts",_this.image_error)
							}
						})
					}
				} else if (this.image_gyroscope == -1000) {
					uni.showToast({
						icon: 'none',
						title: '无法拍照，请选择规定的拍照线段',
						duration: 1000,
						mask: true
					})
				} else {
					uni.showToast({
						icon: 'none',
						title: '无法拍照，调整拍照位置和角度',
						duration: 1000,
						mask: true
					})
				}
			},
			addImages(filePaths) {
				if (filePaths.length > 0) {
					//拍照位置和拍照点的距离
					// const image_distance = this.getDistance(map_data[1] - 0, map_data[0] - 0, this.image_latitude, this.image_longtudes)
					const image_distance = this.set_graphphone_status.distance_status.value
					var fillTexts = [];
					fillTexts.push("拍摄时间：" + this.getNowTime());
					if ((image_distance > setting.distance) || (Math.abs(this.image_gyroscope - Math.abs(this.direction)) >
							setting
							.angle) || (this.image_gyroscope == "undefined") || this.image_gyroscope == null || Math.abs(
							this.image_gyroscope) == -1) {
						fillTexts.push("类型：" + "不合格");
						fillTexts.push("角度相差" + Math.abs(this.image_gyroscope - Math.abs(this.direction)));
						fillTexts.push("距离拍照地点" + image_distance);
						// fillTexts.push("类型：" + "不合格");
						this.image_error.push(this.image_order)
					} else {
						// fillTexts.push("类型：" + "合格" + " "+image_distance+" "+ this.direction+ " " + map_data[2]);
						fillTexts.push("类型：" + "合格");
					}
					this.image_order++
					var _this = this
					uni.setStorage({
						key: _this.tbbh + 'imageerror',
						data: _this.image_error,
						success: function(res) {},
						fail(res) {
							console.log("fail", res)
						}
					});
					// 添加水印
					this.$refs.watermark.addWaterMark({
						filePaths,
						fillTexts
					});
					// _this.$emit("sendimagestauts",_this.image_error)
				}
			},
			/**
			 * 水印添加回调，在H5平台下，filePath 为 base64
			 */
			waterMark(filePath) {
				//list 去重
				// let arr = [1,1,2,3,4,2,5,2,1,3]
				// let newList = [...new Set(arr)]
				var _this = this
				//             this.imageListForPreview.push(filePath);
				// console.log("waterMark filePath",filePath)
				this.cachesimage.push(filePath)
				for (var i = this.cachesimage.length - 1; i >= 0; i--) {
					this.getimagedata(this.cachesimage[i])
					break
				}
			},
			//获取数据并上传
			getimagedata(imageListForPreview) {
				var _this = this
				uni.saveImageToPhotosAlbum({
					filePath: imageListForPreview,
					success: function(res) {
						pathToBase64(imageListForPreview).then(base64 => {
							var base64str = JSON.stringify(base64)
							_this.image_info = {
								image_data: base64,
								image_time: Date.parse(new Date()),
								longitudes: _this.image_longtudes,
								latitude: _this.image_latitude,
								gyroscope: _this.direction
							}
							_this.imageList.push(_this.image_info)
							uni.setStorage({
								key: _this.tbbh,
								data: _this.imageList,
								success: function(res) {
									console.log("chooseimage:uni.getstorage:", res.data);
								},
								fail(res) {
									console.log("fail", res)
								}
							});
							// _this.$emit("sendimagedata",_this.imageList)
						}).catch(error => {
							console.error(error)
						})
						_this.imageListForPreview.push(res.path);
						console.log("save image sucess:", _this.imageListForPreview, res.path)
						uni.setStorage({
							key: _this.tbbh + 'imagelist',
							data: _this.imageListForPreview,
							success: function(res) {
								console.log("chooseimage:uni.getstorage:", res.data);
							},
							fail(res) {
								console.log("fail", res)
							}
						});
					},
				})
			},
			/**
			 * 获取当前时间
			 */
			getNowTime() {
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
			},
			// 删除图片
			btnDeleteImg: function(index) {
				// this.image_error.splice(index,1)
				// for(var i = index;i<this.image_error.length;i++){
				// 	this.image_error.splice(index,1,index-1)
				// }
				console.log("this.image_error.findIndex(index)", this.image_error.findIndex(item => item === index))
				var _this = this
				uni.showModal({
					title: "删除",
					content: "是否删除该选中的图片！",
					confirmText: "删除",
					success(res) {
						if (res.confirm) { //删除
							_this.imageList.splice(index, 1)
							_this.imageListForPreview.splice(index, 1)
							console.log("删除照片后_this.imageList", _this.imageList.length)
							uni.setStorage({
								key: _this.tbbh,
								data: _this.imageList,
								success: function(res) {},
								fail(res) {
									console.log("fail", res)
								}
							});
							// _this.$emit("sendimagedata",_this.imageList)
							uni.setStorage({
								key: _this.tbbh + 'imagelist',
								data: _this.imageListForPreview,
								success: function(res) {
									console.log("chooseimage:uni.getstorage:", res.data);
								},
								fail(res) {
									console.log("fail", res)
								}
							});
							//删除错误照片时,这里修改相应的序号
							if (_this.image_error.findIndex(item => item === index) != -1) {
								_this.image_error.forEach((item, in_dex) => {
									if (item == index) {
										_this.image_error.splice(in_dex, 1)
										for (var i = in_dex; i < _this.image_error.length; i++) {
											_this.image_error.splice(i, 1, _this.image_error[i] - 1)
										}
									}
								})
							} else {
								//index 照片序号
								for (var i = index; i < _this.image_error.length; i++) {
									_this.image_error.splice(i, 1, _this.image_error[i] - 1)
								}
							}
							// uni.setStorage({
							// 	key: _this.tbbh+'imageerror',
							// 	data:_this.image_error,
							// 	success: function (res) {
							// 		console.log("chooseimage:uni.getstorage:",res.data);
							// 	},
							// 	fail(res) {
							// 		console.log("fail",res)
							// 	}
							// });
							uni.setStorageSync(_this.tbbh + 'imageerror', _this.image_error)
							_this.image_order--
						}
						// _this.$emit("sendimagestauts",_this.image_error)
						console.log("_this.image_error", _this.image_error, _this.imageListForPreview.length)
						//，当照片数量为0的时候删除缓存数据
						if (_this.imageListForPreview.length == 0) {
							uni.removeStorage({
								key: _this.tbbh,
								success: function(res) {
									console.log('删除 照片的详细信息');
								}
							});
							uni.removeStorage({
								key: _this.tbbh + 'imagelist',
								success: function(res) {
									console.log('删除照片信息');
								}
							});
							uni.removeStorage({
								key: _this.tbbh + 'imageerror',
								success: function(res) {
									_this.image_order = 0
									_this.image_error = []
									console.log('删除照片错误列表');
								}
							});
						}
					},
				})
			},
			// 图片预览
			previewImage: function(index) {
				var _this = this
				uni.previewImage({
					current: index,
					urls: _this.imageListForPreview,
					indicator: "number"
				})
			},
			getDistance(lat1, lng1, lat2, lng2) {
				const PI = Math.PI
				const EARTH_RADIUS = 6378137.0

				function getRad(d) {
					return d * PI / 180.0
				}
				let f = getRad((lat1 + lat2) / 2)
				let g = getRad((lat1 - lat2) / 2)
				let l = getRad((lng1 - lng2) / 2)
				let sg = Math.sin(g)
				let sl = Math.sin(l)
				let sf = Math.sin(f)
				let s, c, w, r, d, h1, h2
				let a = EARTH_RADIUS
				let fl = 1 / 298.257
				sg = sg * sg
				sl = sl * sl
				sf = sf * sf
				s = sg * (1 - sl) + (1 - sf) * sl
				c = (1 - sg) * (1 - sl) + sf * sl
				w = Math.atan(Math.sqrt(s / c))
				r = Math.sqrt(s * c) / w
				d = 2 * w * a
				h1 = (3 * r - 1) / 2 / c
				h2 = (3 * r + 1) / 2 / s
				var distance = d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg))
				return distance
			},
		},
		mounted() {},
		beforeDestroy(){
			console.log("chooseimage beforeDestroy")
			// uni.stopCompass();
			uni.stopAccelerometer();
		},
	}
</script>
<style>
	/*      图片选择 start */
	.deldete {
		width: 28rpx;
		position: absolute;
		top: -65rpx;
		right: 10rpx;
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
