# **App Name**: PortHub Pages

## Core Features:

- User Authentication & Profile: Secure login and registration with Firebase Auth. Basic user profile management, adapted for a landing page builder.
- Dashboard Management: View and manage all created landing pages. Provides options to edit, preview, publish, duplicate, and delete pages. Shows page status and public URL.
- Template-Based Page Creation: Start a new landing page by choosing from a selection of basic, pre-defined templates (e.g., Product Launch, Service Business, Event Registration).
- Form-Based Content Editor: A two-column editor for managing landing page content, including sections like Hero, Features, Pricing, FAQ, and Contact forms. Integrates with Firestore for data persistence and Cloudinary for image uploads.
- Live Preview Functionality: Real-time, responsive preview of the landing page content as it's being edited, showing desktop, tablet, and mobile views.
- Public Page Rendering & Publishing: Publish landing pages to a unique public URL (/p/[slug]). Control page visibility with publish/unpublish options. Only published pages are publicly accessible.
- Lead Capture System: Allow visitors to submit information via contact forms on published landing pages. Captured leads are stored in Firestore, and the owner can view them from their dashboard.
- AI Content Generation Tool: Utilize generative AI to suggest initial text for headlines, subheadlines, or call-to-action buttons, assisting users in quickly populating page sections.

## Style Guidelines:

- Light color scheme to provide a clean and professional canvas for content creation.
- Primary color: A deep, professional blue (#264D73), chosen for its association with trustworthiness and efficiency.
- Background color: A very light blue-gray (#EEF3F8), providing a subtle yet distinct foundation for the UI elements.
- Accent color: A vibrant sky blue (#40CBED), offering a dynamic contrast and highlighting interactive elements to draw attention.
- Headlines and prominent text will use 'Space Grotesk' (sans-serif) for a modern, technical, and forward-thinking appearance, aligning with the builder concept.
- Body text will utilize 'Inter' (sans-serif), ensuring excellent readability and a neutral, objective feel that suits various content types.
- Functional, clean line icons to represent actions and elements within the dashboard and editor, maintaining clarity and ease of use.
- Editor employs a clear two-column layout: an editing form on the left and a live, responsive preview on the right for immediate feedback. Hero sections are designed to be prominently displayed above the fold on all screen sizes.
- Subtle animations on button hovers and section collapses/expands provide a responsive and polished user experience without being distracting.