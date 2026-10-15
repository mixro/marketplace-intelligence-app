// Reference price listings (non-Tanzanian), and research problems/needs.
// There are NO verified Tanzanian prices or stock records yet: that needs field research.

export const offers = [
  { id: 'o-deye-7sun', product: 'deye-sun-5k-sg04lp3-eu', supplier: '7sun.eu', market: 'EU (reference only)', price: 1756.86, currency: 'EUR',
    basis: 'gross', availability: 'Listed (stock not stated)', src: ['deye_7sun'], checked: '2026-10-15', note: 'Price shown as "gross"; shipping not included.' },
  { id: 'o-vic-fvc', product: 'victron-smartsolar-150-60-tr', supplier: 'FV Componentes', market: 'EU (reference only)', price: 315.58, currency: 'EUR',
    basis: 'incl. taxes', availability: 'Listed (stock not stated)', src: ['victron_fvc'], checked: '2026-10-15', note: '' },
  { id: 'o-vic-solarkontor', product: 'victron-smartsolar-150-60-tr', supplier: 'Solarkontor', market: 'EU (reference only)', price: 363.13, currency: 'EUR',
    basis: 'incl. tax', availability: 'Listed (stock not stated)', src: ['victron_solarkontor'], checked: '2026-10-15', note: 'Prices for the same product differ by about 15% between the two EU listings.' },
  { id: 'o-lor-solarwind', product: 'lorentz-ps2-600-c', supplier: 'Solar-Wind.co.uk', market: 'UK (reference only)', price: 2595.78, currency: 'GBP',
    basis: 'excl. tax', availability: 'Check lead time before ordering', src: ['lorentz_solarwind'], checked: '2026-10-15', note: 'Pump plus controller; the listing asks buyers to check lead time.' },
  { id: 'o-grf-solarstore', product: 'grundfos-15-sqf-290', supplier: 'The Solar Store', market: 'US (reference only)', price: 3299.0, currency: 'USD',
    basis: 'sale price', availability: 'Listed (stock not stated)', src: ['grundfos_solarstore_15'], checked: '2026-10-15', note: '' },
];

// Problems/needs are team hypotheses, NOT validated market problems.
export const problems = [
  {
    id: 'home-backup-power', category: 'inverters',
    title: { en: 'Keep a home or small business powered during outages', sw: 'Kuwa na umeme nyumbani au biashara ndogo wakati wa kukatika kwa umeme' },
    description: { en: 'Households and small businesses with unreliable grid supply look for inverter/charger or hybrid inverter systems with battery storage.', sw: 'Kaya na biashara ndogo zenye umeme usioaminika hutafuta mifumo ya inverta yenye betri.' },
    group: { en: 'Households, small businesses, installers', sw: 'Kaya, biashara ndogo, wafungaji' },
    research: { en: 'Hardware options are recorded for 3 inverters. Battery pricing, local warranty handling and Tanzanian approval requirements are not yet researched.', sw: 'Chaguo za vifaa zimerekodiwa kwa inverta 3. Bei za betri, dhamana ya ndani na mahitaji ya idhini ya Tanzania bado hayajatafitiwa.' },
    keywords: 'backup power outage blackout home business inverter battery umeme kukatika nyumbani biashara akiba',
    related: ['victron-multiplus-ii-48-3000', 'victron-multiplus-ii-48-5000', 'deye-sun-5k-sg04lp3-eu'],
  },
  {
    id: 'borehole-solar-pumping', category: 'pumps',
    title: { en: 'Pump water from a borehole or well using solar power', sw: 'Kusukuma maji kutoka kisima au kisima kirefu kwa nishati ya jua' },
    description: { en: 'Farms, communities and institutions without reliable grid power look for solar pumping systems sized to depth and daily volume.', sw: 'Mashamba, jamii na taasisi zisizo na umeme wa uhakika hutafuta mifumo ya pampu za jua kulingana na kina na kiasi cha maji.' },
    group: { en: 'Farmers, community water projects, engineers', sw: 'Wakulima, miradi ya maji ya jamii, wahandisi' },
    research: { en: 'Pump hardware from two manufacturers is recorded. Sizing data (borehole depth, yield) and local drilling/installation partners are not yet covered.', sw: 'Vifaa vya pampu kutoka kwa watengenezaji wawili vimerekodiwa. Data ya ukubwa wa mfumo na wafungaji wa ndani bado hazijajumuishwa.' },
    keywords: 'borehole well pump water solar pumping farm community kisima pampu maji jua shamba',
    related: ['lorentz-ps2-150-c', 'lorentz-ps2-600-c', 'lorentz-ps2-1800-c', 'grundfos-sqflex-range', 'grundfos-15-sqf-290'],
  },
  {
    id: 'solar-battery-charging', category: 'mppt',
    title: { en: 'Charge a battery bank directly from solar panels', sw: 'Kuchaji betri moja kwa moja kutoka paneli za jua' },
    description: { en: 'Off-grid and solar home systems need a controller matched to panel voltage, battery voltage and charge current.', sw: 'Mifumo ya jua nje ya gridi inahitaji kidhibiti kinacholingana na volteji ya paneli, betri na mkondo wa kuchaji.' },
    group: { en: 'Solar installers, DIY builders, students', sw: 'Wafungaji wa jua, wajenzi binafsi, wanafunzi' },
    research: { en: 'Two MPPT controllers are recorded. Coverage of other controller sizes and PWM options is not yet researched.', sw: 'Vidhibiti viwili vya MPPT vimerekodiwa. Ukubwa mwingine na PWM bado hazijatafitiwa.' },
    keywords: 'charge battery solar panel controller mppt off-grid kuchaji betri paneli jua',
    related: ['victron-smartsolar-150-60-tr', 'epever-tracer-4210an'],
  },
  {
    id: 'automatic-irrigation-flow-control', category: 'pumps',
    title: { en: 'Automatic water flow control for irrigation', sw: 'Udhibiti wa kiotomatiki wa mtiririko wa maji kwa umwagiliaji' },
    description: { en: 'The scenario in the project brief: automate when and how much water flows to crops. A full solution combines a pump with flow sensors, valves, soil-moisture sensing and a controller.', sw: 'Mfano kutoka kwenye andiko la mradi: kuendesha kiotomatiki lini na kiasi gani cha maji kinatiririka mashambani. Suluhisho kamili huunganisha pampu, vipima mtiririko, valvu, vipima unyevu na kidhibiti.' },
    group: { en: 'Farmers, engineering students, system integrators', sw: 'Wakulima, wanafunzi wa uhandisi, waunganishaji wa mifumo' },
    research: { en: 'PARTLY COVERED. Only the pumping hardware is in this dataset. Flow sensors, automated valves, irrigation controllers and soil sensors are not yet recorded, so nothing here shows whether a gap exists. This is a lead for research, not a validated opportunity.', sw: 'IMEFUNIKWA SEHEMU. Vifaa vya kusukuma tu viko kwenye data hii. Vipima mtiririko, valvu, vidhibiti vya umwagiliaji na vipima unyevu bado havijarekodiwa, kwa hiyo haionyeshi kama pengo lipo. Hii ni dalili ya kufanyia utafiti, si fursa iliyothibitishwa.' },
    keywords: 'automatic water flow control irrigation valve flow sensor controller soil moisture umwagiliaji udhibiti mtiririko maji kiotomatiki',
    related: ['lorentz-ps2-600-c', 'lorentz-ps2-600-cs-f', 'grundfos-sqflex-range'],
  },
];
