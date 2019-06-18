/**
 *   The cup you want to show 
 *
 */
jarEl.src ='https://cdn.discordapp.com/attachments/373534361481641987/560571258396213300/tallgainscup.png';


/**
 * The invisible walls. Transparent background
 *
 */
this.cupBarrierImg =  'https://i.imgur.com/LCqxAzc.png';

 
this.config.jar.type = "custom";


 
//For easier debugging
window.scriptDaddy = this;
window.scriptDaddy.jarEl = jarEl;
 

//Removes vertexes that are too close. 
//This makes the walls slightly less accurate 
// but results in MUCH better performance.
window.scriptDaddy.pruningThreshold = 5;
 
 
//Just in case something realy crazy gets thrown in.
// raise this if you have a lot of odd shapes that need
// to be accurate. Hint: You dont.  
window.scriptDaddy.MAX_SCANNING_ATTEMPTS = 360000;
 
 




 

scriptDaddy.createBarrier = function(imgUrl){
  window.canvas = null;
  window.ctx = null;
  window.threshold = 1;
  var blobimg = new Image();
  $(blobimg).css('opacity', 0);
  $(document.body).append(blobimg);
  $(blobimg).css('transform', $("#sl__tip__jar > #widget ").css('transform'));
  blobimg.onload = function (){
    window.canvas = document.createElement('canvas');
    window.canvas.width = scriptDaddy.renderer.width;
    window.canvas.height	= scriptDaddy.renderer.height;
    window.ctx = window.canvas.getContext('2d');


    window.ctx.drawImage(blobimg, (scriptDaddy.renderer.width - $(blobimg).width())/2, $(blobimg).position().top,$(blobimg).width(),$(blobimg).height());
    $(document.body).append(window.canvas);
    window.theThickness = 1;
    window.imgMap = [];
    for(var i = 0; i < blobimg.width; i++){
      imgMap[i] =[];
    }

    window.groupings = [];
    window.yGroupings = [];

    window.isEdge = function (x,y, isVertical){

      if(imgMap[x][y] == 1){
        //registered border detected
        return false;
      }

      if(isVertical){
        if(imgMap[x][y+threshold] == 1 || imgMap[x][y-threshold]==1 ){
          //adjacent to border. Risk of stepping out.
          return false;
        }
        y--;
        height = threshold*2+1;
        width = 1;
      }else{
        if(imgMap[x+threshold][y] == 1 || imgMap[x-threshold][y]==1 ){
          //adjacent to border. Risk of stepping out.
          return false;
        }
        x--;
        height=1;
        width=threshold*2+1;
      }
      var iData = window.ctx.getImageData(x, y, width, height);
      var hasTransparency = false;
      var hasNoTransparency = false;
      for(var i = 3; i < iData.data.length; i+=4){
        if(iData.data[i] == 0){
          hasTransparency = true;
        }else{
          hasNoTransparency = true;
        }
      }
      return hasTransparency && hasNoTransparency;
    }

    window.addVertexToImgMap = function (vertex){
      var x = vertex[0];
      var y = vertex[1];


      imgMap[x][y] = 1;

    }

    window.groupingFound = function(vertex){
      var group = []; 
      var x = vertex[0];
      var y = vertex[1];
      var borderVertex;
      var emergencyExit = scriptDaddy.MAX_SCANNING_ATTEMPTS;
      do{
        emergencyExit--;
        if(emergencyExit<0){
          console.warn("emergency exit reached!");
          break;
        }
        borderVertex=null;

        if(isEdge(x, y+threshold, false)){

          borderVertex = [x, y+threshold];		

        }else if(isEdge(x-threshold, y, true)){

          borderVertex = [x-threshold, y];

        }else if(isEdge(x, y-threshold, false)){

          borderVertex = [x, y-threshold];

        }else if(isEdge(x+threshold, y, true)){

          borderVertex = [x+threshold, y]; 
        } 

        if(borderVertex != null){
          addVertexToImgMap(borderVertex);
          group.push(borderVertex);
          x = borderVertex[0];
          y = borderVertex[1];

        }else if(group.length > 2){
          console.log('grouping completed with ' + group.length + ' elements');
          groupings.push(group);
        }

      }while(borderVertex != null);
      return group;
    }





    window.findGroupings = function(){	
      var spacing = 30;
      for(var y = 0; y < window.canvas.height; y+=spacing){

        var imgData = ctx.getImageData(0, y, window.canvas.width, 1);
        for(var i = 0 ; i < imgData.data.length; i+=4){
          imgData.data[i+3] =0; 
        }
        ctx.putImageData(imgData,0,y);

      }

      for(var x = 0; x < window.canvas.width; x+=spacing){

        var imgData = ctx.getImageData(x, 0, 1, window.canvas.width);
        for(var i = 0 ; i < imgData.data.length; i+=4){
          imgData.data[i+3] =0; 
        }
        ctx.putImageData(imgData,x,0);

      }


      for(var y = 0; y < window.canvas.height; y+=threshold){
        var isInsideGroup = false;

        for(var x = 0; x < window.canvas.width; x+=threshold){


          var iData = window.ctx.getImageData(x , y ,  1,  1);


          if(iData.data[3] != 0 && !isInsideGroup ){
            if(imgMap[x][y] != 1){
              //console.log('new grouping found. '+x+', '+y);
              groupingFound([x, y]);
              isInsideGroup = true;

            } 


          }else if(isInsideGroup){
            isInsideGroup = false; 
          }



        }
      }
    }




 
    window.pruneVertices = function (vertices){
      var prunedVertices = [];
      prunedVertices.push(vertices[0]);
      prunedVertices.push(vertices[1]);
      for(var i = 2; i <vertices.length; i++){
        var vertex = vertices[i];
        var p1 = prunedVertices[prunedVertices.length-1];
        var p2 = prunedVertices[prunedVertices.length-2];
        if(p1[1] == p2[1]){
          //vertical
          if(Math.abs(vertex[1] - p2[1])> scriptDaddy.pruningThreshold){
            prunedVertices.push(vertex);
          }

        }else{
          var slope = p2[0]-p1[0]/p2[1]-p1[1];

          var b = p2[1] - slope*p2[0];

          var expectedY = slope*vertex[0]+b;
          if(Math.abs(expectedY - vertex[1]) > scriptDaddy.pruningThreshold){
            prunedVertices.push(vertex);
          }
        }




      }
      return prunedVertices;
    }

    window.formBody = function(){

      findGroupings();

      for(var i = 0; i < groupings.length; i++){

        var groupingPreHull =  pruneVertices(groupings[i]);	

        //var grouping = groupingPreHull;

        var convexHull = new ConvexHullGrahamScan();
        for(var j = 0; j<groupingPreHull.length; j++){
          convexHull.addPoint(groupingPreHull[j][0], groupingPreHull[j][1]);

        }

        var hullPoints = convexHull.getHull();
        var grouping = [];
        for(var j = 0; j<hullPoints.length; j++){
          grouping.push([hullPoints[j].x, hullPoints[j].y]);

        }


        var position = [0,0]; 


        grouping.sort((a,b) => a[1] - b[1]);

        var cy = (grouping[0][1] + grouping[grouping.length-1][1])/2;

        grouping.sort((a,b) => a[0] - b[0]);

        var cx = (grouping[0][0] + grouping[grouping.length-1][0])/2;
        var center = {x:cx, y:cy};


        var startAng;
        grouping.forEach(point => {
          var ang = Math.atan2(point[1] - center.y,point[0] - center.x);
          if(!startAng){ startAng = ang }
          else {
            if(ang < startAng){  // ensure that all points are clockwise of the start point
              ang += Math.PI * 2;
            }
          }
          point[2] = ang; // add the angle to the point
        });


        // Sort clockwise;
        grouping.sort((a,b)=> a[2] - b[2]);

        var ccPoints = grouping.reverse();
        ccPoints.unshift(ccPoints.pop());
        grouping = ccPoints;

        for(var j = 0; j<grouping.length; j++){
          grouping[j][1] = scriptDaddy.renderer.height - grouping[j][1];
        }

        try{
          var myShape = new p2.Convex({vertices:grouping});
          myShape.material = scriptDaddy.materials.wall;
          var myBody = new p2.Body({mass:0, position:position});
          myBody.addShape(myShape);
          //myBody.fromPolygon(grouping);
          scriptDaddy.world.addBody(myBody);
        }catch (err){
          console.error(err);
        }

      }

    }


    formBody();
    document.body.removeChild(window.canvas)
  }


  var blobsrc = imgUrl; 


  blobimg.src = blobsrc + '?' + new Date().getTime();
  blobimg.setAttribute('crossOrigin','');

}

