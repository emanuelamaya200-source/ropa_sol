/* ---- productos (rutas normalizadas desde la raíz del proyecto) ---- */
const productos = [
  [
    "Remera Blanca##Remera blanca de algodón##./assets/img/remeras/rem2.jpg",
    "Remeras Únicas##Rosa, azul y negro##./assets/img/remeras/con1.jpg",
    "Remeras Únicas##Logo, café, tienda, corazón##./assets/img/remeras/con2.jpg",
    "Remeras Únicas##Cachorro, corazón, blanca, negra##./assets/img/remeras/con3.jpg"
  ],
  [
    "Jean Azul##Jean azul clásico cómodo##./assets/img/pantalon/pantalon1.jpg",
    "Jean Azul Claro##Jean claro corte recto##./assets/img/pantalon/pantalon2.jpg"
  ],
  [
    "Short con Tiras##Short deportivo con tiras##./assets/img/pantalon/pantalon3.jpg##Precio",
    "Short Negro##Short negro estilo básico##./assets/img/short/short1/1.jpg°°./assets/img/short/short1/2.jpg",
    "Short Común Azul##Short azul casual verano##./assets/img/short/short2/1.jpg°°./assets/img/short/short2/2.jpg°°./assets/img/short/short2/3.jpg",
    "Short Corte Liso 4##Short liso color claro##./assets/img/short/short3/1.jpg°°./assets/img/short/short3/2.jpg",
    "Short con Tiras Claro 4##Short claro con tiras##./assets/img/short/short6/1.jpg°°./assets/img/short/short6/2.jpg",
    "Short Claro 4##Short claro estilo simple##./assets/img/short/short6/1.jpg°°./assets/img/short/short6/2.jpg"
  ],
  [
    "Ropa Niño 1##Conjunto infantil de verano##./assets/img/ropa_de_niños/18a5ccbb-0261-4253-bb4c-393eb8de919b.jpg",
    "Ropa Niño 2##Remera infantil colorida##./assets/img/ropa_de_niños/rem1.jpg"
  ]
];

/* DOM refs */
const estaciones = document.getElementsByClassName("estacion");
const tabla = document.getElementById("catalogo");
const detalle = document.getElementById("detalle");

/* Helper: prueba si una imagen carga correctamente */
function testImage(url, timeout = 4000) {
  return new Promise(resolve => {
    const img = new Image();
    let done = false;

    const onDone = (ok) => {
      if (done) return;
      done = true;
      // dar algo de tiempo para evitar flashes
      resolve(ok);
    };

    img.onload = () => onDone(true);
    img.onerror = () => onDone(false);
    img.src = url;

    setTimeout(() => onDone(false), timeout);
  });
}

/* Helper: intenta variantes (jpg/png) y asegura rutas con ./assets/img si faltan */
async function normalizePathCandidates(rawPath) {
  // trimear
  rawPath = (rawPath || "").trim();
  if (!rawPath) return [];

  const candidates = new Set();

  // si contiene ./ o ../ asume ruta tal cual; sino intenta poner ./assets/img/
  const base = rawPath;
  candidates.add(base);

  // si tiene extensión, también probamos cambiar jpg/png
  const extMatch = base.match(/(\.jpg|\.jpeg|\.png)$/i);
  if (extMatch) {
    const baseWithoutExt = base.slice(0, -extMatch[0].length);
    ["jpg","jpeg","png"].forEach(ext => candidates.add(baseWithoutExt + "." + ext));
  } else {
    // si no tiene extensión, añade opciones comunes
    ["jpg","jpeg","png"].forEach(ext => candidates.add(base + "." + ext));
  }

  // si la ruta es relativa pero no empieza con "./" o "../" añadimos prefijo raíz
  if (!base.startsWith("./") && !base.startsWith("../") && !base.startsWith("/")) {
    ["./assets/img/", "./assets/img/"].forEach(pref => {
      Array.from(candidates).forEach(c => candidates.add(pref + c));
    });
  }

  // convertir a array y testear secuencialmente hasta encontrar las que cargan
  const arr = Array.from(candidates);
  const valid = [];
  for (let i = 0; i < arr.length; i++) {
    const url = arr[i];
    /* eslint-disable no-await-in-loop */
    const ok = await testImage(url);
    if (ok) valid.push(url);
  }
  return valid;
}

/* Normaliza lista de imágenes (separadas por °°), devolviendo solo las que existan */
async function normalizeImages(imgField) {
  const parts = (imgField || "").split("°°").map(s => s.trim()).filter(Boolean);
  const results = [];
  for (const part of parts) {
    const val = await normalizePathCandidates(part);
    // añade la primera válida para esa entrada
    if (val.length) {
      // si normalizePathCandidates retornó varias, añadimos todas (opcional)
      val.forEach(v => results.push(v));
    }
  }
  // evitar duplicados
  return Array.from(new Set(results));
}

