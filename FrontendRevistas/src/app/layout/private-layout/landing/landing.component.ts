import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

interface Indexador {
  nombre: string;
  logo: string;
  url: string;
  alt: string;
}

interface Recurso {
  titulo: string;
  descripcion: string;
  icono: string;
  tipo: 'descarga' | 'externo';
  url: string;
  download?: string;
}

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
  providers: [MessageService]
})
export class LandingComponent implements OnInit {
  public autenticado = false;

  public readonly indexadores: Indexador[] = [
    {
      nombre: 'Dialnet',
      logo: 'assets/logos/dialnet.png',
      url: 'https://dialnet.unirioja.es/servlet/revista?codigo=27866',
      alt: 'Dialnet'
    },
    {
      nombre: 'WorldCat',
      logo: 'assets/logos/worldcat.png',
      url: 'https://www.worldcat.org/es/search?q=on%3ADGCNT+http%3A%2F%2Frevistas.uniguajira.edu.co%2Frev%2Findex.php%2Fcei%2Foai&qt=results_page',
      alt: 'WorldCat'
    },
    {
      nombre: 'BASE',
      logo: 'assets/logos/base.png',
      url: 'https://www.base-search.net/Search/Results?q=dccoll:ftunivlaguaojs&refid=dcreces',
      alt: 'BASE'
    },
    {
      nombre: 'MIAR',
      logo: 'assets/logos/miar.png',
      url: 'https://miar.ub.edu/issn/2389-9484',
      alt: 'MIAR'
    },
    {
      nombre: 'Latindex',
      logo: 'assets/logos/latindex.jpg',
      url: 'https://www.latindex.org/latindex/ficha/27303',
      alt: 'Latindex'
    },
    {
      nombre: 'Aura AmeliCA',
      logo: 'assets/logos/aura.png',
      url: 'http://aura.amelica.org/detalle-revista.html?cveRevista=2026',
      alt: 'Aura AmeliCA'
    },
    {
      nombre: 'Zenodo',
      logo: 'assets/logos/zenodo.png',
      url: 'https://zenodo.org/communities/2389-9484',
      alt: 'Zenodo'
    },
    {
      nombre: 'ERIH PLUS',
      logo: 'assets/logos/erihplus.jpg',
      url: 'https://kanalregister.hkdir.no/publiseringskanaler/erihplus/periodical/info?id=504017',
      alt: 'ERIH PLUS'
    },
    {
      nombre: 'REDIB',
      logo: 'assets/logos/redib.jpg',
      url: 'https://www.redib.org',
      alt: 'REDIB'
    },
    {
      nombre: 'LatinREV',
      logo: 'assets/logos/latinrev.jpg',
      url: 'https://latinrev.flacso.org.ar/revistas/ciencia-e-ingenieria',
      alt: 'LatinREV'
    }
  ];

  public readonly recursos: Recurso[] = [
    {
      titulo: 'Plantilla para artículos',
      descripcion: 'Documento base con la estructura formal que deben seguir los manuscritos sometidos a evaluación editorial.',
      icono: 'pi pi-file-word',
      tipo: 'descarga',
      url: 'assets/documentos/plantillacei2023.docx',
      download: 'plantilla_articulos_2023.docx'
    },
    {
      titulo: 'Declaración de originalidad',
      descripcion: 'Formato requerido para certificar la originalidad del manuscrito y el cumplimiento de criterios éticos y editoriales.',
      icono: 'pi pi-check-circle',
      tipo: 'descarga',
      url: 'assets/documentos/originalidad2023.docx',
      download: 'originalidad_2023.docx'
    },
    {
      titulo: 'Normas de publicación',
      descripcion: 'Consulta los lineamientos, requisitos editoriales, estructura del artículo y condiciones para la postulación.',
      icono: 'pi pi-book',
      tipo: 'externo',
      url: 'https://ia802602.us.archive.org/28/items/normascei2023/normascei2023.pdf'
    }
  ];

  constructor(
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    this.autenticado = !!token;

    if (!this.autenticado) {
      this.router.navigateByUrl('/login');
      return;
    }

    const yaMostroMensaje = sessionStorage.getItem('landing_success_shown');
    if (!yaMostroMensaje) {
      this.messageService.add({
        severity: 'success',
        summary: 'Bienvenido',
        detail: 'Ingreso exitoso a la plataforma.'
      });
      sessionStorage.setItem('landing_success_shown', 'true');
    }
  }

  trackByNombre(index: number, item: Indexador): string {
    return item.nombre;
  }

  trackByTitulo(index: number, item: Recurso): string {
    return item.titulo;
  }
}