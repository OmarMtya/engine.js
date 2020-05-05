let $ = (x) => document.querySelector(x);
let $$ = (x) => document.querySelectorAll(x);

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
        actualizarLista();
    };

    $("#play").onclick = function(){
        if(!animando){ // Pone play
            animando = true;
            $g.Animar();
            $("#play").innerHTML = '<i class="fas fa-pause"></i>';
            $("#atributos").style.display = 'none';
            objetoSeleccionado = null;
            actualizarLista(true);
        }else{ // Pone pausa
            animando = false;
            $g.DetenerAnimacion();
            $g.Dibujar();
            $("#play").innerHTML = '<i class="fas fa-play"></i>';
            actualizarLista();
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
        actualizarLista();
    }

    $$("input, select").forEach(element => {
        if (element.type == 'select-one' || element.type == 'color') {
            element.onchange = function(){
                let obj = $g.figuras.find((x) => x.id == objetoSeleccionado.id);
                switch (this.id) {
                    case 'tipo':
                        obj.tipo = this.value.toLowerCase();
                        break;
                    case 'relleno':
                        obj.transform.relleno = this.value;
                        console.log(this.value);
                        break;
                }
                $g.Dibujar();
                actualizarLista();
            }
        }else{
            element.onkeyup = function (a) {
                let obj = $g.figuras.find((x) => x.id == objetoSeleccionado.id);
                console.log(obj);
                switch (this.id) {
                    case 'nombre':
                        obj.nombre = this.value;
                        break;
                    case 'gravedad':
                        obj.rigido.valor = parseFloat(this.value);
                        break;
                    case 'colision':
                        obj.rigido.sinColision = this.value;
                        break;
                    case 'x':
                        obj.transform.x = parseFloat(this.value);
                        break;
                    case 'y':
                        obj.transform.y = parseFloat(this.value);
                        break;
                    case 'altura':
                        obj.transform.altura = parseFloat(this.value);
                        break;
                    case 'anchura':
                        obj.transform.anchura = parseFloat(this.value);
                        break;
                    case 'imagen':
    
                        break;
                    case 'radio':
                        obj.transform.radio = parseFloat(this.value);
                        break;
                    case 'relleno':
                        obj.transform.relleno = this.value;
                        break;
                    case 'sonido':
    
                        break;
                }
                actualizarLista();
                $g.Dibujar();
            }
        }
    });

}

function actualizarLista(removerListeners = false){
    $("#jerarquia .objetos").innerHTML = "";
    $g.figuras.forEach((obj) => {
        let p = document.createElement("p");
        p.innerHTML = obj.nombre;
        p.id = obj.id;
        switch (obj.tipo) {
            case 'circulo':
                p.innerHTML += `<i style="color: ${obj.transform.relleno}" class="fas fa-circle"></i>`;
                break;
            case 'cuadrado':
                p.innerHTML += `<i style="color: ${obj.transform.relleno}" class="fas fa-square"></i>`;
                break;
            case 'imagen':
            case 'sprite':
                p.innerHTML += `<i style="color: ${obj.transform.relleno}" class="far fa-images"></i>`;
                break;
        }
        $("#jerarquia .objetos").appendChild(p);
        if(!removerListeners && !animando){ // Cuando no está animando
            p.classList.add('objeto-seleccionable');
            p.onclick = seleccionarObjeto;
        }
        if (objetoSeleccionado && obj.id == objetoSeleccionado.id) { // Mantiene el seleccionado al objeto de la lista si se actualiza
            p.classList.add('seleccionado');
        }
    });
}

function seleccionarObjeto(){
    $("#atributos").style.display = 'block';
    console.log(this);
    $$('.seleccionado').forEach((obj) => {
        obj.classList.remove("seleccionado");
    });
    this.classList.add('seleccionado');
    obj = $g.figuras.find((x)=>x.id == this.id);
    objetoSeleccionado = obj;
    $("#nombre").value = obj.nombre;
    $("#gravedad").value = obj.rigido.valor;
    $("#colision").checked = !obj.rigido.sinColision;
    $("#x").value = obj.transform.x;
    $("#y").value = obj.transform.y;
    $("#tipo").value = obj.tipo;
    $("#altura").value = obj.transform.altura;
    $("#anchura").value = obj.transform.anchura;
    $("#radio").value = obj.transform.radio;
    $("#relleno").value = obj.transform.relleno;

}

