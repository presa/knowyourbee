updateMenu('#packages');

var FormWizard = function () {

    var handleDatePickers = function () {

        if (jQuery().datepicker) {
            $('#date_sent, #date_received').datepicker({
                rtl: App.isRTL(),
                orientation: "left",
                autoclose: true,
                format: "dd/mm/yyyy"
            }).on('changeDate', function(ev){
                if (ev.target.id == "date_sent") {
                    $("#date_received").prop("disabled", false);
                    $("#date_received").datepicker("setStartDate", ev.target.value)
                }
                $(this).valid();
            });
        }

        $("#date_received").prop("disabled", true);

    };

    var handleSelect2 = function () {
        // Set the "bootstrap" theme as the default theme for all Select2
        // widgets.
        //
        // @see https://github.com/select2/select2/issues/2927
        $.fn.select2.defaults.set("theme", "bootstrap");

        $("#courier_id").select2({
            placeholder: "Select courier",
            width: null
        });

        $("#partner_id").select2({
            placeholder: "Select the partner",
            width: null
        });

        $("#location_id").select2({
            placeholder: "Select the storage location",
            width: null
        });

        $("#sender_id").select2({
            placeholder: "Select the person who sent",
            width: null
        });

        $("#receiver_id").select2({
            placeholder: "Select the person who received",
            width: null
        });

        // copy Bootstrap validation states to Select2 dropdown
        //
        // add .has-waring, .has-error, .has-succes to the Select2 dropdown
        // (was #select2-drop in Select2 v3.x, in Select2 v4 can be selected via
        // body > .select2-container) if _any_ of the opened Select2's parents
        // has one of these forementioned classes (YUCK! ;-))
        $(".select2").on("select2:open", function() {
            if ($(this).parents("[class*='has-']").length) {
                var classNames = $(this).parents("[class*='has-']")[0].className.split(/\s+/);

                for (var i = 0; i < classNames.length; ++i) {
                    if (classNames[i].match("has-")) {
                        $("body > .select2-container").addClass(classNames[i]);
                    }
                }
            }
        });
    }

    return {
        //main function to initiate the module
        init: function () {
            if (!jQuery().bootstrapWizard) {
                return;
            }

            var form = $('#submit_form');
            var error = $('.alert-danger', form);
            var success = $('.alert-success', form);

            form.validate({
                doNotHideMessage: true, //this option enables to show the error/success messages on tab switch.
                errorElement: 'span', //default input error message container
                errorClass: 'help-block help-block-error', // default input error message class
                focusInvalid: false, // do not focus the last invalid input
                rules: {
                    //package metadata
                    date_sent: {
                        required: true
                    },
                    date_received: {
                        required: true
                    },
                    courier_id: {
                        required: true
                    },
                    tracking_number: {
                        required: false,
                        maxlength: 20
                    },
                    partner_id: {
                        required: true
                    },
                    location_id: {
                        required: true
                    },
                    sender_id: {
                        required: true
                    },
                    receiver_id: {
                        required: true
                    },
                    comments: {
                        required: false,
                        maxlength: 512
                    }
                },

                errorPlacement: function (error, element) { // render error placement for each input type
                    if (element.hasClass("select2")) {
                        error.insertAfter(element.next());
                    } else if (element.parent().hasClass("date-picker")) {
                        error.insertAfter(element.parent())
                    } else {
                        error.insertAfter(element); // for other inputs, just perform default behavior
                    }
                },

                invalidHandler: function (event, validator) { //display error alert on form submit
                    success.hide();
                    error.show();
                    App.scrollTo(error, -200);
                },

                highlight: function (element) { // hightlight error inputs
                    $(element)
                        .closest('.form-group').removeClass('has-success').addClass('has-error'); // set error class to the control group
                },

                unhighlight: function (element) { // revert the change done by hightlight
                    $(element)
                        .closest('.form-group').removeClass('has-error'); // set error class to the control group
                },

                success: function (label) {
                    if (label.attr("for") == "gender" || label.attr("for") == "payment[]") { // for checkboxes and radio buttons, no need to show OK icon
                        label
                            .closest('.form-group').removeClass('has-error').addClass('has-success');
                        label.remove(); // remove error label here
                    } else { // display success icon for other inputs
                        label
                            .addClass('valid') // mark the current input as valid and display OK icon
                        .closest('.form-group').removeClass('has-error').addClass('has-success'); // set success class to the control group
                    }
                },

                submitHandler: function (form) {
                    success.show();
                    error.hide();
                    form.submit();
                    //add here some ajax code to submit your form or just call form.submit() if you want to submit the form without ajax
                }

            });

            var displayConfirm = function() {
                $('#tab3 .form-control-static', form).each(function(){
                    var input = $('[name="'+$(this).attr("data-display")+'"]', form);
                    console.log(input)
                    if (input.is(":radio")) {
                        input = $('[name="'+$(this).attr("data-display")+'"]:checked', form);
                    }
                    if (input.is(":text") || input.is("textarea")) {
                        $(this).html(input.val());
                    } else if (input.is("select")) {
                        $(this).html(input.find('option:selected').text());
                    } else if (input.is(":radio") && input.is(":checked")) {
                        $(this).html(input.attr("data-title"));
                    }
                });
            }

            var handleTitle = function(tab, navigation, index) {
                var total = navigation.find('li').length;
                var current = index + 1;
                // set wizard title
                $('.step-title', $('#form_wizard_1')).text('Step ' + (index + 1) + ' of ' + total);
                // set done steps
                jQuery('li', $('#form_wizard_1')).removeClass("done");
                var li_list = navigation.find('li');
                for (var i = 0; i < index; i++) {
                    jQuery(li_list[i]).addClass("done");
                }

                if (current == 1) {
                    $('#form_wizard_1').find('.button-previous').hide();
                } else {
                    $('#form_wizard_1').find('.button-previous').show();
                }

                if (current >= total) {
                    $('#form_wizard_1').find('.button-next').hide();
                    $('#form_wizard_1').find('.button-submit').show();
                    displayConfirm();
                } else {
                    $('#form_wizard_1').find('.button-next').show();
                    $('#form_wizard_1').find('.button-submit').hide();
                }
                App.scrollTo($('.page-title'));
            }

            // default form wizard
            $('#form_wizard_1').bootstrapWizard({
                'nextSelector': '.button-next',
                'previousSelector': '.button-previous',
                onTabClick: function (tab, navigation, index, clickedIndex) {
                    return false;

                    success.hide();
                    error.hide();
                    if (form.valid() == false) {
                        return false;
                    }

                    handleTitle(tab, navigation, clickedIndex);
                },
                onNext: function (tab, navigation, index) {
                    success.hide();
                    error.hide();

                    if (form.valid() == false) {
                        return false;
                    }

                    handleTitle(tab, navigation, index);
                },
                onPrevious: function (tab, navigation, index) {
                    success.hide();
                    error.hide();

                    handleTitle(tab, navigation, index);
                },
                onTabShow: function (tab, navigation, index) {
                    var total = navigation.find('li').length;
                    var current = index + 1;
                    var $percent = (current / total) * 100;
                    $('#form_wizard_1').find('.progress-bar').css({
                        width: $percent + '%'
                    });
                }
            });

            $('#form_wizard_1').find('.button-previous').hide();
            $('#form_wizard_1 .button-submit').click(function () {
                $(form).submit();
            }).hide();

            //apply validation on select2 dropdown value change, this only needed for chosen dropdown integration.
            $('.select2', form).change(function () {
                form.validate().element($(this)); //revalidate the chosen dropdown value and show error or success message for the input
            });

            handleDatePickers();
            handleSelect2();
        }

    };

}();

