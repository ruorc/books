import { Outlet } from 'react-router-dom';
import Footer from './footer/Footer';
import Header from './header/Header';
import Main from './main/Main';

function Layout() {
  return (
    <div className="flex flex-col min-h-full bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      <Header />
      <Main>
        <Outlet />
      </Main>
      <Footer />
    </div>
  );
}

export default Layout;
