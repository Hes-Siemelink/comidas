// Simple debug script to understand the planned week issue
// This would be run in browser console to see the state

function debugPlannedWeekIssue() {
  // Check if we're on the planner page
  if (!window.location.pathname.includes('planner')) {
    console.log('Navigate to /planner first');
    return;
  }

  // Look for the navigation buttons
  const plannedButton = Array.from(document.querySelectorAll('button'))
    .find(btn => btn.textContent.includes('Planned'));
  
  const currentButton = Array.from(document.querySelectorAll('button'))
    .find(btn => btn.textContent.includes('Current'));

  console.log('Found buttons:', {
    planned: !!plannedButton,
    current: !!currentButton
  });

  // Check if there's a week display
  const weekDisplay = document.querySelector('[data-testid="week-display"]') || 
                     document.querySelector('.week-display') ||
                     document.querySelector('h1, h2, h3'); // Look for any heading that might be a week title

  console.log('Current page state:', {
    hasWeekDisplay: !!weekDisplay,
    weekDisplayContent: weekDisplay?.textContent?.substring(0, 100)
  });

  // Try clicking planned button and see what happens
  if (plannedButton) {
    console.log('Clicking planned button...');
    plannedButton.click();
    
    // Check state after click
    setTimeout(() => {
      const weekDisplayAfter = document.querySelector('[data-testid="week-display"]') || 
                              document.querySelector('.week-display') ||
                              document.querySelector('h1, h2, h3');
      
      console.log('After clicking Planned:', {
        hasWeekDisplay: !!weekDisplayAfter,
        weekDisplayContent: weekDisplayAfter?.textContent?.substring(0, 100)
      });
    }, 100);
  }
}

// Run it
debugPlannedWeekIssue();
