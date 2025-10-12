import {
  bootstrapApplication,
  BootstrapContext,
} from '@angular/platform-browser';
import { App } from './app/app';
import { config } from './app/app.config.server';

// 🎯 CAMBIO CLAVE: La función debe aceptar el 'context' y pasarlo como tercer argumento.
// La importación de 'BootstrapContext' ayuda con el tipado, pero 'any' también funciona si no puedes importarlo fácilmente.
const bootstrap = (context: BootstrapContext) =>
  bootstrapApplication(App, config, context);
//                                ^ Tipo requerido             ^ Componente ^ Config ^ Contexto

export default bootstrap;
