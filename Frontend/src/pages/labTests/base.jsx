import { useState } from "react";

export default function Base({ categoryName, inputs, onSubmit }) {
  const [state, setState] = useState(
    inputs.reduce((acc, curr) => ((acc[curr] = ""), acc), {})
  );
  function handleSubmit() {
    onSubmit(state);
  }
  return (
    <div className="w-full max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 capitalize">
          {categoryName} Test Results
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Enter the results for the {categoryName} detection test
        </p>
      </div>
      <form className="px-6 py-4">
        <div className="space-y-4">
          {inputs.map((input, key) => (
            <div key={key}>
              <label
                htmlFor={input}
                className="block text-sm font-medium text-gray-700 capitalize"
              >
                {input}
              </label>
              <input
                type="text"
                id={input}
                name={input}
                placeholder={`Enter ${input} result`}
                onChange={(e) => {
                  setState((prev) => ({ ...prev, [input]: e.target.value }));
                }}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                           focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>
      </form>
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
        <button
          type="button"
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
