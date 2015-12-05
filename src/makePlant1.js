//---------------------------//
// Code to create a plant #1 //
//---------------------------//

// Variables --- o

var currentIndex = 0;
var wiggleVec = new THREE.Vector3(0,0,0);
var segments = [];
var firstSegment = 0;
var treeHeight = 0;
var debug = false;

var TRUNK = 25;           // Number of trunk segments
var BRANCH = 5;           // Number of branch segments
var MIN_AREA = 0.1;       // Minimum area required so spawn a branch

var HEIGHT = 1.0;         // Height of a segment
var SCALE = 1.0;          // Scale of the entire tree

var DECAY = 0.02;         // Rate at which the trunk shrinks
var B_DECAY = 0.2;        // Rate at which branches shrink
var WIGGLE = 0.01;        // Tendency of the trunk to curve
var B_WIGGLE = 0.05;      // Tendency of the branches to curve

var CHANCE = 0.97;        // Base chance to spawn a branch
var LEVEL_MOD = 0.15;      // Spawn chance penalty if you are a sub-branch (stacks infinitely)
var B_NUM = 3;            // Maximum sub-branch level to spawn branches

var HEIGHT_MOD = 0.8;        // Branches spawn more often here, where 1 is the top of the tree
var HEIGHT_WEIGHT = 0.15;    // Influnce of the height modifier
var HEIGHT_THRESHOLD = 0.4;  // Difference at which no branches will grow

var triangle = new THREE.Triangle(
  new THREE.Vector3(-1,0,-.5).multiplyScalar(SCALE),
  new THREE.Vector3(0,0,.75).multiplyScalar(SCALE),
  new THREE.Vector3(1,0,-.5).multiplyScalar(SCALE)
);

// Functions --- o

// Stores an external (visible) triangle of the tree
function Segment(p0,p1,p2,i0,i1,i2) {
  this.tri = new THREE.Triangle(p0,p1,p2);
  this.indices = new THREE.Vector3(i0,i1,i2);
  this.height = Math.max(p0.y,p1.y,p2.y);
  treeHeight = Math.max(treeHeight,this.height);
}

// Determines whether or not a branch spawns a segment
function branchChance(segment,level) {

  var hDiff = 0;
  if (treeHeight != 0) {
    hDiff = segment.height/treeHeight;
  }
  hDiff = Math.abs(hDiff - HEIGHT_MOD);
  if (hDiff > HEIGHT_THRESHOLD) {return false;}
  return (Math.random() > ( CHANCE  +  level*LEVEL_MOD  +  (1-hDiff)*-HEIGHT_WEIGHT ) && segment.tri.area() > MIN_AREA);
}

// Align a triangle with a vector (relative to its center).
function tAlign(tri,vector) {

  var center = tri.midpoint();
  var temp = tri.clone();
  var normalized = vector.clone().normalize();
  var newTri = new THREE.Triangle(temp.a.sub(center),temp.b.sub(center),temp.c.sub(center));
  
  newTri.a.projectOnPlane(normalized);
  newTri.b.projectOnPlane(normalized);
  newTri.c.projectOnPlane(normalized);
  
  newTri = new THREE.Triangle(newTri.a.add(center),newTri.b.add(center),newTri.c.add(center));
  return newTri;
}

// Scale a triangle by a value (relative to its center).
function tScale(tri,value) {
  var center = tri.midpoint();
  var temp1 = tri.clone();
  var temp2 = tri.clone();
  var d1 = temp2.a.sub((temp1.a.sub(center)).multiplyScalar(value));
  var d2 = temp2.b.sub((temp1.b.sub(center)).multiplyScalar(value));
  var d3 = temp2.c.sub((temp1.c.sub(center)).multiplyScalar(value));
  return new THREE.Triangle(d1,d2,d3);
}

