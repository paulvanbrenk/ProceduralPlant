//---------------------------//
// Code to create a plant #1 //
//---------------------------//

// Variables --- o

var currentIndex = 0;
var debug = false;

var TRUNK =25;
var HEIGHT = 0.5;
var SCALE = 2.0;
var DECAY = 0.05;

var triangle = new THREE.Triangle(
  new THREE.Vector3(-1,0,-.5).multiplyScalar(SCALE),
  new THREE.Vector3(0,0,.75).multiplyScalar(SCALE),
  new THREE.Vector3(1,0,-.5).multiplyScalar(SCALE)
);

// Functions --- o

// Align a triangle with a vector (relative to its center). [incomplete] 
function tAlign(tri,vector) {

  var center = tri.midpoint();
  var normalized = vector.normalize();
  var newTri = new THREE.Triangle(tri.a.sub(center),tri.b.sub(center),tri.c.sub(center));
  
  // ... Align with vector ... //
  
  newTri = new THREE.Triangle(newTri.a.add(center),newTri.b.add(center),newTri.c.add(center));
  return newTri;
}

// Scale a triangle by a value (relative to its center).
function tScale(tri,value) {
  var center = tri.midpoint();
  var temp = tri.clone();
  var d1 = tri.a.sub((temp.a.sub(center)).multiplyScalar(value));
  var d2 = tri.b.sub((temp.b.sub(center)).multiplyScalar(value));
  var d3 = tri.c.sub((temp.c.sub(center)).multiplyScalar(value));
  return new THREE.Triangle(d1,d2,d3);
}

// Append a triangle to an existing vertex mesh
function addTriangle(geometry,offset,tri,indices) {

  var newTri;
  newTri = tScale(tri,DECAY);
  // newTri = tAlign(newTri,offset);
  newTri = new THREE.Triangle( tri.a.add(offset), tri.b.add(offset), tri.c.add(offset) );

  geometry.vertices.push (
    new THREE.Vector3( newTri.a.x, newTri.a.y, newTri.a.z ),
    new THREE.Vector3( newTri.b.x, newTri.b.y, newTri.b.z ),
    new THREE.Vector3( newTri.c.x, newTri.c.y, newTri.c.z )
  );
  
  geometry.faces.push(new THREE.Face3(currentIndex,currentIndex+1, currentIndex+2));
  
  geometry.faces.push(new THREE.Face3(indices.x,currentIndex,currentIndex+1));
  geometry.faces.push(new THREE.Face3(indices.x,currentIndex,currentIndex+2));
  geometry.faces.push(new THREE.Face3(indices.y,currentIndex+1,currentIndex));
  geometry.faces.push(new THREE.Face3(indices.y,currentIndex+1,currentIndex+2));
  geometry.faces.push(new THREE.Face3(indices.z,currentIndex+2,currentIndex));
  geometry.faces.push(new THREE.Face3(indices.z,currentIndex+2,currentIndex+1));
  
  geometry.faces.push(new THREE.Face3(currentIndex,indices.x,indices.y));
  geometry.faces.push(new THREE.Face3(currentIndex,indices.x,indices.z));
  geometry.faces.push(new THREE.Face3(currentIndex+1,indices.y,indices.x));
  geometry.faces.push(new THREE.Face3(currentIndex+1,indices.y,indices.z));
  geometry.faces.push(new THREE.Face3(currentIndex+2,indices.z,indices.x));
  geometry.faces.push(new THREE.Face3(currentIndex+2,indices.z,indices.y));
  
  currentIndex += 3;
  return newTri;
}

function branch(geometry,offset,tri,indices,repeat) {
  var T = tri.clone();
  for (var i = 0; i < repeat; i++) {
    T = addTriangle(geometry,new THREE.Vector3(0,HEIGHT*SCALE,0),tri,indices);
    
    // Branch out again!
    if (T.area() > 1) {
      var direction = T.plane().normalize().normal;
      var points = new THREE.Vector3(currentIndex-1,currentIndex-4,currentIndex-5);
      branch(geometry,direction,T,points,repeat/2)
    }
  
  }
}

// Main function
function plantMesh1(scene) {

  // Create base geometry and material
  var geometry = new THREE.Geometry();
  var material = new THREE.MeshBasicMaterial({wireframe: debug, color: "#553311"});

  // Create initial triangle
  var T = triangle.clone();
  geometry.vertices.push(
    new THREE.Vector3(T.a.x,T.a.y,T.a.z),
    new THREE.Vector3(T.b.x,T.b.y,T.b.z),
    new THREE.Vector3(T.c.x,T.c.y,T.c.z)
  );
  geometry.faces.push(new THREE.Face3(0,1,2));
  currentIndex += 3;
  
  // Trunk
  for (var i = 0; i < TRUNK; i++) {
    var direction = T.plane().normalize().normal;
    addTriangle(geometry,direction,T,new THREE.Vector3(currentIndex-3,currentIndex-2,currentIndex-1));
  }
  
  // Branches

  // Return final mesh
  currentIndex = 0;
  return new THREE.Mesh(geometry,material);
}