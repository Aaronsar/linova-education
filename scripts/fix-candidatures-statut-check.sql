-- Autorise le statut "desinscrit" (Désinscrire / réorienter).
-- À coller dans Supabase → SQL Editor → Run.

ALTER TABLE candidatures DROP CONSTRAINT IF EXISTS candidatures_statut_check;
ALTER TABLE candidatures ADD CONSTRAINT candidatures_statut_check
  CHECK (
    statut IS NULL OR statut IN (
      'nouveau',
      'en_cours',
      'entretien',
      'accepte',
      'accepte_alternance',
      'accepte_initial',
      'desinscrit',
      'refuse'
    )
  );
