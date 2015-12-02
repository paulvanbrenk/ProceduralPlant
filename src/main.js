var renderer, scene, camera;

window.onload = function() {
	renderer = new THREE.WebGLRenderer();
	document.body.appendChild(renderer.domElement);
	renderer.setClearColor("navy", 1);
	
	scene = new THREE.Scene();
	
	camera = new THREE.PerspectiveCamera(
		35,  //Field of view
		4/3, //Aspect ratio
		0.1, //Near plane
		1000 //Far plane
	);
	camera.position.set(-15, 10, 10);
	camera.lookAt(scene.position);
	
	var geometry = new THREE.BoxGeometry(5, 5, 5);
	var material = new THREE.MeshLambertMaterial({color: "red"});
	var mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);
	
	var light = new THREE.PointLight("white");
	light.position.set(10, 0, 10);
	scene.add(light);
	
	window.onresize = redraw;
	window.onresize();
}

redraw = function() {
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = (window.innerWidth / window.innerHeight);
	camera.updateProjectionMatrix();
	
	renderer.render(scene, camera);
}
