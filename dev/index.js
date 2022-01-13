import verses from './synopse.json'

const vollst = ['A', 'B', 'D', 'E', 'J', 'a', 'b', 'c', 'd', 'f', 'l', 'p', 'r', 'u', 'z'];

function updateTexts(){
    $('#texte').empty();
    var selectedVersNummer = $('#versn').val();
    $('.witselcheck').each(function(e){
        if ($(this).is(':checked')){
            var witid = $(this).attr('id');
            var content_main = verses['content'][witid][selectedVersNummer];
            var orderList = verses['order'].filter(y => y['wit'] == witid);
            var distance = $('input[name=contextSelCheck]:checked').val();
            var content_prev = '';
            var content_next = '';
            for (var i=1; i <= distance; i++){
                var prevVersNumber = getContextVers(orderList, selectedVersNummer, -i);
                var nextVersNumber = getContextVers(orderList, selectedVersNummer, +i);
                var content_prev_raw = verses['content'][witid][prevVersNumber];
                console.log(content_prev_raw);
                if (typeof content_prev_raw == 'undefined'){content_prev_raw = ' – '};
                content_prev += content_prev_raw + ' / ';
                var content_next_raw = verses['content'][witid][nextVersNumber];
                if (typeof content_next_raw == 'undefined'){content_next_raw = ' – '};
                content_next += ' / ' + content_next_raw;    
            }
            
            // var content_prev = verses['content'][witid][54];
            
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
                        '<div class="verscontent">'+content_prev + ' <strong style="font-size:larger">' + content_main + '</strong> ' + content_next + '</div></div>')
        }
    })
}

function getContextVers(orderList, current, distance){
    // console.log(orderList[0]['order'], current, distance);
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
  
    // Create the list of witnesses
    for (var i = 0; i < verses['order'].length; i++){
        var witfull = verses['order'][i]['wit'];
        var witclean = witfull.replace('_', ' ').replace('.xml', '');
        var witsigle = witclean.substr(0, witclean.indexOf(' '))
        $('#witsel').append('<div class="col-md-3 col-sm-6"><label class="witsellabel">'+ witclean +'</label>'+
                            '<input class="witselcheck" type="checkbox" id="'+witfull +'" name="wit_'+witsigle+'" ></div>') 
    }
    $('#witsel').collapse();
    $('input[name=contextSelCheck][value="1"]').prop("checked", true);


    // Enter to update
    $(document).keydown(function (e) {
        if (e.which == 13) {
            if ($('#versn').is(":focus")){
                e.preventDefault();
                updateTexts();
            }
        }
    });
    
    $('#updateVers').on('click', function(){updateTexts()});
    $('.witselcheck').change(function(){updateTexts()});
    
    $('#prev').on('click',function () {
        $('#versn').val(parseInt($('#versn').val()) - 1);
        updateTexts();
      })
    $('#next').on('click',function () {
        $('#versn').val(parseInt($('#versn').val()) + 1);
        updateTexts();
      })

    
    $('input[name=contextSelCheck]').change(function(){
        updateTexts();
    })

    $('#autoSelWitVoll').on('click', function(){
        
        for (var i = 0; i < vollst.length; i++){
            $('.witselcheck[name=wit_'+vollst[i]+']').prop('checked', true);
        }
        
    })

    

    $('.witlabel').on('click', function(){
        console.log('click');
    })


})