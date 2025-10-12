import { Component } from '@angular/core';
import { HeroVideo } from './sections/hero-video/hero-video';
import { SobreImmunotec } from './sections/sobre-immunotec/sobre-immunotec';
import { Asociate } from './sections/asociate/asociate';
import { VideoInfo } from './sections/video-info/video-info';
import { Imagenes } from './sections/imagenes/imagenes';
import { FortaleceSistema } from './sections/fortalece-sistema/fortalece-sistema';
import { CienciaDetras } from './sections/ciencia-detras/ciencia-detras';
import { Glutation } from './sections/glutation/glutation';
import { Platinum } from './sections/platinum/platinum';
import { OmegaGenv } from './sections/omega-genv/omega-genv';
import { Sport } from './sections/sport/sport';
import { Optimizer } from './sections/optimizer/optimizer';
import { Knutric } from './sections/knutric/knutric';
import { OportunidadIngresos } from './sections/oportunidad-ingresos/oportunidad-ingresos';
import { NegocioConsumidores } from './sections/negocio-consumidores/negocio-consumidores';
import { OportunidadNegocio } from './sections/oportunidad-negocio/oportunidad-negocio';
import { Contacto } from './sections/contacto/contacto';

@Component({
  selector: 'app-landing',
  imports: [
    HeroVideo,
    SobreImmunotec,
    Asociate,
    VideoInfo,
    Imagenes,
    FortaleceSistema,
    CienciaDetras,
    Glutation,
    Platinum,
    OmegaGenv,
    Sport,
    Optimizer,
    Knutric,
    OportunidadIngresos,
    NegocioConsumidores,
    OportunidadNegocio,
    Contacto,
  ],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class Landing {}
