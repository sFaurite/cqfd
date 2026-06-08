/**
 * Navigation du HUB multi-cours. Chaque cours a sa propre arborescence, préfixée
 * par son identifiant (/physique/…, /maths/…). Sidebar, fil d'Ariane, précédent/
 * suivant résolvent le cours courant d'après le PRÉFIXE D'URL.
 */
import { PARTIES as P_MATHS, type Partie, type Chapitre } from './_maths';
import { PARTIES as P_PHYS } from './_physique';
import { PARTIES as P_PROC } from './_processeurs';
import { PARTIES as P_COSMO } from './_cosmologie';
import { PARTIES as P_CHIMIE } from './_chimie';
import { PARTIES as P_RESEAUX } from './_reseaux';
import { PARTIES as P_HISTOIRE } from './_histoire';
import { PARTIES as P_IA } from './_ia';

export type { Partie, Chapitre };
export type CourseId =
  | 'physique'
  | 'maths'
  | 'processeurs'
  | 'cosmologie'
  | 'chimie'
  | 'reseaux'
  | 'histoire'
  | 'ia';

/** Préfixe tous les `path` d'une arborescence par la base du cours. */
function prefixer(parties: Partie[], base: string): Partie[] {
  return parties.map((p) => ({
    ...p,
    chapitres: p.chapitres.map((c) => ({ ...c, path: base + c.path })),
  }));
}

export const NAVS: Record<CourseId, Partie[]> = {
  physique: prefixer(P_PHYS, '/physique'),
  maths: prefixer(P_MATHS, '/maths'),
  processeurs: prefixer(P_PROC, '/processeurs'),
  cosmologie: prefixer(P_COSMO, '/cosmologie'),
  chimie: prefixer(P_CHIMIE, '/chimie'),
  reseaux: prefixer(P_RESEAUX, '/reseaux'),
  histoire: prefixer(P_HISTOIRE, '/histoire'),
  ia: prefixer(P_IA, '/ia'),
};

const COURSE_IDS = Object.keys(NAVS) as CourseId[];

export function courseIdFromPath(path: string): CourseId | null {
  const seg = path.replace(/^\//, '').split('/')[0];
  return (COURSE_IDS as string[]).includes(seg) ? (seg as CourseId) : null;
}

export function navFor(courseId: CourseId): Partie[] {
  return NAVS[courseId] ?? [];
}

const clean = (p: string) => p.replace(/\/$/, '');

function flat(courseId: CourseId) {
  return navFor(courseId).flatMap((partie) => partie.chapitres.map((chap) => ({ partie, chap })));
}

/** Chapitre + partie d'après la route complète (préfixée). */
export function chapByPath(path: string) {
  const cid = courseIdFromPath(path);
  if (!cid) return undefined;
  return flat(cid).find((e) => clean(e.chap.path) === clean(path));
}

/** Précédent / suivant, DANS le cours courant. */
export function prevNextByPath(path: string) {
  const cid = courseIdFromPath(path);
  if (!cid) return { precedent: null, suivant: null };
  const list = flat(cid);
  const i = list.findIndex((e) => clean(e.chap.path) === clean(path));
  return {
    precedent: i > 0 ? list[i - 1] : null,
    suivant: i >= 0 && i < list.length - 1 ? list[i + 1] : null,
  };
}
