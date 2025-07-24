// Firebase Firestore Rules yang direkomendasikan untuk development
export const getFirestoreRules = () => {
  return `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to all users under any document
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
`;
};

// Firebase Firestore Rules yang direkomendasikan untuk production
export const getProductionFirestoreRules = () => {
  return `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow users to read and write their own tasks
    match /tasks/{taskId} {
      allow read, write: if request.auth != null && 
        (resource == null || resource.data.userId == request.auth.uid);
    }
    
    // Allow users to create tasks
    match /tasks/{taskId} {
      allow create: if request.auth != null && 
        request.resource.data.userId == request.auth.uid;
    }
  }
}
`;
}; 