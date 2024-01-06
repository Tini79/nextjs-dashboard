import { lusitana } from '../../ui/fonts'
import RevenueChart from '../../ui/dashboard/revenue-chart'
import LatestInvoices from '../../ui/dashboard/latest-invoices'
import {Suspense} from 'react'
import {RevenueChartSkeleton, LatestInvoicesSkeleton, CardsSkeleton} from '@/app/ui/skeletons'
import CardWrapper, { Card } from '@/app/ui/dashboard/cards'
import { fetchCardData, fetchLatestInvoices, fetchRevenue } from '@/app/lib/data'

export default async function Dashboard() {
  // return <p>Dashboard Page</p>;
  // const revenue = await fetchRevenue()
  // const latestInvoices = await fetchLatestInvoices()
  // const {
  //   numberOfCustomers,
  //   numberOfInvoices,
  //   totalPaidInvoices,
  //   totalPendingInvoices
  // } = await fetchCardData()
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* <Card title="Collected" value={totalPaidInvoices} type="collected"/>
        <Card title="Pending" value={totalPendingInvoices} type="pending"/>
        <Card title="Total Invoices" value={numberOfInvoices} type="invoices"/>
        <Card title="Total Customers" value={numberOfCustomers} type="customers"/> */}
        <Suspense fallback={<CardsSkeleton />} > {/* penggunaan suspense  untuk melakukan loading pada component tertentu saja */}
          <CardWrapper/>
        </Suspense>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        {/* <RevenueChart revenue={revenue}/>
        <LatestInvoices latestInvoices={latestInvoices}/> */}
        <Suspense fallback={<RevenueChartSkeleton/>}>
          <RevenueChart />
        </Suspense>
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          <LatestInvoices />
        </Suspense>
      </div>
    </main>
  )
}