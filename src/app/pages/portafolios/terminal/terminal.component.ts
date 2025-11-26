import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { CommandDefinition, CommandFile } from './interfaces/command.interface';
import { TIPS } from 'src/app/shared/components/constants/tips';
import emailjs from '@emailjs/browser';


interface FileSystem {
  [key: string]: FileSystem | string;
}

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.scss']
})
export class TerminalComponent implements OnInit {

  private http = inject(HttpClient);

  private service = "service_ly17dtq";
  private template = "template_obj";
  private key = "5TUNA37E9rvqGr__1";

  command = '';
  fs: FileSystem = {};
  tipText: string = '';
  output: string[] = [];
  rootFs: FileSystem = {};
  currentPath: string[] = [];
  contactFormVisible = false;
  commands: { [key: string]: CommandDefinition } = {};

  ngOnInit() {
    this.showRandomTip();
    setInterval(() => this.showRandomTip(), 2 * 60 * 1000);
    this.http.get<CommandFile>('assets/cmd/commands.json')
      .subscribe(c => {
        this.commands = c.commands;
        console.log('Comandos cargados:', this.commands);
      });


    // Cargar filesystem
    this.http.get<{ root: FileSystem }>('assets/cmd/filesystem.json')
      .subscribe(fs => {
        this.rootFs = fs.root;
        this.fs = fs.root;
      });
  }

  runCommand(terminal?: HTMLElement) {
    const input = this.command.trim();
    if (!input) return;

    this.output.push(`<br>`);
    this.output.push(this.getPromptLine() + input);


    const [cmd, ...args] = input.split(' ');
    const key = cmd.toLowerCase();
    const commandDef = this.commands[key];

    if (!commandDef) {
      this.output.push(`"${input}" no se reconoce como un comando interno o externo, programa o archivo por lotes ejecutable.`);
      this.output.push(`Escribe "help" para ver todos los comandos disponibles.`);
      return this.resetInput();
    }

    // Mostrar output de comandos no dinámicos
    if (!commandDef.dynamic) {
      (commandDef.output ?? []).forEach(line => {
        if (line === '__CLEAR__') {
          this.output = [];
        } else if (line === '__DATE__') {
          this.output.push(new Date().toLocaleString());
        } else {
          this.output.push(line);
        }
      });
    }

    // Ejecutar comando dinámico si aplica
    if (commandDef.dynamic) {
      this.runDynamicCommand(key, args);
    }

    this.resetInput();
    setTimeout(() => terminal?.scrollTo(0, terminal.scrollHeight));
  }

  private resetInput() {
    this.command = '';
  }

  private runTree() {
    this.output.push(`Estructura de directorios de C:\\Users\\root\\${this.currentPath.join('\\')}`);
    this.output.push('');

    const printTree = (node: FileSystem, prefix: string = '') => {
      const entries = Object.keys(node);
      entries.forEach((name, i) => {
        const isLast = i === entries.length - 1;
        const isDir = typeof node[name] === 'object';

        const branch = isLast ? '└── ' : '├── ';
        this.output.push(prefix + branch + name);

        if (isDir) {
          const newPrefix = prefix + (isLast ? '    ' : '│   ');
          printTree(node[name] as FileSystem, newPrefix);
        }
      });
    };

    printTree(this.fs);
  }


  private runDynamicCommand(cmd: string, args: string[]) {
    switch (cmd) {
      case 'echo':
        this.output.push(args.join(' '));
        break;

      case 'cd':
        if (args.length) this.changeDirectory(args[0]);
        else this.output.push('Debes indicar un directorio.');
        break;
      case 'tree':
        this.runTree();
        break;
      case 'dir':
        this.listDirectory();
        break;
      case 'color':
        this.runColor(args);
        break;
      case 'type':
        if (args.length) this.openFile(args[0]);
        else this.output.push('Debes indicar un archivo.');
        break;
      case 'project':
        if (args.length) this.output.push(`Proyecto "${args[0]}" → descripción en camino...`);
        else this.output.push('Debes indicar un proyecto.');
        break;
      case 'contact':
        this.showContactForm();
        break;

      case 'whoami':
        this.output.push('root');
        break;

      case 'hostname':
        this.output.push('DESKTOP-AARON');
        break;

      case 'ping':
        this.runPing(args);
        break;

      case 'ipconfig':
        this.runIpconfig();
        break;

      case 'systeminfo':
        this.runSysteminfo();
        break;


    }
  }

