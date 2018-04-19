$(init);
function init() {
    $('#imgform').submit(function () {
        var len = $("#userfile").val().length;
        if (len > 0) {
            $(this).ajaxSubmit({
                dataType: 'json',
                error: function (xhr) {
                    //status('Error: ' + xhr.status);
                },
                success: function (response) {
                    console.log(response)
                    if(response.success) {
                        showImage(response.id);
                    }
                }
            });
        }
        return false;
    });

    $("#showList").on('click', function () {
        $('#imgList').toggle();
        list(1);
    });
}

function list(pageNo) {
    $.ajax({
        url: '/list.json',
        dataType: 'json',
        data: {
            pageNo: pageNo
        }
    }).done(function (res) {
        $("#dlList").html('');
        $.each(res.list, function (idx, msg) {
            var dir = "uploads/" + msg.path;
            // var divSen = "<div class=\"thumbnail circle\" style=\"background-image:url(\'" + dir + "\') </div>";
            var divSen = "<div class=\"thumbnail circle\" style=\"background-image:url('" + dir + "')\"> </div>";
            $('#dlList').append(('<dt class="dtdt">' + msg.id + divSen + ' </dt> <dd> </dd>'));
        });

        var deleteid = -1;
        $(".dtdt").on('click', function () {
            if (deleteid == -1) {
                deleteid = $(this).text();
            }

            if (deleteid != $(this).text()) {
                deleteid = $(this).text();
            }

            //$(this).next().text("Delete " + deleteid + "?");
            var ret = confirm("Will you delete " + deleteid + "?");
            if (ret == true) {
                deleteItem(deleteid, pageNo);
            }

        });

        // pagination
        // http://www.xarg.org/2011/09/jquery-pagination-revised/
        $("#paging").paging(res.count, {
            format: '[ < ncn > ]',
            perpage: res.perpage,
            page: pageNo,
            onSelect: function (page) {
                if (page != pageNo) {
                    list(page);
                }
                return event.preventDefault();
            },
            onFormat: function (type) {
                switch (type) {
                    case 'block': // n and c
                        if (!this.active)
                            return '<span>' + this.value + '</span>';
                        else if (this.value != this.page)
                            return '<a href="#' + this.value + '">' + this.value + '</a>';
                        return '<span class="current">' + this.value + '</span>';
                    case 'next': // >
                        return '<a> &gt; </a>';
                    case 'prev': // <
                        return '<a> &lt; </a>';
                    case 'first': // [
                        return '<a>first</a>';
                    case 'last': // ]
                        return '<a>last</a>';
                }
            }
        });
    });
}


function showImage(id) {
    $("#imgPanel").show();
    $.ajax({
        url: '/show.json',
        dataType: 'json',
        cache: false,
        data: {
            id: id
        }
    }).done(function (res) {
        var result = res[0];
        var url = "uploads/" + result.path;
        $('#img').attr("src", url);
        $('#imgPanel').fadeOut(3000);
        list(1);
    });
}

function deleteItem(id, pageNo) {
    $.ajax({
        url: '/delete.json',
        dataType: 'json',
        cache: false,
        data: {
            id: id
        },
    }).done(function (res) {
        alert("Success to delete");
        list(1);
    });
}
