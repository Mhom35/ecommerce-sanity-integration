import React from 'react';
import Head from 'next/head';//head like in html to give meta data

import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Head>
        <title>Mitchell's Store</title>
      </Head>
      <header>
        <Navbar />
      </header>
      <main className="main-container">
        {children}
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  )
}

export default Layout


