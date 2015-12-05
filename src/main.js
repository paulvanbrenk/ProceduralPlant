///main.js
//The main script, which initializes everything else

var renderer, scene, camera;
var params;

redraw = function() {
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = (window.innerWidth / window.innerHeight);
	camera.updateProjectionMatrix();
	
	renderer.render(scene, camera);
	
	controls.update();
}

var timeLast = performance.now();
var updates = [];

update = function(time) {
	var dt = (time - timeLast);
	timeLast = time;
	for (var i = 0; i < updates.length; ++i) {
		updates[i](dt);
	}
	redraw();
	window.requestAnimationFrame(update)
}

var plantObj;
var leafObjs = [];

function regenerate_tree(){
	random = new Math.seedrandom(params.seed);
	
	//delete old objects
	
	//for(var i=0; i< leafObjs.length; i++){
		//scene.remove( leafObjs[i] );
	//}
	scene.remove(plantObj);
  for (var i = 0; i < leafObjs.length; i++) {
    scene.remove(leafObjs[i]);
  }
  leafObjs = [];
	
	plantObj = plantMesh1(params);
	scene.add(plantObj);
	//list of points to put leaves on
	for(var i=0; i< leaves.length; i++){
		var leafObj = generate_leaf_object(leaves[i]);
		//do object merge here
		leafObjs.push(leafObj); //keep reference for now
		scene.add( leafObj );
	}
	leaves = [];
}


