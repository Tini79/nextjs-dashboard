'use server' // kita bikin server action di sini

import { sql } from '@vercel/postgres';
import { z } from 'Zod'
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// const FormSchema = z.object({
//   id: z.string(),
//   customerId: z.string(),
//   amount: z.coerce.number(), // The amount field is specifically set to coerce (change) from a string to a number while also validating its type
//   status: z.enum(['pending', 'paid']),
//   date: z.string()
// })

// attempting to do Server-Side validation
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({
    required_error: 'Please select a customer.'
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    required_error: 'Please select an invoice status.'
  }),
  date: z.string()
})

const CreateInvoice = FormSchema.omit({ id: true, date: true })
const UpdateInvoice = FormSchema.omit({ id: true, date: true })

export type State = {
  errors?: {
    customerId: string[],
    amount?: string[],
    status?: string[]
  }
  message?: string | null
}

// export async function createInvoice(formData: FormData) {
// attempting to do Server-Side validation, make the component accepts 2 parameters  
export async function createInvoice(prevState: State, formData: FormData) { // prevSate > mengandung state yg dikirm dari useFormState hook
  // const rawFormData = {
  //   customerId: formData.get('customerId'),
  //   amount: formData.get('amount'),
  //   status: formData.get('status')
  // }
  const rawFormData = Object.fromEntries(formData.entries()) // in case mau ngolah data dlm jumlah banyak gunakan entries(), supaya nggak initialize satu" kyk di atas

  // attempting to do Server-Side validation, make the component accepts 2 parameters
  const validatedFields = CreateInvoice.safeParse(rawFormData) // safeParse akan mengembalikan object yg mengandung either success | error field, ini membantu untuk handle validation gracefully tanpa perlu menaruhnya dlm try/catch blok 

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.'
    }
  }

  // Prepare data for insertion into the database
  const { customerId, amount, status } = CreateInvoice.parse(rawFormData)
  const amountInCents = amount * 100 // convert the amount into cent
  const date = new Date().toISOString().split('T')[0] // get date in YYYY-MM-DD format

  try {
    // inserting data into database
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Create Invoice!'
    }
  }

  revalidatePath('/dashboard/invoices') // untuk membersihkan cache dan trigger request baru ke server, dan setelah path ter-revalidasi, selanjutnya data baru bakalan diterima dari server
  redirect('/dashboard/invoices') // mengarahkan ke page yg disebutkan dlm parameter
}

// export async function updateInvoice(id: string, formData: FormData) {
export async function updateInvoice(id: string, prevState: State, formData: FormData) { // pengambilan argument diambil dari belakang bukan depan, makanya prevState ditaruh di urutan kedua instead of paling depan kyk createInvoice function
  const rawFormData = Object.fromEntries(formData.entries())

  // do validation
  const validatedFields = UpdateInvoice.safeParse(rawFormData)
  console.log(validatedFields, 'validatedFields');

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Update Invoice.'
    }
  }

  const { customerId, amount, status } = UpdateInvoice.parse(rawFormData)
  const amountInCent = amount * 100

  try {
    await sql`
      UPDATE invoices 
      SET customer_id = ${customerId}, amount = ${amountInCent}, status = ${status}
      WHERE invoices.id = ${id}
    `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Update Invoice!'
    }
  }

  revalidatePath('/dashboard/invoices')
  redirect('/dashboard/invoices')
}

export async function deleteInvoice(id: string) {
  // See error.tsx
  // uncomment this to try, trying throw error for testing
  // throw new Error('Failed to Delete Invoice!')

  try {
    await sql`
      DELETE FROM invoices
      WHERE id = ${id}
    `;
  } catch (error) {
    return {
      message: 'Database Error: Failed to Delete Invoice!'
    }
  }

  revalidatePath('/dashboard/invoices')
}