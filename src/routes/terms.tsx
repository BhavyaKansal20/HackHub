import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/terms")({
  head: () => pageHead("Terms & conditions — HackHub", "Terms for using HackHub’s hackathon directory, campus profiles, AI scores and team matching.", "/terms"),
  component: Terms,
});
function Terms() {
  return <article className="legal-page mx-auto max-w-3xl py-8">
    <p className="text-sm text-gold">Last updated: 19 November 2026</p><h1 className="mt-3 text-4xl font-bold sm:text-5xl">Terms & conditions</h1>
    <p>These terms apply to HackHub, an independent student platform, not an official Thapar Institute service. By using the service you agree to these terms and our privacy policy.</p>
    <h2>Eligibility and accounts</h2><p>Public hackathon listings are available to everyone. Profiles, AI evaluations and campus team features require your own @thapar.edu Google account. Provide accurate information, keep your account secure and do not impersonate another person. If you cannot legally agree to these terms on your own, obtain permission from a parent or guardian.</p>
    <h2>Hackathons and registration</h2><p>Listings are collected from publishers with available feeds. We do not claim complete internet coverage or guarantee that dates, eligibility, prizes or availability are correct. Verify every detail with the organiser. Registration is completed on the organiser’s site, not through HackHub. We are not responsible for event changes or organiser decisions.</p>
    <h2>AI and team matching</h2><p>AI blueprints and fit scores are suggestions, not verified credentials or guarantees of selection. Matching notifications do not guarantee a place on a team. You decide whom to work with and what contact information to share. HackHub does not approve university leave, certify participation or act for the Dean’s offices.</p>
    <h2>Acceptable use</h2><p>Do not post unlawful, abusive, discriminatory, deceptive or infringing content; spam members; harvest personal information; upload malicious files; bypass access controls; or disrupt the service. Do not share confidential university information or another person’s contact details without permission. Report misuse to <a href="mailto:multimodexai@gmail.com">multimodexai@gmail.com</a>.</p>
    <h2>Your content</h2><p>You keep ownership of your profile and posts. You give HackHub permission to store, display and process that content to provide profiles, AI evaluations, team matching and notifications. Submit only content you have the right to use. Hackathon names and images belong to their respective owners.</p>
    <h2>Availability, costs and account action</h2><p>Service availability is not guaranteed. Features may change, and accounts may be restricted for abuse. We currently do not charge students an access fee; third-party events may have fees. We will disclose any future paid features before purchase. Hosting and AI use have operational costs and limits.</p>
    <h2>Responsibility</h2><p>To the extent permitted by applicable law, the service is provided as available without guarantees of accuracy or fitness for a particular purpose. Nothing in these terms excludes rights or responsibilities that applicable law does not allow us to exclude. You are responsible for your participation, shared information and decisions based on AI suggestions.</p>
    <h2>Privacy and contact</h2><p>Our privacy policy describes account storage, AI processing and Lovable’s cookie-free visitor analytics, including page visits and clicks. Questions, deletion requests and complaints can be sent to <a href="mailto:multimodexai@gmail.com">multimodexai@gmail.com</a>. The date above identifies the latest version of these terms.</p>
  </article>;
}