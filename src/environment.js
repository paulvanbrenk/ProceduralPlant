///environment.js
//A basic background for everything, with some basic animation

function environment() {
	var obj = new THREE.Object3D();
	
	//Ground plane
	var planeGeo = new THREE.PlaneGeometry(10000, 10000, 64, 64);
	noise.seed(Math.random());
	for (var i = 0; i < planeGeo.vertices.length; ++i) {
		var vert = planeGeo.vertices[i];
		var length = vert.length();
		var dscale = (15000 / Math.pow(length+1, 2));
		var hscale = (0.05 * Math.pow(length, 1.1));
		vert.z += (hscale * (noise.perlin2(vert.x*dscale, vert.y*dscale) + 0.3));
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
