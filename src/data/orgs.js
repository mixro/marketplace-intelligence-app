// Organisations. Each role carries its own evidence. Brand relationships ("represents") are
// BRAND-LEVEL only: a directory listing a brand does not prove a specific model is stocked.

const SC = 'source_checked';
const CF = 'confirmed';
const NR = 'needs_review';
const SB = 'submitted';

export const orgs = [
  // ---------------------------- manufacturers / brands ----------------------------
  {
    id: 'victron', name: 'Victron Energy', legalName: 'Victron Energy B.V.', kind: 'manufacturer', country: 'Netherlands', city: 'Almere',
    address: 'The Paal 35, 1351 JG Almere', website: 'https://www.victronenergy.com',
    description: { en: 'Dutch manufacturer of inverter/chargers, MPPT solar charge controllers and monitoring equipment.', sw: 'Mtengenezaji wa Uholanzi wa chaja-inverta, vidhibiti chaji vya MPPT na vifaa vya ufuatiliaji.' },
    roles: [{ role: 'manufacturer', status: SC, src: ['victron_solarkontor'], note: 'Name and address come from a retailer page quoting the manufacturer; not yet checked on victronenergy.com.' }],
    brands: [], markets: ['Global'], keywords: 'victron energy netherlands dutch',
  },
  {
    id: 'deye', name: 'Deye', kind: 'manufacturer', country: null, city: null, address: null, website: null,
    description: { en: 'Manufacturer of hybrid solar inverters. Company details have not yet been researched from a primary source.', sw: 'Mtengenezaji wa inverta za hybrid za jua. Taarifa za kampuni bado hazijatafitiwa kutoka chanzo cha msingi.' },
    roles: [{ role: 'manufacturer', status: SC, src: ['deye_lirik'], note: 'Named as manufacturer on a retailer product page only.' }],
    brands: [], markets: ['Global'], keywords: 'deye hybrid inverter',
  },
  {
    id: 'epever', name: 'EPEVER', legalName: 'Beijing Epsolar Technology Co., Ltd.', kind: 'manufacturer', country: 'China', city: 'Beijing',
    address: null, website: 'https://www.epever.com',
    description: { en: 'Manufacturer of MPPT and PWM solar charge controllers, also listed under the legal name Beijing Epsolar Technology.', sw: 'Mtengenezaji wa vidhibiti chaji vya MPPT na PWM vya jua, pia anajulikana kisheria kama Beijing Epsolar Technology.' },
    roles: [{ role: 'manufacturer', status: CF, src: ['epever_digitec', 'enf_rex'], note: 'Country is the stated country of origin of the product (China); head-office address not recorded.' }],
    brands: [], markets: ['Global'], keywords: 'epever epsolar beijing china charge controller',
  },
  {
    id: 'lorentz', name: 'LORENTZ', legalName: 'BERNT LORENTZ GmbH & Co. KG', kind: 'manufacturer', country: 'Germany', city: 'Henstedt-Ulzburg',
    address: 'Siebenstuecken 24, 24558 Henstedt-Ulzburg', website: 'https://www.lorentz.de',
    description: { en: 'German manufacturer of solar water pumping systems (pump, motor and controller).', sw: 'Mtengenezaji wa Kijerumani wa mifumo ya kusukuma maji kwa jua (pampu, injini na kidhibiti).' },
    roles: [{ role: 'manufacturer', status: SC, src: ['lorentz_c'], note: 'Address and website printed on the company datasheet.' }],
    brands: [], markets: ['Global'], keywords: 'lorentz germany german solar pump',
  },
  {
    id: 'grundfos', name: 'Grundfos', kind: 'manufacturer', country: null, city: null, address: null, website: 'https://www.grundfos.com',
    description: { en: 'Pump manufacturer; the SQFlex range covers solar and AC/DC submersible pumps for water supply.', sw: 'Mtengenezaji wa pampu; safu ya SQFlex inajumuisha pampu za kuzamishwa kwa jua na AC/DC.' },
    roles: [{ role: 'manufacturer', status: SC, src: ['grundfos_us'], note: 'Seen on manufacturer literature. Head-office details not yet recorded.' }],
    brands: [], markets: ['Global'], keywords: 'grundfos sqflex pump denmark',
  },

  // ---------------------------- Tanzanian organisations ----------------------------
  {
    id: 'helvetic-solar', name: 'Helvetic Solar', kind: 'local', country: 'Tanzania', city: 'Dar es Salaam',
    address: '2nd Floor, Bains Avenue, Off Chole Road, Masaki, Dar es Salaam', website: 'https://helveticsolar.com',
    description: { en: 'Solar distributor/wholesaler listed in a public directory for Dar es Salaam, with Africa-wide service coverage.', sw: 'Msambazaji/muuzaji wa jumla wa vifaa vya jua aliyeorodheshwa katika orodha ya umma, Dar es Salaam.' },
    roles: [
      { role: 'distributor', status: NR, src: ['enf_helvetic'], note: 'The only source is a directory entry last updated 17 Dec 2018. Treat as possibly outdated until re-checked.' },
      { role: 'wholesaler', status: NR, src: ['enf_helvetic'], note: 'Same directory entry (2018).' },
    ],
    brands: [
      { brand: 'victron', status: NR, src: ['enf_helvetic'], note: 'Listed under inverters, charge controllers and storage in a 2018 directory entry.' },
      { brand: 'lorentz', status: NR, src: ['enf_helvetic'], note: 'Directory lists Lorentz under its panel category (2018 entry); confirm pump supply directly.' },
    ],
    markets: ['Tanzania', 'Africa (stated)'], keywords: 'helvetic solar masaki dar es salaam distributor wholesaler',
  },
  {
    id: 'gs-power', name: 'GS Power', legalName: 'GS Power Installations (Pty) Ltd.', kind: 'local', country: 'Tanzania', city: 'Dar es Salaam',
    address: 'P.O. Box 15073, Dar es Salaam', website: 'https://gspower.co.tz',
    description: { en: 'Solar installer listed for Dar es Salaam (smaller installations, battery storage, design).', sw: 'Mfungaji wa mifumo ya jua aliyeorodheshwa Dar es Salaam (mifumo midogo, hifadhi ya betri, usanifu).' },
    roles: [{ role: 'installer', status: SC, src: ['enf_gspower'], note: 'Directory entry updated 28 May 2025; smaller installations; design service.' }],
    brands: [{ brand: 'victron', status: SC, src: ['enf_gspower'], note: 'Listed as a Victron inverter supplier (brand level).' }],
    markets: ['Tanzania'], keywords: 'gs power installations installer dar es salaam',
  },
  {
    id: 'sepon', name: 'Sepon', legalName: 'Sepon Ltd', kind: 'local', country: 'Tanzania', city: 'Dar es Salaam',
    address: 'Mlimani Tower, 7th Floor, Opposite Mlimani City Mall, Dar es Salaam', website: 'https://www.sepon.co.tz',
    description: { en: 'Solar installer listed for Dar es Salaam (smaller installations, battery storage).', sw: 'Mfungaji wa mifumo ya jua aliyeorodheshwa Dar es Salaam (mifumo midogo, hifadhi ya betri).' },
    roles: [{ role: 'installer', status: SC, src: ['enf_sepon'], note: 'Directory entry updated 24 Jan 2025.' }],
    brands: [{ brand: 'victron', status: SC, src: ['enf_sepon'], note: 'Listed as a Victron inverter supplier (brand level).' }],
    markets: ['Tanzania'], keywords: 'sepon installer mlimani dar es salaam',
  },
  {
    id: 'rex-energy', name: 'Rex Energy', legalName: 'Rex Energy Limited', kind: 'local', country: 'Tanzania', city: 'Dar es Salaam',
    address: 'Rex Investment Building, Makamba St, Gerezania Area, PO Box 76578, Dar es Salaam', website: 'https://rexsolarenergy.com',
    description: { en: 'Solar installer listed for Dar es Salaam, covering smaller and 1 MWp+ installations. Parent company: Rex Investment Limited.', sw: 'Mfungaji wa mifumo ya jua Dar es Salaam, mifumo midogo hadi zaidi ya 1 MWp. Kampuni mama: Rex Investment Limited.' },
    roles: [{ role: 'installer', status: SC, src: ['enf_rex'], note: 'Directory entry updated 23 Jul 2024.' }],
    brands: [
      { brand: 'victron', status: SC, src: ['enf_rex'], note: 'Listed as a Victron inverter supplier (brand level).' },
      { brand: 'epever', status: SC, src: ['enf_rex'], note: 'Listed as an Epever (Beijing Epsolar) supplier (brand level).' },
    ],
    markets: ['Tanzania'], keywords: 'rex energy installer makamba dar es salaam',
  },
  {
    id: 'photons-energy', name: 'Photons Energy', legalName: 'Photons Energy Limited', kind: 'local', country: 'Tanzania', city: 'Arusha',
    address: 'Sakina, Opposite Suma JKT, Along Namanga Road, Arusha', website: 'https://photonsenergy.com',
    description: { en: 'Seller, installer and wholesaler listed in Arusha since 2012, with Tanzania-wide service coverage.', sw: 'Muuzaji, mfungaji na muuzaji wa jumla Arusha tangu 2012, anayehudumia Tanzania nzima.' },
    roles: [
      { role: 'wholesaler', status: SC, src: ['enf_photons'], note: 'Directory lists the company as wholesaler; established 2012.' },
      { role: 'installer', status: SC, src: ['enf_photons'], note: 'Listed under installers in the same directory.' },
    ],
    brands: [
      { brand: 'victron', status: SC, src: ['enf_photons'], note: 'Brand-level listing.' },
      { brand: 'lorentz', status: SC, src: ['enf_photons'], note: 'Directory lists Bernt Lorentz (brand level); pump models not specified.' },
    ],
    markets: ['Tanzania'], keywords: 'photons energy arusha namanga wholesaler installer',
  },
  {
    id: 'compact-energies', name: 'Compact Energies', legalName: 'Compact Energies Ltd', kind: 'local', country: 'Tanzania', city: 'Dar es Salaam',
    address: 'Masaki, Dar es Salaam', website: 'https://compactenergies.co.tz',
    description: { en: 'Solar installer listed for Masaki, Dar es Salaam. Also lists Fronius, Solis, Sunsynk, Dyness and Atess inverter suppliers (outside this prototype\'s catalogue).', sw: 'Mfungaji wa mifumo ya jua Masaki, Dar es Salaam. Pia anaorodhesha Fronius, Solis, Sunsynk, Dyness na Atess (nje ya katalogi ya mfano huu).' },
    roles: [{ role: 'installer', status: SC, src: ['enf_compact'], note: 'Directory entry updated 23 Feb 2026.' }],
    brands: [{ brand: 'victron', status: SC, src: ['enf_compact'], note: 'Listed as a Victron inverter supplier (brand level).' }],
    markets: ['Tanzania'], keywords: 'compact energies installer masaki dar es salaam',
  },
  {
    id: 'segen-tanzania', name: 'Segen Tanzania', kind: 'local', country: 'Tanzania', city: 'Dar es Salaam',
    address: null, website: null,
    description: { en: 'Distribution hub in Dar es Salaam launched by Segen to supply installers and EPCs in East Africa.', sw: 'Kituo cha usambazaji Dar es Salaam kilichozinduliwa na Segen kuhudumia wafungaji na EPC Afrika Mashariki.' },
    roles: [{ role: 'distributor', status: SC, src: ['segen_tz'], note: 'From a trade-press article. No brand list was seen, so no brand relationships are recorded.' }],
    brands: [], markets: ['Tanzania', 'East Africa'], keywords: 'segen tanzania distribution hub dar es salaam epc',
  },
  {
    id: 'gadgetronix', name: 'GadgetroniX', kind: 'local', country: 'Tanzania', city: 'Dar es Salaam',
    address: null, website: 'https://gadgetronix.net',
    description: { en: 'Self-described distributor of solar, water, security and communication equipment in Tanzania, with design and installation projects such as a Zanzibar villa.', sw: 'Anajieleza kuwa msambazaji wa vifaa vya jua, maji, usalama na mawasiliano Tanzania, pia husanifu na kufunga mifumo, mfano nyumba ya Zanzibar.' },
    roles: [
      { role: 'distributor', status: SB, src: ['gadgetronix_are'], note: 'Self-description inside an association case study; not independently confirmed.' },
      { role: 'installer', status: SC, src: ['gadgetronix_are'], note: 'Case study documents a completed design-supply-install project (Zanzibar, 21 May 2026).' },
    ],
    brands: [{ brand: 'victron', status: SC, src: ['gadgetronix_are'], note: 'Project used a Victron MultiPlus-II 3 kVA 48 V and a SmartSolar MPPT 150/45 (brand level for this prototype).' }],
    markets: ['Tanzania'], keywords: 'gadgetronix zanzibar distributor installer solar water',
  },
];

export const ROLE_KEYS = ['manufacturer', 'distributor', 'wholesaler', 'installer'];
