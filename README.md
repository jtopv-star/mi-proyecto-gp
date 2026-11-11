# 🎮 Game Programming — Etapa 1

Plataforma personal para aprender **Java, SQL y diseño de bases de datos** resolviendo ejercicios con un editor de código.
Todo es **gratuito y sin instalar nada**:

| Pieza | Qué usa | Costo |
|---|---|---|
| Editor | CodeMirror (incluido en `vendor/`) | $0 |
| SQL | PGlite = PostgreSQL real compilado a WebAssembly, corre **dentro de tu navegador** (aislado) | $0 |
| Java | CheerpJ (JVM en WebAssembly, gratis para uso personal) + compilador ECJ, **dentro de tu navegador** | $0 |
| Progreso en la nube | Supabase (plan Free) con seguridad RLS | $0, sin tarjeta |
| Publicación | GitHub Pages (o Netlify Drop / Cloudflare Pages) | $0 |

Ningún código tuyo se ejecuta en un servidor: Java y SQL corren en el navegador, en un entorno aislado.

---

## Puesta en marcha (≈15 minutos, solo con el navegador)

### Paso 1 · Supabase (tu base de datos privada)
1. Crea una cuenta en <https://supabase.com> y un proyecto nuevo (plan **Free**; guarda la contraseña de la base).
2. Menú **SQL Editor → New query**, pega **todo** el contenido de `supabase/schema.sql` y pulsa **Run**.
3. **Authentication → Sign In / Providers**: desactiva **“Allow new users to sign up”** (así nadie más puede registrarse).
4. **Authentication → Users → Add user → Create new user**: tu correo y una contraseña, marca **Auto Confirm User**.
5. **Project Settings → API**: copia **Project URL** y la clave **anon / public**.
6. Abre `js/config.js` y pégalas entre las comillas.

> La *anon key* es pública por diseño. Lo que protege tus datos son las políticas RLS del paso 2: sin tu sesión, nadie lee ni escribe nada.

### Paso 2 · Probar sin Supabase (opcional)
Si abres la página sin configurar `config.js` verás un botón **“Probar en modo demo”** que funciona igual pero no guarda nada.

### Paso 3 · Compilador de Java (un archivo)
Descarga <https://repo1.maven.org/maven2/org/eclipse/jdt/ecj/3.26.0/ecj-3.26.0.jar>, renómbralo **`ecj.jar`** y ponlo dentro de la carpeta `lib/`.

### Paso 4 · Publicar gratis (para abrirlo desde Chrome en cualquier computadora)
**GitHub Pages**
1. Cuenta gratis en <https://github.com> → **New repository** (público o privado según tu plan).
2. **Add file → Upload files** y sube el contenido de esta carpeta (si el navegador limita la cantidad, súbela en 2–3 tandas: `vendor/` por separado).
3. **Settings → Pages → Deploy from a branch → main / (root) → Save.**
4. En un minuto tendrás `https://TU-USUARIO.github.io/NOMBRE-REPO/`. Ábrela en Chrome e inicia sesión con tu usuario de Supabase.

*Alternativa:* arrastra la carpeta completa a Netlify Drop o usa “Direct Upload” de Cloudflare Pages.

### Paso 5 · Diagnóstico de Java
En el menú principal abre **🛠️ Diagnóstico Java**. Prueba cada pieza (CheerpJ, `ecj.jar`, compilar y ejecutar) y te dice cuál falla.

---

## Cómo funciona el juego
- **Menú** → 3 áreas → **mundos** (niveles) → ejercicios. Un mundo nuevo se desbloquea al completar el **70 %** del anterior.
- **▶ Ejecutar** prueba tu código libremente; **✔ Comprobar** lo califica contra casos de prueba ocultos.
- **XP y niveles**: fácil 10 · medio 25 · difícil 50 XP. Cada pista reduce 20 % (mínimo 40 %). Cada 150 XP subes de nivel.
- **Autoguardado**: el código se guarda en Supabase 1,5 s después de que dejas de escribir; también se guardan intentos, pistas, resultados, puntuaciones, fecha, XP y mundos desbloqueados. Cierra Chrome o entra desde otra computadora y todo sigue ahí.
- No se usa `localStorage` para tu progreso (solo la librería de Supabase guarda ahí el token de sesión, como cualquier inicio de sesión).

## Límites que conviene conocer
- **Supabase Free pausa el proyecto tras ~7 días sin actividad.** Tus datos no se borran; entras a su panel y pulsas *Restore*. Usándolo cada semana no ocurre.
- **Java 8**: CheerpJ 3 ejecuta Java 8 (nada de `var`, `record` ni bloques de texto). Es suficiente para todos los temas del temario.
- La primera ejecución de Java o SQL en cada visita tarda unos segundos (descarga/arranque del motor); después es rápida.
- Un ciclo infinito en Java se corta a los 10 s con un aviso; si el navegador se queda colgado, recarga la página.
- `CREATE DATABASE` no existe en el motor del navegador (es una sola base); en los ejercicios se usan esquemas/tablas.
- Los ejercicios de JDBC (conectar Java con una base) se harán como completar/leer código, porque en el navegador no hay un servidor de base de datos al que conectarse.

## Contenido actual (Etapa 1)
Java: 12 ejercicios (mundo 1) · Lógica: 5 preguntas de seguimiento de código · SQL: 12 (mundo 1) · BD: 7 (modelado, FK, N:M, normalización, transacción y trigger).
Todas las soluciones están verificadas automáticamente (`node tools/verify.mjs`: SQL con el mismo motor PGlite, Java con un JDK real).

## Hoja de ruta por etapas
1. **Etapa 1 (esta):** plataforma completa + primer mundo de cada área.
2. **Etapa 2:** Java mundos 2–3 (switch, ciclos, métodos, arreglos, ArrayList, cadenas) y SQL mundo 2 (funciones, GROUP BY, HAVING).
3. **Etapa 3:** POO en Java (clases → interfaces), JOINs y consultas combinadas, diseño E-R.
4. **Etapa 4:** excepciones, archivos, colecciones, subconsultas, vistas, índices, procedimientos.
5. **Etapa 5:** mini proyectos, SQL avanzado, JDBC/CRUD y completar las metas 310 + 310.
6. **Etapa 6:** medallas, rachas diarias, repaso de ejercicios fallados, estadísticas.

Meta de cada lenguaje: 310 ejercicios = 30 fáciles + 200 medios + 80 difíciles. El comando `node tools/verify.mjs` muestra el avance contra esa meta.
