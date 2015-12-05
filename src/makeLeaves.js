var random = new Math.seedrandom(12312321313);
var leafmaterial = new THREE.MeshPhongMaterial({color: random()*0xffffff,
                                                specular: random()*0xffffff,
												shininess: 5,
												morphTargets: true,
												vertexColors: THREE.FaceColors,
												shading: THREE.FlatShading});	
			

function generate_leaf_geometry(divisions,length,width,mode) {
	//generates a leaf object
	
	var geometry = new THREE.Geometry();
	
	switch (mode){
		case 1: //round leaf
		for ( var i = 0; i < divisions; i ++ ) {
			geometry.vertices.push(new THREE.Vector3( i * length/divisions,  0, 0));//i		
			geometry.vertices.push(new THREE.Vector3( i * length/divisions,  -.1, Math.sin(i * Math.PI*2/divisions) * width/length ));//i+1		
			if(i>0){
				geometry.faces.push( new THREE.Face3( i-1, i, i+1 ) );
				geometry.faces.push( new THREE.Face3( i+1, i, i-1 ) );
			}			
		}		
		var offset = geometry.vertices.length;	
		for ( var i = 0; i < divisions; i ++ ) {
			geometry.vertices.push(new THREE.Vector3( i * length/divisions,  0, 0));//i
			geometry.vertices.push(new THREE.Vector3( i * length/divisions,  -.1, -Math.sin(i * Math.PI*2/divisions) * width/length ));//i+1
			if(i>0){
				geometry.faces.push( new THREE.Face3( i+offset-1, i+offset, i+offset+1 ) );
				geometry.faces.push( new THREE.Face3( i+offset+1, i+offset, i+offset-1 ) );
			}			
		}
		break;
		case 2://spiky leaf
		
		var rvals = [];
		rvals.push(random());
		for ( var i = 1; i < divisions; i ++ ) {
			rvals.push((random()*2 + rvals[i-1]*5)/6);
		}
		
		for ( var i = 1; i < divisions; i ++ ) {

			geometry.vertices.push(new THREE.Vector3( i * length/divisions,  width/length* rvals[i]*rvals[0], 0));//i
			
			
			geometry.vertices.push(new THREE.Vector3( i * length/divisions,  Math.sin(i * Math.PI*2/divisions) * width/length* rvals[i], Math.sin(i * Math.PI*2/divisions) * width/length * rvals[i]));//i+1
			if(i>0){
				geometry.faces.push( new THREE.Face3( i-1, i, i+1 ) );
				geometry.faces.push( new THREE.Face3( i+1, i, i-1 ) );
			}			
		}
		
		var offset = geometry.vertices.length;
		
		for ( var i = 1; i < divisions; i ++ ) {

			geometry.vertices.push(new THREE.Vector3( i * length/divisions,  width/length* rvals[i]*rvals[0], 0));//i
			
			
			geometry.vertices.push(new THREE.Vector3( i * length/divisions,  Math.sin(i * Math.PI*2/divisions) * width/length* rvals[i], -Math.sin(i * Math.PI*2/divisions) * width/length * rvals[i]));//i+1
			if(i>0){
				geometry.faces.push( new THREE.Face3( i+offset-1, i+offset, i+offset+1 ) );
				geometry.faces.push( new THREE.Face3( i+offset+1, i+offset, i+offset-1 ) );
			}			
		}
		
		break;
		
		case 3:
		
		for ( var i = 0; i < divisions; i += 2 ) {
				
			/*geometry.vertices.push(new THREE.Vector3( i * length/divisions,  -.1, Math.sin(i * Math.PI*2/divisions) * width/length ));//i+1	
			geometry.vertices.push(new THREE.Vector3( i * length/divisions,  0, 0));//i	
			geometry.vertices.push(new THREE.Vector3( i * length/divisions,  -.1, -Math.sin(i * Math.PI*2/divisions) * width/length ));//i+1
			
			var x = i*3;
			if(x>0){
				geometry.faces.push( new THREE.Face3( i-1, i, i+1 ) );
				geometry.faces.push( new THREE.Face3( i+1, i, i-1 ) );
			}*/			
		}		
		
		break;
		
	}

	return geometry;
}


function generate_leaf_object(position){
	
	divisions = 20;
	length = 1;
	width = 1;
	mode = 1;
	
	var leafObj = new THREE.Mesh( generate_leaf_geometry(divisions,length,width,mode), leafmaterial);
	leafObj.position = position;
	return leafObj;
	
}