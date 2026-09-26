import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import BottomNav from '#/components/BottomNav'
import { Input } from '#/components/ui/input'
import { Textarea } from '#/components/ui/textarea'
import { Button } from '#/components/ui/button'
import { Label } from '#/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'

export const Route = createFileRoute('/contact')({
  component: Contact,
})

interface FormErrors {
  name?: string
  email?: string
  message?: string
}

function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)

  function validate(): FormErrors {
    const errs: FormErrors = {}
    if (!name.trim()) errs.name = 'Name is required'
    if (!email.trim()) {
      errs.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Enter a valid email address'
    }
    if (!message.trim()) errs.message = 'Message is required'
    return errs
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return

    setSending(true)
    try {
      const res = await fetch('https://formspree.io/f/xkjgqkbd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      })
      if (!res.ok) throw new Error('Failed to send')
      setSubmitted(true)
    } catch {
      setErrors({ message: 'Failed to send. Please try again.' })
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 gap-15">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white text-2xl font-black">
            Contact
          </CardTitle>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <p className="text-white text-center py-8">
              Thanks for reaching out! Your message has been received and I'll
              get back to you soon.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">
                  Name
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
                />
                {errors.name && (
                  <p className="text-red-400 text-sm">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
                />
                {errors.email && (
                  <p className="text-red-400 text-sm">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-white">
                  Message
                </Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="What's on your mind?"
                  rows={4}
                  className="bg-white/10 border-white/30 text-white placeholder:text-white/50"
                />
                {errors.message && (
                  <p className="text-red-400 text-sm">{errors.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={sending}
                className="w-full bg-[#ef053b] text-white hover:bg-[#cc0430] font-bold"
              >
                {sending ? 'Sending...' : 'Send'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
      <div className="">
        <BottomNav />
      </div>
    </div>
  )
}
