$(init);
function init() {
    $("#upload").on('click', function() {
        var settings = {
            method: 'post',
            dataType: 'json',
            data: {'path': $("#userfile").val()}
        };
        $.ajax('/upload.json', settings)
            .done(function (data) {
                if(data.success) {
                    showImage(data.id);
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
    }).done(function (res){
        var result = res[0];
        var url = "uploads/" + result.path;
        $('#img').attr("src", url);
        $('#thumbDiv').css('backgroundImage', 'url(' + url + ')');
    });
}
