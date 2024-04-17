import Vue from "vue";
var eye_icon = require("../zs-icon/resources/imgs/svg/house.svg");
var refresh_icon = require("../zs-icon/resources/imgs/svg/house.svg");

function getSVG(name) {
	
	return name_to_svg[name]
}

var name_to_svg = {}
var name_to_icon_comp = {}

function initSvgIconComponent(){
	
	var retDom = ""
	
	var name_to_svg = {
		// "eye":eye_icon,
		// "refresh":refresh_icon
	}
	
	var name_to_svg2 = {
		
	// "eye-closed":"",
	
		"refresh":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-clockwise" viewBox="0 0 16 16">\
					  <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/>\
					  <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/>\
					</svg>'
		,	
	
		"airplaneFill":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"  viewBox="0 0 16 16">\
							<path d="M6.428 1.151C6.708.591 7.213 0 8 0s1.292.592 1.572 1.151C9.861 1.73 10 2.431 10 3v3.691l5.17 2.585a1.5 1.5 0 0 1 .83 1.342V12a.5.5 0 0 1-.582.493l-5.507-.918-.375 2.253 1.318 1.318A.5.5 0 0 1 10.5 16h-5a.5.5 0 0 1-.354-.854l1.319-1.318-.376-2.253-5.507.918A.5.5 0 0 1 0 12v-1.382a1.5 1.5 0 0 1 .83-1.342L6 6.691V3c0-.568.14-1.271.428-1.849">\
							</path>\
						</svg>'
		,
		
		"rectangle":'<svg width="36.000000pt" height="36.000000pt" viewBox="0 0 36.000000 36.000000" xmlns="http://www.w3.org/2000/svg">\
						<g transform="translate(0.000000,36.000000) scale(0.100000,-0.100000)" fill="currentColor" stroke="none">\
						<path d="M42 318 c-17 -17 -17 -279 0 -296 17 -17 279 -17 296 0 17 17 17 279\
						0 296 -17 17 -279 17 -296 0z m283 -148 c0 -135 0 -135 -135 -135 -135 0 -135\
						0 -138 124 -4 166 -17 152 140 149 133 -3 133 -3 133 -138z" />\
					  </g>\
					</svg>'
		,
			
		"eyeFill":'<svg width="36.000000pt" height="24.000000pt" viewBox="0 0 36.000000 24.000000" xmlns="http://www.w3.org/2000/svg">\
					  <g transform="translate(0.000000,24.000000) scale(0.100000,-0.100000)" fill="currentColor" stroke="none">\
						<path d="M112 209 c-24 -12 -54 -37 -68 -55 -26 -33 -26 -33 -4 -64 12 -16 41\
					-41 64 -55 24 -14 56 -25 71 -25 42 0 112 37 141 76 26 34 26 34 0 68 -28 37\
					-98 76 -137 76 -13 0 -43 -10 -67 -21z m117 -45 c12 -15 21 -37 21 -50 0 -26\
					-43 -64 -73 -64 -28 0 -67 38 -67 65 0 12 9 34 21 49 28 35 70 35 98 0z" />\
						<path d="M147 152 c-10 -10 -17 -25 -17 -34 0 -19 31 -48 52 -48 19 0 48 31\
					48 52 0 19 -31 48 -52 48 -8 0 -22 -8 -31 -18z" />\
					  </g>\
					</svg>'
		,
		"eyeSlashFill":'<svg width="36.000000pt" height="24.000000pt" viewBox="0 0 36.000000 24.000000" xmlns="http://www.w3.org/2000/svg">\
						  <g transform="translate(0.000000,24.000000) scale(0.100000,-0.100000)" fill="#2f3236" stroke="none">\
							<path d="M60 232 c0 -14 229 -236 237 -229 7 8 -215 237 -229 237 -5 0 -8 -3\
						-8 -8z" />\
							<path d="M137 223 c-12 -12 15 -33 42 -33 34 0 71 -38 71 -72 0 -21 26 -58 41\
						-58 3 0 15 14 28 31 22 30 22 30 -3 64 -14 18 -45 42 -69 54 -42 20 -97 28\
						-110 14z" />\
							<path d="M40 150 c-21 -30 -21 -30 0 -60 29 -40 99 -80 142 -80 19 0 38 3 41\
						7 12 12 -15 33 -42 33 -34 0 -71 38 -71 72 0 22 -26 58 -43 58 -3 0 -15 -13\
						-27 -30z" />\
							<path d="M200 145 c13 -14 26 -23 28 -20 7 7 -29 45 -41 45 -6 0 0 -11 13 -25z" />\
							<path d="M130 113 c0 -12 38 -48 45 -41 3 2 -6 15 -20 28 -14 13 -25 19 -25\
						13z" />\
						  </g>\
						</svg>'
	}
	

	Object.assign(name_to_svg, name_to_svg2)
	// var eye_icon = ""
	
	// var refresh_icon = ""
	
	// ================================================
	
	var icon_name_pro;
	
	for(var icon_name in name_to_svg)
	{
		icon_name_pro = icon_name.slice(0,1).toUpperCase() + icon_name.slice(1, icon_name.length)
		icon_name_pro = icon_name+"Icon"
		name_to_icon_comp[icon_name] = createIconComponent(icon_name_pro, name_to_svg[icon_name])
	}
	
	// name_to_icon_comp["eye"] = createIconComponent("EyeIcon", name_to_svg["eye2"])
					
	name_to_icon_comp["eye2"] = name_to_icon_comp["eye"] 
	
}

function getIconComponent(name){
	
	return name_to_icon_comp[name]
}

function getAllIconComponents(){
	
	return name_to_icon_comp
}

function createIconComponent(name, svg, props){
	
	// var default_props = {
	// 		svg:{
	// 			type:String,
	// 			default:svg
	// 		}
	// 	}
	
	var merged_props = {
			svg:{
				type:String,
				default:svg
			},
			size:{
				type:String,
				default:"1em"
			}
		}
		
	Object.assign(merged_props, props || {})
	var component = Vue.extend(
		{
			name:name,
			props:merged_props,
			render(h){
				
				var svg_elem;
				var class_elem = 'class="zs-icon"'
				
				if (this.svg.slice(1,4)!="svg")
				{
					// note, viewBox coordination 
					svg_elem = `<svg width="76.000000pt" height="72.000000pt" viewBox="0 0 76.000000 72.000000" xmlns="http://www.w3.org/2000/svg">\
					${this.svg}\
					</svg>`
					
					return h("view", {domProps:{innerHTML: svg_element}})
				
				}
				else
				{
					var svg_text_len = this.svg.length
					// svg_elem = "" 
					svg_elem = this.svg.slice(0, 5) + ` ${class_elem} ` + this.svg.slice(5, svg_text_len)
					
					return h("view", { domProps:{innerHTML: svg_elem} } )	
					// return h("view", { domProps:{innerHTML: this.svg} } )	
				}
				
			}
		}
	);
	
	return component
	
}

initSvgIconComponent()

export {
	getSVG,
	getIconComponent,
	getAllIconComponents
}