import verses from './synopse.json'

function updateTexts(){
    $('#texte').empty();
    var selectedVersNummer = $('#versn').val();
    $('.witselcheck').each(function(e){
        if ($(this).is(':checked')){
            var witid = $(this).attr('id');
            var content_main = verses['content'][witid][selectedVersNummer];
            var orderList = verses['order'].filter(y => y['wit'] == witid);
            var prevVersNumber = getContextVers(orderList, selectedVersNummer, -1);
            var nextVersNumber = getContextVers(orderList, selectedVersNummer, +1);
            var content_prev = verses['content'][witid][prevVersNumber];
            var content_next = verses['content'][witid][nextVersNumber];
            // var content_prev = verses['content'][witid][54];
            console.log(content_prev, content_next);
            // var prevVersNummer = verses['order'][witid];
            // var prevContent = verses['content'][witid][prevVersNummer];
            if (typeof content_main == 'undefined'){
                content_main = ' – '
            }
            if (typeof content_prev == 'undefined'){
                content_prev = ' – '
            }
            if (typeof content_next == 'undefined'){
                content_next = ' – '
            }
            $('#texte').append('<div class="col-md-12 col-sm-12">'+
                        '<div class="witlabel">'+ witid.replace('.xml', '').replace('_', ' ').substr(0,13) +'</div>'+
                        '<div class="verscontent">'+content_prev + ' / <strong style="font-size:larger">' + content_main + '</strong> /' + content_next + '</div></div>')
        }
    })
}

function getContextVers(orderList, current, distance){
    console.log(orderList[0]['order'], current, distance);
    // var currIntPos = orderList[0]['order'].filter(e => );
    var contextVersGenNum = -1
    $.each(orderList[0]['order'], function(key, value) { 
        // console.log(key)
        if (value === current){
            var currIntPos = key;
            var contextVersIntNum = parseInt(currIntPos) + distance;
            contextVersGenNum = orderList[0]['order'][contextVersIntNum];
        }
      });
    return contextVersGenNum
}

$(document).ready(function(){

    

    
    for (var i = 0; i < verses['order'].length; i++){
        var witfull = verses['order'][i]['wit'];
        var witclean = witfull.replace('_', ' ').replace('.xml', '');
        var witsigle = witclean.substr(0, witclean.indexOf(' '))
        $('#witsel').append('<div class="col-md-3 col-sm-6"><label class="witsellabel">'+ witclean +'</label>'+
                            '<input class="witselcheck" type="checkbox" id="'+witfull +'" name="wit_'+witsigle+'" ></div>') 
    }

    $('#witsel').collapse();

    $(document).keydown(function (e) {
        if (e.which == 13) {
            if ($('#versn').is(":focus")){
                e.preventDefault();
                updateTexts();
            }
        }
    });
    
    $('#updateVers').on('click', function(){updateTexts()});
    
    $('#prev').on('click',function () {
        $('#versn').val(parseInt($('#versn').val()) - 1);
        updateTexts();
      })
    $('#next').on('click',function () {
        $('#versn').val(parseInt($('#versn').val()) + 1);
        updateTexts();
      })

})