var REQ = ( function () {
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

	return {
		init: function() {
			// individual requirement
            /*
            var id = 'txt1', key = id;
			reqStruct[key] = {
				field:[addReq(id, key)]
			};
            */
			
			// alternates
			/*
            var id = 'chk1', key = id;
			reqStruct[key] = {
				field:[	addReq(id,key), addReq('chk2',key), addReq('chk3',key) ]
			}
            */
			
			// dependencies
			/*
            var id = 'parent1', key = id;
			reqStruct[key] = {
				field:[	addReq(id,key) ],
				trigger:[
					{	field:[	addReq('child1',key) ],
						depend:[ addReq(id,key) ] 
					} 
				] 
			};
            */

			// run through all required fields, paint as needed
			for ( var key in reqStruct ){
                validateGroup(reqStruct[key]);
            }
		}
	}
}());
