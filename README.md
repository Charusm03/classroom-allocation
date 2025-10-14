# Smart Classroom Allocation System

An intelligent multi-modal resource optimization system for educational institutions to efficiently allocate classrooms based on course requirements, student capacity, and scheduling constraints.

## 🎨 Design System & Theme

The Smart Classroom Allocation System employs a formal, professional design theme centered around corporate navy-blue and stone-neutral color schemes. The interface uses a sophisticated gradient background transitioning from stone-50 to stone-200, providing a subtle, elegant canvas. Primary interactive elements feature deep navy (slate-900, blue-900) for authority and trust, while accent blues (blue-600, blue-700) guide user focus to critical actions. Neutral stone tones (stone-100 through stone-400) create clean, unobtrusive surfaces for data tables, cards, and input fields. Status communication relies on semantic colors: emerald greens indicate successful operations and allocations, amber yellows highlight warnings and conflicts requiring attention, and red tones signal errors or critical issues. The text hierarchy employs slate shades from dark (slate-900) for headings to lighter variants (slate-500) for secondary information, ensuring clear visual organization. This color system maintains WCAG AA accessibility standards while projecting a corporate, institutional aesthetic appropriate for educational resource management software.

## 🎯 Features

### 1. Schedule Input

- **CSV File Upload**: Direct upload of course schedules
- **Manual Text Input**: Paste schedule data in CSV format
- **Sample CSV Download**: Template for proper formatting
- **Real-time Validation**: Immediate feedback on data format

### 2. Intelligent Room Allocation

- **Multi-Modal Classification**: Automatically detects required room types:

  - CS Lab (Computer Science practical sessions)
  - EC Lab (Electronics practical sessions)
  - Mech Lab (Mechanical workshops)
  - Theory Rooms (Lecture halls)
  - Event Spaces (Auditoriums for large gatherings)

- **Capacity Optimization**: Matches room capacity to student count
- **Conflict Detection**: Identifies scheduling overlaps
- **Priority-Based Allocation**: Processes larger classes first

### 3. Analytics Dashboard

- **Total Allocations**: Count of successfully allocated classes
- **Room Utilization**: Percentage of available rooms in use
- **Average Utilization Rate**: Efficiency of space usage
- **Conflict Reporting**: List of unallocated classes with reasons

### 4. Results & Reporting

- **Visual Data Tables**: Organized view of all allocations
- **Utilization Bars**: Visual representation of room efficiency
- **Conflict Highlighting**: Clear display of allocation issues
- **Downloadable Reports**: Text-based summary for records

## 📋 CSV Format

```csv
Subject,Department,Year,Section,Students,Day,Time,Duration
Data Structures,CSE,2,A,55,Monday,09:00,60
Database Management,CSE,3,A,50,Monday,10:00,60
Computer Networks,CSE,3,B,48,Monday,09:00,60
```

### Field Descriptions:

- **Subject**: Course name (auto-detects lab requirements)
- **Department**: Academic department code
- **Year**: Year of study (1-4)
- **Section**: Class section (A, B, C, etc.)
- **Students**: Number of enrolled students
- **Day**: Day of week (Monday-Sunday)
- **Time**: Start time in 24-hour format (HH:MM)
- **Duration**: Class duration in minutes

## 🏗️ Component Architecture

### Main Container

```jsx
className = "min-h-screen bg-gradient-to-br from-stone-50 to-stone-200 p-8";
```

**Purpose**: Full-page wrapper with subtle gradient background for depth.

### Header

```jsx
className =
  "bg-gradient-to-r from-slate-900 to-slate-700 text-white rounded-xl shadow-lg p-8";
```

**Purpose**: Professional branding area with strong visual hierarchy.

### Navigation Tabs

**Active State**:

```jsx
className = "bg-white text-blue-900 border-blue-900 shadow-sm";
```

**Inactive State**:

```jsx
className = "text-stone-600 border-transparent hover:bg-stone-50";
```

**Purpose**: Clear visual feedback for current section.

### Cards & Content Areas

```jsx
className =
  "bg-white rounded-xl shadow-sm border border-stone-200 p-8 backdrop-blur-sm bg-opacity-95";
```

