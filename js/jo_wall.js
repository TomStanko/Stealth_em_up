//also referred to as "cell"
function jo_wall(image,solid,vertices){
    /*
    To be able to build walls dynamically they will be made of points
    Grid cells around the cell that the wall is in will only check against 
    the specific point which applies to that particular cell.
    8 1 2
    7 w 3
    6 5 4
    For example, cell 2 will only need to check against vertex 2
    
    */
    //yes, v8 is index 0 because I normally think of corner order in 8246 based on
    //the above illustration
    this.solid = solid;//if true, hero cannot walk through the wall
    
    this.v8 = vertices[0];
    this.v2 = vertices[1];
    this.v4 = vertices[2];
    this.v6 = vertices[3];
    if(this.v2.x < 0 || this.v2.y < 0) throw new Error("Walls cannot be placed in negative space!");
    if(this.v4.x < 0 || this.v4.y < 0) throw new Error("Walls cannot be placed in negative space!");
    if(this.v6.x < 0 || this.v6.y < 0) throw new Error("Walls cannot be placed in negative space!");
    if(this.v8.x < 0 || this.v8.y < 0) throw new Error("Walls cannot be placed in negative space!");
    
    //for drawing image
    this.image_sprite = new PIXI.Sprite(image);
    this.x = this.v8.x;
    this.y = this.v8.y;
    stage.addChild(this.image_sprite);
    
    
    this.graphics = new PIXI.Graphics();
    stage.addChild(this.graphics);
    this.draw = function(){
        //draw wall with debug lines
        var v2_ob = camera.relativePoint(this.v2);
        var v4_ob = camera.relativePoint(this.v4);
        var v6_ob = camera.relativePoint(this.v6);
        var v8_ob = camera.relativePoint(this.v8);
        
        
        this.graphics.clear();//without clear it wont erase the debug shape from previous frame.
        this.graphics.lineStyle(2, 0xFF0000, 1);
		this.graphics.moveTo(v2_ob.x, v2_ob.y);
		this.graphics.lineTo(v4_ob.x, v4_ob.y);
		this.graphics.lineTo(v6_ob.x, v6_ob.y);
		this.graphics.lineTo(v8_ob.x, v8_ob.y);
		this.graphics.lineTo(v2_ob.x, v2_ob.y);
    
    };
    this.prepare_for_draw = function(){
        var draw_coords = camera.relativePoint(this);
        this.image_sprite.position.x = draw_coords.x;
        this.image_sprite.position.y = draw_coords.y;
    };
    
}