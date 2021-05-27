### Front End

### Instructions:

# Installation
1. Download Node.js.
2. in cmd inside folder, run:
    ```npm install```
    <!-- ```npm install react-bootstrap bootstrap``` -->
3. Create a JSON file called ```config.json``` inside src folder containing:
{
  "server_url": "http://localhost:4000/api",
  "paths": {
      "login": "/v0/auth/login",
      "registration": "/v0/auth/registration",
      "dashboardCourses": "/v0/courses/info",
      "course": "/v0/courses/course",
      "createCourse": "/v0/courses/create"
  }
}
run in CMD ```npm start```.


