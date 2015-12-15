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
        vert.z += (0.1 * (noise.perlin2(vert.x * 10, vert.y * 10) + length));
        vert.x *= Math.pow(Math.abs(length), 0.9);
        vert.y *= Math.pow(Math.abs(length), 0.9);
        vert.z *= Math.pow(length, 2);
        vert.multiplyScalar(10000);
    }
    planeGeo.verticesNeedUpdate = true;
    planeGeo.computeFaceNormals();
    planeGeo.computeVertexNormals();
    var planeMat = new THREE.MeshPhongMaterial({ color: "#484" });
    planeMat.shading = THREE.FlatShading;
    var plane = new THREE.Mesh(planeGeo, planeMat);
    plane.rotation.set(-Math.PI / 2, 0, 0);
    obj.add(plane);

    //Sky sphere
    var skyGeo = new THREE.IcosahedronGeometry(20000, 4)
    for (var i = 0; i < skyGeo.vertices.length; ++i) {
        skyGeo.vertices[i].multiplyScalar(-1);
    }
    var skyMat = new THREE.MeshPhongMaterial({
        shading: THREE.FlatShading,
        color: "#11E", fog: false
    });
    skyMat.emissive = new THREE.Color("#335");
    skyMat.shininess = 0;
    var sky = new THREE.Mesh(skyGeo, skyMat);
    sky.rotation.set(0, Math.random() * Math.PI, Math.random() * Math.PI);
    obj.add(sky);

    //Sky rotation
    updates.push(function (dt) {
        sky.rotation.y += (0.000005 * dt);
        sky.rotation.z += (0.000001 * dt);
    });

    //Clouds
    var angleMin = Math.PI / 5;
    var angleMax = Math.PI / 2;
    var cloudGeoVals = [];
    var cloudGeo = new THREE.RingGeometry(angleMin, angleMax, 128, 32);
    noise.seed(Math.random())
    for (var i = 0; i < cloudGeo.vertices.length; ++i) {
        var vert = cloudGeo.vertices[i];
        cloudGeoVals.push(vert.clone());
        var angle = vert.length()

        vert.normalize();
        vert.applyEuler(new THREE.Euler(0, 0, Math.PI / 2));
        var vertNew = new THREE.Vector3(0, 0, -1);
        vertNew.applyAxisAngle(vert, angle);
        vert.copy(vertNew);


    }
    var cloudMat = new THREE.MeshPhongMaterial({
        shading: THREE.FlatShading, color: "#AAF", fog: false
    });
    cloudMat.emissive = new THREE.Color("#AAA");
    var cloud = new THREE.Mesh(cloudGeo, cloudMat);
    cloud.scale.multiplyScalar(20000);
    cloud.rotation.x = Math.PI / 2;
    obj.add(cloud);

    //Cloud rotation
    var cloudTime = 0;
    updates.push(function (dt) {
        cloudTime += (0.000003 * dt);
        for (var i = 0; i < cloud.geometry.vertices.length; ++i) {
            var vert = cloud.geometry.vertices[i];
            var vertOld = cloudGeoVals[i];
            var angle = vertOld.length()

            var pos = ((2 * (angle - angleMin) / (angleMax - angleMin)) - 1);
            var offset = -Math.pow(pos, 6);
            offset += noise.perlin3(vertOld.x * 2, vertOld.y * 2, cloudTime);
            offset += (0.5 * (noise.perlin3(100 + vertOld.x * 7, 100 + vertOld.y * 7, cloudTime) - 0.5));

            vert.normalize();
            vert.multiplyScalar(1 - (offset * 0.2));
        }
        cloud.geometry.verticesNeedUpdate = true;
        cloud.geometry.computeFaceNormals();
        cloud.geometry.computeVertexNormals();
        cloud.rotation.z -= (0.000005 * dt);
    });

    return obj;
}
