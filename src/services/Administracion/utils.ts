// permisos/utils.ts
import type {
  PermisosRaw, PermisosHydrated, PermisoGrupoRaw, PermisoGrupoHydrated,
  PermisosGlobalesState, PermisosIndividualesState,
} from "@/models/permisos";

import type { Accion } from "@/models/accion";
import type { Recurso } from "@/models/recurso";

/** Parsea "plantilla:690..." -> { prefix: 'plantilla' | undefined, id: '690...' } */
export function parseRecursoRef(ref: string) {
  if (!ref) return { prefix: undefined, id: ref };
  const parts = ref.split(':', 2);
  if (parts.length === 2) return { prefix: parts[0], id: parts[1] };
  return { prefix: undefined, id: ref };
}

/** Convierte estado interno -> PermisosRaw (para enviar al backend) */
export function buildPermisosRaw(
  globales: PermisosGlobalesState,
  individuales: PermisosIndividualesState
): PermisosRaw {
  const procesar = (obj: Record<string, string[]>, prefix?: string): PermisoGrupoRaw[] =>
    Object.entries(obj)
      .filter(([, acciones]) => acciones.length > 0)
      .map(([recursoId, acciones]) => ({
        recurso: prefix ? `${prefix}:${recursoId}` : recursoId,
        acciones: [...new Set(acciones)] // dedupe por si acaso
      }));

  const allowed = [
    ...procesar(globales.allowed),
    ...procesar(individuales.allowed.plantilla, 'plantilla'),
    ...procesar(individuales.allowed.documento, 'documento')
  ];

  const denied = [
    ...procesar(globales.denied),
    ...procesar(individuales.denied.plantilla, 'plantilla'),
    ...procesar(individuales.denied.documento, 'documento')
  ];

  return { allowed: allowed.length ? allowed : undefined, denied: denied.length ? denied : undefined };
}

/** Hidrata PermisosRaw -> PermisosHydrated usando mapas por id de recursos/acciones.
 *  recursosMap: { [id]: Recurso }, accionesMap: { [id]: Accion }
 */
export function hydratePermisos(
  raw: PermisosRaw | undefined,
  recursosMap: Record<string, Recurso>,
  accionesMap: Record<string, Accion>
): PermisosHydrated {
  if (!raw) return {};

  const procesar = (arr?: { recurso: string; acciones: string[] }[]) => {
    if (!arr) return undefined;
    return arr.map(item => {
      const { prefix, id } = parseRecursoRef(item.recurso);
      const recursoObj = recursosMap[id] || { id, nombre: id, tipo: prefix } as Recurso;
      const accionesObjs = (item.acciones || []).map(aid => accionesMap[aid] || ({ id: aid, nombre: aid } as Accion));
      return { recurso: recursoObj, acciones: accionesObjs } as PermisoGrupoHydrated;
    });
  };

  return {
    allowed: procesar(raw.allowed),
    denied: procesar(raw.denied)
  };
}

/** Carga un PermisosHydrated (o Raw) en el estado interno del componente (globales/individuales)
 *  Retorna { permisosGlobales, permisosIndividuales } ya inicializados.
 */
export function loadPermisosToState(
  permisos: PermisosHydrated | PermisosRaw | undefined,
  // for when we receive hydrated objects but we need the ids
): { permisosGlobales: PermisosGlobalesState; permisosIndividuales: PermisosIndividualesState } {
  // init empty
  const permisosGlobales: PermisosGlobalesState = { allowed: {}, denied: {} };
  const permisosIndividuales: PermisosIndividualesState = {
    allowed: { plantilla: {}, documento: {} },
    denied: { plantilla: {}, documento: {} }
  };

  if (!permisos) return { permisosGlobales, permisosIndividuales };

  const processEntry = (recursoStrOrObj: any, accionesArr: any[], modo: 'allowed' | 'denied') => {
    // recurso puede ser string ("plantilla:ID") o objeto (hidratado)
    if (typeof recursoStrOrObj === 'string') {
      const { prefix, id } = parseRecursoRef(recursoStrOrObj);
      if (!prefix) {
        permisosGlobales[modo][id] = permisosGlobales[modo][id] || [];
        permisosGlobales[modo][id].push(...(accionesArr || []));
      } else {
        permisosIndividuales[modo][prefix as 'plantilla' | 'documento'][id] =
          permisosIndividuales[modo][prefix as 'plantilla' | 'documento'][id] || [];
        permisosIndividuales[modo][prefix as 'plantilla' | 'documento'][id].push(...(accionesArr || []));
      }
      return;
    }

    // si es objeto hidratado: recurso.id y recurso.tipo
    const recursoObj: Recurso = recursoStrOrObj as Recurso;
    const tipo = (recursoObj.tipo || '').toLowerCase();
    if (tipo === 'ruta' || !tipo) {
      permisosGlobales[modo][recursoObj.id] = permisosGlobales[modo][recursoObj.id] || [];
      const ids = (accionesArr || []).map(a => (typeof a === 'string' ? a : a.id));
      permisosGlobales[modo][recursoObj.id].push(...ids);
    } else {
      const t = tipo.includes('plantilla') ? 'plantilla' : 'documento';
      permisosIndividuales[modo][t][recursoObj.id] = permisosIndividuales[modo][t][recursoObj.id] || [];
      const ids = (accionesArr || []).map(a => (typeof a === 'string' ? a : a.id));
      permisosIndividuales[modo][t][recursoObj.id].push(...ids);
    }
  };

  // soporta raw or hydrated
  if ((permisos as any).allowed) {
    (permisos as any).allowed.forEach((p: any) => processEntry(p.recurso, p.acciones, 'allowed'));
  }
  if ((permisos as any).denied) {
    (permisos as any).denied.forEach((p: any) => processEntry(p.recurso, p.acciones, 'denied'));
  }

  // Normaliza arrays: dedupe
  const dedupeRecord = (rec: Record<string, string[]>) => {
    for (const k in rec) {
      rec[k] = Array.from(new Set(rec[k]));
    }
  };
  dedupeRecord(permisosGlobales.allowed);
  dedupeRecord(permisosGlobales.denied);
  Object.values(permisosIndividuales.allowed.plantilla).forEach((v, i) => permisosIndividuales.allowed.plantilla[i] = Array.from(new Set(v)));
  Object.values(permisosIndividuales.allowed.documento).forEach((v, i) => permisosIndividuales.allowed.documento[i] = Array.from(new Set(v)));
  Object.values(permisosIndividuales.denied.plantilla).forEach((v, i) => permisosIndividuales.denied.plantilla[i] = Array.from(new Set(v)));
  Object.values(permisosIndividuales.denied.documento).forEach((v, i) => permisosIndividuales.denied.documento[i] = Array.from(new Set(v)));

  return { permisosGlobales, permisosIndividuales };
}
