let $ = (x) => document.querySelector(x);
let $$ = (x) => document.querySelectorAll(x);

window.onload = function () {

    $g.InitCanvas($("canvas"), $("#container-canvas"));


    $("#agregarCuadro").onclick = function () {
        let figura = new $g.Figura({
            tipo: "cuadrado",
            transform: new $g.Transform({
                x: 100,
                y: 100,
                anchura: 20,
                altura: 20,
                relleno: "#000000"
            })
        });
        $g.AgregarFigura(figura);
        $g.Dibujar();
        actualizarLista();
    };

    $("#agregarCirculo").onclick = function () {
        let figura = new $g.Figura({
            tipo: "circulo",
            transform: new $g.Transform({
                x: 100,
                y: 100,
                radio: 10,
                relleno: "#000000"
            })
        });
        $g.AgregarFigura(figura);
        $g.Dibujar();
        actualizarLista();
    }

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

    

    $$("input, select").forEach(element => {

        switch (element.type) {
            case 'select-one':
            case 'color':
                element.onchange = function () {
                    let obj = $g.figuras.find((x) => x.id == objetoSeleccionado.id);
                    switch (this.id) {
                        case 'tipo':
                            obj.tipo = this.value.toLowerCase();
                            if (obj.tipo == 'circulo') {
                                esCirculo();
                            } else {
                                esCuadro();
                            }
                            break;
                        case 'relleno':
                            obj.transform.relleno = this.value;
                            break;
                        case 'tipo_sonido':
                            obj.transform.sonido.activacion = this.value;
                            break;
                    }
                    $g.Dibujar();
                    actualizarLista();
                }
                break;
            case 'text':
            case 'number':
                element.onkeyup = function (a) {
                    let obj = $g.figuras.find((x) => x.id == objetoSeleccionado.id);
                    switch (this.id) {
                        case 'nombre':
                            obj.nombre = this.value;
                            break;
                        case 'gravedad':
                            obj.rigido.valor = parseFloat(this.value);
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
                        case 'radio':
                            obj.transform.radio = parseFloat(this.value);
                            break;
                        case 'relleno':
                            obj.transform.relleno = this.value;
                            break;
                        case 'rows_sprite':
                        case 'cols_sprite':
                        case 'altura_sprite':
                        case 'anchura_sprite':
                        case 'velocidad_sprite': // Es importante agregar todos de golpe, por si se selecciona y deselecciona el input de Sprite, ya que no tiene valores default
                            obj.transform.imagen.sprite.row = parseInt($("#rows_sprite").value) - 1;
                            obj.transform.imagen.sprite.cols = parseInt($("#cols_sprite").value);
                            obj.transform.imagen.sprite.altura = parseFloat($("#altura_sprite").value);
                            obj.transform.imagen.sprite.anchura = parseFloat($("#anchura_sprite").value);
                            obj.transform.imagen.sprite.velocidad = parseFloat($("#velocidad_sprite").value);
                            break;
                        default:
                            // console.log("No definido");
                    }
                    actualizarLista();
                    $g.Dibujar();
                }
                break;
            case 'checkbox':
                element.onchange = function () {
                    switch (element.id) {
                        case 'rigido_checkbox':
                            activarElemento($("#rigido-input"), this.checked);
                            if (this.checked) {
                                objetoSeleccionado.rigido = new $g.Rigido();
                            } else {
                                objetoSeleccionado.rigido = null;
                            }
                            break;
                        case 'imagen_checkbox':
                            activarElemento($("#imagen-input"), this.checked);
                            if (this.checked) {
                                objetoSeleccionado.transform.imagen = new $g.Imagen(null);
                            } else {
                                objetoSeleccionado.transform.imagen = null;
                            }
                            break;
                        case 'sprite_checkbox':
                            activarElemento($("#sprite-input"), this.checked);
                            if(this.checked){
                                objetoSeleccionado.transform.imagen.sprite = new $g.Sprite(
                                    $("#rows_sprite").value,
                                    $("#cols_sprite").value,
                                    $("#altura_sprite").value,
                                    $("#anchura_sprite").value,
                                    $("#velocidad_sprite").value
                                );
                            }else{
                                objetoSeleccionado.transform.imagen.sprite = null;
                            }
                            break;
                        case 'sonido_checkbox':
                            activarElemento($("#sonido-input"), this.checked);
                            if(this.checked){
                                objetoSeleccionado.transform.sonido = new $g.Sonido({
                                    src: null,
                                    activacion: 'colision'
                                });
                            }else{
                                objetoSeleccionado.transform.sonido = null;
                            }
                            break;
                        //! FIXME: No está entrando si seleccionas de nuevo, es raro. Pruebalo, fecha: 1 AM
                        case 'colision':
                            objetoSeleccionado.rigido.sinColision = this.checked;
                            break;
                    }
                    // Aquí debería de poner el Dibujar(), pero como son métodos que no hacen un cambio en especifico graficamente, no lo hago
                }
                break;
            case 'file':
                element.onchange = function (evento) {
                    switch (element.id) {
                        case 'imagen':
                            objetoSeleccionado.tipo = 'imagen';

                            let selectedFile = evento.target.files[0];
                            let reader = new FileReader();
                            reader.onload = function (event) {
                                $("#preview").src = event.target.result;
                            };
                            reader.readAsDataURL(selectedFile);

                            let img = new Image();
                            img.src = URL.createObjectURL(this.files[0]);
                            objetoSeleccionado.transform.imagen = new $g.Imagen(
                                img
                            );
                            $g.Dibujar();
                            break;
                        case 'sonido':
                            let audio = new Audio();
                            audio.src = URL.createObjectURL(this.files[0]);
                            objetoSeleccionado.transform.sonido.src = audio;
                            objetoSeleccionado.transform.sonido.src.title = this.files[0].name;
                            $("#nombre_audio").innerHTML = this.files[0].name;
                            break;
                    }
                }
        }
    });

}

