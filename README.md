# iHodei-Contact-chrome-extension

Extensión de Chrome desarrollada por **HodeiCloud** para facilitar la creación y subida visual de publicaciones al apartado de noticias de la plataforma **iHodei Contact**.

Esta herramienta permite subir texto, imágenes, vídeos y PDFs directamente desde el navegador, ofreciendo una interfaz sencilla, rápida e intuitiva.

---

## ⚙️ Requisitos de configuración

> Esta extensión requiere un archivo `config.json` para funcionar correctamente.  
> **No está incluido** en el repositorio, ya que está protegido mediante `.gitignore` por razones de seguridad.

### 📄 Crear el archivo `config.json`

Ubica este archivo en la raíz de la extensión (`/iHodei-Contact-chrome-extension/`) y añade la siguiente estructura:

```json
{
  "PUBLICACION_ENDPOINT": "https://tuservidor.com/publicacion",
  "CONTENIDO_ENDPOINT": "https://tuservidor.com/contenido"
}
```

Reemplaza las URLs con las que correspondan al entorno donde esté desplegado el backend de iHodei Contact.

---

## 🚀 Instrucciones de instalación

1. Clona este repositorio:
   ```bash
   git clone https://github.com/tuusuario/iHodei-Contact-chrome-extension.git
   ```

2. Abre Chrome y accede a:  
   `chrome://extensions/`

3. Activa el **modo desarrollador** (arriba a la derecha).

4. Haz clic en **“Cargar descomprimida”** y selecciona la carpeta del proyecto.

5. La extensión ya estará lista para usarse desde el navegador.

---

## ✨ Funcionalidades principales

- Subida de **texto, imágenes, vídeos y PDFs** asociados a una publicación.
- Vista previa de los archivos seleccionados.
- Validaciones de campos obligatorios (título y texto).
- Gestión visual e intuitiva desde un formulario único.
- Subida controlada: el botón se desactiva durante el proceso y se reactiva según el resultado.
- Acceso rápido a un **manual de ayuda en PDF** incluido.

---

## 🔒 Seguridad

- El archivo `config.json` contiene información sensible y **no debe compartirse públicamente**.
- Está protegido por defecto en el archivo `.gitignore`.

---

## 📂 Estructura del proyecto

```
📦 iHodei-Contact-chrome-extension
├── popup.html
├── popup.js
├── style.css
├── config.json          ← (no incluido)
└── manual_de_uso_creación_de_usuarios_iHodei_Blogs.pdf
```

---

¿Tienes dudas o sugerencias?  
📩 Contacta con el equipo de desarrollo de **HodeiCloud** o abre una *issue* en este repositorio.
