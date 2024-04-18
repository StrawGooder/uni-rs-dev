<template>
	<view>
		<view style="display: flex; flex-direction: column;	width: 100%;height: 100vh;">
			<view class="userInfo_top">
				<view>
					<image class="headerImage" src="../../static/headImage.png">
					<view class="userInfo_top_title">
									<view class="userInfo_top_username">{{userinfo.account}}</view>
									<view class="userInfo_top_role">{{userinfo.role}}</view>
					</view>
				</view>
			</view>
			<view class="userInfo_circle"></view>
			<view class="userInfo_bottom">
				<view class="info">
					<view>
						<text decode="true" class="info_basic_title">基本信息</text>
					</view>
					<view class="info_segment"></view>
					<view class="rowUsername">
						<text decode="true" class="usernameTitle">用户名称</text>
						<text decode="true" class="name">{{userinfo.account}}</text>
					</view>
					<view class="info_segment"></view>
					<view class="rowCity">
						<text decode="true" class="cityTitle">所属地市</text>
						<text decode="true" class="city">{{userinfo.city}}</text>
					</view>
					<view class="info_segment"></view>
					<view class="rowDistrict">
						<text decode="true" class="districtTitle">所属区县</text>
						<text decode="true" class="district">{{userinfo.area}}</text>
					</view>
					<view class="info_segment"></view>
					<view class="rowDepartment">
						<text decode="true" class="departmentTitle">所属部门</text>
						<text decode="true" class="department">{{userinfo.department}}</text>
					</view>
				</view>
			</view>
			<view>
				<button class="button" v-show="!hasLogin"  type="primary" @click="loginF">登录账号</button>
				<button class="button" v-show="hasLogin" type="primary" @click="logoutF">退出登录</button>
			</view>
		</view>
		
	</view>
</template>

<script>
	import setting from '@/setting.js';
	import {
		mapState,  
		mapMutations  
	} from 'vuex';  
	export default {
		// computed: mapState(['hasLogin','uerInfo']),
		data() {
			return {
				userinfo:[],
				hasLogin:[]
			}
		},
		onShow() {
			uni.getStorage({//获得保存在本地的用户信息
			    key: 'uerInfo',  
			    success:(res) => {  
					this.userinfo=res.data.data.user.user;
					this.hasLogin=1;
			    }  
			});  
		},
		onHide() {
			uni.removeStorageSync('first');
		},
		methods: {
			...mapMutations(['logout']),
			logoutF() {
				this.logout()
				uni.navigateTo({
					url: '../../pages/login/login'
				})
			},
			loginF(){
				uni.navigateTo({
					url: '../../pages/login/login'
				})
			}
		}
	}
</script>

