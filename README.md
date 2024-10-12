# NextTalk Chat App

> **NOTE**: 10-12-2024

> I developed NextTalk independently as a personal project to enhance my skills in React and Firebase. This master branch features the current version, which is fully functional and ready for use.

---

## Description 💬

NextTalk is a real-time chat application that allows users to communicate seamlessly. It provides a platform for instant messaging, enhancing social interactions online.

## Medium Blog Posts 📰

For understanding of NextTalk Chat App, along with an overview of its tech stack and development process, I have written an articles on Medium. You can read it through the links below:

+ [Introducing NextTalk Chat App - A Chat Application with Real-Time Support](https://medium.com/@cityalight.hesbon/introducing-nexttalk-chat-app-a-chat-application-with-real-time-support-d7446e71587a)

## Tech Stack 🐩

![Alt text](./src/assets/tech_stack.png)


## Dependencies 👫

This project requires the following dependencies to run:

- **React**: A JavaScript library for building user interfaces.
- **Firebase**: Provides backend services such as authentication and real-time database.
- **React Router**: For handling routing in the application.
- **Axios**: For making HTTP requests.
- **Styled Components**: For styling components in a modular way.

## Front-End 🐕

View the dedicated front-end README.md.

## Back-End 🐾

View the dedicated back-end README.md.

## Authentication 🔑

Passwords are no fun. NextTalk features a passwordless user authentication process managed by Firebase Authentication. The process works as follows:

1. **User Input**: The user enters their email (for login) or both email and username (for signup). The front-end initially sends the email/username to the back-end.

2. **Login Check**: If logging in, and an account does not exist with the given email, the back-end returns a redirect code, and the user is directed to the sign-up process. Otherwise, the back-end generates and returns a challenge token associated with the email.

3. **Send Login Email**: The front-end temporarily stores the challenge token in `localStorage` and uses the Firebase API to send a login email to the user. The login email includes a random code that the user must enter to verify their account.

4. **Verification**: Upon entering the verification code, the user is redirected to the home page of NextTalk. This redirect occurs on a URL hashed by Firebase, which the front-end parses to retrieve the user's profile.

5. **Token Exchange**: The front-end retrieves the challenge token from `localStorage` and returns it to the back-end along with the verified email. The back-end generates and returns a bearer token in the form of a cookie.

6. **Cleanup**: After being returned to the back-end, the challenge token is cleared from `localStorage`. The bearer token is set, and the user can fully access their profile!

This passwordless approach enhances user experience by simplifying the authentication process while ensuring security through Firebase Authentication.

## Author ✒️

+ Hesbon Kipchirchir [Heshbon](https://github.com/Heshbon)

## License 🔒

+  This project is licensed under the [MIT License](https://opensource.org/licenses/MIT) - see the [LICENSE](https://github.com/Heshbon/nexttalk-chat-app/blob/main/LICENSE) file for details.