// Append a triangle to an existing vertex mesh
function addTriangle(geometry,offset,tri,indices) {

  var newTri = tri.clone();
  newTri = tScale(newTri,DECAY);
  newTri = tAlign(newTri,offset);
  newTri = new THREE.Triangle( newTri.a.add(offset), newTri.b.add(offset), newTri.c.add(offset) );

  geometry.vertices.push (
    new THREE.Vector3( newTri.a.x, newTri.a.y, newTri.a.z ),
    new THREE.Vector3( newTri.b.x, newTri.b.y, newTri.b.z ),
    new THREE.Vector3( newTri.c.x, newTri.c.y, newTri.c.z )
  );
  
  geometry.faces.push(new THREE.Face3(currentIndex,currentIndex+1, currentIndex+2));
  
  geometry.faces.push(new THREE.Face3(indices.x,currentIndex,currentIndex+2));
  geometry.faces.push(new THREE.Face3(indices.y,currentIndex+1,currentIndex));
  geometry.faces.push(new THREE.Face3(indices.z,currentIndex+2,currentIndex+1));
  
  geometry.faces.push(new THREE.Face3(indices.x,indices.y,currentIndex));
  geometry.faces.push(new THREE.Face3(indices.y,indices.z,currentIndex+1));
  geometry.faces.push(new THREE.Face3(indices.z,indices.x,currentIndex+2));
  
  segments.push(new Segment(tri.a,newTri.a,newTri.c,   indices.x,currentIndex,currentIndex+2));
  segments.push(new Segment(tri.b,newTri.b,newTri.a,   indices.y,currentIndex+1,currentIndex));
  segments.push(new Segment(tri.c,newTri.c,newTri.b,   indices.z,currentIndex+2,currentIndex+1));
  segments.push(new Segment(tri.a,tri.b,newTri.a,      indices.x,indices.y,currentIndex));
  segments.push(new Segment(tri.b,tri.c,newTri.b,      indices.y,indices.z,currentIndex+1));
  segments.push(new Segment(tri.c,tri.a,newTri.c,      indices.z,indices.x,currentIndex+2));
  
  currentIndex += 3;
  return newTri;
}

function branch(geometry,tri,indices,repeat,level) {
  
  var temp = tri.clone();
  wiggleVec = new THREE.Vector3(0,0,0);
  for (var i = 0; i < repeat; i++) {
    wiggleVec.add( new THREE.Vector3(WIGGLE*((Math.random()*2)-1), WIGGLE*((Math.random()*2)-1), WIGGLE*((Math.random()*2)-1)) );
    var direction = temp.plane().normalize().normal.multiplyScalar(HEIGHT);
    if (i == 0) {
      temp = addTriangle(geometry,direction.add(wiggleVec),temp,indices);
    }
    else {
      temp = addTriangle(geometry,direction.add(wiggleVec),temp,new THREE.Vector3(currentIndex-3,currentIndex-2,currentIndex-1));
    }    
  }
  
  // Branches spawn more branches
  if (level < B_NUM) {
    var start = firstSegment;
    var end = segments.length;
    firstSegment = segments.length;
    for (var i = start; i < end; i++) {
      if (branchChance(segments[i],level)) {
        branch(geometry,segments[i].tri,segments[i].indices,BRANCH,level+1);
      }
    }
  }
  
}

// Main function
function plantMesh1(scene) {

  // Create base geometry and material
  var geometry = new THREE.Geometry();
  var material = new THREE.MeshPhongMaterial({wireframe: debug, color: "#553311"});
  material.shading = THREE.FlatShading;

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
    wiggleVec.add( new THREE.Vector3(WIGGLE*((Math.random()*2)-1), WIGGLE*((Math.random()*2)-1), WIGGLE*((Math.random()*2)-1)) );
    var direction = T.plane().normalize().normal.multiplyScalar(HEIGHT);
    T = addTriangle(geometry,direction.add(wiggleVec),T,new THREE.Vector3(currentIndex-3,currentIndex-2,currentIndex-1));
  }
  
  // Branches
  DECAY = B_DECAY;
  WIGGLE = B_WIGGLE;
  if (B_NUM > 0) {
    firstSegment = segments.length;
    var end = segments.length;
    for (var i = 0; i < end; i++) {
      if (branchChance(segments[i],0)) {
        branch(geometry,segments[i].tri,segments[i].indices,BRANCH,0);
      }
    }
  }
  console.log(segments.length);

  // Return final mesh
  currentIndex = 0;
  return new THREE.Mesh(geometry,material);
}