<style lang="scss">
// @import '/colorui/main.css';
// @import '/colorui/icon.css';
	page {
		background: url(../../static/bg.png) no-repeat center center fixed ;
		background-size: cover;
		box-sizing: border-box;
	}
	.userInfo_top{
		 // background: pink; 
		 height: 300upx;
		 position: relative;
		 // margin-top:35%;
		 display: block;
		 .headerImage{
			 width: 200upx;
			 height: 200upx;
			 position: absolute;
			 bottom: 12%;
			 left: 10%;
		 }
		 .userInfo_top_title{
			 // width: 200upx;
			 // height: 200upx;
			 // background: pink;
			 position: absolute;
			 bottom: 18%;
			 left: 40%;
			 .userInfo_top_username{
				 font-size: 50rpx;
				 color: white;
			 }
			 .userInfo_top_role{
				 font-size: 40rpx;
				 color: #c1c3ca;
			 }
		 }
	}
	.userInfo_circle{
		background: white;
		height: 100upx;		
		border-top-left-radius:80%;
		border-top-right-radius:80%;
		display: block;
	}
	.userInfo_bottom{
		// margin-top:80rpx;
		padding:0;
		width: 100%;
		background: white;
		flex: 1;
	}
	.info{
		 white-space:normal;
		 width:749upx;
		 height:200%;
		 padding:0upx;
		 clear:both;
		 float:left;
		 text-align:left;
		 border-radius:0upx;
		 font-size:8upx;
	}
	 
	 .info_basic_title{
		 font-weight: bold;
		 white-space:normal;
		 width:689upx;
		 height:29upx;
		 padding:0upx;
		 margin-top:34upx;
		 margin-left:30upx;
		 float:left;
		 text-align:left; 
		 border-radius:0upx; 
		 color:#000000;
		 font-size:40upx; 
		 line-height:29upx;
		 }
	 .info_segment{
		 white-space:normal;
		 width:691upx;
		 height:1upx;
		 padding:0upx;
		 clear:both;
		 margin-top:31upx;
		 margin-left:29upx;
		 float:left;
		 background-color:#e1e1e1;
		 text-align:left; 
		 border-radius:0upx;
		 font-size:2upx; 
		 line-height:4upx;
		 }
	 .rowUsername{
		 white-space:normal;
		 width:699upx;
		 height:29upx;
		 padding:0upx;
		 clear:both;
		 margin-top:35upx;
		 margin-left:23upx;
		 float:left;
		 text-align:left; 
		 border-radius:0upx;
		 font-size:28upx; 
		 line-height:29upx;
		 }
	 .usernameTitle{
		 width:159upx;
		 padding:0upx;
		 margin-top:0upx;
		 margin-left:6upx;
		 float:left; 
		 border-radius:0upx;
		 color:#000000;
		 font-size:27upx;
		 }
	 .name{
		 width:399upx;
		 padding:0upx;
		 margin-top:0upx;
		 margin-left:88upx;
		 float:left;
		 text-align:right; 
		 color:#c8c8c8;
		 font-size:24upx; 
		 line-height:29upx;
		 }
		
		.rowCity{
				 white-space:normal;
				 width:699upx;
				 height:29upx;
				 padding:0upx;
				 clear:both;
				 margin-top:35upx;
				 margin-left:23upx;
				 float:left;
				 text-align:left; 
				 border-radius:0upx;
				 font-size:28upx; 
				 line-height:29upx;
				 }
		.cityTitle{
				 width:159upx;
				 padding:0upx;
				 margin-top:0upx;
				 margin-left:6upx;
				 float:left; 
				 border-radius:0upx;
				 color:#000000;
				 font-size:27upx;
				 }
		.city{
				 width:399upx;
				 padding:0upx;
				 margin-top:0upx;
				 margin-left:88upx;
				 float:left;
				 text-align:right; 
				 color:#c8c8c8;
				 font-size:24upx; 
				 line-height:29upx;
				 }
				 
		.rowDistrict{
				 white-space:normal;
				 width:699upx;
				 height:29upx;
				 padding:0upx;
				 clear:both;
				 margin-top:35upx;
				 margin-left:23upx;
				 float:left;
				 text-align:left; 
				 border-radius:0upx;
				 font-size:28upx; 
				 line-height:29upx;
				 }
		.districtTitle{
				 width:159upx;
				 padding:0upx;
				 margin-top:0upx;
				 margin-left:6upx;
				 float:left; 
				 border-radius:0upx;
				 color:#000000;
				 font-size:27upx;
				 }
		.district{
				 width:399upx;
				 padding:0upx;
				 margin-top:0upx;
				 margin-left:88upx;
				 float:left;
				 text-align:right; 
				 color:#c8c8c8;
				 font-size:24upx; 
				 line-height:29upx;
				 }
		.rowDepartment{
				 white-space:normal;
				 width:699upx;
				 height:29upx;
				 padding:0upx;
				 clear:both;
				 margin-top:35upx;
				 margin-left:23upx;
				 float:left;
				 text-align:left; 
				 border-radius:0upx;
				 font-size:28upx; 
				 line-height:29upx;
				 }
		.departmentTitle{
				 width:159upx;
				 padding:0upx;
				 margin-top:0upx;
				 margin-left:6upx;
				 float:left; 
				 border-radius:0upx;
				 color:#000000;
				 font-size:27upx;
				 }
		.department{
				 width:399upx;
				 padding:0upx;
				 margin-top:0upx;
				 margin-left:88upx;
				 float:left;
				 text-align:right; 
				 color:#c8c8c8;
				 font-size:24upx; 
				 line-height:29upx;
				 }
</style>

 
