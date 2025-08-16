# Our Family Recipe App

Record recipes, plan family meals and have a handy assistant while cooking!

## Key features

* **Recipe Database**. Family members can browse existing recipes, add and share new recipes, and comment and change existing recipes.
* **Family Meal planner**. The planner will help you plan weekly meal planning, balancing ingredient variety and cost.
* **Cooking Assistant**. A cooking view will help you go through the recipe ste by step, set timers and record any changes you made while cooking

## Main app structure

When opening the application, you land at the home page and there are three main sections

### 1. "Start cooking"

This is just a button that will start cooking mode. When pressed it will go into "cooking mode" for the first recipe on the "Coming up" list. 

### 2. "Coming up" 

This lists the meals that are planned for the coming week. If the list is empty, it will have a link or button saying "Suggest a dinner". At the end there is a link or button "Plan meals".

### 3. All recipes

It will show a list of five recipes that highlight suggestions from the database that haven't been cooked in a while.
There is a link  will take you to the recipe browser where you can search for recipes and add new recipes.

###

From the home page, you can navigate to the subcomponents

1. [Meal planner](meal-planner-page.md)
2. [Recipe database](recipe-database-page.md)
3. Cooking assistant (TBD)

## Architecture

Ultimatley, this will be an app running on our phones. We all have iPhones, but a cross-platform architecture would be fine. 

To kickstart, we will start with a simple webapp. This helps us prototype the ideas faster by taking the app deployment out of the equation. However, the app will be developed for mobile and we may take that into account when designing app structure, screens, technology selection, etc. 

Also, for starters it will be a single user app, without login functionality and settings. That will be defined later.

At this stage, we need to prototype quickly to get an ide where to go with the app.

One requirement also is to make the app multilingual. We are a Mexican-Dutch family so it would also be nice to have the app in Spanish and Dutch.

See [architecture.md](architecture.md) for the current technology and architecture choices.