window.onload = function() {
	renderer = new THREE.WebGLRenderer({antialias: true, logarithmicDepthBuffer: true});
	document.body.appendChild(renderer.domElement);
	renderer.setClearColor("white", 1);
	
	scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2("#77E", 0.00008);
	
	camera = new THREE.PerspectiveCamera(
		35,  //Field of view
		4/3, //Aspect ratio
		0.1, //Near plane
		50000 //Far plane
	);
	camera.position.set(-75, 25, 75);
	
	scene.add(environment());
	
	
	
	var light = new THREE.DirectionalLight("white");
	light.position.set(-15, 20, 10);
	scene.add(light);
	
	var lightNight = new THREE.DirectionalLight("#EAF", 0.1);
	lightNight.position.set(15, -25, -10);
	scene.add(lightNight);
	
	
	//GUI
	
	var gui = new dat.GUI({});
			
	params = {
		seed: 5555,
		TRUNK: 50,           // Number of trunk segments  // 0 - 150
		BRANCH: 9,           // Number of branch segments // 0 - 30
		MIN_AREA: 0.1,       // Minimum area required so spawn a branch // 0 - 0.5

		HEIGHT: 0.7,         // Height of a segment // 0.1 - 5
		SCALE: 1.0,          // Scale of the entire tree // 0.1 - 50

		DECAY: 0.03,         // Rate at which the trunk shrinks // 0 - 1
		B_DECAY: 0.2,        // Rate at which branches shrink // 0 - 1

		SINE_DECAY: 0.1,     // Wavelike form decay // 0 - 1
		SINE_FREQ: 5,        // Rate of sine decay // 0 - 20

		WIGGLE: 0.005,       // Tendency of the trunk to curve // 0 - 0.02
		B_WIGGLE: 0.05,      // Tendency of the branches to curve // 0 - .3

		CHANCE: 0.05,        // Base chance to spawn a branch // 0 - 0.2
		LEVEL_MOD: 0.1,      // Spawn chance penalty if you are a sub-branch (stacks infinitely) // 0 - 0.3
		B_NUM: 3,            // Maximum sub-branch level to spawn branches // 0 - 5

		HEIGHT_MOD: 0.9,         // Branches spawn more often here, where 1 is the top of the tree // 0 - 1
		HEIGHT_WEIGHT: 0.1,      // Influnce of the height modifier // 0 - 0.3
		HEIGHT_THRESHOLD: 0.5,   // Difference at which no branches will grow // 0 - 1

		LEAF_FREQ: 0.08,         // Frequency of leaf generation // 0 - .3
		LEAF_MOD: 0.5,           // Tendency of leaves to grow at a position, where 1 is the tip of a branch // 0 - 1
		LEAF_WEIGHT: 0.1,        // Influence of the lead modifier // 0 - 0.3
    
		COLOR: "#553311",        // Tree color
    
    WIREFRAME: false         // Display wireframe
		
	};
			
	gui.add(params, 'seed',1,10000).onFinishChange(function(value){
		random = new Math.seedrandom(value);
		leafmaterial = new THREE.MeshPhongMaterial( { color: random()*0xffffff, specular: random()*0xffffff, shininess: 5, morphTargets: true, vertexColors: THREE.FaceColors, shading: THREE.FlatShading } );		
		regenerate_tree();
	});
	gui.add(params, 'TRUNK').min(0).max(150).onFinishChange(function(value){
		regenerate_tree();	
	})
	gui.add(params, 'BRANCH').min(0).max(30).onFinishChange(function(value){
		regenerate_tree();	
	});
	gui.add(params, 'MIN_AREA').min(0).max(.5).onFinishChange(function(value){
		regenerate_tree();
	});
	gui.add(params, 'HEIGHT').min(.1).max(5).onFinishChange(function(value){
		regenerate_tree();	
	});
	gui.add(params, 'SCALE').min(.1).max(50).onFinishChange(function(value){
		regenerate_tree();	
	});
	gui.add(params, 'DECAY').min(0).max(1).onFinishChange(function(value){
		regenerate_tree();	
	});
	gui.add(params, 'B_DECAY').min(0).max(1).onFinishChange(function(value){
		regenerate_tree();	
	});
	gui.add(params, 'SINE_DECAY').min(0).max(1).onFinishChange(function(value){
		regenerate_tree();	
	});
	gui.add(params, 'SINE_FREQ').min(0).max(20).onFinishChange(function(value){
		regenerate_tree();	
	});
	gui.add(params, 'WIGGLE').min(0).max(.02).onFinishChange(function(value){
		regenerate_tree();	
	});
	gui.add(params, 'B_WIGGLE').min(0).max(.3).onFinishChange(function(value){
		regenerate_tree();	
	});
	gui.add(params, 'CHANCE').min(0).max(.2).onFinishChange(function(value){
		regenerate_tree();	
	});
	gui.add(params, 'LEVEL_MOD').min(0).max(.3).onFinishChange(function(value){
		regenerate_tree();	
	});
	gui.add(params, 'B_NUM').min(0).max(5).onFinishChange(function(value){
		regenerate_tree();	
	});
	gui.add(params, 'HEIGHT_MOD').min(0).max(1).onFinishChange(function(value){
		regenerate_tree();	
	});
	gui.add(params, 'HEIGHT_WEIGHT').min(0).max(.3).onFinishChange(function(value){
		regenerate_tree();	
	});
	gui.add(params, 'HEIGHT_THRESHOLD').min(0).max(1).onFinishChange(function(value){
		regenerate_tree();	
	});
	gui.add(params, 'LEAF_FREQ').min(0).max(.3).onFinishChange(function(value){
		regenerate_tree();	
	});
	gui.add(params, 'LEAF_MOD').min(0).max(1).onFinishChange(function(value){
		regenerate_tree();	
	});
	gui.add(params, 'LEAF_WEIGHT').min(0).max(.3).onFinishChange(function(value){
		regenerate_tree();	
	});
  gui.add(params, 'COLOR').onFinishChange(function(value){
		regenerate_tree();	
	});
  gui.add(params, 'WIREFRAME').onFinishChange(function(value){
		regenerate_tree();	
	});
	
	regenerate_tree();
	
	
	// Controls
				
	controls = new THREE.TrackballControls( camera , renderer.domElement );
	controls.target.set(0, 20, 0);

	controls.rotateSpeed = 1.0;
	controls.zoomSpeed = 1.2;
	controls.panSpeed = 0.8;

	controls.noZoom = false;
	controls.noPan = false;

	controls.staticMoving = true;
	controls.dynamicDampingFactor = 0.15;
	
	window.onresize = redraw;
	window.onresize();
	
	window.requestAnimationFrame(update)
}
