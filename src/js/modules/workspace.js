
// degas.workspace

{
	init() {
		// fast references
		this.els = {
			workspace: window.find(".workspace"),
			toolbar: {
				wireframe: window.find(`.toolbar-tool_[data-click="set-view-shade"][data-arg="wireframe"]`),
				flat: window.find(`.toolbar-tool_[data-click="set-view-shade"][data-arg="flat"]`),
				solid: window.find(`.toolbar-tool_[data-click="set-view-shade"][data-arg="solid"]`),
				material: window.find(`.toolbar-tool_[data-click="set-view-shade"][data-arg="material"]`),
			}
		};
	},
	dispatch(event) {
		let APP = degas,
			Self = APP.workspace,
			object,
			name,
			value,
			el;
		// console.log(event);
		switch (event.type) {
			case "create-editor-viewport":
				// create editor + viewport
				editor = new Editor();
				viewport = new Viewport(editor);

				/*
				let width = window.innerWidth,
					height = window.innerHeight;
				Self.postProcessing = {
					composer: new EffectComposer( renderer ),
					renderPass: new RenderPass( editor.scene, editor.camera ),
					outlinePass: new OutlinePass( new THREE.Vector2( width, height ), editor.scene, editor.camera ),
					effectFXAA: new ShaderPass( FXAAShader ),
					gammaPass: new ShaderPass( GammaCorrectionShader ),
				};
				Self.postProcessing.effectFXAA.uniforms[ 'resolution' ].value.set( 1 / width, 1 / height );
				Self.postProcessing.composer.addPass( Self.postProcessing.renderPass );
				Self.postProcessing.composer.addPass( Self.postProcessing.outlinePass );
				Self.postProcessing.composer.addPass( Self.postProcessing.effectFXAA );
				Self.postProcessing.composer.addPass( Self.postProcessing.gammaPass );
				// outline details
				Self.postProcessing.outlinePass.edgeStrength = 3.0;
				Self.postProcessing.outlinePass.edgeThickness = 1.0;
				// outline color
				Self.postProcessing.outlinePass.visibleEdgeColor.set( '#ff9900' );
				Self.postProcessing.outlinePass.hiddenEdgeColor.set( '#2255cc' );
				// set composer dimension
				Self.postProcessing.composer.setSize( width, height );
				*/

				// append panel
				Self.els.workspace.append(viewport.container.dom);
				Self.els.rendererCvs = Self.els.workspace.append(renderer.domElement),
				Self.dispatch({ type: "resize-workspace" });
				break;
			case "resize-workspace":
				if (editor === undefined) {
					Self.dispatch({ type: "create-editor-viewport" });
				}
				Self.els.rendererCvs.attr({
					width: Self.els.workspace.prop("offsetWidth"),
					height: Self.els.workspace.prop("offsetHeight"),
				});
				// resize viewport
				viewport.resize();
				break;
			case "deselect":
				editor.deselect();
				break;
			case "set-view-shade":
				el = Self.els.toolbar[event.arg];
				el.parent().find(".tool-active_").removeClass("tool-active_");
				el.addClass("tool-active_");

				switch (event.arg) {
					case "wireframe":
						editor.scene.children
							.filter(child => child.type === "Mesh")
							.map(child => {
								console.log( child );
								child.material.wireframe = true;
								child.material.flatShading = true;
								/*
								let clone = child.geometry.clone(),
									edges = new THREE.EdgesGeometry(clone),
									material = new THREE.LineBasicMaterial({ color: Settings.wireframe.default }),
									object = new THREE.LineSegments(edges, material);

								object.position.set(...child.position.toArray());
								object.rotation.set(...child.rotation.toArray());
								object.scale.set(...child.scale.toArray());

								editor.scene.add(object);
								// editor.scene.remove(child);
								if (editor.selected === child) {
									editor.select( object );
								}
								child.visible = false;
								// child.material.transparent = true;
								// child.material.opacity = 0.125;
								*/
							});
						break;
					case "flat":
						editor.scene.children
							.filter(child => child.type === "Mesh")
							.map(child => {
								child.material.wireframe = false;
								child.material.flatShading = true;
								child.material.needsUpdate = true;
							});
						break;
					case "solid":
						editor.scene.children
							.filter(child => child.type === "Mesh")
							.map(child => {
								child.material.wireframe = false;
								child.material.flatShading = false;
								child.material.needsUpdate = true;
							});
						break;
				}

				// render
				viewport.render();
				return true;
			case "set-editor-control-state":
				viewport.editorControlsSetState(event.arg.toUpperCase());
				return true;
			case "set-transform-control-mode":
				viewport.transformControlsSetMode(event.arg);
				return true;
			case "add-mesh":
				object = event.object || Self.getMesh(event.arg);
				// apply argument value
				if (event.position) object.position.set(...event.position);
				editor.addObject( object );
				editor.select( object );
				viewport.viewInfo.update();
				viewport.render();
				break;
			case "add-light":
				object = Self.getLight(event.arg);
				// apply argument value
				if (event.intensity) object.intensity = event.intensity;
				editor.addObject( object );
				editor.select( object );
				viewport.viewInfo.update();
				viewport.render();
				break;
			case "add-camera":
				console.log(event);
				break;
		}
	},
	getMesh(type) {
		let material = new THREE.MeshStandardMaterial(),
			sprite,
			path,
			edges,
			geometry,
			mesh;
		switch (type) {
			case "box":
				geometry = new THREE.BoxGeometry( 1, 1, 1, 1, 1, 1 );
				mesh = new THREE.Mesh( geometry, material );
				mesh.name = 'Box';
				break;
			case "circle":
				geometry = new THREE.CircleGeometry( 1, 8, 0, Math.PI * 2 );
				mesh = new THREE.Mesh( geometry, material );
				mesh.name = 'Circle';
				break;
			case "cylinder":
				geometry = new THREE.CylinderGeometry( 1, 1, 2, 12, 1, false, 0, Math.PI * 2 );
				mesh = new THREE.Mesh( geometry, material );
				mesh.name = 'Cylinder';
				break;
			case "dodecahedron":
				geometry = new THREE.DodecahedronGeometry( 1, 0 );
				mesh = new THREE.Mesh( geometry, material );
				mesh.name = 'Dodecahedron';
				break;
			case "icosahedron":
				geometry = new THREE.IcosahedronGeometry( 1, 0 );
				mesh = new THREE.Mesh( geometry, material );
				mesh.name = 'Icosahedron';
				break;
			case "lathe":
				geometry = new THREE.LatheGeometry();
				material = new THREE.MeshStandardMaterial({ side: THREE.DoubleSide });
				mesh = new THREE.Mesh( geometry, material );
				mesh.name = 'Lathe';
				break;
			case "octahedron":
				geometry = new THREE.OctahedronGeometry( 1, 0 );
				mesh = new THREE.Mesh( geometry, material );
				mesh.name = 'Octahedron';
				break;
			case "plane":
				geometry = new THREE.PlaneGeometry( 1, 1, 1, 1 );
				mesh = new THREE.Mesh( geometry, material );
				mesh.name = 'Plane';
				break;
			case "ring":
				geometry = new THREE.RingGeometry( 0.5, 1, 8, 1, 0, Math.PI * 2 );
				mesh = new THREE.Mesh( geometry, material );
				mesh.name = 'Ring';
				break;
			case "sphere":
				geometry = new THREE.SphereGeometry( 1, 32, 16, 0, Math.PI * 2, 0, Math.PI );
				mesh = new THREE.Mesh( geometry, material );
				mesh.name = 'Sphere';
				break;
			case "sprite":
				material = new THREE.SpriteMaterial();
				sprite = new THREE.Sprite( material );
				sprite.name = 'Sprite';
				break;
			case "tetrahedron":
				geometry = new THREE.TetrahedronGeometry( 1, 0 );
				mesh = new THREE.Mesh( geometry, material );
				mesh.name = 'Tetrahedron';
				break;
			case "torus":
				geometry = new THREE.TorusGeometry( 1, 0.4, 8, 24, Math.PI * 2 );
				mesh = new THREE.Mesh( geometry, material );
				mesh.name = 'Torus';
				break;
			case "torusknot":
				geometry = new THREE.TorusKnotGeometry( 1, 0.4, 64, 8, 2, 3 );
				mesh = new THREE.Mesh( geometry, material );
				mesh.name = 'TorusKnot';
				break;
			case "tube":
				path = new THREE.CatmullRomCurve3( [
					new THREE.Vector3( 2, 2, - 2 ),
					new THREE.Vector3( 2, - 2, - 0.6666666666666667 ),
					new THREE.Vector3( - 2, - 2, 0.6666666666666667 ),
					new THREE.Vector3( - 2, 2, 2 )
				] );
				geometry = new THREE.TubeGeometry( path, 64, 1, 8, false );
				mesh = new THREE.Mesh( geometry, material );
				mesh.name = 'Tube';
				break;
		}
		return mesh;
	},
	getLight(type) {
		let intensity = 1,
			distance = 0,
			color = 0xffffff,
			light;
		switch (type) {
			case "ambientlight":
				color = 0x222222;
				light = new THREE.AmbientLight( color );
				light.name = 'AmbientLight';
				break;
			case "directionallight":
				light = new THREE.DirectionalLight( color, intensity );
				light.name = 'DirectionalLight';
				light.target.name = 'DirectionalLight Target';
				light.position.set( 5, 10, 7.5 );
				break;
			case "hemispherelight":
				let skyColor = 0x00aaff;
				let groundColor = 0xffaa00;
				light = new THREE.HemisphereLight( skyColor, groundColor, intensity );
				light.name = 'HemisphereLight';
				light.position.set( 0, 10, 0 );
				break;
			case "pointlight":
				light = new THREE.PointLight( color, intensity, distance );
				light.name = 'PointLight';
				break;
			case "spotlight":
				let angle = Math.PI * 0.1;
				let penumbra = 0;
				light = new THREE.SpotLight( color, intensity, distance, angle, penumbra );
				light.name = 'SpotLight';
				light.target.name = 'SpotLight Target';
				light.position.set( 5, 10, 7.5 );
				break;
		}
		return light;
	}
}
