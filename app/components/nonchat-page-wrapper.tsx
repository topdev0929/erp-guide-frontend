/* The purpose of this file is to add proper padding; so that we can scroll down and not have the nav footer overlap with content. HOWEVER, it only applies to pages without AI chat components on them. The reason is; if you add this to a page that uses chat.tsx; it will create a second; outer scroll bar; that leads to a very annoying experience for the user when they're trying to scroll through messages.
 */

"use client";

interface NonChatPageWrapperProps {
  children: React.ReactNode;
}

export default function NonChatPageWrapper({
  children,
}: NonChatPageWrapperProps) {
  return (
    <div className="min-h-screen bg-[#349934] bg-opacity-10 p-4 pb-20 sm:p-6 sm:pb-24 lg:p-8 lg:pb-24">
      <div className="max-w-4xl mx-auto">{children}</div>
    </div>
  );
}
