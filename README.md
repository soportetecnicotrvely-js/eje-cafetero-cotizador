Cotizador Eje Cafetero — GitHub Pages + Supabase + n8n
Widget embebible (sin build, sin frameworks) que se inserta dentro de la
página descriptiva del destino (la que arma el otro equipo, al estilo
`trvely.com.co/eje-cafetero/`). Permite:
Elegir una fecha de salida fija (no hay calendario libre) y la
cantidad de adultos, niños e infantes.
Al presionar Cotizar, ver el valor total y el descriptivo
completo de esa salida específica (qué incluye, alojamiento,
itinerario, notas especiales) — este descriptivo no se muestra en
ningún lado antes de cotizar, porque cambia según la fecha elegida
(Fin de Año trae cena especial y paseo a caballo; Semana de Receso no
trae cócteles; Festival de Velas tiene la nota del toque de queda, etc.).
Enviar una prereserva con los datos de contacto, que dispara
automáticamente el correo al cliente, el correo interno al equipo, y —
cuando se confirma disponibilidad — el correo con los medios de pago.
Estructura del proyecto
```
├── index.html            Monta el widget (ver nota de "cómo insertarlo" abajo)
├── styles.css            Identidad Trvely oficial (Burgundy/Beige/Blanco, Montserrat/Work Sans)
├── app.js                Lógica: cálculo de tarifas, descriptivo, Supabase, envío de prereserva
├── data.js               Tarifas + salidas + descriptivo de cada una (respaldo local / seed)
├── config.js             Aquí pones tu URL y anon key de Supabase
├── supabase/schema.sql   Tablas, RLS y datos semilla (incluye el descriptivo editable)
└── n8n/
    ├── 1-nueva-prereserva.json      Workflow: correo cliente + correo interno
    └── 2-confirmar-prereserva.json Workflow: correo de confirmación + medios de pago
```
Cómo insertar el widget en la página real del destino
Todo lo que hace falta es esto, en cualquier punto de la página descriptiva:
```html
<div id="eje-cafetero-cotizador"></div>
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2" defer></script>
<script src="https://TU-DOMINIO/config.js"></script>
<script src="https://TU-DOMINIO/data.js"></script>
<script src="https://TU-DOMINIO/app.js" defer></script>
```
El script busca el `<div id="eje-cafetero-cotizador">` y construye todo el
widget adentro. Todo el CSS está prefijado con `.cw` para no chocar con los
estilos que ya tenga esa página. `index.html` de este proyecto es exactamente
eso — un ejemplo mínimo de cómo se ve montado solo.
1) Publicar en GitHub Pages
Sube todos estos archivos a tu repositorio (raíz o `/docs`).
Settings → Pages → Source: `Deploy from a branch`, rama `main`, carpeta `/ (root)`.
El sitio queda en `https://tu-usuario.github.io/tu-repo/`.
Funciona en modo demo desde ya (usa `data.js` local), sin depender de Supabase todavía.
2) Crear el proyecto en Supabase
Crea un proyecto en supabase.com.
SQL Editor → New query → pega todo `supabase/schema.sql` y ejecútalo. Crea las tablas, activa RLS y siembra tarifarios + salidas + descriptivo.
Project Settings → API → copia `Project URL` y `anon public key` a `config.js`.
Sube `config.js` actualizado. Listo: el cotizador ya lee/escribe en Supabase.
Estas llaves son seguras en el navegador porque RLS solo permite leer
`pricing_tiers`/`departures` e insertar en `prereservations` (nadie puede
leer, editar ni borrar reservas ajenas desde el sitio).
Gestión de las prereservas
El equipo revisa y confirma desde Supabase → Table Editor → prereservations.
Cambiar `status` de `pendiente` a `confirmada` dispara el correo de confirmación.
Mantener las fechas y el descriptivo actualizados
Nuevas salidas: agrega una fila en `departures` (Table Editor), indicando su `tier`.
Cambios de contenido (qué incluye, nota especial, alojamiento): edita directamente
las columnas `incluye`, `special_note`, `lodging`, `meals_note` en `pricing_tiers`
— no requiere tocar código ni volver a publicar el sitio.
El itinerario (día a día) solo tiene dos variantes en el PDF actual (`regular` y
`findeanio`); viven en `data.js`/`app.js` (`window.ITINERARIES`). Si en el futuro
aparece una tercera variante de itinerario, se agrega ahí.
3) Configurar los correos con n8n
a) Nueva prereserva
Importa `n8n/1-nueva-prereserva.json`, configura tus credenciales SMTP.
Activa el workflow y copia la URL del webhook.
Supabase → Database → Webhooks → nuevo hook: tabla `prereservations`, evento `INSERT`, URL del webhook de n8n.
b) Confirmar prereserva
Importa `n8n/2-confirmar-prereserva.json`.
Activa y copia su URL de webhook.
Supabase → otro Database Webhook: tabla `prereservations`, evento `UPDATE`, URL de este segundo webhook.
El workflow revisa que el cambio realmente haya sido "a confirmada" antes de
enviar el correo con los medios de pago. Ajusta remitente, firma y cuentas
bancarias en los nodos de correo según lo que use realmente Dominick Travel.
4) Reglas de tarifa implementadas
La categoría de habitación (sencilla/doble/triple/cuádruple/quíntuple) se calcula por adultos + niños.
Un niño (3-10 años) solo paga tarifa de niño con mínimo 2 adultos; si no, paga tarifa de adulto.
Un infante (0-2 años) no cuenta para la categoría. Si viaja con 1 solo adulto, ese adulto paga sencilla y el infante su tarifa de infante.
Si la salida no tiene tarifa "sencilla" (ej. Fin de Año), el sitio lo indica.
5) Identidad de marca aplicada
Tomada de "Trvely — Brand Guidelines 2025":
Elemento	Valor
Burgundy Travel (color primario)	`#B41241`
Confort Beige (fondo suave)	`#F4E5D2`
Títulos	Montserrat ExtraBold/Bold, tracking -5
Subtítulos / etiquetas de campo	Work Sans Bold
Párrafos	Montserrat Regular
Los únicos valores que no vienen de la guía (porque la guía no cubre
estados de interacción de UI) son el tono de `hover` de los botones y el
gris-oscuro de texto de lectura — están documentados como tales en los
comentarios de `styles.css`.
> El widget no incluye el logotipo de Trvely en ningún lado (la página del
> destino ya lo trae). Si más adelante quieres mostrar el isotipo dentro del
> widget (ej. un sello "reserva segura con Trvely"), se necesita el archivo
> real del logo (SVG/PNG en Burgundy y en blanco) — no se debe reconstruir a
> mano, según las reglas de "usos incorrectos" de la propia guía.
6) Ideas para siguientes iteraciones
Panel interno (Supabase Auth) para confirmar/rechazar sin entrar al Table Editor.
Workflow en n8n programado que inserte automáticamente las próximas salidas de "temporada baja".
Soporte multi-destino: el modelo de datos ya está pensado para agregar más planes.
