<template>
 	<view>
 		<!-- logo -->
 		<view style="margin-top: 130rpx;">
 			<image class="logo" src="../../static/LOGO2.png">
 			</image>
 		</view>
 		
 		<view class="titleLogin">登 录</view>
 		
 		<view class="inputspace">
 			<uni-forms ref="form" :modelValue="form" :rules="rules"  label-position="top" >
 				<view class="usernameInput">
 					<uni-forms-item name="username" label="账号" >
 						<uni-easyinput  v-model="form.username" prefixIcon="person" focus placeholder="   请输入账号" placeholder-style="font-size:20rpx;"></uni-easyinput>
 					</uni-forms-item>
 				</view>
 				
 				<view class="passwordInput">
 					<uni-forms-item name="password" label="密码">
 						<uni-easyinput v-model="form.password" prefixIcon="locked"  focus placeholder="   请输入密码"  type="password" placeholder-style="font-size:20rpx;"></uni-easyinput>
 					</uni-forms-item>
 				</view>
 			</uni-forms>
 			
 			<view>
 				<button type="primary" @click="loginFn" class="loginBt">登录</button>
 			</view>
 		</view>
 	</view>
</template>
 
<script>
	import {  
		mapMutations  
	} from 'vuex';  
	import setting from '@/setting.js';
 	export default {
 		data() { 
 			return {
 				form:{
 					username:'',
 					password:''
 				},
 				rules: {
 					username: {
 						rules:[
 							{   // 校验 username 不能为空
 								required: true,
 								errorMessage: '账号不能为空！',
 							}
 						],
 						validateTrigger:'submit'
 					},
 					password: {
 						rules:[
 							{   // 校验 password 不能为空
 								required: true,
 								errorMessage: '密码不能为空！',
 							}
 						],
 						validateTrigger:'submit'
 					}
 				},
				user_data:null
 			}
 		},
		created() {
			try{
				this.user_data = uni.getStorageSync('uerInfo').data.user.user
				this.form.username = this.user_data.account;
				this.form.password = this.user_data.password
				
			}catch(e){
				
				//TODO handle the exception
			}
		},
		onHide() {
			uni.removeStorageSync('first');
		},
 		methods: {
 			loginFn(){
 				this.$refs.form.validate().then(res=>{
 								
 								// const baseUrl="http://localhost:8001/login"   //后台接口
 								uni.request({
 									// url: 'http://192.168.31.193:8001/login',   //后台接口
									url: setting.url+'/login',   //后台接口
 									method:"POST",
									sslVerify:false,//真机运行受证书限制
 									data:this.form,
 									success: (res) => {
										if (res.data.code === 200) {
											// window.sessionStorage.setItem('userId', res.data.data.user.user.id);
											// window.sessionStorage.setItem('username', res.data.data.user.username);
											// this.$message.success('登陆成功')
												uni.showToast({
													icon:"none",
													title:'登录成功'
												})
												this.login(res.data)//用户信息保存在vuex中
												// uni.navigateTo({
												// 	url: '../../task_info_items/task_infor_items'
												// })
												uni.switchTab({
												        url: '../index/index',
														// success: function (e) {
														//     var page = getCurrentPages();
														//     if (page == undefined || page == null) return;
														//     page.onShow();
														//   }  
												    })
										} else {
											// this.$message.error(res.data.message)
												uni.showToast({
													icon:"none",
													title:res.data.message
												})
										}
 									},
									header: {
										'Content-Type': 'application/x-www-form-urlencoded',
										'X-Requested-With': 'xmlhttprequest'
										// 'Content-Type': 'application/json;charset:utf-8',
									},
									fail: (res) => {
										console.log(res)
									},
									// complete: (complete) => {  
									// 	console.log(complete)  
									// }
								})
							})
			},
			...mapMutations(['login'])  
		} 
	}
 </script>
 
 <style>
	/deep/.uni-forms-item__label{
	 		color: #606266 !important;
	 		font-size: 20px !important;
	 	}
	/deep/.content-clear-icon{
	 		padding: 0 15px
	 	}
	/deep/.uni-forms-item__error{
	 		font-size: 30rpx !important;
	 	}
 	page {
 		background: url(../../static/login/bg2.png) no-repeat center center fixed ;
 		background-size: cover;
 		box-sizing: border-box;
 	}
 	.logo{
 		display:block;
 		margin: 0 auto;
 		height: 240rpx;
 		width: 240rpx;
 	}
 	.titleLogin{
 		margin-top: 80rpx;
 		/* margin-bottom: 80rpx; */
 		font-size: 65rpx;
 		color: white;
 		text-align: center;
 		font-weight:700;
 	}
 	/* uni-easyinput{
 		border-radius: 100rpx;
 	} */
 	
 	.inputspace{
 		background: #fff;
 		border-radius: 25rpx;
 		box-shadow: 0rpx 10rpx 30rpx rgb(119, 117, 149);
 		/* box-shadow: 1px 1px 2px 2px rgba(0, 0, 0, 0.1); */
 		width: 670rpx;
 		margin: 80rpx auto;
 		padding-top: 80rpx;
 		padding-bottom: 100rpx;
 		/* margin: 200rpx auto; */
 	}
 	.usernameInput{
 		margin: 0 auto;
 		width: 520rpx;
		font-size: 50rpx;
 	}
 	.passwordInput{
 		margin: 0 auto;
 		width: 520rpx;
 	}
 	.loginBt{
 		/* margin: 50rpx auto; */
 		margin-top: 80rpx;
 		width: 500rpx;
 		border-radius: 50rpx;
 		box-shadow: 10rpx 10rpx 20rpx rgb(243, 244, 237);
 		background-image:linear-gradient(to right,#636c8b,#2d3653);
 	}
 	/* :label-style="{'font-size':'80rpx'}" */
 /* 	label{
 		font-size:80rpx;
 	} */
 	
 </style>
 