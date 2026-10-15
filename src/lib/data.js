import { sources, sourcesById as baseSources } from '../data/sources.js';
import { categories, attrDefs, products as baseProducts } from '../data/catalog.js';
import { orgs } from '../data/orgs.js';
import { offers, problems } from '../data/misc.js';
import { weakestStatus } from './format.js';

const LOCAL_ROLES = ['distributor', 'wholesaler', 'installer'];

// Merge static data with the admin's browser-local overrides and custom products.
export function buildData({ overrides = {}, customProducts = [] } = {}) {
  const sourcesById = { ...baseSources };
  customProducts.forEach((p) => (p.extraSources || []).forEach((s) => { sourcesById[s.id] = s; }));

  const merge = (p) => {
    const claims = {};
    Object.entries(p.attrs).forEach(([k, base]) => {
      const o = overrides[`${p.id}.${k}`];
      claims[k] = o ? { ...base, ...o, edited: true } : base;
    });
    return { ...p, claims };
  };

  const prods = [...baseProducts, ...customProducts].map(merge);
  const productsById = Object.fromEntries(prods.map((p) => [p.id, p]));
  const orgsById = Object.fromEntries(orgs.map((o) => [o.id, o]));

  const localSuppliersFor = (product) =>
    orgs
      .filter((o) => o.kind === 'local')
      .map((o) => {
        const rel = o.brands.find((b) => b.brand === product.brand);
        return rel ? { org: o, rel } : null;
      })
      .filter(Boolean);

  const productsForOrg = (org) => {
    if (org.kind === 'manufacturer') return prods.filter((p) => p.brand === org.id);
    const brandIds = org.brands.map((b) => b.brand);
    return prods.filter((p) => brandIds.includes(p.brand));
  };

  const productStatus = (p) => weakestStatus(Object.values(p.claims).map((c) => c.status));
  const completeness = (p) => {
    const defs = attrDefs[p.category] || [];
    const filled = defs.filter((d) => p.claims[d.key] && p.claims[d.key].v !== undefined && p.claims[d.key].v !== null && p.claims[d.key].v !== '').length;
    return { filled, total: defs.length };
  };

  return {
    sources, sourcesById, categories, attrDefs, products: prods, productsById, orgs, orgsById,
    offers, problems, localSuppliersFor, productsForOrg, productStatus, completeness, LOCAL_ROLES,
  };
}
