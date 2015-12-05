///main.js
//The main script, which initializes everything else

var renderer, scene, camera;

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
	
	//delete old objects
	
	//for(var i=0; i< leafObjs.length; i++){
		//scene.remove( leafObjs[i] );
	//}
	scene.remove(plantObj);
	
	plantObj = plantMesh1()
	scene.add(plantObj);
	/*var leafList = getLeaves();//list of points to put leaves on
	for(var i=0; i< leafList.length; i++){
		var leafObj = generate_leaf_object(leafList[i]);
		//do object merge here
		leafObjs.push(leafObj); //keep reference for now
		scene.add( leafObj );
	}*/
	leafList = [];
}


window.onload = function() {
	renderer = new THREE.WebGLRenderer({antialias: true});
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
	camera.position.set(-40, 10, 40);
	camera.lookAt(new THREE.Vector3(0, 10, 0));
	
	scene.add(environment());
	
	regenerate_tree();
	
	var light = new THREE.DirectionalLight("white");
	light.position.set(-15, 25, 10);
	scene.add(light);
	
	
	//GUI
	
	var gui = new dat.GUI({});
			
	var params = {
		seed: 5555,
		TRUNK: 30,           // Number of trunk segments
		BRANCH: 6,           // Number of branch segments
		MIN_AREA: 0.1,       // Minimum area required so spawn a branch

		HEIGHT: 0.7,         // Height of a segment
		SCALE: 1.0,          // Scale of the entire tree

		DECAY: 0.03,         // Rate at which the trunk shrinks
		B_DECAY: 0.2,        // Rate at which branches shrink

		SINE_DECAY: 0.1,     // Wavelike form decay
		SINE_FREQ: 5,        // Rate of sine decay

		WIGGLE: 0.005,       // Tendency of the trunk to curve
		B_WIGGLE: 0.05,      // Tendency of the branches to curve

		CHANCE: 0.05,        // Base chance to spawn a branch
		LEVEL_MOD: 0.1,      // Spawn chance penalty if you are a sub-branch (stacks infinitely)
		B_NUM: 3,            // Maximum sub-branch level to spawn branches

		HEIGHT_MOD: 0.9,         // Branches spawn more often here, where 1 is the top of the tree
		HEIGHT_WEIGHT: 0.1,      // Influnce of the height modifier
		HEIGHT_THRESHOLD: 0.5,   // Difference at which no branches will grow

		LEAF_FREQ: 0.04,         // Frequency of leaf generation
		LEAF_MOD: 0.5,           // Tendency of leaves to grow at a position, where 1 is the tip of a branch
		LEAF_WEIGHT: 0.1,        // Influence of the lead modifier
		
	};
			
	gui.add(params, 'seed',1,10000).onFinishChange(function(value){
		random = new Math.seedrandom(value);
		leafmaterial = new THREE.MeshPhongMaterial( { color: random()*0xffffff, specular: random()*0xffffff, shininess: 5, morphTargets: true, vertexColors: THREE.FaceColors, shading: THREE.FlatShading } );		
		regenerate_tree();
	});
	gui.add(params, 'TRUNK').onFinishChange(function(value){
		regenerate_tree();	
	})
	gui.add(params, 'BRANCH').onFinishChange(function(value){
		regenerate_tree();	
	});
	gui.add(params, 'MIN_AREA').onFinishChange(function(value){
		regenerate_tree();
	});
	gui.add(params, 'HEIGHT').onFinishChange(function(value){
		regenerate_tree();	
	});
	gui.add(params, 'SCALE').onFinishChange(function(value){
		regenerate_tree();	
	});
	gui.add(params, 'DECAY').onFinishChange(function(value){
		regenerate_tree();	
	});
	gui.add(params, 'B_DECAY').onFinishChange(function(value){
		regenerate_tree();	
	});
	gui.add(params, 'SINE_DECAY').onFinishChange(function(value){
		regenerate_tree();	
	});
	gui.add(params, 'SINE_FREQ').onFinishChange(function(value){
		regenerate_tree();	
	});
	gui.add(params, 'WIGGLE').onFinishChange(function(value){
		regenerate_tree();	
	});
	gui.add(params, 'B_WIGGLE').onFinishChange(function(value){
		regenerate_tree();	
	});
	gui.add(params, 'CHANCE').onFinishChange(function(value){
		regenerate_tree();	
	});
	gui.add(params, 'LEVEL_MOD').onFinishChange(function(value){
		regenerate_tree();	
	});
	gui.add(params, 'B_NUM').onFinishChange(function(value){
		regenerate_tree();	
	});
	gui.add(params, 'HEIGHT_MOD').onFinishChange(function(value){
		regenerate_tree();	
	});
	gui.add(params, 'HEIGHT_WEIGHT').onFinishChange(function(value){
		regenerate_tree();	
	});
	gui.add(params, 'HEIGHT_THRESHOLD').onFinishChange(function(value){
		regenerate_tree();	
	});
	gui.add(params, 'LEAF_FREQ').onFinishChange(function(value){
		regenerate_tree();	
	});
	gui.add(params, 'LEAF_MOD').onFinishChange(function(value){
		regenerate_tree();	
	});
	gui.add(params, 'LEAF_WEIGHT').onFinishChange(function(value){
		regenerate_tree();	
	});
	
	
	// Controls
				
	controls = new THREE.TrackballControls( camera , renderer.domElement );

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