/* Render de productos para categoría 'indice' (0..3) */
async function renderProductosAsync(indice) {
  tabla.innerHTML = "";
  detalle.classList.add("hidden");

  const lista = productos[indice] || [];
  for (let col = 0; col < lista.length; col++) {
    const itemStr = lista[col];
    const partes = itemStr.split("##");
    const titulo = (partes[0] || "Sin título").trim();
    const desc = (partes[1] || "").trim();
    const imgField = partes[2] || "";

    // normaliza imágenes (async) - devuelve lista de urls válidas
    const imagenes = await normalizeImages(imgField);

    const cont = document.createElement("article");
    cont.className = "columna";
    cont.setAttribute("data-cat", indice);
    cont.setAttribute("data-idx", col);

    const t = document.createElement("p"); t.className = "titulo"; t.textContent = titulo;
    const d = document.createElement("p"); d.className = "desc"; d.textContent = desc;

    const img = document.createElement("img");
    img.alt = titulo;
    // si hay al menos una imagen válida la usamos, sino placeholder
    img.src = imagenes[0] || "./assets/img/placeholder.png";

    const indicator = document.createElement("div");
    indicator.className = "carousel-ind";
    indicator.textContent = imagenes.length > 1 ? `1 / ${imagenes.length}` : "";

    // al click abrimos detalle (cambia de 'página')
    cont.addEventListener("click", () => showDetalle(indice, col));

    cont.appendChild(t);
    cont.appendChild(d);
    cont.appendChild(img);
    cont.appendChild(indicator);
    tabla.appendChild(cont);
  }
}

/* showDetalle con carousel robusto; utiliza normalizeImages también */
async function showDetalle(catIdx, prodIdx) {
  detalle.innerHTML = "";
  detalle.classList.remove("hidden");
  tabla.innerHTML = ""; // ocultar catálogo

  const partes = productos[catIdx][prodIdx].split("##");
  const titulo = (partes[0] || "Producto").trim();
  const desc = (partes[1] || "").trim();
  const imgField = partes[2] || "";

  const imagenes = await normalizeImages(imgField);
  // si no hay imagenes válidas, usar placeholder repetido
  if (!imagenes.length) imagenes.push("./assets/img/placeholder.png");

  // back
  const back = document.createElement("button");
  back.className = "back";
  back.textContent = "← Volver";
  back.addEventListener("click", () => {
    detalle.classList.add("hidden");
    // re-renderiza la categoría anterior (si hay una activa)
    const active = Array.from(estaciones).findIndex(x => x.classList.contains("active"));
    if (active >= 0) renderProductosAsync(active);
    else tabla.innerHTML = "";
  });

  // layout
  const wrap = document.createElement("div"); wrap.className = "wrap";
  const left = document.createElement("div"); left.className = "left";
  const right = document.createElement("div"); right.className = "right";

  const mainImg = document.createElement("img");
  mainImg.src = imagenes[0];
  mainImg.alt = titulo;

  // carousel state
  let current = 0;
  const prevBtn = document.createElement("button");
  prevBtn.className = "btn-arrow"; prevBtn.textContent = "‹";
  prevBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    current = (current - 1 + imagenes.length) % imagenes.length;
    mainImg.src = imagenes[current];
    indicator.textContent = `${current + 1} / ${imagenes.length}`;
  });

  const nextBtn = document.createElement("button");
  nextBtn.className = "btn-arrow"; nextBtn.textContent = "›";
  nextBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    current = (current + 1) % imagenes.length;
    mainImg.src = imagenes[current];
    indicator.textContent = `${current + 1} / ${imagenes.length}`;
  });

  const indicator = document.createElement("div");
  indicator.className = "carousel-ind";
  indicator.textContent = `${current + 1} / ${imagenes.length}`;

  const controls = document.createElement("div");
  controls.className = "controls";
  controls.appendChild(prevBtn);
  controls.appendChild(indicator);
  controls.appendChild(nextBtn);

  left.appendChild(mainImg);
  left.appendChild(controls);

  const h2 = document.createElement("h2"); h2.textContent = titulo;
  const p = document.createElement("p"); p.textContent = desc;
  p.style.marginTop = "12px";

  const comprar = document.createElement("button");
  comprar.className = "btn-arrow";
  comprar.textContent = "Comprar / Ver más";
  comprar.style.marginTop = "18px";
  comprar.addEventListener("click", () => {
    alert(`Has elegido: ${titulo}`);
  });

  right.appendChild(h2);
  right.appendChild(p);
  right.appendChild(comprar);

  wrap.appendChild(left);
  wrap.appendChild(right);

  detalle.appendChild(back);
  detalle.appendChild(wrap);
}

/* setear listeners y arranque */
Array.from(estaciones).forEach((el, idx) => {
  el.addEventListener("click", async () => {
    Array.from(estaciones).forEach(x => x.classList.remove("active"));
    el.classList.add("active");
    await renderProductosAsync(idx);
  });
});

document.addEventListener("DOMContentLoaded", async () => {
  if (estaciones[0]) {
    estaciones[0].classList.add("active");
    await renderProductosAsync(0);
  }
});
