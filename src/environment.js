///environment.js
//A basic background for everything, with some basic animation

function environment() {
	var obj = new THREE.Object3D();
	
	//Ground plane
	var planeGeo = new THREE.PlaneGeometry(1000, 1000, 32, 32);
	var planeMat = new THREE.MeshLambertMaterial({color: "green"});
	var plane = new THREE.Mesh(planeGeo, planeMat);
	plane.rotation.set(-Math.PI/2, 0, 0);
	obj.add(plane);
	
	return obj;
}