**Purpose**: Elevated content containers with subtle depth.

### Buttons

**Primary Actions** (Submit, Allocate):

```jsx
className =
  "bg-blue-900 hover:bg-slate-900 text-white px-6 py-3 rounded-lg shadow-sm hover:shadow-md";
```

**Secondary Actions** (Download, Cancel):

```jsx
className =
  "bg-white border border-stone-300 hover:border-stone-400 text-stone-700 px-6 py-3 rounded-lg";
```

**Success Actions** (Confirm):

```jsx
className =
  "bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg";
```

### Status Messages

**Success**:

```jsx
className =
  "bg-emerald-50 border-l-4 border-emerald-500 text-emerald-800 p-4 rounded-r-lg";
```

**Warning/Conflicts**:

```jsx
className =
  "bg-amber-50 border-l-4 border-amber-500 text-amber-800 p-4 rounded-r-lg";
```

**Info**:

```jsx
className = "bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg";
```

### Data Tables

```jsx
<thead className="bg-stone-100 sticky top-0 border-b border-stone-200">
<tbody className="hover:bg-stone-50 transition-colors duration-150">
```

**Purpose**: Clean, readable data presentation with hover feedback.

### Metric Cards

```jsx
className =
  "bg-gradient-to-br from-blue-900 to-blue-700 text-white p-6 rounded-xl shadow-lg";
```

**Purpose**: Eye-catching statistics with gradient backgrounds for emphasis.

### Badges/Tags

```jsx
className =
  "px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200";
```

**Purpose**: Category indicators and status labels.

## 🚀 Getting Started

### Prerequisites

- Node.js 16+
- React 18+
- Lucide React icons

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd smart-classroom-allocation

# Install dependencies
npm install

# Start development server
npm run dev
```

### Dependencies

```json
{
  "react": "^18.2.0",
  "lucide-react": "^0.263.1"
}
```

## 🔧 Configuration

### Available Classrooms

Edit the `classrooms` array in `App.jsx`:

```javascript
const classrooms = [
  { id: "CS-LAB-1", capacity: 60, type: "CS_LAB", building: "IT Block" },
  { id: "ROOM-101", capacity: 80, type: "THEORY", building: "Main Block" },
  // Add more rooms as needed
];
```

### Lab Requirements Mapping

Edit the `labRequirements` object to map courses to room types:

```javascript
const labRequirements = {
  "Data Structures": "CS_LAB",
  Mathematics: "THEORY",
  "Workshop Practice": "MECH_LAB",
  // Add course mappings
};
```

## 📊 Allocation Algorithm

1. **Parse Input**: Validates and structures schedule data
2. **Sort by Priority**: Processes larger classes first (descending student count)
3. **Match Requirements**: Filters suitable rooms based on:
   - Required lab type
   - Minimum capacity
4. **Conflict Check**: Validates time slot availability
5. **Allocate**: Assigns first suitable conflict-free room
6. **Report Conflicts**: Logs unallocated classes with reasons

## 🎭 Design Principles

### Visual Hierarchy

- **Primary elements**: Bold colors (blue-900, emerald-500)
- **Secondary elements**: Muted colors (stone-600, slate-700)
- **Tertiary elements**: Subtle colors (stone-400, slate-500)

### Consistency

- **Border radius**: `rounded-lg` (0.5rem) for most elements, `rounded-xl` (0.75rem) for major containers
- **Shadows**: `shadow-sm` for subtle depth, `shadow-lg` for emphasis
- **Spacing**: Consistent padding scale (p-3, p-4, p-6, p-8)
- **Transitions**: 200ms duration for interactive elements

### Accessibility

- **Color contrast**: WCAG AA compliant text colors
- **Focus states**: Clear ring indicators on interactive elements
- **Semantic HTML**: Proper table structure and headings
- **Status indicators**: Color + text for accessibility

## 📱 Responsive Design

The system uses Tailwind's responsive utilities:

- **Desktop**: Full grid layouts (grid-cols-3, grid-cols-4)
- **Tablet**: Adjusted grid columns for medium screens
- **Mobile**: Stacked layouts for small screens
