function inicializarVistas(){



    $("#colores").onclick = function () {
        $("body").classList.remove(esquemasColor[contadorEsquema]);
        contadorEsquema++;
        if (contadorEsquema == 3) {
            contadorEsquema = 0;
        }
        let skin = esquemasColor[contadorEsquema];
        $("body").classList.add(skin);
        localStorage.setItem('skin', skin);
        
    };

    $("#ventana").onclick = function () {
        $("body").classList.remove(estructuras[contadorEstructura]);
        contadorEstructura++;
        if(contadorEstructura == 3){
            contadorEstructura = 0;
        }
        let estructura = estructuras[contadorEstructura];
        $("body").classList.add(estructura);
        localStorage.setItem('estructura', estructura);
    };

    (function(){
        let skin = localStorage.getItem('skin');
        if(skin){
            $("body").classList.add(skin);
        }

        let estructura = localStorage.getItem('estructura');
        if (estructura) {
            $("body").classList.add(estructura);
        }

    })();
}

