import verses from './synopse.json'

const witGroups = {
    'alle': new Set(['A', 'B', 'C', 'D', 'E', 'J', 'a', 'b', 'c', 'd', 'f', 'l', 'p', 'r', 'u', 'z', 'F', 'G', 'H', 'K', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X1', 'X2', 'e']),
    'keine': new Set([]),
    'vollst': new Set(['A', 'B', 'D', 'E', 'J', 'a', 'b', 'c', 'd', 'f', 'l', 'p', 'r', 'u', 'z']),
    'fragm': new Set(['C','F', 'G', 'H', 'K', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X1', 'X2', 'e'])
}; 

var order = ['A', 'B', 'D', 'E', 'J', 'a', 'b', 'c', 'd', 'f', 'l', 'p', 'r', 'u', 'z','C','F', 'G', 'H', 'K', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X1', 'X2', 'e'];




function updateTexts(){
    $('#texte').empty();
    var selectedVersNummer = $('#versn').val();
    
    for (var i=0; i < order.length; i++){
        if ($('.witselcheck[name=wit_'+order[i]+']').is(':checked')){
            var selector = $('.witselcheck[name=wit_'+order[i]+']');
            var witid = selector.attr('id');
            var content_main = verses['content'][witid][selectedVersNummer];
            var orderList = verses['order'].filter(y => y['wit'] == witid);
            var distance = $('input[name=contextSelCheck]:checked').val();
            var content_prev = '';
            var content_next = '';
            for (var d = 1; d <= distance; d++){
                console.log(d);
                var prevVersNumber = getContextVers(orderList, selectedVersNummer, - d);
                var nextVersNumber = getContextVers(orderList, selectedVersNummer, + d);
                var content_prev_raw = verses['content'][witid][prevVersNumber];
                if (typeof content_prev_raw == 'undefined'){content_prev_raw = ' – '};
                content_prev += content_prev_raw + ' / ';
                var content_next_raw = verses['content'][witid][nextVersNumber];
                if (typeof content_next_raw == 'undefined'){content_next_raw = ' – '};
                content_next += ' / ' + content_next_raw;    
            }
            
            
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
    }

    // $('.witselcheck').each(function(e){
    //     if ($(this).is(':checked')){
    //         var witid = $(this).attr('id');
    //         var content_main = verses['content'][witid][selectedVersNummer];
    //         var orderList = verses['order'].filter(y => y['wit'] == witid);
    //         var distance = $('input[name=contextSelCheck]:checked').val();
    //         var content_prev = '';
    //         var content_next = '';
    //         for (var i=1; i <= distance; i++){
    //             var prevVersNumber = getContextVers(orderList, selectedVersNummer, -i);
    //             var nextVersNumber = getContextVers(orderList, selectedVersNummer, +i);
    //             var content_prev_raw = verses['content'][witid][prevVersNumber];
    //             if (typeof content_prev_raw == 'undefined'){content_prev_raw = ' – '};
    //             content_prev += content_prev_raw + ' / ';
    //             var content_next_raw = verses['content'][witid][nextVersNumber];
    //             if (typeof content_next_raw == 'undefined'){content_next_raw = ' – '};
    //             content_next += ' / ' + content_next_raw;    
    //         }
            
            
    //         if (typeof content_main == 'undefined'){
    //             content_main = ' – '
    //         }
    //         if (typeof content_prev == 'undefined'){
    //             content_prev = ' – '
    //         }
    //         if (typeof content_next == 'undefined'){
    //             content_next = ' – '
    //         }
    //         $('#texte').append('<div class="col-md-12 col-sm-12">'+
    //                     '<div class="witlabel">'+ witid.replace('.xml', '').replace('_', ' ').substr(0,13) +'</div>'+
    //                     '<div class="verscontent">'+content_prev + ' <strong style="font-size:larger">' + content_main + '</strong> ' + content_next + '</div></div>')
    //     }
    // })
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
                            '<input class="witselcheck" type="checkbox" id="'+witfull +'" name="wit_'+witsigle+'" >'+
                            '<input type="text" value="'+ parseInt(order.indexOf(witsigle)+1) +'" class="orderSelector"></input></div>') 
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

    $('.autoSelWitItem').on('click', function(){
        var which = $(this).attr('data-val');
        $('.witselcheck').each(function(){
            var name = $(this).attr('name').substr(4);
            if (witGroups[which].has(name)){
                $(this).prop('checked', true)
            } else {
                $(this).prop('checked', false)
            }
        })
        updateTexts();
    })

    

    $('.witlabel').on('click', function(){
        console.log('click');
    })
    var orderOldValue = 0;
    $('.orderSelector').on('focus', function(){
        orderOldValue = $(this).attr('value')
    })

    $('.orderSelector').on('change', function(){
        var thisWit = $(this).prev().attr('name').substr(4);
        var orderNewValue = $(this).val();
        if (orderNewValue > 34  || orderNewValue < 1){
            alert('Insert a value between 1 and 34');
            $(this).val(orderOldValue);
        } else if (orderNewValue != orderOldValue) {
            var otherWitElement = $('.orderSelector[value='+orderNewValue+']')
            var otherWit = otherWitElement.prev().attr('name').substr(4);
            otherWitElement.attr('value', orderOldValue);
            otherWitElement.val(orderOldValue);
            $(this).attr('value', orderNewValue);
            if (orderNewValue < orderOldValue){
                order.splice(order.indexOf(otherWit),1);
                order.splice(order.indexOf(thisWit), 1);
                order.splice(parseInt(orderNewValue) - 1, 0, thisWit);
                order.splice(parseInt(orderOldValue) -1 , 0, otherWit);
            }else {
                order.splice(order.indexOf(thisWit), 1);
                order.splice(order.indexOf(otherWit),1);
                order.splice(parseInt(orderOldValue) -1 , 0, otherWit);
                order.splice(parseInt(orderNewValue) - 1, 0, thisWit);
            }
            updateTexts();
        }
    })


})