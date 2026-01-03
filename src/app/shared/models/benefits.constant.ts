import { IBenefit } from './plan.interface';

export const freeBenefits = <IBenefit[]>[
  { icon: 'dollar', text: '5 Créditos por mês*' },
];

export const basicBenefits = <IBenefit[]>[
  { icon: 'dollar', text: '100 Créditos por mês*' },
  { icon: 'file-done', text: 'Salve e consulte suas análises' },
];

export const plusBenefits = <IBenefit[]>[
  { icon: 'plus', text: 'Tudo do Basic' },
  { icon: 'dollar', text: '500 Créditos por mês*' },
  { icon: 'bar-chart', text: 'Dados de uso detalhados' },
];

export const proBenefits = <IBenefit[]>[
  { icon: 'plus', text: 'Tudo do Plus' },
  { icon: 'dollar', text: '1500 Créditos por mês*' },
  {
    icon: 'ionSparklesOutline',
    text: 'Dê contexto para a IA, descreva do seu jeito',
  },
  { icon: 'ionHelpBuoyOutline', text: 'Suporte personalizado' },
];
