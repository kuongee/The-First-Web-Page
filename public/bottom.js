$(init);
function init() {
    $("#upload").on('click', function () {
        var len = $("#userfile")[0].files.length;
        if (len > 0) {
            var settings = {
                method: 'post',
                dataType: 'json',
                data: { 'path': $("#userfile").val() }
            };
            $.ajax('/upload.json', settings)
                .done(function (data) {
                    if (data.success) {
                        showImage(data.id);
                    }
                });
        }
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
            $('#dlList').append(('<dt>' + msg.id + divSen + ' </dt>'));

        });

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
                        return '<a>&gt;</a>';
                    case 'prev': // <
                        return '<a>&lt;</a>';
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
