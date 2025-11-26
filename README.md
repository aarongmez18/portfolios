# Portafolio Interactivo - Simulación de Terminal

## Descripción
Este proyecto es una simulación de una terminal de comandos estilo Windows/CMD desarrollada en Angular.  
Su objetivo es ofrecer una experiencia interactiva dentro de un navegador, permitiendo a los usuarios ejecutar comandos ficticios y explorar un sistema de archivos simulado.

Se trata de un portafolio interactivo donde se muestran proyectos, experiencia y formas de contacto, todo dentro de un entorno tipo terminal.

---

## Funcionalidades principales
- **Comandos básicos:** `cd`, `dir`, `tree`, `type`, `echo`, `color`, `help`.
- **Comandos de información:** `whoami`, `hostname`, `ping`, `ipconfig`, `systeminfo`.
- **Simulación de filesystem** con carpetas y archivos `.txt`.
- **Sistema de tips aleatorios** para mejorar la experiencia del usuario.
- **Formulario de contacto integrado** usando EmailJS.
- **Renderizado de archivos de texto** con información de proyectos, experiencia y certificaciones.
- **Simulación de navegación** con rutas relativas y absolutas.
- **Salida estilizada tipo terminal** con colores y formato CMD.

---

## Estructura de archivos
El filesystem simulado contiene las siguientes carpetas y archivos:

root/
├─ about/
│ ├─ about.txt
│ ├─ experience.txt
│ └─ skills.txt
├─ projects/
│ ├─ portfolio.txt
│ ├─ bankops.txt
│ ├─ java_algorithms.txt
│ └─ muchachos.txt
├─ contact/
  └─ contact.txt

- Cada archivo `.txt` contiene información correspondiente de la sección.

---

## Tecnologías utilizadas
- Angular 16
- TypeScript
- NgOnInit
- HttpClient para cargar filesystem y archivos `.txt`
- EmailJS para el envío de formularios de contacto
- CSS/SCSS para diseño y estilo tipo terminal

---

## Cómo ejecutar el proyecto localmente

1. Clonar el repositorio:
   
git clone https://github.com/aarongmez18/portfolios.git
cd portfolios

2. Instalar dependencias:

npm install

3. Levantar el proyecto en modo desarrollo:

ng serve

4. Abrir en el navegador

Objetivo del proyecto

Este proyecto tiene fines educativos y de demostración, mostrando cómo se puede recrear una terminal interactiva en un entorno web para exponer un portafolio profesional y proyectos personales.

