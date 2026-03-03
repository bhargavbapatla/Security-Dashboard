import { type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import clsx from 'clsx'

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

