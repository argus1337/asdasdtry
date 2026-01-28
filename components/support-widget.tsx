"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { MessageSquare, X, RotateCcw, Minus, Plus } from "lucide-react";

interface Message {
  type: "bot" | "user";
  text: string;
}

interface ConversationOption {
  label: string;
  next: string;
  response?: string;
}

const conversationTree: Record<string, { message: string; options?: ConversationOption[]; isEnd?: boolean }> = {
  start: {
    message: "Hi there! Welcome to CreateSync Support. How can I help you today?",
    options: [
      { label: "Help with verification", next: "verification" },
      { label: "Question about earnings", next: "earnings" },
      { label: "Technical issue", next: "technical" },
      { label: "Other question", next: "other" },
    ],
  },
  verification: {
    message: "I'd be happy to help with verification! What specific issue are you experiencing?",
    options: [
      { label: "Can't verify my channel", next: "verify_cant", response: "I understand. Channel verification requires you to be logged into the same Google account that owns your YouTube channel. Make sure you're signed in with the correct account and try again." },
      { label: "Verification button not working", next: "verify_button", response: "If the verification button isn't responding, try refreshing the page or clearing your browser cache. If the issue persists, try using a different browser like Chrome or Firefox." },
      { label: "Already verified but still showing unverified", next: "verify_status", response: "Sometimes verification status takes a few minutes to update. Please wait 5-10 minutes and refresh the page. If it still shows unverified, please contact us at support@createsync.com with your channel URL." },
    ],
  },
  earnings: {
    message: "Great question about earnings! What would you like to know?",
    options: [
      { label: "How are earnings calculated?", next: "earnings_calc", response: "Your potential earnings are estimated based on your subscriber count, engagement rate, and platform. Actual earnings depend on brand deals you accept. Most creators earn $50-500 per sponsored post, with larger channels earning significantly more." },
      { label: "When do I get paid?", next: "earnings_payment", response: "Payments are processed within 30 days after a campaign is completed and approved by the brand. You can choose to receive payments via PayPal, bank transfer, or Payoneer." },
      { label: "Why is my estimate different?", next: "earnings_different", response: "Earnings estimates are recalculated based on your current metrics. If your subscriber count or engagement has changed, your estimate may adjust accordingly. The estimate is a range based on typical brand deals in your niche." },
    ],
  },
  technical: {
    message: "Sorry to hear you're having technical issues. What's happening?",
    options: [
      { label: "Page not loading", next: "tech_loading", response: "Try these steps: 1) Clear your browser cache and cookies, 2) Disable any ad blockers, 3) Try a different browser, 4) Check your internet connection. If issues persist, email support@createsync.com." },
      { label: "Can't submit the form", next: "tech_form", response: "Make sure all required fields are filled in correctly. Check that your email format is valid and your phone number includes the country code. If you're still having trouble, try using Chrome browser." },
      { label: "YouTube channel not parsing", next: "tech_parse", response: "Make sure your YouTube channel URL is in the correct format: youtube.com/@username or youtube.com/channel/CHANNEL_ID. The channel must be public for parsing to work." },
    ],
  },
  other: {
    message: "No problem! What else can I help you with?",
    options: [
      { label: "How long until I hear back?", next: "other_timeline", response: "After verification, our team typically reviews applications within 24-48 hours. You'll receive an email notification once your profile is approved and you can start receiving brand offers." },
      { label: "Can I change my information?", next: "other_change", response: "Yes! Once you're verified, you can update your profile information in your dashboard. If you need to change details before verification, simply fill out the form again with the correct information." },
      { label: "Contact human support", next: "other_human", response: "You can reach our support team at support@createsync.com. We typically respond within 24 hours during business days. For urgent matters, include 'URGENT' in your subject line." },
    ],
  },
  verify_cant: { message: "I understand. Channel verification requires you to be logged into the same Google account that owns your YouTube channel. Make sure you're signed in with the correct account and try again.", options: [{ label: "Back to main menu", next: "start" }], isEnd: true },
  verify_button: { message: "If the verification button isn't responding, try refreshing the page or clearing your browser cache. If the issue persists, try using a different browser like Chrome or Firefox.", options: [{ label: "Back to main menu", next: "start" }], isEnd: true },
  verify_status: { message: "Sometimes verification status takes a few minutes to update. Please wait 5-10 minutes and refresh the page. If it still shows unverified, please contact us at support@createsync.com with your channel URL.", options: [{ label: "Back to main menu", next: "start" }], isEnd: true },
  earnings_calc: { message: "Your potential earnings are estimated based on your subscriber count, engagement rate, and platform. Actual earnings depend on brand deals you accept. Most creators earn $50-500 per sponsored post, with larger channels earning significantly more.", options: [{ label: "Back to main menu", next: "start" }], isEnd: true },
  earnings_payment: { message: "Payments are processed within 30 days after a campaign is completed and approved by the brand. You can choose to receive payments via PayPal, bank transfer, or Payoneer.", options: [{ label: "Back to main menu", next: "start" }], isEnd: true },
  earnings_different: { message: "Earnings estimates are recalculated based on your current metrics. If your subscriber count or engagement has changed, your estimate may adjust accordingly. The estimate is a range based on typical brand deals in your niche.", options: [{ label: "Back to main menu", next: "start" }], isEnd: true },
  tech_loading: { message: "Try these steps: 1) Clear your browser cache and cookies, 2) Disable any ad blockers, 3) Try a different browser, 4) Check your internet connection. If issues persist, email support@createsync.com.", options: [{ label: "Back to main menu", next: "start" }], isEnd: true },
  tech_form: { message: "Make sure all required fields are filled in correctly. Check that your email format is valid and your phone number includes the country code. If you're still having trouble, try using Chrome browser.", options: [{ label: "Back to main menu", next: "start" }], isEnd: true },
  tech_parse: { message: "Make sure your YouTube channel URL is in the correct format: youtube.com/@username or youtube.com/channel/CHANNEL_ID. The channel must be public for parsing to work.", options: [{ label: "Back to main menu", next: "start" }], isEnd: true },
  other_timeline: { message: "After verification, our team typically reviews applications within 24-48 hours. You'll receive an email notification once your profile is approved and you can start receiving brand offers.", options: [{ label: "Back to main menu", next: "start" }], isEnd: true },
  other_change: { message: "Yes! Once you're verified, you can update your profile information in your dashboard. If you need to change details before verification, simply fill out the form again with the correct information.", options: [{ label: "Back to main menu", next: "start" }], isEnd: true },
  other_human: { message: "You can reach our support team at support@createsync.com. We typically respond within 24 hours during business days. For urgent matters, include 'URGENT' in your subject line.", options: [{ label: "Back to main menu", next: "start" }], isEnd: true },
};

