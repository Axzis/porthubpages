import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, CheckCircle, Bot } from 'lucide-react';
import { Logo } from '@/components/logo';
import { placeholderImages } from '@/lib/placeholder-images';

export default function Home() {
  const heroImage = placeholderImages.find(p => p.id === 'hero-builder-app-screenshot');
  const avatar1 = placeholderImages.find(p => p.id === 'avatar-1');
  const avatar2 = placeholderImages.find(p => p.id === 'avatar-2');
  const avatar3 = placeholderImages.find(p => p.id === 'avatar-3');


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Logo />
        <nav className="hidden md:flex items-center gap-6">
          <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Features
          </Link>
          <Link href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Testimonials
          </Link>
          <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Pricing
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/login">Log In</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Get Started Free</Link>
          </Button>
        </div>
      </header>

      <main className="flex-grow">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 text-center py-20 lg:py-32">
          <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
            Build high-converting landing pages in minutes.
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
            PortHub Pages helps you create, customize, and publish landing pages for products, services, events, and campaigns—without coding.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/signup">
                Create Your First Page <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </div>
          {heroImage && (
            <div className="mt-12 lg:mt-16 rounded-xl shadow-2xl overflow-hidden bg-card p-2 border">
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                width={1200}
                height={750}
                data-ai-hint={heroImage.imageHint}
                className="rounded-lg"
                priority
              />
            </div>
          )}
        </section>

        <section id="features" className="py-20 lg:py-24 bg-secondary">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="font-headline text-3xl sm:text-4xl font-bold text-foreground">Everything you need to launch</h2>
              <p className="mt-4 max-w-xl mx-auto text-muted-foreground">
                All the tools to build a beautiful, high-performance landing page in minutes.
              </p>
            </div>
            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-4">
                <Bot className="h-8 w-8 text-primary" />
                <h3 className="font-headline text-xl font-bold">AI-Powered Suggestions</h3>
                <p className="text-muted-foreground">Kickstart your creativity with AI-generated headlines and copy. Overcome writer's block and get to publishing faster.</p>
              </div>
              <div className="space-y-4">
                <CheckCircle className="h-8 w-8 text-primary" />
                <h3 className="font-headline text-xl font-bold">Form-based Editor</h3>
                <p className="text-muted-foreground">No complex drag-and-drop. Our simple, structured forms make editing fast and intuitive. What you see is what you get.</p>
              </div>
              <div className="space-y-4">
                <CheckCircle className="h-8 w-8 text-primary" />
                <h3 className="font-headline text-xl font-bold">Live Previews</h3>
                <p className="text-muted-foreground">Instantly see your changes in a real-time preview that shows you exactly how your page will look on desktop, tablet, and mobile.</p>
              </div>
              <div className="space-y-4">
                <CheckCircle className="h-8 w-8 text-primary" />
                <h3 className="font-headline text-xl font-bold">Template Gallery</h3>
                <p className="text-muted-foreground">Start from a blank canvas or choose from professionally designed templates for products, services, events, and more.</p>
              </div>
              <div className="space-y-4">
                <CheckCircle className="h-8 w-8 text-primary" />
                <h3 className="font-headline text-xl font-bold">Lead Capture Forms</h3>
                <p className="text-muted-foreground">Easily add contact forms to your pages and start collecting leads. All submissions are neatly organized in your dashboard.</p>
              </div>
              <div className="space-y-4">
                <CheckCircle className="h-8 w-8 text-primary" />
                <h3 className="font-headline text-xl font-bold">Publish Instantly</h3>
                <p className="text-muted-foreground">Go live with a single click. Your page is hosted on a fast, reliable network and available at a unique public URL.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="py-20 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="font-headline text-3xl sm:text-4xl font-bold text-foreground">Loved by creators and businesses</h2>
              <p className="mt-4 max-w-xl mx-auto text-muted-foreground">
                Don't just take our word for it. Here's what our users are saying.
              </p>
            </div>
            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <p>"I launched my new SaaS product in a single afternoon with PortHub Pages. The editor is so fast and the AI suggestions were a lifesaver!"</p>
                  <div className="mt-4 flex items-center gap-4">
                    {avatar1 && <Image src={avatar1.imageUrl} alt={avatar1.description} data-ai-hint={avatar1.imageHint} width={40} height={40} className="rounded-full" />}
                    <div>
                      <p className="font-semibold">Sarah L., Indie Hacker</p>
                      <p className="text-sm text-muted-foreground">@sarah_dev</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <p>"Finally, a landing page builder that isn't bloated. I built a page for my freelance services and got my first new client the next day."</p>
                  <div className="mt-4 flex items-center gap-4">
                    {avatar2 && <Image src={avatar2.imageUrl} alt={avatar2.description} data-ai-hint={avatar2.imageHint} width={40} height={40} className="rounded-full" />}
                    <div>
                      <p className="font-semibold">Michael T., Designer</p>
                      <p className="text-sm text-muted-foreground">@michaeltcreative</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <p>"We needed a simple page for our community event. PortHub Pages was the perfect tool. Easy, affordable, and professional."</p>
                  <div className="mt-4 flex items-center gap-4">
                    {avatar3 && <Image src={avatar3.imageUrl} alt={avatar3.description} data-ai-hint={avatar3.imageHint} width={40} height={40} className="rounded-full" />}
                    <div>
                      <p className="font-semibold">Jessica P., Event Organizer</p>
                      <p className="text-sm text-muted-foreground">@startupmeetup</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
            <h2 className="font-headline text-3xl sm:text-4xl font-bold">Ready to build your next big thing?</h2>
            <p className="mt-4 max-w-xl mx-auto opacity-80">
              Join thousands of others and start building your high-converting landing page today.
            </p>
            <div className="mt-8">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/signup">
                  Get Started for Free <ArrowRight className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <Logo />
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} PortHub Pages. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
