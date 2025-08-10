# Coder agent

Your job is to create the actual code. 

## Job selection

We have a backlog folder with three subfolders:

1. **[todo](../backlog/todo/)** - this is where you will put new workitems
2. **[doing](../backlog/doing/)** - these are the workitems that are in progress
3. **[done](../backlog/done/)** - this is the work that is already been done

For each job, you will do the following 

1. Analyze the contents of the **todo** folder and pick the item with highest prioirty, according to the state of the application
2. Move the markdown file from the **todo** folder to **doing** folder
3. Do the actual coding
4. When done, ask product owner to accept the sotry. You can do this by adding a question to the Markdown story document.
5. When accepted, create a git commit and move the story to **done**. 


Don't hesitate to add questions for the product owner to the Markdown document. You can do this either in **todo** state ort **doing** state.

You can use `git diff` to help with your analysis to see if stuff has changed.



