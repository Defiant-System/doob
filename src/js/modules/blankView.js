
// degas.blankView

{
	init() {
		// fast and direct references
		this.els = {
			el: window.find("content .blank-view"),
		};
		// window.settings.clear();
		
		// get settings, if any
		let xList = $.xmlFromString(`<Recents/>`);
		let xSamples = window.bluePrint.selectSingleNode(`//Samples`);
		this.xRecent = window.settings.getItem("recents") || xList.documentElement;

		Promise.all(this.xRecent.selectNodes("./*").map(async xItem => {
				let filepath = xItem.getAttribute("filepath"),
					check = await defiant.shell(`fs -f '${filepath}'`);
				if (!check.result) {
					xItem.parentNode.removeChild(xItem)
				}
			}))
			.then(() => {
				// add recent files in to data-section
				xSamples.parentNode.append(this.xRecent);

				// render blank view
				window.render({
					template: "blank-view",
					match: `//Data`,
					target: this.els.el,
				});

				// temp
				setTimeout(() => this.els.el.find(".sample:nth(0)").trigger("click"), 200);
			});
	},
	dispatch(event) {
		let APP = degas,
			Self = APP.blankView,
			el;
		// console.log(event);
		switch (event.type) {
			case "open-filesystem":
				APP.dispatch({ type: "open-file" });
				break;
			case "from-clipboard":
				// TODO
				break;
			case "select-sample":
				el = $(event.target);
				if (!el.hasClass("sample")) return;

				let url = el.data("url"),
					parts = url.slice(url.lastIndexOf("/") + 1),
					[ name, kind ] = parts.split("."),
					file = new defiant.File({ name, kind });
				// fetch file
				fetch(url, { responseType: "text" })
					.then(f => f.blob())
					.then(blob => {
						file.blob = blob;
						APP.dispatch({ type: "prepare-file", isSample: true, file });
					});
				break;
			case "select-recent-file":
				break;
			case "add-recent-file":
				if (!event.file.path) return;
				let str = `<i name="${event.file.base}" filepath="${event.file.path}"/>`,
					xFile = $.nodeFromString(str),
					xExist = Self.xRecent.selectSingleNode(`//Recents/*[@filepath="${event.file.path}"]`);
				// remove entry if already exist
				if (xExist) xExist.parentNode.removeChild(xExist);
				// insert new entry at first position
				Self.xRecent.insertBefore(xFile, Self.xRecent.firstChild);
				break;
		}
	}
}