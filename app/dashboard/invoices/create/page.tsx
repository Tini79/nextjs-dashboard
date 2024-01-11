import Form from '@/app/ui/invoices/create-form'
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs'
import { fetchCustomers } from '@/app/lib/data'
import { Metadata } from 'next';

export const metadata: Metadata = {
  // assigning metadata title for every page
  //   title: 'Invoices | Acme Dashboard'
  // ngirim title doang ke file layout.tsx root
  title: 'Create Invoices'
}

export default async function Create() {
  const customers = await fetchCustomers()

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          { label: 'Create Invoice', href: '/dashboard/invoices/create', active: true }
        ]}
      />
      <Form customers={customers} />
    </main>
  )
}