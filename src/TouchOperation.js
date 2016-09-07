/**
 * Created by aillieo on 16/9/6.
 */

var TouchOperation ={
  
  _startingPoint:null,
  _direction:0,
  
  
  TouchOperation:function(startingPoint, direction ){
    
    this._startingPoint = startingPoint;
    this._direction= direction;
    
  },

  getStartingPoint:function(){
    return this._startingPoint;
  },
  getDirection:function(){
    return this._direction;

  }
  
  
  
  
};
