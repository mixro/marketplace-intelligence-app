import React from 'react';
import { useRoute } from './lib/router.js';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Search from './pages/Search.jsx';
import Product from './pages/Product.jsx';
import Org from './pages/Org.jsx';
import Compare from './pages/Compare.jsx';
import Category from './pages/Category.jsx';
import Problem from './pages/Problem.jsx';
import Admin from './pages/Admin.jsx';
import About from './pages/About.jsx';
import { useApp } from './lib/store.jsx';
import { A, Empty } from './components/ui.jsx';

export default function App() {
  const route = useRoute();
  const { t } = useApp();
  const [page, arg] = route.segs;
  let view;
  switch (page) {
    case undefined: view = <Home />; break;
    case 'search': view = <Search route={route} />; break;
    case 'product': view = <Product id={arg} />; break;
    case 'org': view = <Org id={arg} />; break;
    case 'compare': view = <Compare route={route} />; break;
    case 'category': view = <Category id={arg} />; break;
    case 'problem': view = <Problem id={arg} />; break;
    case 'admin': view = <Admin />; break;
    case 'about': view = <About />; break;
    default:
      view = <div className="container page"><Empty title={t('common.notFound')}><A to="/" className="btn btn-primary">{t('nav.home')}</A></Empty></div>;
  }
  return <Layout route={route}>{view}</Layout>;
}