var FormRepeater = function () {

    return {
        //main function to initiate the module
        init: function () {
            $('#tab2').repeater({
                show: function () {
                    $(this).slideDown();
                    $("select[name*='collector']").select2({
                        placeholder: "Select a collector",
                        width: null
                    });
                    $("select[name*='processor']").select2({
                        placeholder: "Select a processor",
                        width: null
                    });
                    $("select[name*='process_location']").select2({
                        placeholder: "Select a process location",
                        width: null
                    });
                    $("select[name*='country']").select2({
                        placeholder: "Select the country of origin",
                        width: null
                    });
                    $("select[name*='state']").select2({
                        placeholder: "Select a state",
                        width: null
                    });
                    $("select[name*='city']").select2({
                        placeholder: "Select a city",
                        width: null
                    });
                    $("select[name*='genus_id']").select2({
                        placeholder: "Select genus",
                        width: null
                    });
                    $("select[name*='species_id']").select2({
                        placeholder: "Select species",
                        width: null
                    });
                    $("select[name*='subspecies_id']").select2({
                        placeholder: "Select subspecies",
                        width: null
                    });
                    $("select[name*='lineage_id']").select2({
                        placeholder: "Select lineage",
                        width: null
                    });
                    $("input[name*='sample_date']").datepicker({
                        rtl: App.isRTL(),
                        orientation: "left",
                        autoclose: true,
                        format: "dd/mm/yyyy"
                    })
                },

                hide: function (deleteElement) {
                    $(this).slideUp(deleteElement);
                },
                repeaters: [{
                    selector: '.inner-repeater',
                    show: function () {
                        $(this).slideDown();
                        $("select[name*='genus_id']").select2({
                            placeholder: "Select genus",
                            width: null
                        });
                        $("select[name*='species_id']").select2({
                            placeholder: "Select species",
                            width: null
                        });
                        $("select[name*='subspecies_id']").select2({
                            placeholder: "Select subspecies",
                            width: null
                        });
                        $("select[name*='lineage_id']").select2({
                            placeholder: "Select ineage",
                            width: null
                        });
                    },

                    hide: function (deleteElement) {
                        $(this).slideUp(deleteElement);
                    }
                }]

            });
        }

    };

}();

jQuery(document).ready(function() {
    FormWizard.init();
    FormRepeater.init();
    $("#collector").select2({
        placeholder: "Select a collector",
        width: null
    });
    $("#processor").select2({
        placeholder: "Select a processor",
        width: null
    });
    $("#process_location").select2({
        placeholder: "Select a process location",
        width: null
    });
    $("#country").select2({
        placeholder: "Select the country of origin",
        width: null
    });
    $("#state").select2({
        placeholder: "Select a state",
        width: null
    });
    $("#city").select2({
        placeholder: "Select a city",
        width: null
    });
    $("#genus_id").select2({
        placeholder: "Select genus",
        width: null
    });
    $("#species_id").select2({
        placeholder: "Select species",
        width: null
    });
    $("#subspecies_id").select2({
        placeholder: "Select subspecies",
        width: null
    });
    $("#lineage_id").select2({
        placeholder: "Select lineage",
        width: null
    });
    $('#sample_date_sampled, #sample_date_received').datepicker({
        rtl: App.isRTL(),
        orientation: "left",
        autoclose: true,
        format: "dd/mm/yyyy"
    });
});