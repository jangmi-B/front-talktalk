import Image from "next/image";

export default function SignUp() {
  return (
    <div className="bg-grey-lighter max-h-screen flex flex-col mt-[10%]">
      {/* <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2"> */}
      <div className="container max-w-sm mx-auto mt-8 flex flex-col items-center justify-center px-2">
        <Image alt="logo" src={"/images/small_logo.png"} width={300} height={100} />
        {/* <Image alt="logo" src={"/images/small_logo.png"} width={500} height={200} priority={true} /> */}
        <div className="bg-white px-6 py-1 rounded text-black w-full h-[400px] ">
          {/* <h1 className="mb-8 text-3xl text-center">Sign up</h1> */}
          <input
            type="text"
            className="block border border-grey-light w-full p-3 rounded mb-4"
            name="fullname"
            placeholder="Name"
          />
          <input
            type="text"
            className="block border border-grey-light w-full p-3 rounded mb-4"
            name="id"
            placeholder="ID"
          />
          <input
            type="password"
            className="block border border-grey-light w-full p-3 rounded mb-4"
            name="password"
            placeholder="Password"
          />
          <input
            type="password"
            className="block border border-grey-light w-full p-3 rounded mb-4"
            name="confirm_password"
            placeholder="Confirm Password"
          />

          <button
            type="submit"
            className="w-full text-center bg-blue-700 py-3 rounded bg-green text-white hover:bg-green-dark focus:outline-none my-1"
          >
            Create Account
          </button>

          <div className="text-center text-sm text-grey-dark mt-4">
            By signing up, you agree to
            <br /> the
            <a className="no-underline border-b border-grey-dark text-grey-dark" href="#">
              Terms of Service
            </a>{" "}
            and
            <a className="no-underline border-b border-grey-dark text-grey-dark" href="#">
              Privacy Policy
            </a>
          </div>
        </div>

        <div className="text-blue-500 mt-6">
          Already have an account?
          <a className="no-underline border-b border-blue text-blue" href="/">
            Log in
          </a>
          .
        </div>
      </div>
    </div>
  );
}
