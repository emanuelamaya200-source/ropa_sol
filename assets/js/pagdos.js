const productos = [
  [
    "Campera otoño 1##Campera ligera otoño, cómoda y cálida##./assets/img/ot/ot1.png",
    "Campera otoño 2##Chaqueta casual de otoño##./assets/img/ot/ot2.png",
    "Campera otoño 3##Abrigo corto elegante##./assets/img/ot/ot3.png",
    "Campera otoño 4##Campera con capucha##./assets/img/ot/ot4.png"
  ],
  [
    "Campera blanca invierno##Campera blanca térmica##./assets/img/in/in1.png",
    "Campera azul invierno##Campera azul abrigo completo##./assets/img/in/in2.png",
    "Campera gris invierno##Campera gris con capucha##./assets/img/in/in3.png",
    "Campera negra invierno##Campera negra elegante##./assets/img/in/in4.png"
  ],
  [
    "Conjunto primavera 1##Conjunto ligero primavera##./assets/img/pr/pr1.png",
    "Conjunto primavera 2##Camisa estampada##./assets/img/pr/pr2.png",
    "Conjunto primavera 3##Pantalón casual##./assets/img/pr/pr3.png",
    "Conjunto primavera 4##Vestido primavera##./assets/img/pr/pr4.png"
  ],
  [
    "Ropa verano 1##Remera fresca verano##./assets/img/ve/ve1.png",
    "Ropa verano 2##Short cómodo##./assets/img/ve/ve2.png",
    "Ropa verano 3##Top estampado##./assets/img/ve/ve3.png",
    "Ropa verano 4##Vestido veraniego##./assets/img/ve/ve4.png"
  ]
];

const estaciones = document.getElementsByClassName("estacion");

Array.from(estaciones).forEach(element => {
  element.addEventListener('click', function() {
    AñadirColumnas(element);
  });
});

function AñadirColumnas(estacionelegida) {
  let tabla = document.getElementById("tabla");
  tabla.innerHTML = "";

  switch (estacionelegida.id) {
    case "item1":
      for (let columna = 0; columna < productos[0].length; columna++) {
        let atributos = productos[0][columna].split("##");
        let string = "";
        string += "<p>" + atributos[0] + "</p>";
        string += "<p>" + atributos[1] + "</p>";
        string += "<img src='" + atributos[2] + "' alt='" + atributos[0] + "'>";
        let parrafo = document.createElement("div");
        parrafo.innerHTML = string;
        tabla.appendChild(parrafo);
      }
      break;

    case "item2":
      for (let columna = 0; columna < productos[1].length; columna++) {
        let atributos = productos[1][columna].split("##");
        let string = "";
        string += "<p>" + atributos[0] + "</p>";
        string += "<p>" + atributos[1] + "</p>";
        string += "<img src='" + atributos[2] + "' alt='" + atributos[0] + "'>";
        let parrafo = document.createElement("div");
        parrafo.innerHTML = string;
        tabla.appendChild(parrafo);
      }
      break;

    case "item3":
      for (let columna = 0; columna < productos[2].length; columna++) {
        let atributos = productos[2][columna].split("##");
        let string = "";
        string += "<p>" + atributos[0] + "</p>";
        string += "<p>" + atributos[1] + "</p>";
        string += "<img src='" + atributos[2] + "' alt='" + atributos[0] + "'>";
        let parrafo = document.createElement("div");
        parrafo.innerHTML = string;
        tabla.appendChild(parrafo);
      }
      break;

    case "item4":
      for (let columna = 0; columna < productos[3].length; columna++) {
        let atributos = productos[3][columna].split("##");
        let string = "";
        string += "<p>" + atributos[0] + "</p>";
        string += "<p>" + atributos[1] + "</p>";
        string += "<img src='" + atributos[2] + "' alt='" + atributos[0] + "'>";
        let parrafo = document.createElement("div");
        parrafo.innerHTML = string;
        tabla.appendChild(parrafo);
      }
      break;

    default:
      break;
  }
}