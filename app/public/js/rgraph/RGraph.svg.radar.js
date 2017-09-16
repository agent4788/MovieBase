
RGraph=window.RGraph||{isRGraph:true};RGraph.SVG=RGraph.SVG||{};(function(win,doc,undefined)
{var RG=RGraph,ua=navigator.userAgent,ma=Math,win=window,doc=document;RG.SVG.Radar=function(conf)
{this.set=function(name,value)
{if(arguments.length===1&&typeof name==='object'){for(i in arguments[0]){if(typeof i==='string'){var ret=RG.SVG.commonSetter({object:this,name:i,value:arguments[0][i]});name=ret.name;value=ret.value;this.set(name,value);}}}else{var ret=RG.SVG.commonSetter({object:this,name:name,value:value});name=ret.name;value=ret.value;this.properties[name]=value;if(name==='colors'){this.originalColors=RG.SVG.arrayClone(value);this.colorsParsed=false;}}
return this;};this.id=conf.id;this.uid=RG.SVG.createUID();this.container=document.getElementById(this.id);this.layers={};this.svg=RG.SVG.createSVG({object:this,container:this.container});this.isRGraph=true;this.width=Number(this.svg.getAttribute('width'));this.height=Number(this.svg.getAttribute('height'));this.data=RG.SVG.arrayClone(conf.data);this.originalData=RG.SVG.arrayClone(conf.data);this.type='radar';this.coords=[];this.coords2=[];this.angles=[];this.angles2=[];this.colorsParsed=false;this.originalColors={};this.gradientCounter=1;this.nodes=[];this.shadowNodes=[];this.max=0;this.redraw=false;this.highlight_node=null;RG.SVG.OR.add(this);this.container.style.display='inline-block';this.properties={centerx:null,centery:null,radius:null,gutterLeft:35,gutterRight:35,gutterTop:35,gutterBottom:35,backgroundGrid:true,backgroundGridColor:'#ddd',backgroundGridRadialsCount:null,backgroundGridConcentricsCount:5,backgroundGridLinewidth:1,backgroundGridPoly:true,colors:['red','black','orange','green','#6ff','#ccc','pink','orange','cyan','maroon','olive','teal'],filled:false,filledOpacity:0.25,filledAccumulative:true,textColor:'black',textFont:'sans-serif',textSize:12,textBold:false,textItalic:false,labels:[],scaleVisible:true,scaleUnitsPre:'',scaleUnitsPost:'',scaleMax:null,scaleMin:0,scalePoint:'.',scaleThousand:',',scaleRound:false,scaleDecimals:0,scaleFormatter:null,scaleBold:null,scaleItalic:null,scaleColor:null,scaleSize:null,scaleFont:null,scaleLabelsCount:5,linewidth:1,tooltips:null,tooltipsOverride:null,tooltipsEffect:'fade',tooltipsCssClass:'RGraph_tooltip',tooltipsEvent:'mousemove',highlightStroke:'rgba(0,0,0,0)',highlightFill:'rgba(255,255,255,0.7)',highlightLinewidth:1,tickmarks:'circle',tickmarksLinewidth:1,tickmarksSize:6,tickmarksFill:'white',title:'',titleSize:16,titleX:null,titleY:null,titleHalign:'center',titleValign:null,titleColor:'black',titleFont:null,titleBold:false,titleItalic:false,titleSubtitle:'',titleSubtitleSize:10,titleSubtitleX:null,titleSubtitleY:null,titleSubtitleHalign:'center',titleSubtitleValign:null,titleSubtitleColor:'#aaa',titleSubtitleFont:null,titleSubtitleBold:false,titleSubtitleItalic:false,grouping:'normal',shadow:false,shadowOffsetx:2,shadowOffsety:2,shadowBlur:2,shadowOpacity:0.25,key:null,keyColors:null,keyOffsetx:0,keyOffsety:0,keyTextOffsetx:0,keyTextOffsety:-1,keyTextSize:null,keyTextBold:null,keyTextItalic:null};RG.SVG.getGlobals(this);if(RG.SVG.FX&&typeof RG.SVG.FX.decorate==='function'){RG.SVG.FX.decorate(this);}
var prop=this.properties;this.draw=function()
{RG.SVG.fireCustomEvent(this,'onbeforedraw');this.data=RG.SVG.arrayClone(this.originalData);if(this.data.length>1){var len=this.data[0].length;for(var i=1;i<this.data.length;++i){if(this.data[i].length!==len){alert('[ERROR] The Radar chart datasets must have the same number of elements!');}}}
this.angles=[];this.coords=[];this.coords2=[];RG.SVG.createDefs(this);this.graphWidth=this.width-prop.gutterLeft-prop.gutterRight;this.graphHeight=this.height-prop.gutterTop-prop.gutterBottom;this.centerx=(this.graphWidth/2)+prop.gutterLeft;this.centery=(this.graphHeight/2)+prop.gutterTop;this.radius=ma.min(this.graphWidth,this.graphHeight)/2;this.centerx=typeof prop.centerx==='number'?prop.centerx:this.centerx;this.centery=typeof prop.centery==='number'?prop.centery:this.centery;this.radius=typeof prop.radius==='number'?prop.radius:this.radius;if(typeof prop.radius==='string'&&prop.radius.match(/^\+|-\d+$/))this.radius+=parseFloat(prop.radius);if(typeof prop.centerx==='string'&&prop.centerx.match(/^\+|-\d+$/))this.centery+=parseFloat(prop.centerx);if(typeof prop.centery==='string'&&prop.centery.match(/^\+|-\d+$/))this.centerx+=parseFloat(prop.centery);if(RG.SVG.isArray(this.data)&&(typeof this.data[0]==='number'||typeof this.data[0]==='string')){this.data=[this.data];}
for(var i=0;i<this.data.length;++i){for(var j=0;j<this.data[i].length;++j){if(typeof this.data[i][j]==='string'){this.data[i][j]=RG.SVG.stringsToNumbers(this.data[i][j]);}}}
if(prop.filled&&prop.filledAccumulative){for(var dataset=1;dataset<this.data.length;++dataset){for(var i=0;i<this.data[dataset].length;++i){this.data[dataset][i]+=this.data[dataset-1][i];}}}
this.getMaxValue();RG.SVG.resetColorsToOriginalValues({object:this});this.parseColors();this.scale=RG.SVG.getScale({object:this,numlabels:typeof prop.scaleLabelsCount==='number'?prop.scaleLabelsCount:prop.backgroundGridConcentricCount,unitsPre:prop.scaleUnitsPre,unitsPost:prop.scaleUnitsPost,max:typeof prop.scaleMax==='number'?prop.scaleMax:this.max,min:prop.scaleMin,point:prop.scalePoint,round:prop.scaleRound,thousand:prop.scaleThousand,decimals:prop.scaleDecimals,strict:typeof prop.scaleMax==='number',formatter:prop.scaleFormatter});this.max=this.scale.max;this.drawBackground();this.drawRadar();this.drawTickmarks();this.drawLabels();RG.SVG.drawTitle(this);this.addTooltipHotspots();if(typeof prop.key!==null&&RG.SVG.drawKey){RG.SVG.drawKey(this);}else if(!RGraph.SVG.isNull(prop.key)){alert('The drawKey() function does not exist - have you forgotten to include the key library?');}
RG.SVG.attribution(this);if(prop.shadow){RG.SVG.setShadow({object:this,offsetx:prop.shadowOffsetx,offsety:prop.shadowOffsety,blur:prop.shadowBlur,opacity:prop.shadowOpacity,id:'dropShadow'});}
var obj=this;doc.body.addEventListener('mousedown',function(e)
{obj.hideHighlight(obj);},false);RG.SVG.fireCustomEvent(this,'ondraw');return this;};this.drawBackground=function()
{if(prop.backgroundGrid){var grid=RG.SVG.create({svg:this.svg,parent:this.svg.all,type:'g',attr:{className:'rgraph_radar_grid',fill:'rgba(0,0,0,0)',stroke:prop.backgroundGridColor}});var origin=0-(RG.SVG.TRIG.PI/2),radials=(typeof prop.backgroundGridRadialsCount==='number'?prop.backgroundGridRadialsCount:this.data[0].length),concentrics=prop.backgroundGridConcentricsCount,step=RG.SVG.TRIG.TWOPI/radials;if(radials>0){for(var i=0,len=radials;i<len;++i){var coords=RG.SVG.TRIG.toCartesian({cx:this.centerx,cy:this.centery,r:this.radius,angle:origin+(i*step)});var str='M {1} {2} L {3} {4}'.format(this.centerx,this.centery,coords.x,coords.y);RG.SVG.create({svg:this.svg,type:'path',parent:grid,attr:{d:str,stroke:prop.backgroundGridColor,'stroke-width':prop.backgroundGridLinewidth}});}}
if(concentrics>0){if(prop.backgroundGridPoly){for(var j=1;j<=concentrics;j++){for(var i=0,len=radials,path=[];i<len;++i){var coords=RG.SVG.TRIG.toCartesian({cx:this.centerx,cy:this.centery,r:this.radius*(j/concentrics),angle:origin+(i*step)});path.push('{1} {2} {3}'.format(i===0?'M':'L',coords.x,coords.y));}
RG.SVG.create({svg:this.svg,type:'path',parent:grid,attr:{d:path.join(' ')+' z',fill:'transparent',stroke:prop.backgroundGridColor,'stroke-width':prop.backgroundGridLinewidth}});}}else{for(var j=1;j<=concentrics;j++){RG.SVG.create({svg:this.svg,type:'circle',parent:grid,attr:{cx:this.centerx,cy:this.centery,r:this.radius*(j/concentrics),fill:'transparent',stroke:prop.backgroundGridColor,'stroke-width':prop.backgroundGridLinewidth}});}}}}};this.drawRadar=function(opt)
{for(var dataset=0,len=this.data.length;dataset<len;++dataset){this.coords2[dataset]=[];this.angles2[dataset]=[];var path=[];for(var i=0,len2=this.data[dataset].length;i<len2;++i){var value=this.data[dataset][i];var xy=RG.SVG.TRIG.toCartesian({cx:this.centerx,cy:this.centery,r:this.getRadius(this.data[dataset][i]),angle:(RG.SVG.TRIG.TWOPI/len2)*i-RG.SVG.TRIG.HALFPI});xy.r=(((value-prop.scaleMin)/(this.max-prop.scaleMin)))*this.radius;xy.angle=(RG.SVG.TRIG.TWOPI/len2)*i-RG.SVG.TRIG.HALFPI;path.push('{1}{2} {3}'.format(i===0?'M':'L',xy.x,xy.y));this.angles.push({cx:this.centerx,cy:this.centery,r:xy.r,angle:xy.angle});this.angles2[dataset].push({cx:this.centerx,cy:this.centery,r:xy.r,angle:xy.angle});this.coords.push([xy.x,xy.y]);this.coords2[dataset].push([xy.x,xy.y]);}
if(dataset>0&&prop.filled&&prop.filledAccumulative){path.push('L {1} {2}'.format(this.coords2[dataset][0][0],this.coords2[dataset][0][1]));path.push('M {1} {2}'.format(this.coords2[dataset-1][0][0],this.coords2[dataset-1][0][1]));for(var i=this.coords2[dataset-1].length-1;i>=0;--i){path.push('L {1} {2}'.format(this.coords2[dataset-1][i][0],this.coords2[dataset-1][i][1]));}
this.redraw=true;}else{path.push('z');}
var path=RG.SVG.create({svg:this.svg,type:'path',parent:this.svg.all,attr:{d:path.join(" "),stroke:prop.colors[dataset],fill:prop.filled?prop.colors[dataset]:'transparent','fill-opacity':prop.filledOpacity,'stroke-width':prop.linewidth,'clip-path':this.isTrace?'url(#trace-effect-clip)':'',filter:prop.shadow?'url(#dropShadow)':'',}});path.setAttribute('data-dataset',dataset);}
this.redrawRadar();};this.redrawRadar=function()
{if(this.redraw){this.redraw=false;for(var dataset=0;dataset<this.coords2.length;++dataset){var path=[];for(var i=0;i<this.coords2[dataset].length;++i){if(i===0){path.push('M {1} {2}'.format(this.coords2[dataset][i][0],this.coords2[dataset][i][1]));}else{path.push('L {1} {2}'.format(this.coords2[dataset][i][0],this.coords2[dataset][i][1]))}}
path.push('z')
RG.SVG.create({svg:this.svg,type:'path',parent:this.svg.all,attr:{d:path.join(" "),stroke:prop.colors[dataset],fill:'transparent','stroke-width':prop.linewidth}});}}};this.drawTickmarks=function()
{var group=RG.SVG.create({svg:this.svg,parent:this.svg.all,type:'g',attr:{className:'rgraph_radar_tickmarks'}});for(var i=0;i<this.coords2.length;++i){for(var j=0;j<this.coords2[i].length;++j){if(prop.tickmarks==='circle'||prop.tickmarks==='filledcircle'){var c=RG.SVG.create({svg:this.svg,type:'circle',parent:group,attr:{cx:this.coords2[i][j][0],cy:this.coords2[i][j][1],r:prop.tickmarksSize,fill:prop.tickmarks==='filledcircle'?prop.colors[i]:prop.tickmarksFill,stroke:prop.colors[i],'stroke-width':prop.tickmarksLinewidth,'clip-path':this.isTrace?'url(#trace-effect-clip)':''}});c.setAttribute('data-dataset',i);c.setAttribute('data-index',j);}else if(prop.tickmarks==='rect'||prop.tickmarks==='filledrect'){var halfTickmarkSize=prop.tickmarksSize/2;var fill=typeof prop.tickmarksFill==='object'&&prop.tickmarksFill[i]?prop.tickmarksFill[i]:prop.tickmarksFill;var s=RG.SVG.create({svg:this.svg,type:'rect',parent:group,attr:{x:this.coords2[i][j][0]-halfTickmarkSize,y:this.coords2[i][j][1]-halfTickmarkSize,width:prop.tickmarksSize,height:prop.tickmarksSize,fill:prop.tickmarks==='filledrect'?prop.colors[i]:fill,stroke:prop.colors[i],'stroke-width':prop.tickmarksLinewidth}});s.setAttribute('data-dataset',i);s.setAttribute('data-index',j);}}}};this.drawLabels=function()
{var angles=this.angles2,prop=this.properties,labels=prop.labels;for(var i=0,len=labels.length;i<len;++i){if(!labels[i]){continue;}
var endpoint=RG.SVG.TRIG.getRadiusEndPoint({angle:RG.SVG.TRIG.TWOPI/labels.length*i-RG.SVG.TRIG.HALFPI,r:this.radius+15});var x=endpoint[0]+this.centerx,y=endpoint[1]+this.centery;if((i/len)<0.5){halign='left';}else{halign='right';}
if((i/len)<0.25||(i/len)>0.75){valign='bottom';}else{valign='top';}
if((i/len)===0){halign='center';}
if((i/len)===0.25){valign='center';}
if((i/len)===0.5){halign='center';}
if((i/len)===0.75){valign='center';}
RG.SVG.text({object:this,svg:this.svg,parent:this.svg.all,text:labels[i],size:typeof prop.labelsSize==='number'?prop.labelsSize:prop.textSize,x:x,y:y,halign:halign,valign:'center',color:prop.labelsColor||prop.textColor,bold:typeof prop.labelsBold==='boolean'?prop.labelsBold:prop.textBold,italic:typeof prop.labelsItalic==='boolean'?prop.labelsItalic:prop.textItalic,font:prop.labelsFont||prop.textFont});}
if(prop.scaleVisible){for(var i=0;i<this.scale.labels.length;++i){var x=this.centerx;var y=this.centery-(this.radius/this.scale.labels.length*(i+1));RG.SVG.text({object:this,svg:this.svg,parent:this.svg.all,text:this.scale.labels[i],size:prop.scaleSize||prop.textSize-2,x:x,y:y,halign:'center',valign:'center',background:'rgba(255,255,255,0.7)',padding:2,color:prop.scaleColor||prop.textColor,bold:typeof prop.scaleBold==='boolean'?prop.scaleBold:prop.textBold,italic:typeof prop.scaleItalic==='boolean'?prop.scaleItalic:prop.textItalic,font:prop.scaleFont||prop.textFont});}
var str=RG.SVG.numberFormat({object:this,num:this.scale.min.toFixed(prop.scaleDecimals),prepend:prop.scaleUnitsPre,append:prop.scaleUnitsPost,point:prop.scalePoint,thousand:prop.scaleThousand,formatter:prop.scaleFormatter});RG.SVG.text({object:this,svg:this.svg,parent:this.svg.all,text:str,size:prop.scaleSize||prop.textSize-2,x:this.centerx,y:this.centery,halign:'center',valign:'center',background:'rgba(255,255,255,0.7)',padding:2,color:prop.scaleColor||prop.textColor,bold:typeof prop.scaleBold==='boolean'?prop.scaleBold:prop.textBold,italic:typeof prop.scaleItalic==='boolean'?prop.scaleItalic:prop.textItalic,font:prop.scaleFont||prop.textFont});}};this.highlight=function(circle)
{circle.setAttribute('fill',prop.highlightFill);circle.setAttribute('stroke',prop.highlightStroke);circle.setAttribute('stroke-width',prop.highlightLinewidth);this.highlight_node=circle;RG.SVG.REG.set('highlight',circle);};this.parseColors=function()
{if(!Object.keys(this.originalColors).length){this.originalColors={colors:RG.SVG.arrayClone(prop.colors),highlightFill:RG.SVG.arrayClone(prop.highlightFill)}}
var colors=prop.colors;if(colors){for(var i=0;i<colors.length;++i){colors[i]=RG.SVG.parseColorRadial({object:this,color:colors[i]});}}
prop.highlightFill=RG.SVG.parseColorRadial({object:this,color:prop.highlightFill});};this.getMaxValue=function()
{var max=0;if(prop.filled&&prop.filledAccumulative){this.max=RG.SVG.arrayMax(this.data[this.data.length-1]);}else{for(var dataset=0,max=0;dataset<this.data.length;++dataset){this.max=ma.max(this.max,RG.SVG.arrayMax(this.data[dataset]));}}};this.getRadius=function(value)
{return((value-prop.scaleMin)/(this.scale.max-prop.scaleMin))*this.radius;};this.addTooltipHotspots=function()
{if(prop.tooltips&&prop.tooltips.length>0){if(prop.tooltipsEvent!=='mousemove'){prop.tooltipsEvent='click';}
var group=RG.SVG.create({svg:this.svg,type:'g',parent:this.svg.all,attr:{className:'rgraph-radar-tooltip-hotspots'}});for(var dataset=0,seq=0;dataset<this.coords2.length;++dataset){for(var i=0;i<this.coords2[dataset].length;++i){var circle=RG.SVG.create({svg:this.svg,type:'circle',parent:group,attr:{cx:this.coords2[dataset][i][0],cy:this.coords2[dataset][i][1],r:prop.tickmarksSize,fill:'transparent',stroke:'transparent','stroke-width':0,'data-sequential-index':seq},style:{cursor:prop['tooltips'][seq]?'pointer':'default'}});(function(dataset,index,seq,obj)
{if(prop.tooltips[seq]){circle.addEventListener(prop.tooltipsEvent,function(e)
{var tooltip=RG.SVG.REG.get('tooltip');if(tooltip&&tooltip.__sequentialIndex__===seq){return;}
RG.SVG.tooltip({object:obj,dataset:dataset,index:index,sequentialIndex:seq,text:prop.tooltips[seq],event:e});obj.highlight(this);},false);if(prop.tooltipsEvent==='click'){circle.addEventListener('mousemove',function(e)
{e.target.style.cursor='pointer';},false);}}}(dataset,i,seq++,this));}}}};this.roundRobin=function()
{};this.on=function(type,func)
{if(type.substr(0,2)!=='on'){type='on'+type;}
RG.SVG.addCustomEventListener(this,type,func);return this;};this.exec=function(func)
{func(this);return this;};this.removeHighlight=this.hideHighlight=function()
{var highlight=RG.SVG.REG.get('highlight');if(highlight&&this.highlight_node){this.highlight_node.setAttribute('fill','transparent');this.highlight_node.setAttribute('stroke','transparent');RG.SVG.REG.set('highlight',null);}};this.trace=function()
{var opt=arguments[0]||{},frame=1,frames=opt.frames||120,obj=this
step=360/frames;this.isTrace=true;this.draw();var clipPath=RG.SVG.create({svg:this.svg,parent:this.svg.defs,type:'clipPath',attr:{id:'trace-effect-clip'}});clipPathArcPath=RG.SVG.TRIG.getArcPath2({cx:this.angles[0].cx,cy:this.angles[0].cy,r:this.angles[0].r*2,start:0,end:0});var clipPathArc=RG.SVG.create({svg:this.svg,parent:clipPath,type:'path',attr:{d:clipPathArcPath}});var iterator=function()
{var width=(frame++)/frames*obj.width;var deg=(360/frames)*frame++,rad=(RG.SVG.TRIG.TWOPI/360)*deg
clipPathArc.setAttribute('d',RG.SVG.TRIG.getArcPath2({cx:obj.angles[0].cx,cy:obj.angles[0].cy,r:obj.angles[0].r*2,start:0,end:rad}));if(frame<=frames){RG.SVG.FX.update(iterator);}else if(opt.callback){(opt.callback)(obj);}};iterator();return this;};for(i in conf.options){if(typeof i==='string'){this.set(i,conf.options[i]);}}};return this;})(window,document);