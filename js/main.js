let $ = (x) => document.querySelector(x);

window.onload = function () {

    $g.InitCanvas($("canvas"), $("#container-canvas"));


    $("#agregarCuadro").onclick = function () {
        let figura = new $g.Figura({
            tipo: "cuadrado",
            transform: new $g.Transform({
                x: 0,
                y: 0,
                anchura: 20,
                altura: 20,
                relleno: "#000000"
            }),
            rigido: new $g.Rigido()
        });
        $g.AgregarFigura(figura);
        $g.Dibujar();
        actualizarLista(figura);
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
        let figura = new $g.Figura({
            tipo: "circulo",
            transform: new $g.Transform({
                x: 10,
                y: 10,
                radio: 10,
                relleno: "#000000"
            }),
            rigido: new $g.Rigido()
        });
        $g.AgregarFigura(figura);
        $g.Dibujar();
        actualizarLista(figura);
    }

}

function actualizarLista(obj){
    console.log($g.figuras);
    let p = document.createElement("p");
    p.innerHTML = obj.nombre;
    switch (obj.tipo) {
        case 'circulo':
            p.innerHTML += '<i class="fas fa-circle"></i>';
            break;
        case 'cuadrado':
            p.innerHTML += '<i class="fas fa-square"></i>';
            break;
        case 'imagen':
        case 'sprite':
            p.innerHTML += '<i class="far fa-images"></i>';
            break;
    }
    // p.classList.add("objeto");
    $("#jerarquia").appendChild(p);
}

