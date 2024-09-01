import dynamic from 'next/dynamic';
import React from 'react'

const DynamicContent = dynamic(()=>{return import('./Expense')}, {ssr: false});

function Page() {
  return (
    <DynamicContent />
  )
}

export default Page