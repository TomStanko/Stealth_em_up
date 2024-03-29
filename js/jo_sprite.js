var unit_radius = 15;
function jo_sprite(pixiSprite){
    //utility variables, these do not affect the actual sprite, but are used for camera and such, see prepare_for_draw()
    this.x = 0;
    this.y = 0;
    this.rad = 0;//radians (rotation)
    this.target = {x: null, y:null};//the target that this sprite moves twords
    this.speed = 3;
    this.moving = true;
    this.alive = true;
    this.radius = 14;
    
    this.path = [];//path applies to AI following a path;
    
    this.sprite = pixiSprite;
    //center the image:
    this.sprite.anchor.x = 0.5;
    this.sprite.anchor.y = 0.5;
    
    
	stage.addChild(this.sprite);
    this.kill = function(){
        this.alive = false;
        //enable moving so they can be dragged
        this.moving = true;
        this.path = [];
        this.target = {x: null, y:null};
    }
    /*this.move = function(targx,targy){
        //this function uses similar triangles with sides a,b,c and A,B,C where c and C are the hypotenuse
        //the movement of this.x and this.y (a,b) are found with the formulas: A/C = a/c and B/C = b/c
        var a,b;
        var c = this.speed;
        var A = targx-this.x;
        var B = targy-this.y;
        var C = Math.sqrt(A*A+B*B);
        if(C<this.stop_distance){        
            return; // the object is close enough that it need not move
        }
        a = c*A/C;
        b = c*B/C;
        this.x += a;
        this.y += b;
        this.rad = Math.atan2(b,a);
    };*/
    this.stop_distance = 1.5; //Distance to stop from target.
    this.move_to_target = function(){
        //this function uses similar triangles with sides a,b,c and A,B,C where c and C are the hypotenuse
        //the movement of this.x and this.y (a,b) are found with the formulas: A/C = a/c and B/C = b/c
        if(this.target.x == null || this.target.y == null )return;//no target
        var a,b;
        var c = this.speed;
        var A = this.target.x-this.x;
        var B = this.target.y-this.y;
        var C = Math.sqrt(A*A+B*B);
        if(C<this.stop_distance){        
            return true; // the object is close enough that it need not move
        }
        a = c*A/C;
        b = c*B/C;
        if(this.moving){
            //only move the sprite if they are set to moving, for example when guards see hero they will stop in their tracks
            this.x += a;
            this.y += b;
        }
        var newRad = Math.atan2(b,a);
        var diff = newRad - this.rad;
        if(diff <= 0.1)this.rad = newRad;
        else if(diff > Math.PI)this.rad -= 0.1;
        else if(diff < -Math.PI)this.rad += 0.1;
        else if(diff < 0)this.rad -= 0.1;
        else if(diff > 0)this.rad += 0.1;
        if(this.rad < Math.PI)this.rad += Math.PI*2; //keep it between -PI and PI
        if(this.rad > Math.PI)this.rad -= Math.PI*2; //keep it between -PI and PI
        
    };
    this.prepare_for_draw = function(){
        var draw_coords = camera.relativePoint(this);
        this.sprite.position.x = draw_coords.x;
        this.sprite.position.y = draw_coords.y;
        this.sprite.rotation = this.rad;
    };
    this.getCircleInfoForUtilityLib = function(){
        return {'center': {x:this.x,y:this.y}, 'radius':unit_radius};
    };
    this.angleBetweenSprites = function(otherSprite){
        var deltax = otherSprite.x - this.x;
        var deltay = otherSprite.y - this.y;
        //return -Math.atan2(deltay,deltax)*180/3.14159 //in degrees
        return -Math.atan2(deltay,deltax); // in radians
    };
    this.angleBetweenSprites_relativeToThis = function(otherSprite){
        //this function uses the "this" sprite's current rotation as the origin axis for the angle
        var deltax = otherSprite.x - this.x;
        var deltay = otherSprite.y - this.y;
        //return -Math.atan2(deltay,deltax)*180/3.14159 //in degrees
        var result = this.sprite.rotation-Math.atan2(deltay,deltax); // in radians
        if(result > Math.PI)result -= Math.PI*2;
        if(result < -Math.PI)result += Math.PI*2;
        return result;
    };
    //This function will test collision between sprite and coord and 
    //move the sprite accordingly so that it is no longer colliding
    this.collide = function(coord){
        var opp = this.y - coord.y;
        var adj = this.x - coord.x;
        var C = Math.sqrt(opp*opp+adj*adj);
        if ( C >= this.radius)return;
        
        var L = this.radius;
        var Ang = Math.atan2(opp,adj);
        
        
        var x2 = coord.x + (Math.cos(Ang) * L)
        var y2 = coord.y + (Math.sin(Ang) * L)
        
        //set sprite to new coordinates
        this.x = x2;
        this.y = y2;
    };
    this.collide_with_wall_sides = function(wall){
        //check for top/bottom side collision
        //if between left and right side
        if(this.x < wall.v2.x && this.x > wall.v8.x){
            //if colliding with top or bottom wall
            if(this.y + this.radius > wall.v2.y && this.y - this.radius < wall.v4.y){
                //determine which way to push
                var how_far_in_v2 = this.y - wall.v2.y;
                var how_far_in_v4 = wall.v4.y - this.y;
                if(how_far_in_v2 < how_far_in_v4){
                    this.y = wall.v2.y-this.radius;
                }else{
                    this.y = wall.v4.y+this.radius;
                }
                
            }
        }
        
        //check for left/right side collision
        //if between top and bottom side
        if(this.y < wall.v4.y && this.y > wall.v2.y){
            //if colliding with left or right wall
            if(this.x + this.radius > wall.v8.x && this.x - this.radius < wall.v2.x){
                //determine which way to push
                var how_far_in_v8 = this.x - wall.v8.x;
                var how_far_in_v2 = wall.v2.x - this.x;
                if(how_far_in_v8 < how_far_in_v2){
                    this.x = wall.v8.x-this.radius;
                }else{
                    this.x = wall.v2.x+this.radius;
                }
                
            }
        }
    };

}
