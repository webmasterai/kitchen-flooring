import { redirect } from "next/navigation";

/** Legacy WordPress path — canonical contact page lives at /contact. */
export default function ContactUsRedirectPage() {
  redirect("/contact");
}