  private runColor(args: string[]) {
    const colorCode = args[0]?.toUpperCase();

    const validHex = /^[0-9A-F]{2}$/;

    if (!colorCode || !validHex.test(colorCode)) {
      this.output.push('Formato inválido. Usa: color <fondo><texto> (ej: 0A)');
      this.output.push('Colores disponibles: 0=Negro, 1=Azul, 2=Verde, 3=Cian, 4=Rojo, 5=Magenta, 6=Amarillo, 7=Blanco, 8=Gris, 9=Azul claro, A-F letras para colores claros');
      return;
    }

    const bg = parseInt(colorCode[0], 16);
    const fg = parseInt(colorCode[1], 16);

    const colors: string[] = [
      'black', 'blue', 'green', 'cyan', 'red', 'magenta', 'yellow', 'white',
      'gray', 'lightblue', 'lightgreen', 'lightcyan', 'lightred', 'lightmagenta', 'lightyellow', 'brightwhite'
    ];

    document.querySelector('.cmd-container')!.setAttribute('style',
      `color: ${colors[fg]}; background-color: ${colors[bg]};`
    );

    this.output.push(`Color cambiado: fondo=${colors[bg]}, texto=${colors[fg]}`);
  }


  private changeDirectory(dir: string) {
    if (!dir) {
      this.output.push('Debes indicar un directorio.');
      return;
    }

    if (dir === '..' || dir === '../') {
      if (this.currentPath.length === 0) {
        this.output.push('Ya estás en el directorio raíz.');
        return;
      }

      this.currentPath.pop();
      this.rebuildCurrentFs();
      return;
    }
    if (dir === '.') { return; }
    if (dir.includes('/')) {
      const parts = dir.split('/').filter(p => p.length > 0);

      for (const p of parts) {
        if (p === '..') {
          if (this.currentPath.length > 0) {
            this.currentPath.pop();
          }
        } else if (this.fs[p] && typeof this.fs[p] === 'object') {
          this.currentPath.push(p);
        } else {
          this.output.push(`Directorio no encontrado: ${p}`);
          this.rebuildCurrentFs();
          return;
        }

        this.rebuildCurrentFs();
      }

      return;
    }

    if (this.fs[dir] && typeof this.fs[dir] === 'object') {
      this.currentPath.push(dir);
      this.fs = this.fs[dir] as FileSystem;
      this.rebuildCurrentFs();
    } else {
      this.output.push('Directorio no encontrado.');
    }
  }

  private rebuildCurrentFs() {
    let node = this.rootFs;

    for (const folder of this.currentPath) {
      node = node[folder] as FileSystem;
    }

    this.fs = node;
  }



  private listDirectory() {
    const folder = this.fs;
    const items = Object.keys(folder);

    const now = new Date();
    const fecha = now.toLocaleDateString('es-ES');
    const hora = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

    this.output.push(` El volumen de la unidad C no tiene etiqueta.`);
    this.output.push(` El número de serie del volumen es: B87F-7D74`);
    this.output.push(``);
    this.output.push(` Directorio de C:\\Users\\root\\${this.currentPath.join('\\')}`);
    this.output.push(``);

    let totalArchivos = 0;
    let totalBytes = 0;
    let totalDirs = 0;

    items.forEach(name => {
      const isDir = typeof folder[name] === 'object';
      const fechaLinea = fecha.padEnd(12, ' ');
      const horaLinea = hora.padEnd(8, ' ');

      if (isDir) {
        totalDirs++;
        this.output.push(`${fechaLinea} &nbsp;${horaLinea} &nbsp;&nbsp;&nbsp;<DIR> &nbsp;&nbsp;&nbsp;&nbsp;${name}`);
      } else {
        totalArchivos++;
        const fakeSize = Math.floor(Math.random() * 500000) + 1024;
        totalBytes += fakeSize;

        const sizeStr = fakeSize.toLocaleString('es-ES').padStart(15, ' ');

        this.output.push(`${fechaLinea} &nbsp;${horaLinea} &nbsp;&nbsp;${sizeStr} ${name}`);
      }
    });

    this.output.push(`&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${totalArchivos} archivos&nbsp; ${totalBytes.toLocaleString('es-ES')} bytes`);
    this.output.push(`&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${totalDirs} dirs&nbsp; 138.820.026.368 bytes libres`);
  }


