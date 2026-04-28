'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { ContactSection } from '@/lib/types';
import { addLead } from '@/lib/firestore-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { Label } from '../ui/label';

interface ContactFormProps {
  pageId: string;
  ownerId: string;
  contactSection: ContactSection;
  isPreview?: boolean;
}

export function ContactForm({ pageId, ownerId, contactSection, isPreview = false }: ContactFormProps) {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isPreview) return;
    setLoading(true);

    const result = await addLead(pageId, ownerId, {
      name: contactSection.form.name ? name : undefined,
      email: contactSection.form.email ? email : '',
      phone: contactSection.form.phone ? phone : undefined,
      message: contactSection.form.message ? message : undefined,
    });

    setLoading(false);

    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Submission failed',
        description: result.error,
      });
    } else {
      setSubmitted(true);
      toast({
        title: 'Thank you!',
        description: 'Your message has been sent.',
      });
    }
  };

  if (submitted) {
    return (
      <div className="text-center p-8 border rounded-lg bg-secondary">
        <h3 className="text-2xl font-bold">Thank You!</h3>
        <p className="text-muted-foreground">Your message has been received.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      {contactSection.form.name && (
        <div className="space-y-2">
            <Label htmlFor="contact-name">Name</Label>
            <Input id="contact-name" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
      )}
      {contactSection.form.email && (
        <div className="space-y-2">
            <Label htmlFor="contact-email">Email</Label>
            <Input id="contact-email" type="email" placeholder="Your Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
      )}
      {contactSection.form.phone && (
        <div className="space-y-2">
            <Label htmlFor="contact-phone">Phone</Label>
            <Input id="contact-phone" type="tel" placeholder="Your Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
      )}
      {contactSection.form.message && (
        <div className="space-y-2">
            <Label htmlFor="contact-message">Message</Label>
            <Textarea id="contact-message" placeholder="Your Message" value={message} onChange={(e) => setMessage(e.target.value)} required />
        </div>
      )}
      <Button type="submit" className="w-full" disabled={loading || isPreview}>
        {loading ? <Loader2 className="animate-spin" /> : contactSection.form.submitButtonLabel}
      </Button>
    </form>
  );
}
