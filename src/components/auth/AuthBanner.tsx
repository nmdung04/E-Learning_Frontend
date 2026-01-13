'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

const testimonials = [
  {
    id: 1,
    name: "Linh Tran",
    role: "IELTS 6.0 to 7.5 · Intensive Sprint",
    text: "The speaking studio and AI pronunciation coach finally made me comfortable pitching in English.",
    fullStory: "Before joining E-Learning English I memorized scripts and still froze in meetings. The coaches diagnosed my weak vowel sounds, gave me daily WhatsApp drills, and paired me with a study partner who kept me accountable through every live class.",
    milestones: [
      "Recorded 40 speaking clips reviewed by native mentors",
      "Closed two cross-border sales calls without switching to Vietnamese",
      "Booked the official IELTS exam with confidence after week 8"
    ],
    avatar: "/images/auth/Sarah.jpg"
  },
  {
    id: 2,
    name: "Minh Nguyen",
    role: "Business English · Evening Cohort",
    text: "Daily micro-lessons inside the LMS fit between client calls and still improved my writing score by 2 bands.",
    fullStory: "E-Learning English mapped a curriculum to my fintech job. I practiced replying to tough stakeholder emails, rewrote product updates with mentor feedback, and used the browser extension to collect vocabulary straight into the platform glossary.",
    milestones: [
      "Graduated from B1 to solid B2 in 12 weeks",
      "Delivered monthly reports to the Singapore office in English",
      "Maintained a 21-day streak thanks to calendar reminders"
    ],
    avatar: "/images/auth/Emily.jpg"
  },
  {
    id: 3,
    name: "Nam Pham",
    role: "TOEIC Upgrade · Weekend Track",
    text: "Listening labs that mirror real customer support calls helped me jump 250 points in six weeks.",
    fullStory: "My company reimburses TOEIC classes only if we hit 800. The E-Learning English dashboard showed me which parts I kept missing, and the podcast-style exercises plus auto-graded quizzes made commuting hours productive instead of wasted time.",
    milestones: [
      "Improved listening score from 320 to 555",
      "Completed every weekend live review without missing a session",
      "Earned the internal stipend and got promoted to shift lead"
    ],
    avatar: "/images/auth/Nam.jpg"
  },
  {
    id: 4,
    name: "Peter Dang",
    role: "Corporate Fluency · Custom Plan",
    text: "Our HR team rolled out the platform and my entire squad now collaborates in English during sprint reviews.",
    fullStory: "We uploaded our engineering glossary into E-Learning English, then mentors built role-play scenarios for stand-ups, demos, and incident calls. The AI coach flagged filler words and gave me replacement phrases that sounded natural.",
    milestones: [
      "Hosted two sprint reviews fully in English",
      "Cut translation time from 3 hours to 40 minutes weekly",
      "Onboarded three new teammates using the same curriculum"
    ],
    avatar: "/images/auth/Peter.jpg"
  }
];

const TRANSITION_DURATION = 280;

const AuthBanner = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [isAnimating, setIsAnimating] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleNavigate = (dir: "next" | "prev") => {
    if (isAnimating) return;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsExpanded(false);
    setDirection(dir);
    setIsAnimating(true);

    timeoutRef.current = setTimeout(() => {
      setCurrentTestimonial((prev) => {
        if (dir === "next") {
          return (prev + 1) % testimonials.length;
        }
        return (prev - 1 + testimonials.length) % testimonials.length;
      });
      setIsAnimating(false);
    }, TRANSITION_DURATION);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const transitionClass = useMemo(() => {
    if (!isAnimating) return "opacity-100 translate-x-0";
    return direction === "next" ? "opacity-0 translate-x-6" : "opacity-0 -translate-x-6";
  }, [direction, isAnimating]);

  const testimonial = testimonials[currentTestimonial];

  return (
    <div className="lg:block hidden lg:w-1/2 bg-white-97 p-8 lg:p-16 flex flex-col justify-center items-center border-b lg:border-b-0 lg:border-r border-white-90">
          <div className="w-full max-w-[400px]">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-15 mb-4">
              E-Learning
            </h2>
            <p className="text-gray-30 text-sm mb-10 leading-relaxed">
              Real learners share how the E-Learning English platform, live coaches, and AI study tools helped them stay consistent and scale their fluency.
            </p>

            {/* Testimonial Card */}
            <div className={`bg-white-99 rounded-2xl p-6 shadow-xl border border-white-90 mb-8 relative transition-all duration-300 ease-out ${transitionClass}`}>
              <p className="text-xs font-semibold text-mint-50 uppercase tracking-[0.3em] mb-3">
                {testimonial.role}
              </p>
              <p className="text-gray-30 text-sm leading-relaxed">
                "{testimonial.text}"
              </p>

              <div className={`transition-all duration-300 ease-out ${isExpanded ? "max-h-[320px] opacity-100 mt-6" : "max-h-0 opacity-0 -mt-4"} overflow-hidden`}>
                <p className="text-gray-30 text-sm leading-relaxed">
                  {testimonial.fullStory}
                </p>
                <ul className="mt-4 space-y-2 text-sm text-gray-30">
                  {testimonial.milestones.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-mint-50" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex items-center justify-between mt-8">
                <div className="flex items-center gap-3">
                  <img 
                    src={testimonial.avatar} 
                    alt="" 
                    className="w-10 h-10 rounded-full object-cover shadow-sm"
                  />
                  <span className="font-semibold text-gray-15 text-sm">
                    {testimonial.name}
                  </span>
                </div>
                <button
                  aria-expanded={isExpanded}
                  onClick={() => setIsExpanded((prev) => !prev)}
                  className="text-xs font-semibold text-mint-50 bg-white-95 px-3 py-2 rounded-lg hover:bg-mint-50 hover:text-white transition-all cursor-pointer"
                >
                  {isExpanded ? "Hide Story" : "Read Full Story"}
                </button>
              </div>
            </div>

            {/* Navigation Arrows */}
            <div className="flex justify-end gap-2">
              <button
                aria-label="Previous testimonial"
                onClick={() => handleNavigate("prev")}
                disabled={isAnimating}
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-white-90 bg-white-99 hover:bg-white-95 transition-all shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5 text-gray-30" />
              </button>
              <button
                aria-label="Next testimonial"
                onClick={() => handleNavigate("next")}
                disabled={isAnimating}
                className="w-10 h-10 flex items-center justify-center rounded-xl border border-white-90 bg-white-99 hover:bg-white-95 transition-all shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5 text-gray-30" />
              </button>
            </div>
          </div>
        </div>
  );
};

export default AuthBanner;
