$(document).ready(function(){
    
    function type_text(texts) {
        var textIndex = parseInt(Math.random() * texts.length);
        $('#typewriter').text(texts[textIndex]).show("slide", {'direction' : 'right'}, 500);
        setInterval(function() {
            textIndex = (textIndex + 1) % texts.length;
            $('#typewriter').hide("slide", {'direction' : 'left'}, 500);
            setTimeout(function(){
                $('#typewriter').text(texts[textIndex]).show("slide", {'direction' : 'right'}, 500);
            }, 400);
        }, 4000);

    }
    $('#typewriter').hide();
    $.getJSON("/api/definitions", type_text);
});



