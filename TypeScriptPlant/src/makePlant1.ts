//---------------------------//
// Code to create a plant #1 //
//---------------------------//

// Variables --- o

var params: Parameters;

var currentIndex = 0;
var wiggleVec = new THREE.Vector3(0, 0, 0);
var segments :Segment[] = [];
var leaves :LeafObj[]= [];
var firstSegment = 0;
var treeHeight = 0;

var DECAY = 0.03;         // Rate at which the trunk shrinks
var WIGGLE = 0.005;       // Tendency of the trunk to curve

var triangle:THREE.Triangle;

// Functions --- o

class LeafObj{
    constructor(vertex: THREE.Vector3, rotation: THREE.Vector3) {
        this.position = vertex;
        this.rotation = rotation;
    }

    position: THREE.Vector3;
    rotation: THREE.Vector3;
}

// Stores an external (visible) triangle of the tree
class Segment {
    constructor(p0: THREE.Vector3, p1: THREE.Vector3, p2: THREE.Vector3, i0: number, i1: number, i2: number) {
        this.tri = new THREE.Triangle(p0, p1, p2);
        this.indices = new THREE.Vector3(i0, i1, i2);
        this.height = Math.max(p0.y, p1.y, p2.y);
        treeHeight = Math.max(treeHeight, this.height);
    }

    tri: THREE.Triangle;
    indices: THREE.Vector3;
    height: number;
}

// Determines whether or not a branch spawns a segment
function branchChance(segment : Segment, level:number) {

    var hDiff = 0;
    if (treeHeight != 0) {
        hDiff = segment.height / treeHeight;
    }
    hDiff = Math.abs(hDiff - params.HEIGHT_MOD);
    if (hDiff > params.HEIGHT_THRESHOLD) { return false; }
    return (random() < (params.CHANCE - level * params.LEVEL_MOD - (1 - hDiff) * -params.HEIGHT_WEIGHT) && segment.tri.area() > params.MIN_AREA);
}

// Align a triangle with a vector (relative to its center).
function tAlign(tri:THREE.Triangle, vector:THREE.Vector3) {

    var center = tri.midpoint();
    var temp = tri.clone();
    var normalized = vector.clone().normalize();
    var newTri = new THREE.Triangle(temp.a.sub(center), temp.b.sub(center), temp.c.sub(center));

    newTri.a.projectOnPlane(normalized);
    newTri.b.projectOnPlane(normalized);
    newTri.c.projectOnPlane(normalized);

    newTri = new THREE.Triangle(newTri.a.add(center), newTri.b.add(center), newTri.c.add(center));
    return newTri;
}

// Scale a triangle by a value (relative to its center).
function tScale(tri:THREE.Triangle, value:number) {
    var center = tri.midpoint();
    var temp1 = tri.clone();
    var temp2 = tri.clone();
    var d1 = temp2.a.sub((temp1.a.sub(center)).multiplyScalar(value));
    var d2 = temp2.b.sub((temp1.b.sub(center)).multiplyScalar(value));
    var d3 = temp2.c.sub((temp1.c.sub(center)).multiplyScalar(value));
    return new THREE.Triangle(d1, d2, d3);
}

// Cap a triangle into a pyramid
function capTriangle(geometry:THREE.Geometry, offset:THREE.Vector3, tri:THREE.Triangle, indices:THREE.Vector3) {
    var newTri = tri.clone();
    var newPoint = newTri.midpoint().add(offset);

    geometry.vertices.push(new THREE.Vector3(newPoint.x, newPoint.y, newPoint.z));

    geometry.faces.push(new THREE.Face3(indices.x, indices.y, currentIndex));
    geometry.faces.push(new THREE.Face3(indices.y, indices.z, currentIndex));
    geometry.faces.push(new THREE.Face3(indices.z, indices.x, currentIndex));

    currentIndex += 1;
    return newTri;
}

// Append a triangle to an existing vertex mesh
function addTriangle(geometry: THREE.Geometry, offset: THREE.Vector3, tri: THREE.Triangle, indices: THREE.Vector3) {

    var newTri = tri.clone();
    var scale = DECAY + Math.sin(segments.length * params.SINE_FREQ) * params.SINE_DECAY;
    newTri = tScale(newTri, scale);
    newTri = tAlign(newTri, offset);
    newTri = new THREE.Triangle(newTri.a.add(offset), newTri.b.add(offset), newTri.c.add(offset));

    geometry.vertices.push(
        new THREE.Vector3(newTri.a.x, newTri.a.y, newTri.a.z),
        new THREE.Vector3(newTri.b.x, newTri.b.y, newTri.b.z),
        new THREE.Vector3(newTri.c.x, newTri.c.y, newTri.c.z)
    );

    geometry.faces.push(new THREE.Face3(currentIndex, currentIndex + 1, currentIndex + 2));

    geometry.faces.push(new THREE.Face3(indices.x, currentIndex, currentIndex + 2));
    geometry.faces.push(new THREE.Face3(indices.y, currentIndex + 1, currentIndex));
    geometry.faces.push(new THREE.Face3(indices.z, currentIndex + 2, currentIndex + 1));

    geometry.faces.push(new THREE.Face3(indices.x, indices.y, currentIndex));
    geometry.faces.push(new THREE.Face3(indices.y, indices.z, currentIndex + 1));
    geometry.faces.push(new THREE.Face3(indices.z, indices.x, currentIndex + 2));

    segments.push(new Segment(tri.a, newTri.a, newTri.c, indices.x, currentIndex, currentIndex + 2));
    segments.push(new Segment(tri.b, newTri.b, newTri.a, indices.y, currentIndex + 1, currentIndex));
    segments.push(new Segment(tri.c, newTri.c, newTri.b, indices.z, currentIndex + 2, currentIndex + 1));
    segments.push(new Segment(tri.a, tri.b, newTri.a, indices.x, indices.y, currentIndex));
    segments.push(new Segment(tri.b, tri.c, newTri.b, indices.y, indices.z, currentIndex + 1));
    segments.push(new Segment(tri.c, tri.a, newTri.c, indices.z, indices.x, currentIndex + 2));

    currentIndex += 3;
    return newTri;
}

