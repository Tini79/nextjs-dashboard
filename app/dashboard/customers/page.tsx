import { Metadata } from 'next';

export const metadata: Metadata = {
  // assigning metadata title for every page
  //   title: 'Invoices | Acme Dashboard'
  // ngirim title doang ke file layout.tsx root
  title: 'Customers'
}

export default function Customers() {
  return <p>Customers Page</p>;
}