'use client';

import InscriptionInitialForm, {
  PROGRAMME_INITIALE_ANNEE2,
} from '@/components/inscription-initial/InscriptionInitialForm';
import { FRAIS_ANNUELS_2A_CENTS, FRAIS_ANNUELS_2A_LABEL, FRAIS_BOURSIERS_2A_CENTS, FRAIS_BOURSIERS_2A_LABEL } from '@/lib/acompte';
import { PROGRESS_2A } from '@/lib/inscription-initial-progress';

export default function InscriptionInitial2aPage() {
  return (
    <InscriptionInitialForm
      progress={PROGRESS_2A}
      fraisAnnuelsCents={FRAIS_ANNUELS_2A_CENTS}
      fraisAnnuelsLabel={FRAIS_ANNUELS_2A_LABEL}
      fraisBoursiersLabel={FRAIS_BOURSIERS_2A_LABEL}
      fraisBoursiersCents={FRAIS_BOURSIERS_2A_CENTS}
      tarifCode="2a-5000"
      programme={PROGRAMME_INITIALE_ANNEE2}
    />
  );
}
