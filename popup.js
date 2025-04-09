let estaEnviando = false;
let PUBLICACION_ENDPOINT = "";
let CONTENIDO_ENDPOINT = "";
let archivos = {
  imagenes: [],
  videos: [],
  pdfs: [],
};

document.addEventListener("DOMContentLoaded", () => {
  cargarConfiguracion();
  document.getElementById("enviar").addEventListener("click", enviarArchivos);
  document.getElementById("boton-ayuda").addEventListener("click", () => {
    window.open(
      "manual_de_uso_creación_de_usuarios_iHodei_Blogs.pdf",
      "_blank"
    );
  });

  document.getElementById("imagenes").addEventListener("change", (e) => {
    archivos.imagenes = [...archivos.imagenes, ...Array.from(e.target.files)];
    mostrarPreviews("imagenes");
  });

  document.getElementById("videos").addEventListener("change", (e) => {
    archivos.videos = [...archivos.videos, ...Array.from(e.target.files)];
    mostrarPreviews("videos");
  });

  document.getElementById("pdfs").addEventListener("change", (e) => {
    archivos.pdfs = [...archivos.pdfs, ...Array.from(e.target.files)];
    mostrarPreviews("pdfs");
  });
});

function cargarConfiguracion() {
  fetch(chrome.runtime.getURL("config.json"))
    .then((response) => response.json())
    .then((config) => {
      PUBLICACION_ENDPOINT = config.PUBLICACION_ENDPOINT;
      CONTENIDO_ENDPOINT = config.CONTENIDO_ENDPOINT;
      console.log("✅ URL cargada desde config.json:");
    })
    .catch((error) => {
      console.error("❌ Error cargando config.json:", error);
      alert("No se pudo cargar la configuración de la url.");
    });
}

function mostrarPreviews(tipo) {
  const container = document.getElementById(`preview-${tipo}`);
  container.innerHTML = "";

  archivos[tipo].forEach((file, index) => {
    const wrapper = document.createElement("div");
    wrapper.style.position = "relative";

    const elemento = document.createElement(
      tipo === "imagenes" ? "img" : tipo === "videos" ? "video" : "div"
    );

    if (tipo === "pdfs") {
      elemento.classList.add("preview-pdf");

      const icono = document.createElement("span");
      icono.textContent = "📄";

      const nombre = document.createElement("span");
      nombre.textContent = file.name;
      nombre.classList.add("pdf-nombre");

      elemento.appendChild(icono);
      elemento.appendChild(nombre);
    } else {
      elemento.src = URL.createObjectURL(file);
      if (tipo === "videos") elemento.controls = true;
    }

    elemento.classList.add("preview-item");

    const botonX = document.createElement("button");
    botonX.textContent = "❌";
    botonX.classList.add("boton-x");
    botonX.onclick = () => {
      archivos[tipo].splice(index, 1);
      mostrarPreviews(tipo);
    };

    wrapper.appendChild(elemento);
    wrapper.appendChild(botonX);
    container.appendChild(wrapper);
  });
}

async function enviarArchivos() {
  if (!PUBLICACION_ENDPOINT || !CONTENIDO_ENDPOINT) {
    alert("La configuración de la url no está cargada.");
    return;
  }

  if (archivos.imagenes.length === 0) {
    alert("Tienes que seleccionar al menos una imagen.");
    return;
  }

  if (estaEnviando) return;
  estaEnviando = true;

  const boton = document.getElementById("enviar");
  boton.innerText = "Creando publicación...";
  boton.disabled = true;

  const titulo = document.getElementById("titulo").value.trim();
  const texto = document.getElementById("texto").value.trim();

  if (!titulo || !texto) {
    alert("Por favor, completa el título y el texto.");
    boton.innerText = "Enviar archivos";
    boton.disabled = false;
    estaEnviando = false;
    return;
  }

  const listaArchivos = [
    ...archivos.imagenes.map((file) => ({ file, tipo: "IMG" })),
    ...archivos.videos.map((file) => ({ file, tipo: "VID" })),
    ...archivos.pdfs.map((file) => ({ file, tipo: "PDF" })),
  ];

  if (listaArchivos.length === 0) {
    alert("No se seleccionó ningún archivo.");
    boton.innerText = "Enviar archivos";
    boton.disabled = false;
    estaEnviando = false;
    return;
  }

  try {
    const publicacionRes = await fetch(PUBLICACION_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo, texto }),
    });

    if (!publicacionRes.ok) {
      const errorData = await publicacionRes.json();
      throw new Error(errorData.error || "Error al crear la publicación.");
    }

    const { id: publicacion_id } = await publicacionRes.json();
    console.log("🆗 Publicación creada con ID:", publicacion_id);

    for (const { file, tipo } of listaArchivos) {
      const formData = new FormData();
      formData.append("archivo", file);
      formData.append("publicacion_id", publicacion_id);
      formData.append("tipoContenido", tipo);

      console.log(`⬆️ Subiendo ${tipo}:`, file.name);
      const contenidoRes = await fetch(CONTENIDO_ENDPOINT, {
        method: "POST",
        body: formData,
      });

      if (!contenidoRes.ok) {
        const errorData = await contenidoRes.json();
        throw new Error(errorData.error || `Error al subir ${file.name}.`);
      }
    }

    alert("✅ Publicación y archivos subidos correctamente.");

    document.getElementById("titulo").value = "";
    document.getElementById("texto").value = "";
    archivos = { imagenes: [], videos: [], pdfs: [] };
    ["imagenes", "videos", "pdfs"].forEach((tipo) => mostrarPreviews(tipo));
  } catch (err) {
    console.error("❌ Error:", err);
    alert(err.message || "Ocurrió un error durante la subida.");
  } finally {
    boton.innerText = "Enviar archivos";
    boton.disabled = false;
    estaEnviando = false;
  }
}
