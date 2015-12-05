///main.js
//The main script, which initializes everything else

var renderer, scene, camera;

redraw = function() {
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = (window.innerWidth / window.innerHeight);
	camera.updateProjectionMatrix();
	
	renderer.render(scene, camera);
}

var timeLast = performance.now();
var updates = [];

update = function(time) {
	var dt = (time - timeLast);
	timeLast = time;
	for (var i = 0; i < updates.length; ++i) {
		updates[i](dt);
	}
	redraw();
	window.requestAnimationFrame(update)
}


window.onload = function() {
	renderer = new THREE.WebGLRenderer({antialias: true});
	document.body.appendChild(renderer.domElement);
	renderer.setClearColor("white", 1);
	
	scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2("#77E", 0.00008);
	
	camera = new THREE.PerspectiveCamera(
		35,  //Field of view
		4/3, //Aspect ratio
		0.1, //Near plane
		20000 //Far plane
	);
	camera.position.set(-40, 10, 40);
	camera.lookAt(new THREE.Vector3(0, 10, 0));
	
	scene.add(environment());
	
	scene.add(plantMesh1());
	var leafList = getLeaves();
	
	for(var i=0; i< leafList.length; i++){
		var leafObj = generate_leaf_object(leafList[i]);
		//do merge here
	}
	leafList = [];
	
	var light = new THREE.DirectionalLight("white");
	light.position.set(-15, 25, 10);
	scene.add(light);
	
	
	// Controls
				
	controls = new THREE.TrackballControls( camera , renderer.domElement );

	controls.rotateSpeed = 1.0;
	controls.zoomSpeed = 1.2;
	controls.panSpeed = 0.8;

	controls.noZoom = false;
	controls.noPan = false;

	controls.staticMoving = true;
	controls.dynamicDampingFactor = 0.15;
	
	window.onresize = redraw;
	window.onresize();
	
	window.requestAnimationFrame(update)
}
