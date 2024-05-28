import Vue from "vue";
// var eye_icon = require("../zs-icon/resources/imgs/svg/house.svg");
// var refresh_icon = require("../zs-icon/resources/imgs/svg/house.svg");

function getSVG(name) {
	
	// return name_to_svg[name]
}

// var name_to_svg = {}
var name_to_icon_comp = null

function initSvgIconComponent(){
	
	if(name_to_icon_comp!=null)
	{
		return
	}
	name_to_icon_comp={}

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
			
		"eyeFillSmooth":'<svg width="36.000000pt" height="24.000000pt" viewBox="0 0 36.000000 24.000000" xmlns="http://www.w3.org/2000/svg">\
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
		"eyeSlashFillSmooth":'<svg width="36.000000pt" height="24.000000pt" viewBox="0 0 36.000000 24.000000" xmlns="http://www.w3.org/2000/svg">\
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
						,
		"eyeFill":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">\
				  <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>\
				  <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>\
				</svg>',
		"eyeSlash":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16">\
		  <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z"/>\
		  <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829"/>\
		  <path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z"/>\
		</svg>',
		"layersFillSmooth":'<svg width="36.000000pt" height="28.000000pt" viewBox="0 0 36.000000 28.000000" xmlns="http://www.w3.org/2000/svg">\
						<g transform="translate(0.000000,28.000000) scale(0.100000,-0.100000)" fill="currentColor" stroke="none">\
						<path d="M98 228 c-43 -23 -78 -45 -78 -48 0 -3 36 -25 80 -49 80 -42 80 -42\
						160 0 44 24 80 46 80 49 0 6 -152 90 -161 90 -2 0 -39 -19 -81 -42z" />\
						<path d="M42 117 c-12 -6 -22 -14 -22 -18 0 -5 36 -27 80 -49 80 -40 80 -40\
						160 0 44 22 80 44 80 49 0 4 -10 12 -22 18 -18 8 -34 4 -80 -21 -58 -31 -58\
						-31 -116 0 -46 25 -62 29 -80 21z" />\
						</g>\
						</svg>'
		,
		'layersFill':'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-layers-fill" viewBox="0 0 16 16">\
					  <path d="M7.765 1.559a.5.5 0 0 1 .47 0l7.5 4a.5.5 0 0 1 0 .882l-7.5 4a.5.5 0 0 1-.47 0l-7.5-4a.5.5 0 0 1 0-.882z"/>\
					  <path d="m2.125 8.567-1.86.992a.5.5 0 0 0 0 .882l7.5 4a.5.5 0 0 0 .47 0l7.5-4a.5.5 0 0 0 0-.882l-1.86-.992-5.17 2.756a1.5 1.5 0 0 1-1.41 0z"/>\
					</svg>',
		"crosshair2":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-crosshair2" viewBox="0 0 16 16">\
					  <path d="M8 0a.5.5 0 0 1 .5.5v.518A7 7 0 0 1 14.982 7.5h.518a.5.5 0 0 1 0 1h-.518A7 7 0 0 1 8.5 14.982v.518a.5.5 0 0 1-1 0v-.518A7 7 0 0 1 1.018 8.5H.5a.5.5 0 0 1 0-1h.518A7 7 0 0 1 7.5 1.018V.5A.5.5 0 0 1 8 0m-.5 2.02A6 6 0 0 0 2.02 7.5h1.005A5 5 0 0 1 7.5 3.025zm1 1.005A5 5 0 0 1 12.975 7.5h1.005A6 6 0 0 0 8.5 2.02zM12.975 8.5A5 5 0 0 1 8.5 12.975v1.005a6 6 0 0 0 5.48-5.48zM7.5 12.975A5 5 0 0 1 3.025 8.5H2.02a6 6 0 0 0 5.48 5.48zM10 8a2 2 0 1 0-4 0 2 2 0 0 0 4 0"/>\
					</svg>',
		
		
		// draw edit
		"pencilSquare":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">\
				  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>\
				  <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>\
				</svg>',
		"pencil":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">\
				  <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>\
				</svg>',
		"pencilFill":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">\
					  <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>\
					</svg>',
		
		
		"stopFill":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-stop-fill" viewBox="0 0 16 16">\
					  <path d="M5 3.5h6A1.5 1.5 0 0 1 12.5 5v6a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 11V5A1.5 1.5 0 0 1 5 3.5"/>\
					</svg>',
		"stopCircle":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-stop-circle" viewBox="0 0 16 16">\
					  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>\
					  <path d="M5 6.5A1.5 1.5 0 0 1 6.5 5h3A1.5 1.5 0 0 1 11 6.5v3A1.5 1.5 0 0 1 9.5 11h-3A1.5 1.5 0 0 1 5 9.5z"/>\
					</svg>',
		"stopBtn":'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-stop-btn" viewBox="0 0 16 16">\
				  <path d="M6.5 5A1.5 1.5 0 0 0 5 6.5v3A1.5 1.5 0 0 0 6.5 11h3A1.5 1.5 0 0 0 11 9.5v-3A1.5 1.5 0 0 0 9.5 5z"/>\
				  <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm15 0a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1z"/>\
				</svg>',
				
		"pointerFill":'<svg version="1.0" viewBox="0 0 24 24"  fill="currentColor" xmlns="http://www.w3.org/2000/svg">\
					<path d="M7,2l12,11.2l-5.8,0.5l3.3,7.3l-2.2,1l-3.2-7.4L7,18.5V2"/>\
					</svg>',
		"pointer":'<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 16 16" fill="currentColor">\
				<path d="M 5.65625 2.09375 C 5.550781 2.070313 5.4375 2.082031 5.34375 2.117188 C 5.160156 2.195313 5 2.402344 5 2.632813 L 5 13.421875 L 7.789063 11.613281 L 9.101563 14.171875 L 11.546875 12.921875 L 10.339844 10.578125 L 13.472656 9.765625 L 12.855469 9.148438 L 5.945313 2.242188 C 5.867188 2.160156 5.761719 2.113281 5.65625 2.09375 Z M 6 3.707031 L 11.527344 9.234375 L 8.878906 9.921875 L 10.199219 12.484375 L 9.539063 12.828125 L 8.171875 10.171875 L 6 11.578125 Z"></path>\
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
					
	// name_to_icon_comp["eye2"] = name_to_icon_comp["eye"] 
	
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