scriptDaddy.createBarrier(this.cupBarrierImg);





/**
 * Graham's Scan Convex Hull Algorithm
 * @desc An implementation of the Graham's Scan Convex Hull algorithm in JavaScript.
 * @author Brian Barnett, brian@3kb.co.uk, http://brianbar.net/ || http://3kb.co.uk/
 * @version 1.0.5
 * https://github.com/brian3kb/graham_scan_js 
 */
function ConvexHullGrahamScan() {
  this.anchorPoint = undefined;
  this.reverse = false;
  this.points = [];
}

ConvexHullGrahamScan.prototype = {

  constructor: ConvexHullGrahamScan,

  Point: function (x, y) {
    this.x = x;
    this.y = y;
  },

  _findPolarAngle: function (a, b) {
    var ONE_RADIAN = 57.295779513082;
    var deltaX, deltaY;

    //if the points are undefined, return a zero difference angle.
    if (!a || !b) return 0;

    deltaX = (b.x - a.x);
    deltaY = (b.y - a.y);

    if (deltaX == 0 && deltaY == 0) {
      return 0;
    }

    var angle = Math.atan2(deltaY, deltaX) * ONE_RADIAN;

    if (this.reverse){
      if (angle <= 0) {
        angle += 360;
      }
    }else{
      if (angle >= 0) {
        angle += 360;
      }
    }

    return angle;
  },

  addPoint: function (x, y) {
    //Check for a new anchor
    var newAnchor =
        (this.anchorPoint === undefined) ||
        ( this.anchorPoint.y > y ) ||
        ( this.anchorPoint.y === y && this.anchorPoint.x > x );

    if ( newAnchor ) {
      if ( this.anchorPoint !== undefined ) {
        this.points.push(new this.Point(this.anchorPoint.x, this.anchorPoint.y));
      }
      this.anchorPoint = new this.Point(x, y);
    } else {
      this.points.push(new this.Point(x, y));
    }
  },

  _sortPoints: function () {
    var self = this;

    return this.points.sort(function (a, b) {
      var polarA = self._findPolarAngle(self.anchorPoint, a);
      var polarB = self._findPolarAngle(self.anchorPoint, b);

      if (polarA < polarB) {
        return -1;
      }
      if (polarA > polarB) {
        return 1;
      }

      return 0;
    });
  },

  _checkPoints: function (p0, p1, p2) {
    var difAngle;
    var cwAngle = this._findPolarAngle(p0, p1);
    var ccwAngle = this._findPolarAngle(p0, p2);

    if (cwAngle > ccwAngle) {

      difAngle = cwAngle - ccwAngle;

      return !(difAngle > 180);

    } else if (cwAngle < ccwAngle) {

      difAngle = ccwAngle - cwAngle;

      return (difAngle > 180);

    }

    return true;
  },

  getHull: function () {
    var hullPoints = [],
        points,
        pointsLength;

    this.reverse = this.points.every(function(point){
      return (point.x < 0 && point.y < 0);
    });

    points = this._sortPoints();
    pointsLength = points.length;

    //If there are less than 3 points, joining these points creates a correct hull.
    if (pointsLength < 3) {
      points.unshift(this.anchorPoint);
      return points;
    }

    //move first two points to output array
    hullPoints.push(points.shift(), points.shift());

    //scan is repeated until no concave points are present.
    while (true) {
      var p0,
          p1,
          p2;

      hullPoints.push(points.shift());

      p0 = hullPoints[hullPoints.length - 3];
      p1 = hullPoints[hullPoints.length - 2];
      p2 = hullPoints[hullPoints.length - 1];

      if (this._checkPoints(p0, p1, p2)) {
        hullPoints.splice(hullPoints.length - 2, 1);
      }

      if (points.length == 0) {
        if (pointsLength == hullPoints.length) {
          //check for duplicate anchorPoint edge-case, if not found, add the anchorpoint as the first item.
          var ap = this.anchorPoint;
          //remove any udefined elements in the hullPoints array.
          hullPoints = hullPoints.filter(function(p) { return !!p; });
          if (!hullPoints.some(function(p){
            return(p.x == ap.x && p.y == ap.y);
          })) {
            hullPoints.unshift(this.anchorPoint);
          }
          return hullPoints;
        }
        points = hullPoints;
        pointsLength = points.length;
        hullPoints = [];
        hullPoints.push(points.shift(), points.shift());
      }
    }
  }
};

// EXPORTS

if (typeof define === 'function' && define.amd) {
  define(function() {
    return ConvexHullGrahamScan;
  });
}
if (typeof module !== 'undefined') {
  module.exports = ConvexHullGrahamScan;
}
