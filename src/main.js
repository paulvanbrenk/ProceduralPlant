///main.js
//The main script, which initializes everything else

var renderer, scene, camera;

window.onload = function() {
	renderer = new THREE.WebGLRenderer();
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
	
	var geometry = new THREE.BoxGeometry(5, 5, 5);
	var material = new THREE.MeshLambertMaterial({color: "red"});
	var mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(0, 2.5, 0);
	//scene.add(mesh);
  scene.add(plantMesh1());
	
	var light = new THREE.DirectionalLight("white");
	light.position.set(-15, 25, 10);
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
