import { parseExerciseCsv } from "@/utils/exerciseCsv";

export const exerciseOptionsCsv = `exercise_name
Push-ups
Squats
Lunges
Burpees
Mountain Climbers
Jumping Jacks
Bicycle Crunches
Dips
Pull-ups
Russian Twists
Leg Raises
Deadlifts
Bench Press
Rows
Shoulder Press
Calf Raises
Tricep Extensions
Lateral Raises
Glute Bridges
Superman
Box Jumps
Kettlebell Swings
Step-ups
Face Pulls
Lat Pulldowns
Reverse Lunges
Plyo Squats
Scissors Kicks
Tricep Dips
Seated Rows
Flutter Kicks
Inverted Rows
Bulgarian Split Squats
Prone Cobras
Resistance Band Pull-Aparts
Wall Angels
Bird Dogs
Plyometric Push-ups
Decline Push-ups
Incline Push-ups
Dead Bugs
Pistol Squats
Zottman Curls
Dragon Flags
Renegade Rows
Frog Jumps
Turkish Get-ups
Bear Crawls
Windshield Wipers
Thrusters`;

export const exerciseOptions = parseExerciseCsv(exerciseOptionsCsv);
