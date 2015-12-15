declare enum LeafMode {
    round = 1,
    spiky = 2,
    three = 3,
    four = 4,
}

function generate_leaf_geometry(divisions: number, length: number, width: number, mode: LeafMode): THREE.Geometry {
    var geometry = new THREE.Geometry();
    switch (mode) {
        case 1: //round leaf
            for (var i = 0; i < divisions; i++) {
                geometry.vertices.push(new THREE.Vector3(i * length / divisions, 0, 0));//i
                geometry.vertices.push(new THREE.Vector3(i * length / divisions, -.1, Math.sin(i * Math.PI * 2 / divisions) * width / length));//i+1
                if (i > 0) {
                    geometry.faces.push(new THREE.Face3(i - 1, i, i + 1));
                    geometry.faces.push(new THREE.Face3(i + 1, i, i - 1));
                }
            }
            var offset = geometry.vertices.length;
            for (var i = 0; i < divisions; i++) {
                geometry.vertices.push(new THREE.Vector3(i * length / divisions, 0, 0));//i
                geometry.vertices.push(new THREE.Vector3(i * length / divisions, -.1, -Math.sin(i * Math.PI * 2 / divisions) * width / length));//i+1
                if (i > 0) {
                    geometry.faces.push(new THREE.Face3(i + offset - 1, i + offset, i + offset + 1));
                    geometry.faces.push(new THREE.Face3(i + offset + 1, i + offset, i + offset - 1));
                }
            }
            break;

        case 2://spiky leaf
            var rvals : number[] = [];
            rvals.push(random());
            for (var i = 1; i < divisions; i++) {
                rvals.push((random() * 2 + rvals[i - 1] * 5) / 6);
            }
            for (var i = 1; i < divisions; i++) {
                geometry.vertices.push(new THREE.Vector3(i * length / divisions, width / length * rvals[i] * rvals[0], 0));//i
                geometry.vertices.push(new THREE.Vector3(i * length / divisions, Math.sin(i * Math.PI * 2 / divisions) * width / length * rvals[i], Math.sin(i * Math.PI * 2 / divisions) * width / length * rvals[i]));//i+1
                if (i > 0) {
                    geometry.faces.push(new THREE.Face3(i - 1, i, i + 1));
                    geometry.faces.push(new THREE.Face3(i + 1, i, i - 1));
                }
            }
            var offset = geometry.vertices.length;
            for (var i = 1; i < divisions; i++) {
                geometry.vertices.push(new THREE.Vector3(i * length / divisions, width / length * rvals[i] * rvals[0], 0));//i
                geometry.vertices.push(new THREE.Vector3(i * length / divisions, Math.sin(i * Math.PI * 2 / divisions) * width / length * rvals[i], -Math.sin(i * Math.PI * 2 / divisions) * width / length * rvals[i]));//i+1
                if (i > 0) {
                    geometry.faces.push(new THREE.Face3(i + offset - 1, i + offset, i + offset + 1));
                    geometry.faces.push(new THREE.Face3(i + offset + 1, i + offset, i + offset - 1));
                }
            }

            break;
        case 3:
            var subdiv = Math.floor(random() * divisions / 10) + 3;
            for (var i = 0; i < divisions; i++) {
                var tmp = (i % subdiv == 0) ? Math.sin(i * Math.PI * 2 / divisions) * width / length : (Math.sin(i * Math.PI * 2 / divisions) * width / length + i * length / divisions) / 2;
                geometry.vertices.push(new THREE.Vector3(i * length / divisions, 0, 0));//i
                geometry.vertices.push(new THREE.Vector3(i * length / divisions, -.1, tmp));//i+1
                if (i > 0) {
                    geometry.faces.push(new THREE.Face3(i - 1, i, i + 1));
                    geometry.faces.push(new THREE.Face3(i + 1, i, i - 1));
                }
            }
            var offset = geometry.vertices.length;
            for (var i = 0; i < divisions; i++) {
                var tmp = (i % subdiv == 0) ? Math.sin(i * Math.PI * 2 / divisions) * width / length : (Math.sin(i * Math.PI * 2 / divisions) * width / length + i * length / divisions) / 2;
                geometry.vertices.push(new THREE.Vector3(i * length / divisions, 0, 0));//i
                geometry.vertices.push(new THREE.Vector3(i * length / divisions, -.1, -tmp));//i+1
                if (i > 0) {
                    geometry.faces.push(new THREE.Face3(i + offset - 1, i + offset, i + offset + 1));
                    geometry.faces.push(new THREE.Face3(i + offset + 1, i + offset, i + offset - 1));
                }
            }
            break;

        case 4:
            for (var i = 0; i < divisions; i++) {
                var angle = random() * Math.PI * 2;
                var x1 = Math.cos(angle) * width * random();
                var y1 = Math.sin(angle) * length * random();

                var x2 = Math.cos(angle + Math.PI * .9) * width * random();
                var y2 = Math.sin(angle + Math.PI * .9) * length * random();

                var x3 = Math.cos(angle + Math.PI * 1.1) * width * random();
                var y3 = Math.sin(angle + Math.PI * 1.1) * length * random();

                geometry.vertices.push(new THREE.Vector3(x1, y2, y1));
                geometry.vertices.push(new THREE.Vector3(x2, y3, y2));
                geometry.vertices.push(new THREE.Vector3(x3, y1, y3));

                geometry.faces.push(new THREE.Face3(i * 1 + 1, i * 2, i * 3 + 2));
                geometry.faces.push(new THREE.Face3(i * 2, i * 1 + 1, i * 3 + 2));
            }
            break;
    }
    return geometry;
}


function generate_leaf_object(obj:LeafObj, divisions:number, length:number, width:number, mode:LeafMode) : THREE.Mesh {

    // Rotation
    var mat = new THREE.Matrix4();
    mat.lookAt(obj.position, new THREE.Vector3().addVectors(obj.position, obj.rotation), new THREE.Vector3(0, 1, 0));

    var leafObj = new THREE.Mesh(generate_leaf_geometry(divisions, length, width, mode), leafmaterial);
    leafObj.position.set(obj.position.x, obj.position.y, obj.position.z);// = position;
    leafObj.setRotationFromMatrix(mat);// = rotation;
    return leafObj;

}