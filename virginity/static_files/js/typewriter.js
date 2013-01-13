var texts = [
"Not having had intercourse",
"There is technical virginity, spiritual virginity, and making love",
"Never having had sexual intercourse or oral sex",
"Never ejaculating inside a woman’s vagina",
"In the Virgin Mary sense",
"A personal decision ",
"A state of mind",
"Not using a dildo if you are a lesbian",
"Penetrative sex is the line",
"I don’t define it and I don’t think it exists",
"Neither of us removing our pants",
"Untouched",
"Purely a social construct",
"Never having had sexual intercourse with a woman",
"A state of never having had sex",
"Innocence from any sort of sexual knowledge",
"A dying concept that hopefully will one day be obsolete",
"Never connecting with someone romantically",
"Having sex with both men and women",
"Never having had vaginal sex yet",
"The power that society has over women and their bodies",
"It’s not real! No one is walking around with mine in their pocket",
"Being pure in body",
"Never having had penetrative sex",
"Something we all have in common until one by one we all lose it",
"The essence of purity, naivety, and lack of intimate experience"];
$(document).ready(function(){
    function type_text() {
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
    type_text();
});



