window.onload = function () {
    let $ = (x) => document.querySelector(x);

    $g.InitCanvas($("canvas"), $("#container-canvas"));


    $("#agregarCuadro").onclick = function () {
        $g.AgregarFigura(new $g.Figura({
            tipo: "cuadrado",
            transform: new $g.Transform({
                x: 0,
                y: 0,
                anchura: 20,
                altura: 20,
                relleno: "#000000"
            }),
            rigido: new $g.Rigido()
        }));
        $g.Dibujar();
        actualizarLista();
    };

    $("#play").onclick = function(){
        if(!animando){ // Pone play
            animando = true;
            $g.Animar();
        }else{ // Pone pausa
            animando = false;
            $g.DetenerAnimacion();
            $g.Dibujar();
        }
    }

    $("#agregarCirculo").onclick = function() {
        $g.AgregarFigura(new $g.Figura({
            tipo: "circulo",
            transform: new $g.Transform({
                x: 10,
                y: 10,
                radio: 10,
                relleno: "#000000"
            }),
            rigido: new $g.Rigido()
        }));
        $g.Dibujar();
        actualizarLista();
    }

}


function actualizarLista(){
    console.log($g.figuras);
}

