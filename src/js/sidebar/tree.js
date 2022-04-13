
// degas.sidebar.tree

{
	init() {
		// fast references
		this.els = {
			el: window.find(".sidebar .tree"),
		};
		// render blank view
		window.render({
			template: "tree",
			match: `//Tree`,
			target: this.els.el,
		});

		// temp
		// setTimeout(() => this.els.el.find(".row:nth(5)").trigger("click"), 100);
		// setTimeout(() => this.els.el.find(".row:nth(3) .icon-arrow").trigger("click"), 100);

		setTimeout(() => {
			let node = {
					id: 10,
					expanded: 0,
					icon: "mesh",
					name: "Banana",
					children: [
						{ id: 11, icon: "mesh", name: "Test 2" },
						{ id: 12, icon: "mesh", name: "Test 3" },
					]
				};
			this.dispatch({
				type: "add-tree-node",
				insert: "before",
				id: "3",
				node
			});
		}, 300);
	},
	dispatch(event) {
		let APP = degas,
			Self = APP.sidebar.tree,
			name,
			value,
			el;
		// console.log(event);
		switch(event.type) {
			case "handle-tree-event":
				el = $(event.target);
				if (el.data("type")) {
					return Self.dispatch({ ...event, type: el.data("type") });
				}
				el.parents(".tree").find(".selected").removeClass("selected");
				el.addClass("selected");
				// TODO: focus / select on object
				break;
			case "toggle-expand":
				el = $(event.target).parents(".row:first");
				if (el.hasClass("expanded")) {
					el.removeClass("expanded");
				} else {
					if (!el.find(".children").length) {
						// render blank view
						window.render({
							template: "tree-children",
							match: `//Tree//*[@id="${el.data("id")}"]`,
							append: el,
						});
					}
					// delay "animation" to next tick - wait for render finish
					requestAnimationFrame(() => el.addClass("expanded"));
				}
				break;
			case "toggle-visibility":
				el = $(event.target);
				if (el.hasClass("icon-eye-on")) el.prop({ className: "icon-eye-off" });
				else el.prop({ className: "icon-eye-on" });
				break;
			case "add-tree-node":
				let str = [],
					xParse = node => {
						let expand = node.expanded !== undefined ? `expanded="${node.expanded}"` : "";
						str.push(`<i id="${node.id}" icon="${node.icon}" name="${node.name}" ${expand}>`);
						if (node.children) node.children.map(n => xParse(n));
						str.push(`</i>`);
					};
				// parse node
				xParse(event.node);

				let xInsert = event.insert || "append",
					xAnchorId = event.id || window.bluePrint.selectSingleNode(`//Tree//i`).getAttribute("id"),
					xAnchor = window.bluePrint.selectSingleNode(`//Tree//i[@id="${xAnchorId}"]`),
					xNode = $.xmlFromString(`<data>${str.join("\n")}</data>`).selectSingleNode(`//data/i`);
				switch (xInsert) {
					case "before":
						xAnchor.parentNode.insertBefore(xNode, xAnchor);
						window.render({
							template: "tree-node",
							match: `//Tree//*[@id="${xNode.getAttribute("id")}"]`,
							before: Self.els.el.find(`.row[data-id="${xAnchor.getAttribute("id")}"]`),
						});
						break;
					case "after":
						xAnchor.parentNode.insertBefore(xNode, xAnchor.nextSibling);
						window.render({
							template: "tree-node",
							match: `//Tree//*[@id="${xNode.getAttribute("id")}"]`,
							after: Self.els.el.find(`.row[data-id="${xAnchor.getAttribute("id")}"]`),
						});
						break;
					case "prepend":
						xAnchor.insertBefore(xNode, xAnchor.firstChild);
						window.render({
							template: "tree-node",
							match: `//Tree//*[@id="${xNode.getAttribute("id")}"]`,
							prepend: Self.els.el.find(`.row[data-id="${xAnchor.getAttribute("id")}"] > .children > div`),
						});
						break;
					default: // append
						xAnchor.appendChild(xNode);
						window.render({
							template: "tree-node",
							match: `//Tree//*[@id="${xNode.getAttribute("id")}"]`,
							append: Self.els.el.find(`.row[data-id="${xAnchor.getAttribute("id")}"] > .children > div`),
						});
				}
				break;
			case "remove-tree-node":
				break;
		}
	}
}
