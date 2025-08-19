# Meal Planner Page Specification

## Goal
The Meal Planner page enables users to plan, manage, and track meals for weekly periods. It supports creating new weeks, managing current and planned weeks, checking off completed meals, and browsing historical meal plans. The page facilitates grocery planning, meal balancing, and family cooking assignments.

## Sections and Functional Behavior

### 1. Week Navigation Section
- Displays navigation tabs for Current, Planned, and Completed weeks.
- The active tab is visually highlighted.
- When a user clicks on a tab, they navigate to the corresponding week view.
- Navigation preserves the state of each section.

### 2. Week Display Section
- Shows the details of the selected week including title, meals, and status.
- The week title is editable and can be modified by clicking on the edit icon.
- Meals are displayed in a list with checkboxes, names, and optional recipe links.
- Meal completion status can be toggled by clicking the checkbox.
- Meals can be reordered using drag and drop functionality.

### 3. Meal Management Section
- Provides an input field to add new meals to the current week.
- Users can type a meal name and press Enter to add it to the list.
- Each meal can optionally link to a recipe from the database.
- Meals can be assigned to family members and specific days (optional).
- Users can edit or remove existing meals from the week.

### 4. Week Creation Section
- Displays a "Create New Week" button when no week exists in the current section.
- When pressed, creates a new week with an auto-generated title.
- The title is immediately in edit mode for user customization.
- After saving the title, focus moves to the meal input field for quick planning.

### 5. Week Completion Section
- Shows a "Complete Week" button on the current week when applicable.
- When all meals are checked off, triggers an automatic completion ceremony.
- Completion moves the week from Current to Completed status.
- If a Planned week exists, it automatically becomes the new Current week.

### 6. Week Browser Section (Completed Tab)
- Displays a list of all completed weeks with navigation controls.
- Users can select any completed week to view its details.
- Shows weeks in reverse chronological order (most recent first).
- Provides search and filtering capabilities for finding specific weeks.

### 7. Accessibility and Responsiveness
- All interactive elements are accessible via keyboard and screen readers.
- Drag and drop functionality has keyboard alternatives.
- The page layout adapts to different screen sizes and devices.

## General Behavior
- Week states transition automatically: Planned → Current → Completed.
- All sections update dynamically in response to user actions.
- Only one Current and one Planned week can exist at any time.
- Multiple Completed weeks are preserved in the archive.

## User Flow: Creating a New Week

1. User navigates to Current or Planned section with no existing week.
2. User presses the "Create New Week" button.
3. A new week is created with an auto-generated title in edit mode.
4. User can modify the title or press Enter to accept it.
5. Focus automatically moves to the "Add meal" input field.
6. User can immediately start adding meals by typing and pressing Enter.

## User Flow: Adding Meals to a Week

1. User types a meal name in the "Add meal" input field.
2. User presses Enter to add the meal to the week.
3. The meal appears in the meal list with an unchecked checkbox.
4. The input field is cleared and ready for the next meal.
5. User can optionally link the meal to a recipe or assign it to a family member.

## User Flow: Completing a Week

1. User checks off meals as they are cooked throughout the week.
2. When the last meal is checked, a completion ceremony is triggered.
3. User confirms the completion (optional ceremony with animation).
4. The week moves from Current to Completed status.
5. If a Planned week exists, it automatically becomes the new Current week.
6. If no Planned week exists, the Current section becomes empty.

---
This specification is intended for implementation by any agent or builder app, focusing on functional requirements and user interactions rather than specific UI details.

---

## Original Spec

This documents describes the Meal Planner page.

You get here form the home page.

The main purpose of the Meal Planner page is to show which meals are planned for this week and to make a new plan for next week. You can also browse previous weeks to see what we have cooked.

The concept of 'week' is fairly loose here and not directly connected to a week in the calendar. A 'week' is a bunch of recipes that are planned ahead with the purpose of
* Preparing the grocery list for weekly shopping
* Balancing out the meals between meat, vegetarian, pasta, fish, etc.
* Decide who cooks what. We are a family with three children and each child should cook once a week. They can decide the day and the meal they want to cook.

This does not always aligns with a normal week due to circumstances -- the shopping isn't always done on the same day, there could be an event or a holiday, etc.
But in reality it is very practical to have a 'unit of work', typically consisting of 5 to 7 planned meals. 7 is the maximum, it is not practical to do shopping for more than 7 days because fresh produce will perish. Minimum would be 3, like in a 'filler episode' for example just before we go on holiday.

We would need to think of a good term here, please help suggest one. Will use 'comidas week' or just week for now

The meals can be linked to recipes in the database, but also could be just an idea that is written down. For example "Indonesian rendang" would point to an entry in the database, but "Supermarket pizza with salad" is just an ad-hoc meal idea with no recipe behind it. 

Main display should be the current weak and the meals being planned. We can clearly see which meals are planned in which order. Meals that have been cooked can be ticked off like in a todo list -- this should be easy. Meals can be assigned to somebody from the family to cook and to a certain day, but this is not required. There is a certain order and meal order can be changed with drag and drop or another way. So there is some level of planning, but planning is fluid and can be adapted.

We can plan a new 'week'. In that case you hit a plus button or something and you get an empty week. The easiest way to fill it is to type in the meals line by line, just plain text. Pressing enter will get you to the next meal. This way you can plan a new 'comidas week' in seconds.  The meals will have a checkbox in front of it. this way the comidas week view is immediately usable. 

You can navigate from the current comidas week, to the next planned week. The next may not have been created. We could say that if there is a current active one, there is always is a 'next' that could be empty. There is also an archive. When you check the last comida of a week, it will move to archive (maybe with some ceremony like a confirmation button and a nice animation)

Properties of each meal (comida)
* Title
* Done or not (checkbox)
* Recipe link (optional -- but if it's there it can be the title) Note that there can be multiple recipes involved but we'll start with one link
* Who is cooking (name, optional)
* Day 


### Meal Planner Page Logic

The Meal planner has three sections

1. Current
2. Planned
3. Completed (formerly "Archived")
 
When we land on the page we see the Current section. User can navigate freely between the three section.

#### Current

This will display the currently active week. There can at most one active week. There can also be no active week.

If there is no currentlty active week, the Create New Week button is shown and nothing else on the page.

When you press the button, a new week is created and displayed. The title is in edit mode and selected so the user can replace the generated title with a better one right away. When pressing return on the title, focus is on the Add meal input line so we can populate the week right away.

If there is a currently active week, it is shown. The Create New Week button is not visible in this case

If the currently active week is completed, the following happens.
* The week is marked is completed and is no longer shown on the Current section. It is now part of the Completed section.
* If there is a week in Planned state, it now becomes the Current one (state is changed) and it will be displayed. This release is no longer displayed on Planned section then.



#### Planned

This will display the week that is coming up. The page behaves like Current, but the week is not active and can not be completed. There is no Complete Week button and when you check all meals nothing happens.
There can be only one Planned week, or none at all.

If there is no planned week, the Create New Week button is shown and nothing else on the page.

If there is a planned week, it is shown. The Create New Week button is not visible in this case

#### Completed

On this page you can browse all completed weeks. This was used to be called "Archived" but tpo avoid confusion and align terminology we will use 'Completed' now in UI and code.

There can be multiple completed weeks. Only one is shown on the page. By default this is the week the was completed last. There is a component on top (before the week) that shows the list of all weeks. You can select a week from the list and it will be displayed below.
There is a rudimentary component in place that we can use for prototyping. Later we will implement a dropdown with search.