function branch(geometry:THREE.Geometry, tri:THREE.Triangle, indices:THREE.Vector3, repeat:number, level:number) {

    var temp = tri.clone();
    wiggleVec = new THREE.Vector3(0, 0, 0);
    for (var i = 0; i < repeat; i++) {
        wiggleVec.add(new THREE.Vector3(WIGGLE * ((random() * 2) - 1), WIGGLE * ((random() * 2) - 1), WIGGLE * ((random() * 2) - 1)));
        var direction = temp.plane().normalize().normal.multiplyScalar(params.HEIGHT);
        if (i == 0) {
            temp = addTriangle(geometry, direction.add(wiggleVec), temp, indices);
        }
        else {
            temp = addTriangle(geometry, direction.add(wiggleVec), temp, new THREE.Vector3(currentIndex - 3, currentIndex - 2, currentIndex - 1));
        }
    
        // Leaves
        var temp2 = temp.clone();
        var midpoint = temp.midpoint();
        if (random() < params.LEAF_FREQ) {
            leaves.push(new LeafObj(temp2.a, new THREE.Vector3().subVectors(temp2.a, midpoint).normalize()));
        }

        if (random() < params.LEAF_FREQ) {
            leaves.push(new LeafObj(temp2.b, new THREE.Vector3().subVectors(temp2.a, midpoint).normalize()));
        }

        if (random() < params.LEAF_FREQ) {
            leaves.push(new LeafObj(temp2.c, new THREE.Vector3().subVectors(temp2.a, midpoint).normalize()));
        }

    }
  
    // Branches spawn more branches
    if (level < params.B_NUM) {
        var start = firstSegment;
        var end = segments.length;
        firstSegment = segments.length;
        for (var i = start; i < end; i++) {
            if (branchChance(segments[i], level)) {
                branch(geometry, segments[i].tri, segments[i].indices, params.BRANCH * (1 - params.B_REDUCE), level + 1);
            }
        }
    }

}

// Main function
function plantMesh1(vars:Parameters) {

    console.log(vars);
  
    // Get input variables
    params = vars;
    DECAY = params.DECAY;
    WIGGLE = params.WIGGLE;

    triangle = new THREE.Triangle(
        new THREE.Vector3(-1, 0, -.5).multiplyScalar(params.SCALE),
        new THREE.Vector3(0, 0, .75).multiplyScalar(params.SCALE),
        new THREE.Vector3(1, 0, -.5).multiplyScalar(params.SCALE)
    );


    // Create base geometry
    var geometry = new THREE.Geometry();

    // Create initial triangle
    var T = triangle.clone();
    geometry.vertices.push(
        new THREE.Vector3(T.a.x, T.a.y, T.a.z),
        new THREE.Vector3(T.b.x, T.b.y, T.b.z),
        new THREE.Vector3(T.c.x, T.c.y, T.c.z)
    );
    geometry.faces.push(new THREE.Face3(0, 1, 2));
    currentIndex += 3;
  
    // Trunk
    for (var i = 0; i < params.TRUNK; i++) {
        wiggleVec.add(new THREE.Vector3(WIGGLE * ((random() * 2) - 1), WIGGLE * ((random() * 2) - 1), WIGGLE * ((random() * 2) - 1)));
        var direction = T.plane().normalize().normal.multiplyScalar(params.HEIGHT);
        T = addTriangle(geometry, direction.add(wiggleVec), T, new THREE.Vector3(currentIndex - 3, currentIndex - 2, currentIndex - 1));
    }

    wiggleVec.add(new THREE.Vector3(WIGGLE * ((random() * 2) - 1), WIGGLE * ((random() * 2) - 1), WIGGLE * ((random() * 2) - 1)));
    var direction = T.plane().normalize().normal.multiplyScalar(params.HEIGHT);
    T = capTriangle(geometry, direction, T, new THREE.Vector3(currentIndex - 3, currentIndex - 2, currentIndex - 1));
  
    // Branches
    DECAY = params.B_DECAY;
    WIGGLE = params.B_WIGGLE;
    if (params.B_NUM > 0) {
        firstSegment = segments.length;
        var end = segments.length;
        for (var i = 0; i < end; i++) {
            if (branchChance(segments[i], 0)) {
                branch(geometry, segments[i].tri, segments[i].indices, params.BRANCH, 0);
            }
        }
    }
    console.log(leaves.length);

    // Return final mesh
    currentIndex = 0;
    wiggleVec = new THREE.Vector3(0, 0, 0);
    segments = [];
    firstSegment = 0;
    treeHeight = 0;
    return geometry;
}