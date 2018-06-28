var REQ = (function () {
    var reqStruct = {};

    function addReq(id, grp) {
        var el = document.getElementById(id);
        if (!el.grp) {
            el.grp = grp;
            validateElement(el);
            $(el).on('click keyup blur', function () {
                validateElement(this);
                validateGroup(reqStruct[this.grp]);
            });
        }
        return el;
    }

    function isInput(el) {
        return (el.type && (el.type == 'radio' || el.type == 'checkbox'));
    }

    function findIncomplete(group) {
        if (group.isRequired) {
            return group.field[0];
        } else if (group.trigger && group.trigger.length) {
            var field = false;
            for (var i = 0; i < group.trigger.length; i++) {
                if (field = findIncomplete(group.trigger[i])) {
                    return field;
                }
            }
        } else {
            return false;
        }
    }

    function paintReq(group) {
        for (var i = group.field.length; i--;) {
            if (!group.field[i]) {//skip this loop iteration
                continue;
            } else if (isInput(group.field[i])) {// if radio or checkbox, paint parent
                //group.field[i].parentNode.style.backgroundColor = ( group.isRequired ? '#ffc' : '' );
                $(group.field[i].parentNode)[group.isRequired ? 'addClass' : 'removeClass']('rbtn_req');
            } else {// text input or textarea, paint background
                //group.field[i].style.backgroundColor = ( group.isRequired ? '#ffc' : '' );
                $(group.field[i])[group.isRequired ? 'addClass' : 'removeClass']('rbtn_req');
            }
        }
    }

    function validateElement(el) {
        if (isInput(el)) {
            el.valid = el.checked;
        } else {
            el.valid = (el.value.length ? true : false);
        }
        return el.valid;
    }

    function validateGroup(group) {
        group.isRequired = (!validateSubgroup(group.field) // field is NOT completed
            && (!group.depend || !group.depend.length || validateSubgroup(group.depend)));//dependency is met or doesn't exist
        paintReq(group);

        if (typeof group.trigger !== 'undefined' && group.trigger.length) {
            for (var i = group.trigger.length; i--;) {
                validateGroup(group.trigger[i]);
            }
        }
    }

    function validateSubgroup(elArr) {
        var isValid = true;

        if (typeof elArr !== 'undefined' && elArr.length) {
            isValid = false;
            for (var i = elArr.length; i--;) {
                if (validateElement(elArr[i])) {
                    return true;
                }
            }
        }
        return isValid;
    }

    return {
        showIncomplete: function () {
            var $buttonBox = $('#csnButtonBox');
            var firstIncomplete = false;
            $buttonBox.find('input').prop('disabled', false);

            for (var key in reqStruct) {
                if (firstIncomplete = findIncomplete(reqStruct[key])) {
                    $("html").animate({ scrollTop: $(firstIncomplete).offset().top - 200 }, 600, function () {
                        EMR.UTIL.pulseWarning((isInput(firstIncomplete) ? firstIncomplete.parentNode : firstIncomplete));
                    });
                    break;
                }
            }

            return firstIncomplete;
        },

        init: function () {
            // may need to improve search efficiency with
            var $box = $('.csnblock-container');

            // ADD RISK ASSESSMENT REQUIRED FIELDS
            $box.find('input[id^="csnblock_si_thoughts"][id$="_yes"]').each(function () {
                var noteID = (this.id).match(/\d+/)[0];
                var key = this.id;
                // break this out since it's triggered by two separate groups (below)
                // ... not sure this is a good decision? Hm.
                var trigStruct = {
                    field: [    addReq('csnblock_si_review_protocols' + noteID, key),
                                addReq('csnblock_si_safety_plan' + noteID, key),
                                addReq('csnblock_si_init_hospitalization' + noteID, key),
                                addReq('csnblock_si_other_txt' + noteID, key)],
                    depend: [   addReq(this.id, key),
                                addReq('csnblock_si_behavior' + noteID + '_yes', key)]
                }

                // "Suicidal Thoughts" and sub requirements
                reqStruct[key] = {

                    field: [addReq(this.id, key),

                    addReq('csnblock_si_thoughts' + noteID + '_no', key)],

                    trigger: [

                        {
                            field: [addReq('csnblock_si_method' + noteID + '_yes', key),

                            addReq('csnblock_si_method' + noteID + '_no', key)],

                            depend: [addReq(this.id, key)]

                        },

                        {
                            field: [addReq('csnblock_si_plan' + noteID + '_yes', key),

                            addReq('csnblock_si_plan' + noteID + '_no', key)],

                            depend: [addReq(this.id, key)]

                        },

                        {
                            field: [addReq('csnblock_si_noplan' + noteID + '_yes', key),

                            addReq('csnblock_si_noplan' + noteID + '_no', key)],

                            depend: [addReq(this.id, key)]

                        },

                        trigStruct

                    ]

                };



                // "Suicidal Behavior" and sub requirements

                key = 'csnblock_si_behavior' + noteID + '_yes';//key can be anything, just needs to be unique.

                reqStruct[key] = {

                    field: [addReq(key, key),

                    addReq('csnblock_si_behavior' + noteID + '_no', key)],

                    trigger: [

                        {
                            field: [addReq('csnblock_si_behavior_txt' + noteID, key)],

                            depend: [addReq(this.id, key)]

                        },

                        trigStruct

                    ]

                };

            });





            // ADD FOCUS OF SESSION REQUIRED FIELDS

            $box.find('textarea[id^="csnblock_focus_txt"]').each(function () {

                var noteID = (this.id).match(/\d+/)[0];

                var key = this.id;//key can be anything, just needs to be unique.

                var fieldArr = [addReq(this.id, key)];



                $('input[id^="csnblock_objective' + noteID + '"]').each(function () {

                    fieldArr.push(addReq(this.id, key));

                });



                reqStruct[key] = {

                    field: fieldArr

                };

            });



            // ADD INTERVENTIONS REQUIRED FIELDS

            $box.find('textarea[id^="csnblock_intervention_txt"]').each(function () {

                var noteID = (this.id).match(/\d+/)[0];

                var fieldArr = [];

                var key = 'csnblock_intervention' + noteID;

                $('input[id^="csnblock_intervention' + noteID + '"]').each(function () {

                    fieldArr.push(addReq(this.id, key));

                });



                if (fieldArr.length) {

                    reqStruct[key] = {

                        field: fieldArr

                    };

                }



                reqStruct[this.id] = {

                    field: [addReq(this.id, this.id)]

                };



            });



            // ADD RESPONSE REQUIRED FIELDS

            $box.find('textarea[id^="csnblock_response_txt"]').each(function () {

                var noteID = (this.id).match(/\d+/)[0];



                var key = 'csnblock_response_cooperative' + noteID;

                if ($("#" + key).length) {

                    reqStruct[key] = {

                        field: [addReq('csnblock_response_attentive' + noteID, key),

                        addReq('csnblock_response_cooperative' + noteID, key),

                        addReq('csnblock_response_suspicious' + noteID, key),

                        addReq('csnblock_response_agreeable' + noteID, key),

                        addReq('csnblock_response_open' + noteID, key),

                        addReq('csnblock_response_guarded' + noteID, key),

                        addReq('csnblock_response_agitated' + noteID, key),

                        addReq('csnblock_response_refused' + noteID, key),

                        addReq('csnblock_response_aggressive' + noteID, key),

                        addReq('csnblock_response_disinterested' + noteID, key)

                        ]

                    };

                }



                reqStruct[this.id] = {

                    field: [addReq(this.id, this.id)]

                };



            });



            // ADD PATIENT PROGRESS REQUIRED FIELDS

            $box.find('textarea[id^="csnblock_progress_txt"]').each(function () {

                reqStruct[this.id] = {

                    field: [addReq(this.id, this.id)]

                };



            });



            // ADD ACTION PLAN REQUIRED FIELDS

            $box.find('textarea[id^="csnblock_action_txt"]').each(function () {

                reqStruct[this.id] = {

                    field: [addReq(this.id, this.id)]

                };

            });



            // run through all required fields, paint as needed

            for (var key in reqStruct) {

                validateGroup(reqStruct[key]);

            }



        }

    }

}());