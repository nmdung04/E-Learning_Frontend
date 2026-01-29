'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

const testimonials = [
  {
    id: 1,
    name: "Linh Tran",
    role: "TOEIC Speaking from 120 to 160 · Intensive Sprint",
    text: "Role-play labs mirrored the TOEIC Speaking prompts, so I stopped freezing and hit the timing cues naturally.",
    fullStory: "I used to memorize scripts and still blank out on Part 4. The coaches drilled intonation with timed recordings, the AI coach flagged filler words, and a study buddy kept me accountable for daily speaking clips. By week 7 I could deliver responses within 45 seconds without rushing.",
    milestones: [
      "Recorded 40 timed TOEIC Speaking clips with mentor notes",
      "Raised speaking score from 120 to 160 in 7 weeks",
      "Handled client updates in English without slipping to Vietnamese"
    ],
    avatar: "/images/auth/Sarah.jpg"
  },
  {
    id: 2,
    name: "Minh Nguyen",
    role: "TOEIC L&R from 550 to 750 · Evening Cohort",
    text: "Micro-lessons fit between client calls and lifted my Listening/Reading score by 200 points.",
    fullStory: "The curriculum matched my fintech workflows: parsing support tickets, summarizing specs, and scanning long emails for key actions—just like TOEIC parts 3, 4, 6, and 7. Mentor feedback on written summaries sharpened my grammar, and the glossary extension pushed collocations into my review deck.",
    milestones: [
      "Listening score jumped from 295 to 375",
      "Reading score climbed from 255 to 375",
      "Maintained a 21-day streak with calendar nudges"
    ],
    avatar: "/images/auth/Emily.jpg"
  },
  {
    id: 3,
    name: "Nam Pham",
    role: "TOEIC 550 to 805 · Weekend Track",
    text: "Listening labs mirrored customer-support calls and pushed me over the 800 threshold in six weeks.",
    fullStory: "Company reimbursement kicks in at 800. The dashboard showed weak question types (negative questions, double-passages), and podcast-style drills matched TOEIC audio speed. Auto-graded quizzes on the bus turned dead time into practice, and I learned to spot traps faster.",
    milestones: [
      "Listening score from 320 to 440; Reading from 230 to 365",
      "Completed every weekend live review",
      "Earned the stipend and got promoted to shift lead"
    ],
    avatar: "/images/auth/Nam.jpg"
  },
  {
    id: 4,
    name: "Peter Dang",
    role: "TOEIC Readiness for Engineering · Custom Plan",
    text: "We aligned TOEIC prep with sprint rituals, so the team practiced English and scored higher together.",
    fullStory: "We uploaded our engineering glossary, then mentors turned sprint reviews and incident calls into TOEIC-style listening/reading tasks. The AI coach highlighted vague phrasing and suggested concise alternatives. HR tracked progress by part, and the squad built confidence for both the test and daily stand-ups.",
    milestones: [
      "Hosted two sprint reviews fully in English",
      "Cut translation time from 3 hours to 40 minutes weekly",
      "Team average TOEIC score up by 180 points"
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