export function SupportWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState("start");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const addBotMessage = useCallback((text: string) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { type: "bot", text }]);
      setIsTyping(false);
    }, 500 + Math.random() * 500);
  }, []);

  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
    if (messages.length === 0) {
      addBotMessage(conversationTree.start.message);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleRestart = () => {
    setMessages([]);
    setCurrentStep("start");
    setTimeout(() => {
      addBotMessage(conversationTree.start.message);
    }, 100);
  };

  const handleOptionClick = (option: ConversationOption) => {
    // Add user message
    setMessages((prev) => [...prev, { type: "user", text: option.label }]);

    // Navigate to next step
    setCurrentStep(option.next);

    // Add bot response
    const nextStep = conversationTree[option.next];
    if (nextStep) {
      setTimeout(() => {
        addBotMessage(nextStep.message);
      }, 300);
    }
  };

  const currentOptions = conversationTree[currentStep]?.options || [];

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          className="fixed bottom-5 right-5 z-50 w-16 h-16 rounded-full gradient-button flex items-center justify-center shadow-lg shadow-primary/40 hover:shadow-primary/60 hover:-translate-y-1 transition-all"
          aria-label="Open support chat"
        >
          <MessageSquare className="w-7 h-7 text-white" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-5 right-5 z-50 transition-all duration-300 ${
            isMinimized
              ? "w-16 h-16 rounded-full"
              : "w-[340px] max-w-[calc(100vw-40px)] h-[480px] rounded-[22px]"
          }`}
        >
          {isMinimized ? (
            <button
              onClick={handleMinimize}
              className="w-full h-full rounded-full gradient-button flex items-center justify-center shadow-lg"
              aria-label="Expand chat"
            >
              <Plus className="w-6 h-6 text-white" />
            </button>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#1b1e35]/98 to-[#12172b]/95 rounded-[22px] shadow-2xl border border-white/10 backdrop-blur-lg flex flex-col overflow-hidden">
              {/* Header */}
              <div className="gradient-button p-4 flex items-center justify-between rounded-t-[22px]">
                <div>
                  <h3 className="text-white font-bold text-base">CreateSync Support</h3>
                  <div className="flex items-center gap-2 text-xs text-white/80 uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-green-400 shadow-lg shadow-green-400/50 animate-pulse" />
                    Online
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleMinimize}
                    className="w-8 h-8 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
                    aria-label="Minimize"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleRestart}
                    className="w-8 h-8 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
                    aria-label="Restart"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleClose}
                    className="w-8 h-8 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-[#141828]/60 to-[#101323]/95">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-lg ${
                        message.type === "user"
                          ? "gradient-button text-white rounded-br-md"
                          : "bg-gradient-to-br from-white/95 to-slate-100/95 text-slate-900 rounded-bl-md"
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gradient-to-br from-white/95 to-slate-100/95 text-slate-900 px-4 py-3 rounded-2xl rounded-bl-md">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Options */}
              {currentOptions.length > 0 && !isTyping && (
                <div className="p-4 bg-[#0c0f1c]/75 border-t border-white/10 space-y-2">
                  {currentOptions.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleOptionClick(option)}
                      className="w-full px-4 py-3 text-sm font-semibold text-white bg-white/5 border border-primary/40 rounded-xl hover:bg-gradient-to-r hover:from-primary/50 hover:to-secondary/50 hover:border-transparent hover:-translate-y-0.5 transition-all"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}
