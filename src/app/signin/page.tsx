"use client";
import React from "react";
import {
  GoogleLoginButton,
  GithubLoginButton,
} from "react-social-login-buttons";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import tailwindConfig from "./tailwind.config";
import { useState } from "react";

export default function Sig() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [userVerify, setUserverify] = useState(null);

  const [error, setError] = useState("");

  const handlecred = async (e) => {
    e.preventDefault();

    // Call the NextAuth signIn function
    const result = await signIn("credentials", {
      redirect: false,
      username,
      password
    });

    if (result.error) {
      setErrorMessage(result.error);
    } 
    else {

      window.location.href = "/";
    }
  };

  const handleVerification = async (username, responseMessage) => {
    try {
      if (
        responseMessage[0]?.email === username &&
        responseMessage[0]?.emailVerified
      ) {
        window.location.href = `/api/auth/home?email=${encodeURIComponent(
          username
        )}`;
      } else if (responseMessage[0]?.emailVerified === false) {
        setErrorMessage(null);
        setUserverify("not verified");
      } else {
        setUserverify(null);
        setErrorMessage("new user");
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("An error occurred");
    }
  };
  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/generate-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: username }),
      });

      const result = await response.json();

      console.log("Success:", result);
    } catch (error) {
      console.error("Error:", error);
    }
    window.location.href = `/api/auth/verifyOtp?email=${encodeURIComponent(
      username
    )}`;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:3001/login/${username}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: username }),
      });
      const data = await response.json();

      if (response.ok) {
        setResponseMessage(data);
        await handleVerification(username, data);
      } else {
        console.log("User does not exist");
        setErrorMessage("User does not exist");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setErrorMessage("An error occurred during login");
    }
    // const result = await signIn("credentials", {
    //   redirect: false,
    //   username,
    // });

    if (result.error) {
      setErrorMessage(result.error);
    } else {
      // Handle successful login, e.g., redirect or display success message
      window.location.href = "/";
    }
  };
  const newUser = () => {
    window.location.href = "/api/auth/newUser";
  };
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  return (
    <>
    <div className="tw-bg-black tw-h-8 tw-w-8">
      <p>hello</p>
    </div>
    <div className="tw-text-center">

      <div className="tw-min-h-screen bg-gray-100 text-gray-900 tw-flex tw-justify-center ">
        <div className="tw-max-w-screen-xl m-0 sm:pt-10 bg-white shadow sm:rounded-lg flex justify-center flex-1 ">
          <div className="tw-lg:w-1/2 tw-xl:w-5/12 tw-pt-6 tw-sm:pt-12 ">
            <div>
              <img
                src="https://actlogica.com/wp-content/uploads/2018/04/landing-page1200x400.png"
                className="w-32 mx-auto"
                />
            </div>
            <div className="tw-m-6 flex flex-col items-center ">
              <h1 className="text xl:text-3xl font-extrabold">Log In</h1>
              <div className="mx-auto max-w-xs my-2 pt-2 pb-2">
                {userVerify && (
                  <div
                    className="bg-100 border border-yellow-400 text-yellow-700 px-9 py-3 rounded relative"
                    role="alert"
                  >
                    <strong className="font-bold">
                      {" "}
                      <button onClick={handleAuth}>Verify Your Mail!</button>
                    </strong>
                  </div>
                )}

                {errorMessage && (
                  <div
                    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                    role="alert"
                  >
                    <strong className="font-bold">Invalid Credentials! </strong>
                  </div>
                )}
                <form onSubmit={handlecred} className="space-y-6">
                  <div className="m-1"></div>
                  <input
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                    placeholder="Enter Username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                  <input
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    required
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="mb-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                  >
                    <span className="text-blue-700 ml-3 bg-black">Log in here</span>
                  </button>
                </form>
              </div>
              <div className=" border-b text-center">
                <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
                  Or
                </div>
              </div>
              <div className="w-full flex-1 mt-8">
                <div className="flex flex-col items-center">
                  <button
                    className="w-full max-w-xs font-bold shadow-sm rounded-lg py-3 bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline"
                    onClick={() => signIn("google", { callbackUrl })}
                  >
                    <div className="bg-white p-2 rounded-full">
                      <svg className="w-4" viewBox="0 0 533.5 544.3">
                        <path
                          d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z"
                          fill="#4285f4"
                        />
                        <path
                          d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z"
                          fill="#34a853"
                        />
                        <path
                          d="M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z"
                          fill="#fbbc04"
                        />
                        <path
                          d="M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 339.7-.8 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z"
                          fill="#ea4335"
                        />
                      </svg>
                    </div>
                    <span className="ml-4">Log in with Google</span>
                  </button>

                  <button
                    className="w-full max-w-xs font-bold shadow-sm rounded-lg py-3 bg-indigo-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline mt-5"
                    onClick={() => signIn("github", { callbackUrl })}
                  >
                    <div className="bg-white p-1 rounded-full">
                      <svg className="w-6" viewBox="0 0 32 32">
                        <path
                          fillRule="evenodd"
                          d="M16 4C9.371 4 4 9.371 4 16c0 5.3 3.438 9.8 8.207 11.387.602.11.82-.258.82-.578 0-.286-.011-1.04-.015-2.04-3.34.723-4.043-1.609-4.043-1.609-.547-1.387-1.332-1.758-1.332-1.758-1.09-.742.082-.726.082-.726 1.203.086 1.836 1.234 1.836 1.234 1.07 1.836 2.808 1.305 3.492 1 .11-.777.422-1.305.762-1.605-2.664-.301-5.465-1.332-5.465-5.93 0-1.313.469-2.383 1.234-3.223-.121-.3-.535-1.523.117-3.175 0 0 1.008-.32 3.301 1.23A11.487 11.487 0 0116 9.805c1.02.004 2.047.136 3.004.402 2.293-1.55 3.297-1.23 3.297-1.23.656 1.652.246 2.875.12 3.175.77.84 1.231 1.91 1.231 3.223 0 4.61-2.804 5.621-5.476 5.922.43.367.812 1.101.812 2.219 0 1.605-.011 2.898-.011 3.293 0 .32.214.695.824.578C24.566 25.797 28 21.3 28 16c0-6.629-5.371-12-12-12z"
                        />
                      </svg>
                    </div>
                    <span className="ml-4">Log in with GitHub</span>
                  </button>
                </div>
              </div>
            </div>
            <p className="mt-5 text-center text-sm text-gray-500">
              New User?{" "}
              <button onClick={() => newUser()} style={{ color: "blue" }}>
                SignUp
              </button>
            </p>
          </div>

          <div className="flex-1 bg-indigo-00 text-center hidden lg:flex">
            <div
              className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
              style={{
                backgroundImage:
                  "url(https://img.freepik.com/free-vector/cryptocurrency-mining-software-artificial-intelligence-e-business-crypto-trading-bot-automated-ai-tradings-best-bitcoin-trading-bot-concept_335657-74.jpg?t=st=1722878206~exp=1722881806~hmac=f86ed6b479faab6b1b693857fe68840c7d626d3d6fe7f6ee23617de43edd58b0&w=1060)",
                }}
                ></div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
  {
    /* <div classNameName="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
    <div classNameName="sm:mx-auto sm:w-full sm:max-w-sm">
      <img
        alt="CompassAI Logo"
        src="https://actlogica.com/wp-content/uploads/2018/04/landing-page1200x400.png"
        classNameName="mx-auto h-10 w-auto"
      />
      <h2 classNameName="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
        Sign in to your account
      </h2>
    </div>

    <div classNameName="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form onSubmit={handleSubmit} classNameName="space-y-6">
      {errorMessage && (
          <div
            classNameName="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong classNameName="font-bold">Invalid Credentials!</strong>
          </div>
        )}
        <div>
          <label
            htmlFor="email"
            classNameName="block text-sm font-medium leading-6 text-gray-900"
          >
            Email address
          </label>
          <div classNameName="mt-2">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              classNameName="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <div classNameName="flex items-center justify-between">
            <label
              htmlFor="password"
              classNameName="block text-sm font-medium leading-6 text-gray-900"
            >
              Password
            </label>
            <div classNameName="text-sm">
              <a
                href="#"
                classNameName="font-semibold text-indigo-600 hover:text-indigo-500"
              >
                Forgot password?
              </a>
            </div>
          </div>
          <div classNameName="mt-2">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              classNameName="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
        
        <div>
          <button
            type="submit"
            classNameName="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Sign in
          </button>
        </div>
      </form>

      <div>
        <p classNameName="mt-5 text-center text-sm text-gray-500">or </p>
        <div classNameName="mt-5 flex w-full justify-center rounded-md  px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          <div>
            <GoogleLoginButton
              onClick={() => signIn("google", { callbackUrl })}
            />
          </div>
        </div>
      </div>
      <div>
        <div classNameName="mt-1 flex w-full justify-center rounded-md  px-3 py-1.5 text-sm font-semibold leading-6 text-black shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
          <div>
            <GithubLoginButton
              onClick={() => signIn("github", { callbackUrl })}
            />
          </div>
        </div>
      </div>

      <p classNameName="mt-5 text-center text-sm text-gray-500">
      Not a member?{" "}
      <button onClick={() => newUser()} style={{color:'blue'}}>
      
      SignUp
      </button>
        
      </p>
      </div>
    </div> */
  }
}

// import type {
//   GetServerSidePropsContext,
//   InferGetServerSidePropsType,
// } from "next"
// import { getCsrfToken } from "next-auth/react"

// export default function SignIn({
//   csrfToken,
// }: InferGetServerSidePropsType<typeof getServerSideProps>) {
//   return (
//     <form method="post" action="/api/auth/callback/credentials">
//       <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
//       <label>
//         Username
//         <input name="username" type="text" />
//       </label>
//       <label>
//         Password
//         <input name="password" type="password" />
//       </label>
//       <button type="submit">Sign in</button>
//     </form>
//   )
// }
// "use client"

// export default function SignIn() {

//   return (
//     <div>
//       <h1>Sign In</h1>
//       <form >
//         <div>
//           <label>
//             Username:
//             <input
//               type="text"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//             />
//           </label>
//         </div>
//         <div>
//           <label>
//             Password:
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//           </label>
//         </div>
//         <button type="submit">Sign In</button>
//       </form>
//     </div>
//   );
// }


