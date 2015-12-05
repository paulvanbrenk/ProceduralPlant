///environment.js
//A basic background for everything, with some basic animation

function environment() {
	var obj = new THREE.Object3D();
	
	//Ground plane
	var planeGeo = new THREE.PlaneGeometry(2, 2, 64, 64);
	noise.seed(Math.random());
	for (var i = 0; i < planeGeo.vertices.length; ++i) {
		var vert = planeGeo.vertices[i];
		var length = vert.length();
		vert.z += (0.1 * (noise.perlin2(vert.x*10, vert.y*10) + length));
		vert.x *= Math.pow(Math.abs(vert.x), 0.9);
		vert.y *= Math.pow(Math.abs(vert.y), 0.9);
		vert.z *= Math.pow(length, 2);
		vert.multiplyScalar(10000);
	}
	planeGeo.verticesNeedUpdate = true;
	planeGeo.computeFaceNormals();
	planeGeo.computeVertexNormals();
	var planeMat = new THREE.MeshPhongMaterial({color: "#484"});
	planeMat.shading = THREE.FlatShading;
	var plane = new THREE.Mesh(planeGeo, planeMat);
	plane.rotation.set(-Math.PI/2, 0, 0);
	obj.add(plane);
	
	//Sky sphere
	var skyGeo = new THREE.IcosahedronGeometry(15000, 4)
	for (var i = 0; i < skyGeo.vertices.length; ++i) {
		skyGeo.vertices[i].multiplyScalar(-1);
	}
	var skyMat = new THREE.MeshPhongMaterial({
		shading: THREE.FlatShading,
		color: "blue", fog: false});
	skyMat.emissive = new THREE.Color("#447");
	skyMat.shininess = 0;
	var sky = new THREE.Mesh(skyGeo, skyMat);
	sky.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
	obj.add(sky);
	
	return obj;
}
