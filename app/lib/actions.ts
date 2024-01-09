'use server' // kita bikin server action di sini
import { sql } from '@vercel/postgres';
import { z } from 'Zod'
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const FormSchema = z.object({
  id: z.string(),
  customerId: z.string(),
  amount: z.coerce.number(), // The amount field is specifically set to coerce (change) from a string to a number while also validating its type
  status: z.enum(['pending', 'paid']),
  date: z.string()
})

const CreateInvoice = FormSchema.omit({ id: true, date: true })

export async function createInvoice(formData: FormData) {
  // const rawFormData = {
  //   customerId: formData.get('customerId'),
  //   amount: formData.get('amount'),
  //   status: formData.get('status')
  // }
  const rawFormData = Object.fromEntries(formData.entries()) // in case mau ngolah data dlm jumlah banyak gunakan entries(), supaya nggak initialize satu" kyk di atas
  
  const { customerId, amount, status } = CreateInvoice.parse(rawFormData)
  const amountInCents = amount * 100 // convert the amount into cent
  const date = new Date().toISOString().split('T')[0] // get date in YYYY-MM-DD format

  // inserting data into database
  await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;

  revalidatePath('/dashboard/invoices') // untuk membersihkan cache dan trigger request baru ke server, dan setelah path ter-revalidasi, selanjutnya data baru bakalan diterima dari server
  redirect('/dashboard/invoices') // mengarahkan ke page yg disebutkan dlm parameter
}