/**
 * Actualiza la lista de los elementos en el canvas
 * @param {boolean} removerListeners - Remueve los clicks listener del elemento
 */
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
                p.innerHTML += `<i class="far fa-images"></i>`;
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
    $$('.seleccionado').forEach((obj) => { // Selecciona a todos los de la lista de jerarquía y les remueve el seleccionado
        obj.classList.remove("seleccionado");
    });
    this.classList.add('seleccionado'); // Agrega la clase seleccionado al div que se hizo click

    // Encuentro la figura que se está seleccionando
    obj = $g.figuras.find((x)=>x.id == this.id);
    objetoSeleccionado = obj;

    // Agrega las funciones por default para las figuras
    if (objetoSeleccionado.tipo == 'circulo') {
        esCirculo();
    } else if (obj.tipo == 'cuadrado') {
        esCuadro();
    } else {
        esImagen();
    }


    // Asigna los valores al DOM dependiendo de los atributos del objeto
    $("#nombre").value = obj.nombre;
    if(obj.rigido){
        $("#gravedad").value = obj.rigido.valor;
        $("#colision").checked = !obj.rigido.sinColision;
    }
    $("#x").value = obj.transform.x;
    $("#y").value = obj.transform.y;
    $("#tipo").value = obj.tipo;
    $("#altura").value = obj.transform.altura;
    $("#anchura").value = obj.transform.anchura;
    $("#radio").value = obj.transform.radio;
    $("#relleno").value = obj.transform.relleno;
    if(obj.rigido){
        $("#rigido_checkbox").checked = true;
        $("#rigido_checkbox").onchange();
    }
    if(obj.transform.imagen && obj.transform.imagen.src){
        $("#imagen_checkbox").checked = true;
        $("#preview").src = obj.transform.imagen.src.src;
        // $("#imagen_checkbox").onchange(); - Se bugea si agrego esto
    }
    if (obj.transform.imagen && obj.transform.imagen.sprite) {
        $("#sprite_checkbox").checked = true;
        $("#sprite-input").style.display = 'block';
    }
    if (obj.transform.sonido) {
        $("#sonido_checkbox").checked = true;
        $("#sonido-input").style.display = 'block';
        if (obj.transform.sonido.src){
            $("#nombre_audio").innerHTML = obj.transform.sonido.src.title;
        }
        $("#tipo_sonido").value = obj.transform.sonido.activacion;
    }
}

/**
 * Función que elimina los campos que no son necesarios para los circulos
 */
function esCirculo(activar = true){
    figuraDefault();
    if(activar){ // Si, es circulo
        $("#radio-input").style.display = 'block';
        $("#altura-input").style.display = 'none';
        $("#anchura-input").style.display = 'none';
        $("#imagen_titulo").style.display = 'none';
        esCuadro(false);
    }else{
        $("#altura-input").style.display = 'block';
        $("#anchura-input").style.display = 'block';
        $("#radio-input").style.display = 'none';
        $("#imagen_titulo").style.display = 'flex';
    }
}

/**
 * Función que elimina los campos que no son necesarios para los cuadros
 */
function esCuadro(activar = true){
    figuraDefault();
    if(activar){ // Si, es cuadrado
        $("#imagen-input").style.display = 'block';
        $("#altura-input").style.display = 'block';
        $("#anchura-input").style.display = 'block';
        esCirculo(false);
    }else{
        $("#imagen-input").style.display = 'none';
        $("#altura-input").style.display = 'none';
        $("#anchura-input").style.display = 'none';
    }
}

/**
 * Función que elimina los campos que no son necesarios para las imagenes
 */
function esImagen(){
    figuraDefault();
    esCuadro();
    $("#imagen-input").style.display = 'block';
}

/**
 * Función que ejecuta una figura en default
 */
function figuraDefault(){
    $("#rigido-input").style.display = 'none';
    $("#sonido-input").style.display = 'none';
    $("#imagen-input").style.display = 'none';
    $("#sprite-input").style.display = 'none';
    // Elimino todos los checkbox, los voy a cambiar siempre y cuando la figura tenga el valor en true
    $("#rigido_checkbox").checked = false;
    $("#imagen_checkbox").checked = false;
    $("#sonido_checkbox").checked = false;
    $("#sprite_checkbox").checked = false;

    $("#preview").src = "";
    $("#imagen").value = "";
    $("#sonido").value = "";
    $("#nombre_audio").innerHTML = "";
    $("#tipo_sonido").value = "colision";
}

function activarElemento(elemento, mostrar){
    if(mostrar){
        elemento.style.display = 'block';
    }else{
        elemento.style.display = 'none';
    }
}