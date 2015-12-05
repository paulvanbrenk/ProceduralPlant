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
		vert.x *= Math.pow(Math.abs(length), 0.9);
		vert.y *= Math.pow(Math.abs(length), 0.9);
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
	var skyGeo = new THREE.IcosahedronGeometry(20000, 4)
	for (var i = 0; i < skyGeo.vertices.length; ++i) {
		skyGeo.vertices[i].multiplyScalar(-1);
	}
	var skyMat = new THREE.MeshPhongMaterial({
		shading: THREE.FlatShading,
		color: "blue", fog: false});
	skyMat.emissive = new THREE.Color("#447");
	skyMat.shininess = 0;
	var sky = new THREE.Mesh(skyGeo, skyMat);
	sky.rotation.set(0, Math.random()*Math.PI, Math.random()*Math.PI);
	obj.add(sky);
	
	//Sky rotation
	updates.push(function(dt) {
		sky.rotation.y += (0.000005 * dt);
		sky.rotation.z += (0.000001 * dt);
	});
	
	//Cloud
	var cloudObj = new THREE.Object3D();
	var cloudGeo = new THREE.PlaneGeometry(2, 2, 24, 24);
	noise.seed(Math.random())
	for (var i = 0; i < cloudGeo.vertices.length; ++i) {
		var vert = cloudGeo.vertices[i];
		var length = vert.length();
		vert.z += (noise.perlin2(vert.x*2, vert.y*2) * 2);
		vert.z -= (Math.pow(length, 2) * 2);
	}
	var cloudV = cloudGeo.vertices;
	for (var i = 0; i < cloudGeo.faces.length; ++i) {
		var face = cloudGeo.faces[i];
		if (Math.min(cloudV[face.a].z, cloudV[face.b].z, cloudV[face.c].z) < -1) {
			face.materialIndex = 1;
		}
	}
	cloudGeo.verticesNeedUpdate = true;
	cloudGeo.computeFaceNormals();
	cloudGeo.computeVertexNormals();
	var cloudMatVis = new THREE.MeshPhongMaterial({
		shading: THREE.FlatShading, color: "#AAF", fog: false});
	cloudMatVis.emissive = new THREE.Color("#AAA");
	var cloudMatHid = new THREE.MeshLambertMaterial();
	cloudMatHid.visible = false;
	var cloudMat = new THREE.MeshFaceMaterial([cloudMatVis, cloudMatHid]);
	var cloud = new THREE.Mesh(cloudGeo, cloudMat);
	cloud.scale.set(2000, 1000, 30);
	cloud.position.y = 3000;
	cloud.position.z = -16000;
	cloudObj.add(cloud);
	obj.add(cloudObj);
	
	//Cloud rotation
	updates.push(function(dt) {
		cloudObj.rotation.y += (0.000005 * dt);
	});
	
	return obj;
}
