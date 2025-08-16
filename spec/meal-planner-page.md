# Meal Planner page

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


