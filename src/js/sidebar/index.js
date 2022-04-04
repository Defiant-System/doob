
// degas.sidebar

{
	init() {
		// fast references
		this.els = {
			content: window.find("content"),
			sidebar: window.find(".sidebar"),
		};
		// temp
		this.els.sidebar.find(".properties .tabs > div:nth(0)").trigger("click");
	},
	dispatch(event) {
		let APP = degas,
			Self = APP.sidebar,
			name,
			value,
			el;
		// console.log(event);
		switch (event.type) {
			case "toggle-sidebar":
				let animStop = false,
					resizeAnim = () => {
						if (animStop) return;
						requestAnimationFrame(resizeAnim);
						viewport.resize();
					};
				// start resize animation
				resizeAnim();
				// schedule stopper
				value = Self.els.content.hasClass("show-sidebar");
				name = value ? "!show-sidebar" : "show-sidebar";
				Self.els.content.cssSequence(name, "transitionend", el => {
					if (!el.hasClass("sidebar")) return;
					animStop = true;
				});
				return !value;
			case "select-sidebar-tab":
				el = $(event.target);
				if (el[0] === event.el[0]) return;
				el.parent().find(".active").removeClass("active");
				el.addClass("active");

				name = el.data("name");
				value = Self.els.sidebar.find(`.properties .tab-body div[data-section="${name}"]`);
				value.parent().find("> div[data-section].active").removeClass("active");
				value.addClass("active");
				break;
			default:
				if (event.el) {
					el = event.el;
					el = el.data("section") ? el : el.parents(`div[data-section]`);
					if (el.length) Self[el.data("section")].dispatch(event);
				}
		}
	},
	tree: @import "./tree.js",
	light: @import "./light.js",
	files: @import "./files.js",
	camera: @import "./camera.js",
	modifiers: @import "./modifiers.js",
	material: @import "./material.js",
	settings: @import "./settings.js",
	texture: @import "./texture.js",
	object: @import "./object.js",
}