  private openFile(file: string) {
    const filePath = this.fs[file];
    if (!filePath) {
      this.output.push('Archivo no encontrado.');
      return;
    }

    this.http.get(`assets/cmd/files/${filePath}`, { responseType: 'text' })
      .subscribe(text => this.output.push(text));
  }

  private getPromptLine(): string {
    if (this.currentPath.length === 0) {
      return 'C\\Users\\root>';
    } else {
      return `C\\Users\\root\\${this.currentPath.join('\\')}>`;
    }
  }

  showRandomTip() {
    const randomIndex = Math.floor(Math.random() * TIPS.length);
    this.tipText = TIPS[randomIndex];
  }


  private showContactForm() {
    this.contactFormVisible = true;
  }
  onContactSubmitted(data: { name: string, email: string, subject?: string, message: string }) {
    emailjs.send(this.service, this.template, {
      from_name: data.name,
      from_email: data.email,
      subject: data.subject,
      message: data.message
    }, this.key)
      .then(() => {
        this.contactFormVisible = false;
        this.output.push(`<br> ¡Gracias por tu mensaje ${data.name}!`);
        this.output.push('Se ha enviado tu email correctamente a mi cuenta.');

        this.output.push('<br> También puedes contactarme por mis redes:');
        this.output.push('LinkedIn: <a href="https://www.linkedin.com/in/aarongmez18/?locale=en" target="_blank">Ir a la página</a>');
        this.output.push('GitHub: <a href="https://github.com/aarongmez18" target="_blank">Ir a la página</a>');
        this.output.push('Instagram: <a href="https://www.instagram.com/aarongomez18" target="_blank">Ir a la página</a>');
      })
      .catch(err => {
        this.contactFormVisible = false;
        this.output.push('Error al enviar el mensaje. Intenta de nuevo.');
        console.error(err);
      });

    this.contactFormVisible = false;
  }

  private runPing(args: string[]) {
    if (!args.length) {
      this.output.push('Ping no proporcionado.');
      return;
    }

    const host = args[0];

    this.output.push(`Haciendo ping a ${host} con 32 bytes de datos:`);

    for (let i = 0; i < 4; i++) {
      const time = Math.floor(Math.random() * 80) + 20;
      this.output.push(`Respuesta desde ${host}: bytes=32 tiempo=${time}ms TTL=54`);
    }

    this.output.push('');
    this.output.push('Estadísticas de ping para ' + host + ':');
    this.output.push('    Paquetes: enviados = 4, recibidos = 4, perdidos = 0 (0% perdidos)');
  }

  private runIpconfig() {
    this.output.push('');
    this.output.push('Adaptador de Ethernet Ethernet:');
    this.output.push('   Sufijo DNS específico para la conexión. . . : local');
    this.output.push('   Dirección IPv4. . . . . . . . . . . . . . . : 192.168.1.22');
    this.output.push('   Máscara de subred . . . . . . . . . . . . . : 255.255.255.0');
    this.output.push('   Puerta de enlace predeterminada . . . . . . : 192.168.1.1');
  }

  private runSysteminfo() {
    this.output.push('');
    this.output.push('Nombre del host:           DESKTOP-AARON');
    this.output.push('Nombre del SO:             Microsoft Windows 10 Pro');
    this.output.push('Versión del SO:            10.0.19045 N/D Compilación 19045');
    this.output.push('Fabricante del SO:         Microsoft Corporation');
    this.output.push('Tipo de sistema:           x64-based PC');
    this.output.push('Procesador(es):            1 Procesadores instalados.');
    this.output.push('                           [01]: AMD Ryzen 7 5800X 8-Core Processor');
    this.output.push('Memoria física total:      16,384 MB');
    this.output.push('Memoria física disponible: 8,912 MB');
    this.output.push('Zona horaria:              (UTC+01:00) Madrid');
  }

}
