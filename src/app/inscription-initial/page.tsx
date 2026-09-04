'use client';

import InscriptionInitialForm, {
  PROGRAMME_INITIALE_STANDARD,
} from '@/components/inscription-initial/InscriptionInitialForm';
import {
  FRAIS_ANNUELS_CENTS,
  FRAIS_ANNUELS_LABEL,
  FRAIS_BOURSIERS_CENTS,
  FRAIS_BOURSIERS_LABEL,
} from '@/lib/acompte';
import { PROGRESS_STANDARD } from '@/lib/inscription-initial-progress';

export default function InscriptionInitialPage() {
  return (
    <InscriptionInitialForm
      progress={PROGRESS_STANDARD}
      fraisAnnuelsCents={FRAIS_ANNUELS_CENTS}
      fraisAnnuelsLabel={FRAIS_ANNUELS_LABEL}
      fraisBoursiersLabel={FRAIS_BOURSIERS_LABEL}
      fraisBoursiersCents={FRAIS_BOURSIERS_CENTS}
      programme={PROGRAMME_INITIALE_STANDARD}
    />
  );
}
