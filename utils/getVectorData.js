
export function getFakeShpData(){				
	// var index = await getShpOne(this.id)
	// 			this.geojson_data = index.data.data
	// 			this.listData.push(this.geojson_data[0].year)
	// 			this.listData.push(this.geojson_data[0].issuedate)
	// 			this.listData.push(this.geojson_data[0].shimc)
	// 			this.listData.push(this.geojson_data[0].tbxzjxzqmc)
	// 			this.listData.push(this.geojson_data[0].jcbh)
	// 			this.listData.push(this.geojson_data[0].tblx)
	// 			this.listData.push(this.geojson_data[0].nyqk)
	// 			this.listData.push(this.geojson_data[0].wyqk)
	// 			this.listData.push(this.geojson_data[0].bz)
	// 			this.listData.push(this.geojson_data[0].dkmj + '亩')
	// 			this.listData.push(this.geojson_data[0].tdmj+ '亩')
	// 			this.listData.push(this.geojson_data[0].gdmj+ '亩')
	// 			this.listData.push(this.geojson_data[0].nydmj+ '亩')
	// 			this.listData.push(this.geojson_data[0].jsydmj+ '亩')
	// 			this.listData.push(this.geojson_data[0].wlydmj+ '亩')
	// 			this.listData.push(this.geojson_data[0].yjjbntmj+ '亩')
	const data = [
		{year:2023, issuedate:'2023-09-01', 
		shimc:"桂林市", tbxzjxzqmc:"none", jctbbh:"0001",
		tblx:"新增建筑物",nyqk:"1",wyqk:"1",bz:"无",dkmj:"0.1"
		},
		
	]
	
	return {
		data:data
	}
}