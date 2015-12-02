///environment.js
//A basic background for everything, with some basic animation

function environment() {
	var obj = new THREE.Object3D();
	
	//Ground plane
	var planeGeo = new THREE.PlaneGeometry(2000, 2000, 48, 48);
	for (var i = 0; i < planeGeo.vertices.length; ++i) {
		var vert = planeGeo.vertices[i];
		vert.z += (0.0025 * (Math.random() - 0.5) * Math.pow(vert.length(), 1.5));
	}
	planeGeo.verticesNeedUpdate = true;
	planeGeo.computeFaceNormals();
	planeGeo.computeVertexNormals();
	var planeMat = new THREE.MeshPhongMaterial({color: "green"});
	planeMat.shading = THREE.FlatShading;
	var plane = new THREE.Mesh(planeGeo, planeMat);
	plane.rotation.set(-Math.PI/2, 0, 0);
	obj.add(plane);
	
	return obj;
}
