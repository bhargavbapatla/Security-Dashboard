import { type FC } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Card } from '../components/ui/card'
import { Label } from '../components/ui/label'
import { Input } from '../components/ui/input'
import { Checkbox } from '../components/ui/checkbox'
import { Button } from '../components/ui/button'

type LoginValues = {
  firstName: string
  lastName: string
  email: string
  password: string
  agree: boolean
}

const validationSchema = Yup.object({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(8, 'Min 8 characters').required('Password is required'),
  agree: Yup.boolean().oneOf([true], 'You must agree to the terms'),
})

const SocialIcon = ({ id }: { id: string }) => {
  if (id === 'apple') {
    return (
      <svg className="h-5 w-5" viewBox="0 0 24 24">
        <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.21-1.23 3.91-1.12 1.57.11 2.77.63 3.55 1.74-2.89 1.72-2.38 5.76.68 7.05-.59 1.51-1.53 3.02-3.22 4.56zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.16 2.29-2.04 4.14-3.74 4.25z" fill="black" />
      </svg>
    )
  }
  if (id === 'google') {
    return (
      <svg className="h-5 w-5" viewBox="0 0 24 24">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
      </svg>
    )
  }
  if (id === 'meta') {
    return (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" fill="#007AFF" />
      </svg>
    )
  }
  return null
}

const socials = ['apple', 'google', 'meta']

export const Login: FC = () => {
  const initialValues: LoginValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    agree: false,
  }

  const handleSubmit = async (values: LoginValues) => {
    await new Promise((r) => setTimeout(r, 500))
    console.log(values)
  }

  return (
    <>
      {/* Logo fixed top-left over entire page */}
      <div className="fixed left-6 top-5 z-50 flex items-center gap-2">
        <span className="h-3 w-3 rounded-full bg-[#0CC8A8]" />
        <span className="text-sm font-semibold tracking-wide text-white">aps</span>
      </div>

      {/* Full-page gradient background */}
      <div
        className="grid min-h-screen grid-cols-1 lg:grid-cols-2"
        style={{
          background: `
            radial-gradient(ellipse 60% 60% at 10% 90%, rgba(12,200,168,0.30) 0%, transparent 60%),
            radial-gradient(ellipse 55% 55% at 90% 10%, rgba(255,92,0,0.30) 0%, transparent 60%),
            #0b0b0c
          `
        }}
      >
        {/* Left panel */}
        <div className="relative hidden items-center justify-start p-12 lg:flex">
          <div className="max-w-xl space-y-6">
            <h1 className="text-5xl font-semibold leading-tight text-white">
              Expert level Cybersecurity
              <br /> in <span className="text-[#0CC8A8]">hours</span> not weeks.
            </h1>
            <div>
              <p className="mb-3 text-sm font-medium text-gray-300">What's included</p>
              <ul className="space-y-2">
                {[
                  'Effortlessly spider and map targets to uncover hidden security flaws',
                  'Deliver high‑quality, validated findings in hours, not weeks.',
                  'Generate professional, enterprise‑grade security reports automatically.',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-gray-300">
                    <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#0CC8A8]/15 text-[#0CC8A8]">✓</span>
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Updated Trustpilot Rating text sizing */}
            <div className="pt-4 space-y-1">
              <div className="text-sm font-medium text-white flex items-center gap-2">
                <span className="text-[#0CC8A8] text-lg">★</span> Trustpilot
              </div>
              <div className="text-white">
                <span className="text-2xl font-bold tracking-tight">Rated 4.5/5.0</span> 
                <span className="text-gray-400 font-normal text-sm ml-2">(100k+ reviews)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="flex items-center justify-center p-6">
          {/* Removed dark mode classes from Card to keep it purely white */}
          <Card className="w-full max-w-md bg-white p-8 text-gray-900 shadow-2xl border-gray-100">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-semibold text-gray-900">Sign up</h1>
              <p className="mt-2 text-sm text-gray-500">
                Already have an account?{' '}
                <a className="font-medium text-[#0CC8A8] hover:underline" href="#">
                  Log in
                </a>
              </p>
            </div>

            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
              {({ isSubmitting, setFieldValue, values }) => (
                <Form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-gray-700">First name*</Label>
                    <Field
                      as={Input}
                      id="firstName"
                      name="firstName"
                      placeholder="First name*"
                      className="border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-[#0CC8A8]"
                    />
                    <ErrorMessage name="firstName" component="div" className="text-xs text-red-500" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-gray-700">Last name*</Label>
                    <Field
                      as={Input}
                      id="lastName"
                      name="lastName"
                      placeholder="Last name*"
                      className="border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-[#0CC8A8]"
                    />
                    <ErrorMessage name="lastName" component="div" className="text-xs text-red-500" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700">Email address*</Label>
                    <Field
                      as={Input}
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Email address*"
                      className="border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-[#0CC8A8]"
                    />
                    <ErrorMessage name="email" component="div" className="text-xs text-red-500" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-700">Password (8+ characters)*</Label>
                    <div className="relative">
                      <Field
                        as={Input}
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Password (8+ characters)*"
                        className="border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-[#0CC8A8]"
                      />
                      <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        <span className="sr-only">Toggle password visibility</span>
                        👁️
                      </button>
                    </div>
                    <ErrorMessage name="password" component="div" className="text-xs text-red-500" />
                  </div>

                  <div className="flex items-start gap-2 pt-2">
                    <Checkbox
                      id="agree"
                      checked={values.agree}
                      onChange={(e) => setFieldValue('agree', e.target.checked)}
                      className="mt-1 border-gray-300 data-[state=checked]:bg-[#0CC8A8] data-[state=checked]:border-[#0CC8A8]"
                    />
                    {/* Fixed Syntax Error Here: Changed label> to </label> */}
                    <label htmlFor="agree" className="text-xs leading-relaxed text-gray-500">
                      I agree to Aps's{' '}
                      <a href="#" className="text-[#0CC8A8] hover:underline">Terms & Conditions</a>{' '}
                      and acknowledge the{' '}
                      <a href="#" className="text-[#0CC8A8] hover:underline">Privacy Policy</a>
                    </label>
                  </div>
                  <ErrorMessage name="agree" component="div" className="text-xs text-red-500" />

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-4 w-full rounded-full bg-[#0CC8A8] py-6 text-base font-medium text-white hover:bg-[#0bb094]"
                  >
                    Create account
                  </Button>

                  <div className="flex justify-center gap-4 pt-4">
                    {socials.map((id) => (
                      <Button
                        key={id}
                        type="button"
                        variant="outline"
                        className="h-12 w-20 rounded-full border-gray-200 bg-gray-50 hover:bg-gray-100"
                      >
                        <SocialIcon id={id} />
                      </Button>
                    ))}
                  </div>
                </Form>
              )}
            </Formik>
          </Card>
        </div>
      </div>
    </>
  )
}

export default Login