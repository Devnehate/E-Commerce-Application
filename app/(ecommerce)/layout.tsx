import Footer from '@/components/footer';
import Navbar from '@/components/navbar';
import React from 'react'

function layout(
    {
        children,
      }: Readonly<{
        children: React.ReactNode;
      }>
) {
    return (
      <div>
            <Navbar />
            <div className='py-20'>{children}</div>
            
            <Footer />
      </div>
  )
}

export default layout