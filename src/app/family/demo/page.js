import FamilyPortal from '../../../components/FamilyPortal';

const demoData = {
  assignments: [
    { kid: 'Ollie', subject: 'Math', task: 'Chapter 7: Fractions - Pages 42-45' },
    { kid: 'Barrett', subject: 'Science', task: 'Plant Life Cycle - Worksheet & Diagram' },
    { kid: 'Isla', subject: 'Reading', task: 'The Hobbit Chapters 3-4 + Response Questions' },
    { kid: 'Ollie', subject: 'History', task: 'Ancient Egypt: Pyramid Construction' },
    { kid: 'Barrett', subject: 'Math', task: 'Multiplication Practice - 8s and 9s' },
    { kid: 'Isla', subject: 'Writing', task: 'Creative Story: Write about a magical forest' },
  ],
  schedule: [
    { time: '8:00 AM', activity: 'Morning Routine & Breakfast' },
    { time: '9:00 AM', activity: 'Math Block (All Kids)' },
    { time: '10:00 AM', activity: 'Reading & Language Arts' },
    { time: '11:00 AM', activity: 'Science / History (Alternating)' },
    { time: '12:00 PM', activity: 'Lunch & Free Time' },
    { time: '1:00 PM', activity: 'PE / Martial Arts Practice' },
    { time: '2:00 PM', activity: 'Independent Work & Projects' },
    { time: '3:00 PM', activity: 'Wrap-up & Daily Review' },
  ],
  reminders: [
    'Field trip to the science museum on Friday. Permission slips due Wednesday.',
    'Ollie has a dental appointment Thursday at 2pm.',
    'Library books due back by the 15th.',
    'Remember to log reading minutes for the homeschool co-op.',
  ],
};

export default function FamilyDemoPage() {
  return <FamilyPortal isDemo={true} demoData={demoData} />;
}
