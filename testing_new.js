var REQ = ( function () {

/*

var reqStruct = {};

  

function addReq(id,grp){

var el = document.getElementById(id);

if ( !el.grp ){

el.grp = grp;

validateElement(el);

$(el).on('click keyup blur',function(){

validateElement(this);

validateGroup(reqStruct[this.grp]);

});

}

return el;

}

  

function isInput(el){

return (el.type && (el.type=='radio'||el.type=='checkbox'||el.type=='hidden'));

}

  

function findIncomplete( group ){

if ( group.isRequired ) {

return group.field[0];

} else if ( group.trigger && group.trigger.length ) {

var field = false;

for ( var i = 0; i < group.trigger.length; i++ ){

if ( field = findIncomplete( group.trigger[i] )){

return field;

}

}

} else {

return false;

}

}

  

function paintReq( group ){

for ( var i = group.field.length; i--; ){

if ( !group.field[i] ) {//skip this loop iteration

continue;

} else if ( isInput(group.field[i]) ) {// if radio or checkbox, paint parent

group.field[i].parentNode.style.backgroundColor = ( group.isRequired ? '#ffc' : '' );

//$( group.field[i].parentNode )[ group.isRequired ? 'addClass' : 'removeClass' ]('rbtn_req');

} else {// text input or textarea, paint background

group.field[i].style.backgroundColor = ( group.isRequired ? '#ffc' : '' );

//$( group.field[i] )[ group.isRequired ? 'addClass' : 'removeClass' ]('rbtn_req');

}

}

}

  

function validateElement(el){

if ( isInput(el) && el.type != 'hidden' ) {

el.valid = el.checked;

} else {

el.valid = ( el.value.length ? true : false );

}

return el.valid;

}

  

function validateGroup(group){

group.isRequired = ( !validateSubgroup( group.field ) // field is NOT completed

&& ( !group.depend || !group.depend.length || validateSubgroup( group.depend ) ) );//dependency is met or doesn't exist

paintReq(group);

  

if ( typeof group.trigger !== 'undefined' && group.trigger.length ) {

for ( var i = group.trigger.length; i--; ) {

validateGroup( group.trigger[i] );

}

}

}

  

function validateSubgroup(elArr){

var isValid = true;

  

if (typeof elArr !== 'undefined' && elArr.length ) {

isValid = false;

for ( var i = elArr.length; i--; ){

if ( validateElement( elArr[i] ) ) {

return true;

}

}

}

return isValid;

}

*/

var reqMap = [];

var reqNodes = [];

function addReq( args ) {

// convert requirements and dependencies to

// standardized arrays of structs

let req = reformatArg( args.req );

let dep = reformatArg( args.dep );

  

/*

let reqDictIndex = reqMap.push({

fields: [],

dependencies: [],

conditional: null

}) - 1; // array length - 1 to get index

  

$req.each(function(){

let $this = $( this );

let reqNodeRef = $this.attr('reqnodeid');

if ( typeof reqNodeRef === 'undefined' ){

reqNodeRef = reqNodes.push({

conditional: null,

field: this,

isvalid: false,

reqmaps: [reqDictIndex]

}) - 1;

$this.attr('reqnodeid',reqNodeRef);

} else {

reqNodes[Number(reqNodeRef)].reqmaps.push(reqDictIndex);

}

$this.on(getTypeEvent($this),REQ.update);

reqMap[reqDictIndex].fields.push(reqNodeRef);

});

  

*/

  

console.log(reqMap);

console.log(reqNodes);

}

  

/**

* @param {Object} $el - jQuery object of required form element

*/

var getTypeEvent = function( $el ){

// TODO: support additional input types

if ( $el.is('[type="radio"]' ) || $el.is('[type="checkbox"]') || $el.is('select') ){

return 'blur change';

} else { // textarea, input[type=text]

return 'blur keyup mouseup';

}

}

  

/**

* @param {*} arg

*/

var reformatArg = function( arg ){

// TODO support alternate arguments types, e.g., name groups

if ( arg.constructor === Array ) {

// loop, recursive call & convert if struct

} else if ( Object.prototype.toString.call(arg) === "[object String]" ) {

// split on ','

} else if ( typeof arg === 'object' && arg !== null ) {

// struct

} else {

//console.error(e);

}

}

  

var update = function(){

console.log( this );

}

  

return {

update: update,

init: function() {

// single requirement

// string list (jquery arg)

addReq({req:'#myID,#altID1,#altID2',dep:"#parentID1,#parentID2"});

// array of IDs

addReq({req:['#myID','altID1','#altID2']});

  

// struct

addreq({req: {id:'#myID',condition:'1'} });

  

// array of structs

addreq({req:[ {id:'myID',condition:'1'}]});

  

/*

NEED TO DECIDE ON AND VS. OR BEHAVIOR

maybe... [[and,and,and],[and,and,and]]

*/

  

/*

// jQuery selector (single or list)

addReq( $myObj );

  

// single requirement with conditional

  

// single requirement with conditional

addreq({req='myID',

con=function(){

console.log( this );

return ( this.value == 1 );

}

});

*/

/*

// require = req

// dependency = dep

// alternate = alt

// conditional = con

////////////////

//// INDIVIDUAL

////////////////

  

// single requirement

addReq('myID'); // optional syntax: addreq({req='myID'});

  

// jQuery selector (single or list)

addReq( $myObj );

  

// single requirement with conditional

addreq({req='myID',condition='1'});

  

// single requirement with conditional

addreq({req='myID',

con=function(){

console.log( this );

return ( this.value == 1 ) );

}

});

  

////////////////

//// ALTERNATE

////////////////

// alternate by name

addReq('myName'); // e.g., radio group, assumes alternates

  

// alternate requirements

addReq(['myID0','myID1']); // e.g., alternates

  

// alternate

addReq({req='myID', alt='otherID'})

  

// alternates

addReq({req='myID', alt=['otherID0','otherID1']})

  

// alternate with conditional

addReq({

req='myID',

alt={req='altID', con=[1,2]}

});

  

// alternates with conditional

addReq({

req='myID',

alt=[{req='altID1', con=[1,2]},{req='altID2'}]

});

  
  

*/

  
  

  
  
  

}

}

}());

  

$(function(){

REQ.init();

});
