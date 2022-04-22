// luodaan pari muuttujaa teatterien ID:lle ja leffoille
var teatteriId = "";
var leffat = "";

// luodaan funktio, jossa haetaan finnkinon teatterialueiden xml-tiedosto
function teatteriHaku() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.overrideMimeType('application/xml');
    xmlhttp.open('GET', 'http://www.finnkino.fi/xml/TheatreAreas/', true);
    xmlhttp.send();

    xmlhttp.onreadystatechange = function() {

        // luodaan muuttuja teattereille
        var teatterit= "";
        // jos kaikki tiedot saadaan haettua ja status on ok
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        
        // luodaan muuttuja tuodulle tiedolle
        var xmlDoc = xmlhttp.responseXML;
        // haetaan teatterin nimi
        var teatteriNimi = xmlDoc.getElementsByTagName('Name');
        // haetaan teatterin ID
        var teatteriId = xmlDoc.getElementsByTagName('ID');

        // haetaan teatteri-vaihtoehdot nimen ja ID:n avulla
        for (i = 0; i < teatteriId.length; i++) {
            teatterit += '<option id="' + teatteriId[i].childNodes[0].nodeValue + '" ' +
                'value="' + teatteriNimi[i].childNodes[0].nodeValue + '">' +
                teatteriNimi[i].childNodes[0].nodeValue + '</option>';
            }
        }
        // lisätään teatterivaihtoehdot html tiedostossa luotuun pudotusvalikkoon
        document.getElementById('teatterit').innerHTML = teatterit;
    }
}
// lisätään teatterivalinta-muuttuja
var teatteriValinta = document.getElementById('teatterit');
// lisätään eventlistener haetiedot functiolle, kun leffateatterivalinta vaihtuu, functio hakee tiedot uudestaan valitulle teatterille
teatteriValinta.addEventListener('change', haeTiedot);

function haeTiedot() {
    // luodaan teatteriId, jonka avulla funktio osaa hakea oikean teatterin tiedot, kun teatteri valitaan valikosta
    teatteriId = teatteriValinta.options[teatteriValinta.selectedIndex].id;
    // haetaan XML-tiedosto finnkinon elokuvista
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.overrideMimeType('application/xml');
    xmlhttp.open('GET', 'https://www.finnkino.fi/xml/Events/?listType=NowInTheaters&area=' + teatteriId, true);
    xmlhttp.send();

    xmlhttp.onreadystatechange = function() {

        // luodaan muuttuja elokuvien nimille
        var nimet= "";

        // // jos kaikki tiedot saadaan haettua ja status on ok
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
        
        // tehdään muuttuja saaduista xml-tiedoston tiedoista
        var xmlDoc = xmlhttp.responseXML;
        // tehdään muuttuja joka hakee tapahtumat xml-tiedostosta
        leffat = xmlDoc.getElementsByTagName('Event');

        // haetaan elokuvien nimet, keskikokoiset kuvat sekä pituudet xml-tiedostosta
        for (i = 0; i < leffat.length; i++) {
            var leffaLista = leffat[i].getElementsByTagName('Title');
            var kuvat = leffat[i].getElementsByTagName('EventMediumImagePortrait');
            var pituus = leffat[i].getElementsByTagName('LengthInMinutes');

           // jos elokuvalle ei löydy valokuvaa, tuodaan niille kuva missä maininta "kuvaa ei löytynyt"
           // luodaan elokuville oma div ja class. Tuodaan elokuvan nimi sekä kesto
            if (kuvat.length < 1 || kuvat[0].textContent.length < 1) {
                nimet += '<div id="' + '"class="leffat"' + '">' + '<img src="eikuvaa.gif"/>' 
                + '<br>' + leffaLista[0].textContent + '<br>'
                + 'Kesto: ' + pituus[0].textContent + ' minuuttia' + '</div>';

            // jos elokuvalle löytyy valokuva, luodaan div ja class sekä tuodaan valokuva, elokuvan nimi sekä kesto
            } else {
                nimet += '<div id="' + '"class="leffat"' + '">' + '<img src="' 
                + kuvat[0].textContent + '"/>' + '<br>' + leffaLista[0].textContent + '<br>'
                + 'Kesto: ' + pituus[0].textContent + ' minuuttia' + '</div>';
            }
        }
        }
        // lisätään elokuvien tiedot teatterivalinnoille
        document.getElementById('leffat').innerHTML = nimet;
    }
}
teatteriHaku();