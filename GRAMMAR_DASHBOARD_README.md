# Grammar Dashboard & Review System

Modern e-learning grammar platform with lesson tracking and submission review features.

## 🎯 Features

### 1. Grammar Dashboard (`/grammar/dashboard`)
- **Lesson Overview**: Grid display of all participated lessons
- **Filter System**: Filter by status (All, Completed, In Progress, Not Started)
- **Lesson Cards**: Display title, category, level, progress, score, and dates
- **Quick Actions**: Review completed lessons or continue learning
- **Statistics Summary**: Overall stats with total, completed, in-progress counts
- **Pagination**: Navigate through multiple pages of lessons

### 2. Review Lesson Page (`/grammar/lessons/:lessonId/review`)
- **Lesson Summary**: Title, description, status badge
- **Performance Stats**: Score, progress percentage, submission count
- **Timeline**: Start date and completion date (if completed)
- **Submission Cards**: Detailed view of all submitted parts
  - Part number and type (MULTIPLE_CHOICE, MATCHING, etc.)
  - Score achieved
  - Submission timestamp
  - Time spent (if tracked)
  - View submission button (opens in new tab)
- **Quick Actions**: Return to dashboard or continue learning

## 📁 File Structure

```
src/
├── services/grammar/
│   ├── api.ts                    # API functions (getMyLessons, getLessonSubmissions)
│   └── types.ts                  # TypeScript interfaces
│
├── components/grammar/
│   ├── StatusBadge.tsx           # Status indicator component
│   ├── ProgressBar.tsx           # Progress visualization
│   ├── LessonCard.tsx            # Lesson card component
│   ├── SubmissionCard.tsx        # Submission detail card
│   └── index.ts                  # Exports
│
├── modules/learning/grammar/
│   ├── GrammarDashboardPage.tsx  # Main dashboard page
│   └── ReviewLessonPage.tsx      # Review submissions page
│
└── app/
    └── routes.tsx                # Route configuration
```

## 🎨 Design System

### Colors
- **Primary**: `#46ce83` → `#3ab56f` (mint-green gradient)
- **Success**: Green tones for completed states
- **Info**: Blue tones for in-progress states
- **Warning**: Amber tones for not-started states

### Components
- **Rounded Corners**: `rounded-xl` (12px), `rounded-2xl` (16px)
- **Shadows**: Soft shadows with hover elevation
- **Transitions**: Smooth 200-300ms transitions
- **Motion**: Framer Motion for enter/exit animations

## 🔌 API Integration

### 1. Get My Lessons
```typescript
GET /api/grammar/my-lessons
Query Params:
  - page: number (default: 1)
  - limit: number (default: 10)
  - status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'
```

### 2. Get Lesson Submissions
```typescript
GET /api/grammar/lessons/{lessonId}/my-submissions
Params:
  - lessonId: number
```

## 🚀 Usage

### Navigation Routes
```tsx
/grammar/dashboard              → Grammar Dashboard Page
/grammar/lessons/:id            → Learn Lesson Page (existing)
/grammar/lessons/:id/review     → Review Lesson Page
```

### Example: Navigate to Dashboard
```tsx
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();
navigate('/grammar/dashboard');
```

### Example: Navigate to Review Page
```tsx
const handleReviewLesson = (lessonId: number) => {
  navigate(`/grammar/lessons/${lessonId}/review`);
};
```

## 🧩 Component Usage

### StatusBadge
```tsx
import { StatusBadge } from '@/components/grammar';

<StatusBadge 
  status="COMPLETED" 
  size="md" 
  showIcon={true} 
/>
```

### ProgressBar
```tsx
import { ProgressBar } from '@/components/grammar';

<ProgressBar 
  percentage={75} 
  showLabel={true}
  size="md"
  animated={true}
/>
```

### LessonCard
```tsx
import { LessonCard } from '@/components/grammar';

<LessonCard 
  lesson={userLesson}
  onReview={(id) => navigate(`/grammar/lessons/${id}/review`)}
  onContinue={(id) => navigate(`/grammar/lessons/${id}`)}
/>
```

### SubmissionCard
```tsx
import { SubmissionCard } from '@/components/grammar';

<SubmissionCard 
  submission={userSubmission}
  onViewSubmission={(url) => window.open(url, '_blank')}
/>
```

## 🎭 States & Variations

### Lesson Status
- **NOT_STARTED**: Gray badge, "Bắt đầu học" button
- **IN_PROGRESS**: Blue badge, "Tiếp tục học" button  
- **COMPLETED**: Green badge, "Xem lại bài làm" button

### Submission Status
- **SUBMITTED**: Amber badge (awaiting grading)
- **COMPLETED**: Green badge (graded)

### Part Types
- **THEORY**: Blue gradient
- **MULTIPLE_CHOICE**: Purple-pink gradient
- **MATCHING**: Orange-red gradient
- **FILL_IN_BLANK**: Green-emerald gradient

## ⚡ Performance

- **Lazy Loading**: Images and components load on demand
- **Pagination**: Limits data fetching to 12 lessons per page
- **Optimized Animations**: Using Framer Motion with GPU acceleration
- **Error Boundaries**: Graceful error handling with retry functionality

## 🔒 Authentication

All pages require authentication via `RequireAuth` wrapper. Authorization Bearer token is automatically attached to API requests via `attachToken()` utility.

## 📱 Responsive Design

- **Mobile**: Single column grid, stacked cards
- **Tablet**: 2-column grid
- **Desktop**: 3-column grid with optimal spacing

## 🛠️ Tech Stack

- **React 18** + **TypeScript**
- **React Router** for navigation
- **Axios** for API calls
- **Framer Motion** for animations
- **Tailwind CSS** for styling
- **Lucide React** for icons

## 🎯 Best Practices

✅ Clean, readable code with proper TypeScript types  
✅ Reusable component architecture  
✅ Consistent naming conventions  
✅ Error handling with user-friendly messages  
✅ Loading states for better UX  
✅ Empty states with helpful guidance  
✅ Responsive design mobile-first approach  
✅ Accessibility considerations (ARIA labels, semantic HTML)

## 📝 Future Enhancements

- [ ] Real-time score updates via WebSocket
- [ ] Filter by category/level
- [ ] Search functionality
- [ ] Export results to PDF
- [ ] Achievement badges system
- [ ] Progress charts/analytics
