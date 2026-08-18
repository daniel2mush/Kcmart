'use client'
import { useState } from 'react'
import {
  InputGroup,
  InputGroupButton,
  InputGroupInput,
} from './ui/input-group'
import Image from "next/image";

const NewsLetter = () => {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    
    setStatus('loading')
    
    // Simulate API call for newsletter subscription
    setTimeout(() => {
      setStatus('success')
      setEmail('')
    }, 1500)
  }

  return (
    <section className=" container place-content-center relative w-full overflow-hidden py-20 md:py-28">
      
       {/* Background Image */}
     <div className="absolute w-full opacity-10 inset-0 z-0">
        <Image
          src="/Hero.webp"
          alt="Hero background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Dark Overlay for Text Contrast */}
      <div className="absolute inset-0 bg-black/40 z-10" />

      {/* Content Container */}
      <div className="relative z-20 max-w-2xl mx-auto h-full px-6 flex flex-col items-center text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
          Join the newsletter
        </h2>
        <p className="text-gray-300 text-lg mt-4 max-w-md">
          Get new products, articles and exclusive updates delivered right to your inbox.
        </p>

        {/* Subscription Form */}
        <form onSubmit={handleSubmit} className="w-full mt-8">
          <InputGroup className="w-full h-14 md:h-16 border border-white/20 rounded-2xl bg-white/5 backdrop-blur-md focus-within:border-white/40 transition-colors">
            <InputGroupInput
              type="email"
              required
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-0 bg-transparent text-white placeholder:text-gray-400 focus-visible:ring-0 h-full"
            />
            
            <InputGroupButton
              type="submit"
              disabled={status === 'loading' || status === 'success'}
              className="bg-primary text-primary-foreground px-6 md:px-8 h-10 md:h-12 rounded-xl font-semibold hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 mr-2"
            >
              {status === 'loading' ? 'Subscribing...' : status === 'success' ? 'Subscribed!' : 'Subscribe'}
            </InputGroupButton>
          </InputGroup>

          {/* Success Message */}
          {status === 'success' && (
            <p className="text-green-400 text-sm mt-4 animate-in fade-in slide-in-from-top-2">
              Thanks for subscribing! Check your inbox.
            </p>
          )}
        </form>
      </div>
    </section>
  )
}

export default NewsLetter