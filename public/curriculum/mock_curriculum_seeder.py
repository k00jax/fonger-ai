import os
import json
import random
from datetime import datetime, timedelta
import firebase_admin
from firebase_admin import credentials, firestore

cred = credentials.Certificate(r"C:\Users\black\arcadia-app\serviceAccountKey.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

SUBJECTS_BY_GRADE = {
    "k": ["Math", "Reading", "Science", "SEL"],
    "1": ["Math", "Reading", "Science", "SEL"],
    "2": ["Math", "Reading", "Science", "SEL"],
    "3": ["Math", "ELA", "Science", "SEL", "Social Studies"],
    "4": ["Math", "ELA", "Science", "SEL", "Social Studies"],
    "5": ["Math", "ELA", "Science", "SEL", "Social Studies"],
}

STUDENT_GRADES = {
    "student_1": "4",  # Oliver
    "student_2": "1",  # Barrett
    "student_3": "2",  # Jenny
}

CURRICULUM_PATH = "./curriculum"

def simulate_progress_for_student(student_id, grade):
    user_ref = db.collection("users").document(student_id)
    allowed_subjects = SUBJECTS_BY_GRADE.get(str(grade).lower(), [])

    for subject in allowed_subjects:
        grade_folder = f"grade_{str(grade).lower()}"
        subject_folder = os.path.join(CURRICULUM_PATH, grade_folder, subject)
        if not os.path.exists(subject_folder):
            print(f"Missing subject folder: {subject_folder}")
            continue
        for unit_file in os.listdir(subject_folder):
            if not unit_file.startswith("unit_") or not unit_file.endswith(".json"):
                continue
            unit_id = unit_file[:-5]  # remove ".json"
            unit_path = os.path.join(subject_folder, unit_file)
            with open(unit_path, "r", encoding="utf-8") as f:
                unit_data = json.load(f)
            # Write progress doc for this unit
            unit_progress = {
                "completed": random.choice([True, False]),
                "unit_title": unit_data.get("title", ""),
                "unit_objective": unit_data.get("objective", ""),
                "skills_tested": unit_data.get("skills_tested", []),
                "quiz_history": [
                    {
                        "score": random.randint(70, 100),
                        "date": (datetime.now() - timedelta(days=random.randint(1, 14))).isoformat(),
                        "missed_skills": random.sample(unit_data.get("skills_tested", []), k=1)
                            if unit_data.get("skills_tested") else []
                    }
                ],
                "activity_completion": [
                    {"step_id": "try_it", "completed_at": (datetime.now() - timedelta(days=random.randint(1, 10))).isoformat()}
                ],
                "last_accessed": datetime.now().isoformat()
            }
            subject_doc_ref = user_ref.collection("progress").document(subject)
            unit_doc_ref = subject_doc_ref.collection("units").document(unit_id)
            unit_doc_ref.set(unit_progress)
            # Create 20 placeholder lesson completions for this unit
            for lesson_num in range(1, 21):
                lesson_doc = f"{unit_id}_lesson_{lesson_num}"
                completed_lesson = {
                    "subject": subject,
                    "completed_at": (datetime.now() - timedelta(days=random.randint(1, 14))).isoformat(),
                    "score": random.randint(75, 100),
                    "skills_mastered": random.sample(unit_data.get("skills_tested", []), k=min(2, len(unit_data.get("skills_tested", []))))
                        if unit_data.get("skills_tested") else [],
                    "lesson_summary": f"Mock completion of {lesson_doc}",
                    "unit_title": unit_data.get("title", ""),
                    "unit_objective": unit_data.get("objective", "")
                }
                user_ref.collection("completed_lessons").document(lesson_doc).set(completed_lesson)

    print(f"Simulated full curriculum progress for {student_id} (grade {grade})")

if __name__ == "__main__":
    for student_id, grade in STUDENT_GRADES.items():
        simulate_progress_for_student(student_id, grade)
    print("All students now have realistic mock progress and lesson completions!")
