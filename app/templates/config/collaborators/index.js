updateMenu('#collaborators');

// Set the "bootstrap" theme as the default theme for all Select2
// widgets.
//
// @see https://github.com/select2/select2/issues/2927
$.fn.select2.defaults.set("theme", "bootstrap");

var initTable = function () {

    $SCRIPT_ROOT = {{ request.script_root|tojson|safe }};

    var table = $('#collaborators_tbl');

    var oTable = table.dataTable({

        // Internationalisation. For more info refer to http://datatables.net/manual/i18n
        "language": {
            "aria": {
                "sortAscending": ": activate to sort column ascending",
                "sortDescending": ": activate to sort column descending"
            },
            "emptyTable": "No data available in table",
            "info": "Showing _START_ to _END_ of _TOTAL_ entries",
            "infoEmpty": "No entries found",
            "infoFiltered": "(filtered1 from _MAX_ total entries)",
            "lengthMenu": "_MENU_ entries",
            "search": "Search:",
            "zeroRecords": "No matching records found"
        },

        buttons: [
            { extend: 'print', className: 'btn dark btn-outline' },
            { extend: 'copy', className: 'btn red btn-outline' },
            { extend: 'pdf', className: 'btn green btn-outline' },
            { extend: 'excel', className: 'btn yellow btn-outline ' },
            { extend: 'csv', className: 'btn purple btn-outline ' },
            { extend: 'colvis', className: 'btn dark btn-outline', text: 'Columns'}
        ],

        // setup responsive extension: http://datatables.net/extensions/responsive/
        responsive: true,

        "order": [
            [2, 'desc']
        ],

        "lengthMenu": [
            [5, 10, 15, 20, -1],
            [5, 10, 15, 20, "All"] // change per page values here
        ],
        // set the initial value
        "pageLength": 15,

        "ajax": $SCRIPT_ROOT+'/config/collaborators/list',

        "columns": [
            {"data": "name", "width": "20%"},
            {"data": "email", "width": "10%"},
            {"data": "phone", "width": "10%"},
            {"data": "role", "width": "20%",
                render: function(data, type, row, meta) {
                    var roles = '';
                    if (data.indexOf('S') >= 0) {
                        roles += 'Sender, '
                    }
                    if (data.indexOf('C') >= 0) {
                        roles += 'Collector, '
                    }
                    if (data.indexOf('P') >= 0) {
                        roles += 'Processor, '
                    }
                    if (data.indexOf('R') >= 0) {
                        roles += 'Receiver, '
                    }
                    return roles.replace(/,\s*$/, "");
                }
            },
            {"data": "active", "width": "10%",
                render: function(data, type, row, meta){
                    if (data) {
                        return '<a class="btn red btn-outline sbold" data-collaborator-id="'+row['id']+'" data-toggle="modal" href="#deactivate"> Deactivate </a>';
                    };
                    return '<a class="btn green btn-outline sbold" data-collaborator-id="'+row['id']+'" data-toggle="modal" href="#reactivate"> Reactivate </a>';
                }
            }
        ]
    });

    // handle datatable custom tools
    $('#sample_3_tools > li > a.tool-action').on('click', function() {
        var action = $(this).attr('data-action');
        oTable.DataTable().button(action).trigger();
    });

    function approveAccountRequest(accid,approve){

        $.ajax({
            //url: $SCRIPT_ROOT+'/config/accreq/approveAccount/'+accreqid,
            url: '{{url_for('config.approveAccount')}}',
            type: 'POST',
            dataType: "json",
            contentType:"application/json",
            data: JSON.stringify({"accid":accid,"approve": approve}),
        })
        .done(function(result) {
           //if(result.data===1){
                window.location.href=$SCRIPT_ROOT+'/config/accreq';
           //}
        });

    };

    $('#approveModel').on('shown.bs.modal', function (event) {
      $btn = $(event.relatedTarget);
      $('#acceptBtn').data('accreqid', $btn.data('accreqid'));
    });

    $('#rejectModel').on('shown.bs.modal', function (event) {
      $btn = $(event.relatedTarget);
      $('#rejectBtn').data('accreqid', $btn.data('accreqid'));
    });

    $('#acceptBtn').on('click', function(event) {
        event.preventDefault();
        approveAccountRequest($(this).data('accreqid'),true);
    });

    $('#rejectBtn').on('click', function(event) {
        event.preventDefault();
        approveAccountRequest($(this).data('accreqid'),false);
    });

}

$(".select2, .select2-multiple").select2({
    placeholder: "Select the collaborator role(s)",
    allowCleart: true,
    width: null,
    placeholder: "Select role(s)"
});

// $("#roles").multiSelect();
// $("#roles").attr("name", "roles[]");

initTable();
