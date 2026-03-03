import { type FC, useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Card } from '../components/ui/card'
import { Label } from '../components/ui/label'
import { Input } from '../components/ui/input'
import { Checkbox } from '../components/ui/checkbox'
import { Button } from '../components/ui/button'
import { toast } from 'sonner'
import { Eye, EyeOff } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog'

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
        {/* Updated fill to white for the black button background */}
        <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.21-1.23 3.91-1.12 1.57.11 2.77.63 3.55 1.74-2.89 1.72-2.38 5.76.68 7.05-.59 1.51-1.53 3.02-3.22 4.56zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.16 2.29-2.04 4.14-3.74 4.25z" fill="white" />
      </svg>
    )
  }
  if (id === 'google') {
    return (
      <svg className="h-5 w-5" viewBox="0 0 24 24">
        {/* Google remains multi-color */}
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
      </svg>
    )
  }
  if (id === 'meta') {
    return (
      <svg className="h-5 w-5" viewBox="0 0 24 24">
        {/* Updated fill to white for the blue button background */}
        <path d="M12 24c-5.018 0-8.892-2.186-10.743-4.536C-.297 17.472-.348 15.019.866 12.86c.64-.112 1.378-.202 2.21-.264-1.077 1.464-1.05 3.321.143 4.83 1.34 1.698 4.295 3.528 8.781 3.528 4.486 0 7.441-1.83 8.782-3.528 1.192-1.509 1.219-3.366.143-4.83.832.062 1.57.152 2.209.264 1.214 2.159 1.163 4.612-.393 6.604C20.892 21.814 17.018 24 12 24zm0-3.046c-3.66 0-6.183-1.405-7.391-2.934-.69-.874-.84-1.874-.46-2.738.38-.865 1.196-1.54 2.45-1.928 2.65-.821 7.152-.821 9.802 0 1.253.388 2.07 1.063 2.45 1.928.38.864.23 1.864-.46 2.738-1.208 1.529-3.731 2.934-7.391 2.934z" fill="white" />
      </svg>
    )
  }
  return null
}

const socials = ['apple', 'google', 'meta']

