
<template>
<view>
	<scroll-view  scroll-y class="content">
		<view class="task-info-item" v-for="(item,index) in taskList" @click="itemToCheck(item.tbbh,item.investigationStatus)">
			<view class = "task-info-item-number">
				{{index}}
			</view>
			<view class = "task-info-item-text">
				<text class = "task-info-item-name">{{item.tbbh}}</text>
				<text class ="task-info-item-pushtime">{{item.taskCreateTime}}</text>
			</view>
			<view class = "task-info-item-status">
				<text v-if="item.investigationStatus=='已核查'">已核查</text>
				<text style="color: red;" v-else>未核查</text>
				
				<text v-if="item.commitStatus=='已审核待提交'">已审核待提交</text>
				<text style="color: red;" v-else>待审核</text>
			</view>
		</view>
	</scroll-view>
	<!-- <view>
		<button class="button" v-show="!hasLogin"  type="primary" @click="loginF">登录账号</button>
		<button class="button" v-show="hasLogin" type="primary" @click="logoutF">退出登录</button>
	</view> -->
	<view v-show="taskList.length==0" class="emptymessage">
		<text>当前无任务</text>
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
		computed: mapState(['hasLogin','uerInfo']),
		data() {
			return {
				taskList:[]
			}
		},
		onShow() {
			
			uni.getStorage({//获得保存在本地的用户信息
			    key: 'uerInfo',  
			    success:(res) => { 
					this.user_id=res.data.data.user.user.user_id;
					
					uni.request({
						url:setting.url+'/taskManagement/getTaskByUserId',
						method: 'POST',
						sslVerify:false,//真机运行受证书限制
						data:{user_id:this.user_id},
						success: res => {
						  
						   if(res.data.success==true){
							   
							   this.taskList = res.data.data.TaskInfoList
							   //过滤器
							   // this.taskLIst = res.data.data.TaskInfoList.filter((item,index)=>{
								  //  return item.investigationStatus=="未核查"
							   // });
							
						   }
						   else{
							   this.taskList=[];
						   }
						},
						header: {
							'Content-Type': 'application/x-www-form-urlencoded',
							'X-Requested-With': 'xmlhttprequest'
							// 'Content-Type': 'application/json;charset:utf-8',
						},
						fail: (res) => {
							console.log(res)
						}
					})
			    }  
			});  
		},
		onHide() {
			uni.removeStorageSync('first');
		},
		methods:{
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
			},
			itemToCheck(tbbh,investigationStatus){
				
				uni.navigateTo({
					 url: `../task_infos_check/task_infos_check?tbbh=`+tbbh+'&user_id='+this.user_id+'&investigationStatus='+investigationStatus,
					success(res) {
					},
					fail(res) {
						console.log(res)
					}
				})
			}
				}
	}
</script>

<style>
	page, .content{
		background-color: #f8f8f8;
		height: 100%;
		overflow: auto;
	}
	.task-info-item{
		/* width: 650upx; */
		padding: 24upx 44upx;
		border-bottom-width: 1px;
		border-color: #eee;
		background-color: #fff;
		/* margin-top: 25upx; */
		border:1px solid #eee;
		/* margin-left: 20upx; */
		height: 7%; 
		display: flex;
		/* border-left: 4px solid #dddd00 ; */
		
	}
	.task-info-item-text{
		display: grid;
		width: 56%;
/* 		margin-left: 12%;
		font-size: 25rpx; */
	}
	.task-info-item-name{
		font-size: 30rpx;
		margin-left: 8%;
	}
	.task-info-item-number {
		display: table-cell;
		border-radius: 40upx;
		background-color: #3172e9;
		width: 70upx;
		height: 70upx;
		text-align: center;
	   /* vertical-align: middle; */
		color: #fff;
		font-size: 50upx;
		margin-top: 12rpx;
	}
	.task-info-item-status{
		display: grid;
		font-size: 36rpx;
		margin-left: 12%;
	}
	.emptymessage{
		margin-top: 50%;
		text-align: center;
	}
</style>
