// This script helps to extract the entry IDs from a Google Form
// Run this in your browser console when viewing the Google Form

(function() {
  console.log('Extracting Google Form field IDs...');
  
  const inputs = document.querySelectorAll('input[name^="entry."]');
  const fieldIds = {};
  
  inputs.forEach(input => {
    const name = input.getAttribute('name');
    const label = input.closest('.freebirdFormviewerComponentsQuestionBaseRoot')
      ?.querySelector('.freebirdFormviewerComponentsQuestionBaseTitle')
      ?.textContent.trim();
    
    if (name && label) {
      console.log(`Field: "${label}" -> ID: "${name}"`);
      fieldIds[label] = name;
    }
  });
  
  console.log('Copy these IDs into your form component:');
  console.log(JSON.stringify(fieldIds, null, 2));
})();
