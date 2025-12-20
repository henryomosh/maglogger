"use client";

import { TriangleAlert } from "lucide-react";
export default function Page() {
  return (
    <main className="flex items-center justify-center md:h-screen pt-12">
      <div className="relative mx-auto flex w-full  flex-col  p-4 mt-4 md:mt-2 pt-12">
        <div className="flex flex-col  w-full items-center justify-center rounded-t-lg  p-3 md:h-24">
          <p className="">
            {" "}
            <TriangleAlert
              className="h-12 text-yellow-500"
              style={{ height: "90px" }}
            />
          </p>

          <div className="flex items-center justify-center gap-4 ">
            <p className="font-extrabold text-md md:text-4xl  ">
              THIS WEBSITE IS NOT ACCESSIBLE AT THIS TIME!
            </p>
          </div>
          <p className="border border-1 rounded-md p-4 m-4">
            We are having trouble connecting you to this website. Please contact
            your system administrator to resolve this issue.
          </p>
        </div>
      </div>
    </main>
  );
}
