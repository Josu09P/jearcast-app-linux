# JEARCAST - APP

## Descripción general

Jear Cast es una aplicación de escritorio desarrollada con el objetivo de brindar a los usuarios una experiencia moderna y limpia para escuchar música desde YouTube, similar a plataformas como Spotify. Utiliza la API de YouTube mediante una clave personal (API Key) proporcionada por el usuario, siguiendo el enfoque del conocido reproductor Headset.

Este proyecto está pensado especialmente para usuarios de Linux, ofreciendo una interfaz fluida, un sistema de favoritos y playlists personalizados, autenticación de usuarios y funciones sociales. Además, será un proyecto de código abierto distribuido libremente a la comunidad.

## Tecnologías Utilizadas

| Categorías | Tecnologías | Descripción |
|------------|-------------|-------------|
| Frontend | Astro | Framework moderno basado en Node.js que permite trabajar con TypeScript, JavaScript, Bootstrap, HTML y CSS para crear interfaces eficientes y optimizadas. |
| Backend/AppDesktop | Electron + Node.js | Empaquetado de la aplicación como software de escritorio multiplataforma. |
| Autenticación | Firebase Authentication | Registro e inicio de sesión mediante correo electrónico y contraseña. |
| Base de datos | Firebase Firestore Database | Almacenamiento de usuario y sus claves API, playlists, favoritos y configuraciones personalizadas. |

## Diseño y Experiencia de Usuario

Para agilizar el desarrollo y mantener una estructura visual coherente, se utiliza el framework Astro en combinación con Bootstrap y TailwindCSS. Esto permite construir una interfaz moderna, ligera y responsive.

## Autenticación y Seguridad

1. Al iniciar la aplicación, el usuario podrá registrarse o iniciar sesión utilizando su correo electrónico y contraseña (Firebase Auth).
2. Al autenticarse, se le solicitará su propia API Key de YouTube, la cual se almacenará de forma segura en Firestore, asociada a su cuenta.
3. Se incluirá una advertencia de responsabilidad para informar al usuario sobre los términos de uso de la API de YouTube.

## Flujo de Uso

### Pantalla de Bienvenida
- Introducción sobre el uso de la aplicación.
- Enlaces directos e imágenes que explican cómo obtener una YouTube API Key.
- Sección opcional de donaciones, con métodos visibles (Yape, BCP, PayPal, Lemon Cash, contacto directo).
- Botón para "Saltar y continuar".

### Autenticación
- Registro o inicio de sesión mediante correo y contraseña.
- Ingreso de la API Key personal.

### Pantalla Principal
- Dashboard musical interactivo.
- Buscador de canciones/videos mediante la YouTube Data API.

#### Secciones
- Música (buscador)
- Favoritos
- Playlists
- Reporte de errores (bugs)
- Configuración

## Consideraciones Técnicas
- Reproducción de música se realizará a través de `<iframe>` de YouTube embebido, cumpliendo con las políticas de uso de la plataforma.
- No se descargará contenido, ni se reproducirá directamente el audio sin la interfaz oficial de YouTube.
- Cada usuario usará su propia API Key, cumpliendo así con los Términos de Servicio de la YouTube API.

## Código Abierto
- Este proyecto será totalmente open source y estará disponible gratuitamente para la comunidad.
- Se invita a desarrolladores, músicos y entusiastas de Linux a colaborar o mejorar el sistema.
- Repositorio: [Josu09P](LINK-DIRECTO)

## Contacto y Apoyo

Si deseas apoyar el desarrollo, puedes hacerlo mediante donaciones voluntarias:

- Yape: 965634940
- BCP:
- Paypal:
- Lemon Cash:
- Contacto directo: +51 965634940
- Correo: jearcast@gmail.com