export const Login: FC = () => {
  const [showPassword, setShowPassword] = useState(false)
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
    toast.success('Account created successfully')
  }

  // Helper function to assign specific Tailwind classes based on the social button type
  const getSocialButtonStyles = (id: string) => {
    switch (id) {
      case 'apple':
        return 'bg-black hover:bg-gray-900 border-0'
      case 'google':
        return 'bg-[#FFF5F3] hover:bg-[#FFEBE6] border-0'
      case 'meta':
        return 'bg-[#3b5998] hover:bg-[#2d4373] border-0' // Using standard Meta blue
      default:
        return 'bg-gray-50 border-gray-200 hover:bg-gray-100'
    }
  }

  const termsContent = (
    <div className="space-y-4 text-sm text-gray-600">
      <p>
        <strong>1. Introduction</strong>
        <br />
        Welcome to Aps. By accessing our platform, you agree to these terms.
      </p>
      <p>
        <strong>2. User Accounts</strong>
        <br />
        You are responsible for maintaining the security of your account credentials.
      </p>
      <p>
        <strong>3. Acceptable Use</strong>
        <br />
        You agree not to misuse our services or violate any applicable laws.
      </p>
      <p>
        <strong>4. Termination</strong>
        <br />
        We reserve the right to terminate accounts that violate our terms.
      </p>
    </div>
  )

  const privacyContent = (
    <div className="space-y-4 text-sm text-gray-600">
      <p>
        <strong>1. Data Collection</strong>
        <br />
        We collect information you provide directly to us, such as when you create an account.
      </p>
      <p>
        <strong>2. Use of Information</strong>
        <br />
        We use your information to provide, maintain, and improve our services.
      </p>
      <p>
        <strong>3. Data Sharing</strong>
        <br />
        We do not share your personal information with third parties except as described in this policy.
      </p>
      <p>
        <strong>4. Security</strong>
        <br />
        We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access.
      </p>
    </div>
  )

  return (
    <>
      {/* Logo fixed top-left over entire page */}
      <div className="fixed left-6 top-5 z-50 flex items-center gap-2">
        <span className="h-3 w-3 rounded-full bg-primary" />
        <span className="text-sm font-semibold tracking-wide text-white">aps</span>
      </div>

      {/* Full-page gradient background */}
      <div
        className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-2"
        style={{
          background: `
            radial-gradient(ellipse 60% 60% at 10% 90%, rgba(12,200,168,0.30) 0%, transparent 60%),
            radial-gradient(ellipse 55% 55% at 90% 10%, rgba(255,92,0,0.30) 0%, transparent 60%),
            #0b0b0c
          `
        }}
      >
        {/* Left panel - Hidden on mobile, flex on large screens */}
        <div className="relative hidden h-full flex-col justify-center p-12 lg:flex">
          <div className="max-w-xl space-y-8">
            <h1 className="text-4xl font-semibold leading-tight text-white lg:text-5xl">
              Expert level Cybersecurity
              <br /> in <span className="text-primary">hours</span> not weeks.
            </h1>
            <div>
              <p className="mb-4 text-sm font-medium text-gray-300">What's included</p>
              <ul className="space-y-4">
                {[
                  'Effortlessly spider and map targets to uncover hidden security flaws',
                  'Deliver high‑quality, validated findings in hours, not weeks.',
                  'Generate professional, enterprise‑grade security reports automatically.',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-gray-300">
                    <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">✓</span>
                    <span className="text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Updated Trustpilot Rating text sizing */}
            <div className="pt-4 space-y-1">
              <div className="flex items-center gap-2 text-sm font-medium text-white">
                <span className="text-lg text-primary">★</span> Trustpilot
              </div>
              <div className="text-white">
                <span className="text-2xl font-bold tracking-tight">Rated 4.5/5.0</span> 
                <span className="ml-2 text-sm font-normal text-gray-400">(100k+ reviews)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel - Full width on mobile, centered on large screens */}
        <div className="flex min-h-screen w-full items-center justify-center p-4 lg:p-8">
          <Card className="w-full max-w-md border-gray-100 bg-white p-6 shadow-2xl sm:p-8">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-semibold text-gray-900">Sign up</h1>
              <p className="mt-2 text-sm text-gray-500">
                Already have an account?{' '}
                <a className="font-medium text-primary hover:underline" href="#">
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
                      className="border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-primary"
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
                      className="border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-primary"
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
                      className="border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-primary"
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
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password (8+ characters)*"
                        className="border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-primary"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <span className="sr-only">Toggle password visibility</span>
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <ErrorMessage name="password" component="div" className="text-xs text-red-500" />
                  </div>

                  <div className="flex items-start gap-2 pt-2">
                    <Checkbox
                      id="agree"
                      checked={values.agree}
                      onCheckedChange={(checked) => setFieldValue('agree', !!checked)}
                      className="mt-1 border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                    />
                    <label htmlFor="agree" className="text-xs leading-relaxed text-gray-500">
                      I agree to Aps's{' '}
                      <Dialog>
                        <DialogTrigger asChild>
                          <button type="button" className="text-blue-600 hover:underline">
                            Terms & Conditions
                          </button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Terms & Conditions</DialogTitle>
                            <DialogDescription>
                              Please read our terms carefully.
                            </DialogDescription>
                          </DialogHeader>
                          {termsContent}
                        </DialogContent>
                      </Dialog>{' '}
                      and acknowledge the{' '}
                      <Dialog>
                        <DialogTrigger asChild>
                          <button type="button" className="text-blue-600 hover:underline">
                            Privacy Policy
                          </button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Privacy Policy</DialogTitle>
                            <DialogDescription>
                              How we handle your data.
                            </DialogDescription>
                          </DialogHeader>
                          {privacyContent}
                        </DialogContent>
                      </Dialog>
                    </label>
                  </div>
                  <ErrorMessage name="agree" component="div" className="text-xs text-red-500" />

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-4 w-full rounded-full bg-primary py-6 text-base font-medium text-white hover:bg-primary/90"
                  >
                    Create account
                  </Button>

                  <div className="flex justify-between gap-3 pt-4">
                    {socials.map((id) => (
                      <Button
                        key={id}
                        type="button"
                        variant="outline"
                        // Flex-1 makes them stretch evenly, and we apply the custom color function
                        className={`h-12 flex-1 rounded-full ${getSocialButtonStyles(id)}`}
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