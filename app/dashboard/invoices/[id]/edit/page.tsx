import { fetchCustomers, fetchInvoiceById } from "@/app/lib/data";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import Form from "@/app/ui/invoices/edit-form";
import { notFound } from "next/navigation";
import { Metadata } from 'next';

export const metadata: Metadata = {
  // assigning metadata title for every page
  //   title: 'Invoices | Acme Dashboard'
  // ngirim title doang ke file layout.tsx root
  title: 'Edit Invoices'
}

export default async function Edit({ params }: { params: { id: string } }) {
  const id = params.id
  const [invoice, customers] = await Promise.all([fetchInvoiceById(id), fetchCustomers()])

  // notFound will take precedence over error.tsx
  if (!invoice) notFound()

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          { label: 'Edit Invoices', href: `/dashboard/invoices/${id}/edit`, active: true }
        ]}
      />
      <Form invoice={invoice} customers={customers} />
    </main>
  )
}