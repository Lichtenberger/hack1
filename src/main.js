import { Client, Databases, ID } from "appwrite";
import { PROJECT_ID, DATABASE_ID, COLLECTION_ID } from './shhh.js';

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(PROJECT_ID);

const databases = new Databases(client);

const form = document.querySelector('form');

form.addEventListener('submit', addApplication)

function addApplication(e) {
  const application = databases.createDocument(
    DATABASE_ID,
    COLLECTION_ID,
    ID.unique(),
    { "company-name": e.target.companyName.value,
      "company-website": e.target.companyWebsite.value,
      "date-applied": e.target.dateApplied.value,
      "role": e.target.role.value,
      "referral-name": e.target.referralName.value,
      "referral-email": e.target.referralEmail.value,
      "resume-used": e.target.resumeUsed.value,
      "response-date": e.target.responseDate.value,
      "response-type": e.target.responseType.value
     }
  );
  application.then(function (response) {
      addApplicationToDOM();
  }, function (error) {
      console.log(error);
  });
  form.reset();
}

async function addApplicationToDOM() {
  document.querySelector('ul').innerHTML = ''
  let response = await databases.listDocuments(
    '67b0b24f0005615d060a',
    '67b0b27f000ab3995e8e',
);

response.documents.forEach((application) =>{
  const li = document.createElement('li')
  li.innerHTML = `
  Company Name - ${application['company-name']} <br>
  Company Website - ${application['company-website']} <br>
  Date Applied - ${application['date-applied']} <br>
  Role - ${application['role']} <br>
  Referral Name - ${application['referral-name']} <br>
  Referral Email - ${application['referral-email']} <br>
  Resume Used - ${application['resume-used']} <br>
  Response Date - ${application['response-date']} <br>
  Response - ${application['response-type']} <br> `
  
  li.id = application.$id
  
  const deleteButton = document.createElement('button')
  deleteButton.textContent = 'X'
  deleteButton.onclick = () => removeApplication(application.$id)
  

  const editButton = document.createElement('button')
  editButton.textContent = 'Edit'
  editButton.onclick = () => editApplication(application.$id)
  
  li.appendChild(editButton)
  li.appendChild(deleteButton)
  document.querySelector('ul').appendChild(li)
})
}

async function removeApplication(id) {
  const result = await databases.deleteDocument(
    '67b0b24f0005615d060a',
    '67b0b27f000ab3995e8e',
    id
  )
  document.getElementById(id).remove()
}

async function editApplication(id) {
  const application = databases.updateDocument(
    '67b0b24f0005615d060a',
    '67b0b27f000ab3995e8e',
    id,
    { "company-name": form.companyName.value,
      "company-website": form.companyWebsite.value,
      "date-applied": form.dateApplied.value,
      "role": form.role.value,
      "referral-name": form.referralName.value,
      "referral-email": form.referralEmail.value,
      "resume-used": form.resumeUsed.value,
      "response-date": form.responseDate.value,
      "response-type": form.responseType.value
     }
  );
  application.then(function (response) {
      addApplicationToDOM();
  }, function (error) {
      console.log(error);
  });
  form.reset();
}

addApplicationToDOM();